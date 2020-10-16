const axios = require('axios')
const projectId = 'saemp-project-ge99'
const firebase_projectId = 'employee-satisfaction-su-2d1c4'
const parent = `projects/${projectId}/agent`
let del_entity = true, del_intent = true
export const RealTimeDB = async (accessToken, form, groupname) => {
    let reggroupname = ""
    groupname.match(/[A-Za-z0-9]/g).forEach(char => {
        reggroupname += char
    })
    groupname = reggroupname
    let getIntent = await getIntent_Firebase(groupname)
    let getEntity = await getEntity_Firebase(groupname)
    if (getEntity !== null && getIntent !== null) {
        let Intent = []
        let entityTypeName = []
        // console.log("prepra_data")
        // console.log(getEntity)
        // console.log(getIntent)
        Object.keys(getIntent).forEach(intentname => {
            Intent.push(getIntent[intentname])
        })

        Object.keys(getEntity).forEach(entityname => {
            entityTypeName.push(getEntity[entityname].name)
        })

        // console.log("IntentName :", Intent)

        let entityTypeNames = {
            entityTypeNames: entityTypeName
        }
        // console.log("entityTypeNames: ", entityTypeNames)
        del_intent = await batchDeleteIntent(parent, Intent, accessToken, groupname)
        del_entity = await batchDeleteEntity(parent, entityTypeNames, accessToken, groupname)
    }

    if (del_entity && del_intent) {
        let formArr = form
        let len = formArr.length

        for (let i = 0; i < len; i++) {
            //เอาคำตอบไปสร้าง entity
            const entities = []
            let entity = formArr[i].answer
            entity.forEach(data => {
                entities.push({
                    value: data,
                    synonyms: [data]
                })
            });
            const entitydisplayName = `${groupname}_question${i + 1}`
            const entityKind = 'KIND_MAP'

            createEntity(parent, entitydisplayName, entityKind, entities, accessToken, groupname)
            //
        }
        //สร้าง intent 
        let params = []
        for (let i = 0; i < len + 1; i++) {
            let displayName = `${groupname}_question${i + 1}`;
            let question = ''
            let answer = ''
            let fallbackinputcontext = []
            let inputcontext = []
            let outputcontext = []
            let trainingPhrases = [];
            let fallbackmessage = []
            let message = []
            let trainingPhrasesParts = [];
            let has_parameter
            let resetcontext
            let action = ""
            if (i === 0) {
                has_parameter = false
                trainingPhrasesParts.push(groupname, `แบบทดสอบ${groupname}`, `แบบสอบถาม${groupname}`, `แบบวัดผล${groupname}`)
                //inputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/StartQuestion-context`)
                fallbackinputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs1-fallback`)
                outputcontext.push(
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs1-context`,
                        lifespanCount: len + 1
                    },
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs1-fallback`,
                        lifespanCount: 1
                    },
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/qs-cancel`,
                        lifespanCount: 3
                    }
                )
            }
            else {
                has_parameter = true
                trainingPhrasesParts = formArr[i - 1].answer
                inputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${i}-context`)
                fallbackinputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${i + 1}-fallback`)
                outputcontext.push(
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${i + 1}-context`,
                        lifespanCount: len + 1
                    },
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${i + 1}-fallback`,
                        lifespanCount: 1
                    },
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/qs-cancel`,
                        lifespanCount: 3
                    }
                )
            }

            if (i !== len) {
                resetcontext = false
                question = formArr[i].question[0]
                answer = formArr[i].answer
                message.push({
                    "quickReplies": {
                        "title": question,
                        "quickReplies": answer
                    }
                })
                fallbackmessage.push(
                    {
                        text: {
                            text: ['ขอโทษครับผมไม่เข้าใจรบกวนเลือกจากในตัวเลือกนะครับ']
                        }
                    },
                    {
                        "quickReplies": {
                            "title": question,
                            "quickReplies": answer
                        }
                    }
                )
                action = ""
            } else if (i === len) {
                resetcontext = true
                message.push({
                    text: {
                        text: ['แบบสอบถามเสร็จสิ้น']
                    }
                })
                action = "put_to_firebase"
            }
            trainingPhrasesParts.forEach(trainingPhrasesPart => {
                let partobj
                if (has_parameter) {
                    partobj = {
                        text: trainingPhrasesPart,
                        entityType: `@${groupname}_question${i}`,
                        alias: `${groupname}_qs${i}`
                    }
                } else {
                    partobj = {
                        text: trainingPhrasesPart
                    }
                }
                const part = partobj
                const trainingPhrase = {
                    type: 'EXAMPLE',
                    parts: [part],
                };

                trainingPhrases.push(trainingPhrase);
            });
            let parameter = {
                "displayName": `${groupname}_qs${i}`,
                "value": `$${groupname}_qs${i}`,
                "entityTypeDisplayName": `@${groupname}_question${i}`,
                "mandatory": true,
                "prompts": ["รบกวนช่วยเลือกคำตอบจากในตัวเลือกนะครับ"]
            }
            if (i !== 0) {
                params.push(parameter)
            }
            await createIntent(displayName, trainingPhrases, inputcontext, outputcontext, params, message, false, action, resetcontext, parent, accessToken, groupname)
            if (i < len) {
                await createIntent(displayName + 'fallback', [], fallbackinputcontext, outputcontext, params, fallbackmessage, true, action, resetcontext, parent, accessToken, groupname)
                let data_JSON = {
                    "question": question,
                    "answer": answer
                }
                keepForm(data_JSON, accessToken)
            }

            if (i < len && i !== 0) {
                params[i - 1].value = `#${groupname}-qs${i}-context.${groupname}_qs${i}`
                params[i - 1].mandatory = false
                delete params[i - 1]["prompts"]
            }
        }
        // //update start-intent
        // const StartQuestion_ID = "875df351-0731-4089-8f0b-2a61e6a0963a"
        // const StartQuestion_Fallback_ID = "26240109-fd2e-4bc6-a1f8-baa12ac8e23a"
        // for (let i = 0; i < 2; i++) {
        //     let GroupNames = []
        //     let Group = await axios({
        //         method:'get',
        //         url: `https://${firebase_projectId}.firebaseio.com/intent.json`
        //     }).then((res) => {
        //         return res.data
        //     }).catch((err) => {
        //         console.log(err)
        //     })
        //     Object.keys(Group).forEach(name => {
        //         GroupNames.push(name)
        //     })
        //     let displayname
        //     let inputcontext = []
        //     let outputcontext = []
        //     let trainingPhrases = [];
        //     let message = []
        //     let trainingPhrasesParts = [];
        //     outputcontext.push(
        //         {
        //             name: `projects/${projectId}/agent/sessions/-/contexts/StartQuestion-context`,
        //             lifespanCount: 3
        //         },
        //         {
        //             name: `projects/${projectId}/agent/sessions/-/contexts/StartQuestion-fallback`,
        //             lifespanCount: 1
        //         },
        //         {
        //             name: `projects/${projectId}/agent/sessions/-/contexts/qs-cancel`,
        //             lifespanCount: 3
        //         }
        //     )
        //     if (i === 0) {
        //         displayname = "StartQuestion"
        //         trainingPhrasesParts.push(`แบบทดสอบ`, `แบบสอบถาม`, `แบบวัดผล`)
        //         trainingPhrasesParts.forEach(trainingPhrasesPart => {
        //             const part = {
        //                 text: trainingPhrasesPart
        //             }
        //             const trainingPhrase = {
        //                 type: 'EXAMPLE',
        //                 parts: [part],
        //             };
        //             trainingPhrases.push(trainingPhrase);
        //         });
        //         message.push({
        //             "quickReplies": {
        //                 "title": "แบบวัดผลความสุขพนักงาน",
        //                 "quickReplies": GroupNames
        //             }
        //         })
        //         updateIntent(StartQuestion_ID, displayname,inputcontext,outputcontext,trainingPhrases,message,false,accessToken)
        //     }
        //     else {
        //         displayname = "StartQuestion_Fallback"
        //         inputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/StartQuestion-fallback`)
        //         message.push(
        //             {
        //                 text: {
        //                     text: ['ขอโทษครับผมไม่เข้าใจรบกวนเลือกจากในตัวเลือกนะครับ']
        //                 }
        //             },
        //             {
        //                 "quickReplies": {
        //                     "title": "แบบวัดผลความสุขพนักงาน",
        //                     "quickReplies": GroupNames
        //                 }
        //             }
        //         )
        //         updateIntent(StartQuestion_Fallback_ID, displayname,inputcontext,outputcontext,trainingPhrases,message,true,accessToken)
        //     }
        // }
        alert("สร้างคำถามเสร็จเรียบร้อยแล้วครับ")
    }
    return true
}



const getEntity_Firebase = async (groupname) => {

    let entity = await axios({
        method: 'get',
        url: `https://${firebase_projectId}.firebaseio.com/entity/${groupname}.json`
    })
        .then((res) => {

            return res.data
        })
        .catch((err) => {
            console.error(err)
        })
    //console.log(entity)
    return entity
}

const getIntent_Firebase = async (groupname) => {
    let intent = await axios({
        method: 'get',
        url: `https://${firebase_projectId}.firebaseio.com/intent/${groupname}.json`
    })
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            console.error(err)
        })
    //console.log(intent)
    return intent
}

const createEntity = async (parent, displayname, kind, entities, accessToken, groupname) => {
    let data = ({
        displayName: displayname,
        kind: kind,
        entities: entities
    })
    // console.log(JSON.stringify(data))
    let is_success
    let entityname = await axios({
        method: 'post',
        url: `https://dialogflow.googleapis.com/v2/${parent}/entityTypes`,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: data
    })
        .then((res) => {
            //console.log(JSON.stringify(res.data));
            is_success = true
            return res.data.name
        })
        .catch((err) => {
            is_success = false
            alert(err.message)
        })
    //console.log(entityname)

    //นำentityname ไปเก็บใน firebase เพื่อใช้สำหรับการตรวจสอบข้อมูล
    if (is_success) {
        let firebasedata = {
            name: entityname
        }
        axios({
            method: 'put',
            url: `https://${firebase_projectId}.firebaseio.com/entity/${groupname}/${displayname}.json`,
            headers: { Authorization: `Bearer ${accessToken}` },
            data: firebasedata
        }).then((res) => {
            console.log('put entitiy to firebase')
        }).catch((err) => {
            console.log('cant put entitiy to firebase')
        })
    }
    //
}

const createIntent = async (displayName, trainingPhrases, inputcontext, outputcontext, params, message, fallback, action, resetcontext, parent, accessToken, groupname) => {
    let intent = {
        displayName: displayName,
        action: action,
        trainingPhrases: trainingPhrases,
        inputContextNames: inputcontext,
        outputContexts: outputcontext,
        resetContexts: resetcontext,
        parameters: params,
        isFallback: fallback,
        messages: message
    }
    //await axios
    // console.log(JSON.stringify(intent))
    let is_success
    let intentname = await axios({
        method: 'post',
        url: `https://dialogflow.googleapis.com/v2/${parent}/intents`,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: intent
    })
        .then((res) => {
            is_success = true
            //console.log(res.data.name)
            return res.data.name
        })
        .catch((err) => {
            is_success = false
            alert(err.message)
        })
    //console.log(intentname)
    //นำintentname ไปเก็บใน firebase เพื่อใช้สำหรับการตรวจสอบข้อมูล
    if (is_success) {
        let firebasedata = {
            name: intentname
        }
        axios({
            method: 'put',
            url: `https://${firebase_projectId}.firebaseio.com/intent/${groupname}/${displayName}.json`,
            headers: { Authorization: `Bearer ${accessToken}` },
            data: firebasedata
        }).then((res) => {
            console.log('put intent to firebase')
        }).catch((err) => {
            console.log('cant put intent to firebase')
        })
    }
    //

}

const batchDeleteIntent = async (parent, Intent, accessToken, groupname) => {
    let data = {
        intents: Intent
    }
    // console.log('DATA Intent: ', data)
    let delete_success
    let oper = await axios({
        method: 'post',
        url: `https://dialogflow.googleapis.com/v2/${parent}/intents:batchDelete`,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: data
    }).then((res) => {
        delete_success = true
        return res.data.done
    }).catch((err) => {
        alert(err.data)
        delete_success = false
        return false
    })
    if (delete_success) {
        axios({
            method: 'delete',
            url: `https://${firebase_projectId}.firebaseio.com/intent/${groupname}.json`,
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => {
            console.log('delete intent firebase')
        }).catch((err) => {
            console.log('cant delete intent firebase')
        })
    }
    return oper
}

const batchDeleteEntity = async (parent, entityTypeNames, accessToken, groupname) => {
    let delete_success
    // console.log('DATA Entity: ', entityTypeNames)
    let oper = await axios({
        method: 'post',
        url: `https://dialogflow.googleapis.com/v2/${parent}/entityTypes:batchDelete`,
        headers: { Authorization: `Bearer ${accessToken}` },
        data: entityTypeNames
    }).then((res) => {
        delete_success = true
        return res.data.done
    }).catch((err) => {
        delete_success = false
        alert(err.data)
        return false
    })
    if (delete_success) {
        axios({
            method: 'delete',
            url: `https://${firebase_projectId}.firebaseio.com/entity/${groupname}.json`,
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => {
            console.log('delete entity firebase')
        }).catch((err) => {
            console.log('cant delete entity firebase')
        })
    }
    return oper
}

const keepForm = async (data_JSON, accessToken) => {
    const ListForm = await axios({
        method: 'get',
        url: `https://${firebase_projectId}.firebaseio.com/scheduled/KEEPQUESTION.json`,
    }).then(res => {
        return res.data
    }).catch(err => {
        alert(err.message)
    })
    console.log(Object.keys(ListForm).length)
    if (Object.keys(ListForm).length >= 6) {
        const path_to_pop = Object.keys(ListForm)[0]
        await axios({
            method: 'delete',
            url: `https://${firebase_projectId}.firebaseio.com/scheduled/KEEPQUESTION/${path_to_pop}.json`,
            headers: { Authorization: `Bearer ${accessToken}` }
        }).then(() => {
            console.log('delete KEEPQUESTION success')
        }).catch((err) => {
            console.error(err)
        })
        await axios({
            method: 'post',
            url: `https://${firebase_projectId}.firebaseio.com/scheduled/KEEPQUESTION.json`,
            headers: { Authorization: `Bearer ${accessToken}` },
            data: data_JSON
        }).then(() => {
            console.log('Keep Success')
        }).catch((err) => {
            console.log('Keep Unsuccess :', err)
        })
    } else {
        await axios({
            method: 'post',
            url: `https://${firebase_projectId}.firebaseio.com/scheduled/KEEPQUESTION.json`,
            headers: { Authorization: `Bearer ${accessToken}` },
            data: data_JSON
        }).then(() => {
            console.log('Keep Success')
        }).catch((err) => {
            console.log('Keep Unsuccess :', err)
        })
    }

}

// const updateIntent = async (IntentID, displayname, inputcontext, outputcontext, trainingPhrases, message, isFallback, accessToken) => {
//     const Intent_Data = {
//         displayName: displayname,
//         isFallback: isFallback,
//         inputContextNames: inputcontext,
//         trainingPhrases: trainingPhrases,
//         outputContexts: outputcontext,
//         messages: message
//     }
//     await axios({
//         method: 'patch',
//         url: `https://dialogflow.googleapis.com/v2/${parent}/intents/${IntentID}`,
//         headers: { Authorization: `Bearer ${accessToken}` },
//         data: Intent_Data
//     }).then((res) => {

//     }).catch((err) => {

//     })
// }