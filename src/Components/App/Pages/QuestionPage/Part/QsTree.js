const axios = require('axios')
const projectId = 'saemp-project-ge99'
const firebase_projectId = 'employee-satisfaction-su-2d1c4'
const parent = `projects/${projectId}/agent`
let del_entity = true, del_intent = true
export const QsTree = async (accessToken, form, groupname) => {
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

    if (del_entity && del_intent) {         //follow_up  check
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

        for (let i = 0; i < len; i++) {
            let displayName = `${groupname}_question${i + 1}`;
            let answer = formArr[i].answer
            let question = formArr[i].question[0]
            let inputcontext = []
            let outputcontext = []
            let trainingPhrases = [];
            let message = []
            let trainingPhrasesParts = [];
            let has_parameter
            let resetcontext
            let action = "put_to_firebase"
            let params = []
            if (formArr[i].followup === "-") {
                // console.log(formArr[i])         {answer: ["",""], question: ['']}
                // if (i === 0) {
                has_parameter = false
                resetcontext = false
                trainingPhrasesParts.push(groupname, `แบบทดสอบ${groupname}`, `แบบสอบถาม${groupname}`, `แบบวัดผล${groupname}`)
                message.push({
                    "quickReplies": {
                        "title": question,
                        "quickReplies": answer
                    }
                })
                trainingPhrasesParts.forEach(trainingPhrasesPart => {
                    let partobj = { text: trainingPhrasesPart }

                    const part = partobj
                    const trainingPhrase = {
                        type: 'EXAMPLE',
                        parts: [part],
                    };

                    trainingPhrases.push(trainingPhrase);
                });
                outputcontext.push(
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs1-context`,
                        lifespanCount: len + 1
                    },
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/qs-cancel`,
                        lifespanCount: 3
                    }
                )
                // } else {
                //     resetcontext = false
                //     formArr[i - 1].answer.forEach(ans => {
                //         trainingPhrasesParts.push(ans)
                //     })
                //     message.push({
                //         "quickReplies": {
                //             "title": question,
                //             "quickReplies": answer
                //         }
                //     })
                //     trainingPhrasesParts.forEach(trainingPhrasesPart => {
                //         let partobj
                //         partobj = {
                //             text: trainingPhrasesPart,
                //             entityType: `@${groupname}_question${i}`,
                //             alias: `${groupname}_qs${i}`
                //         }
                //         const part = partobj
                //         const trainingPhrase = {
                //             type: 'EXAMPLE',
                //             parts: [part],
                //         };
                //         trainingPhrases.push(trainingPhrase);
                //     });
                //     inputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${i+1}-context`)
                //     outputcontext.push(
                //         {
                //             name: `projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${i+1}-context`,
                //             lifespanCount: len + 1
                //         },
                //         {
                //             name: `projects/${projectId}/agent/sessions/-/contexts/qs-cancel`,
                //             lifespanCount: 3
                //         }
                //     )
                // }
                await createIntent(displayName, trainingPhrases, inputcontext, outputcontext, params, message, false, action, resetcontext, parent, accessToken, groupname)
            }
            else {
                let params = []
                let qs_follow_up = formArr[i].followup // "0,1,wwww"
                let qs_follow_up_array = qs_follow_up.split(',')
                qs_follow_up_array[0] = parseInt(qs_follow_up_array[0])
                qs_follow_up_array[1] = parseInt(qs_follow_up_array[1])
                console.log(qs_follow_up_array) // [0,0,"ggg"]
                resetcontext = false
                inputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${qs_follow_up_array[0] + 1}-context`)
                outputcontext.push(
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${i + 1}-context`,
                        lifespanCount: len + 1
                    },
                    {
                        name: `projects/${projectId}/agent/sessions/-/contexts/qs-cancel`,
                        lifespanCount: 3
                    }
                )
                trainingPhrasesParts.push(qs_follow_up_array[2])
                trainingPhrasesParts.forEach(trainingPhrasesPart => {
                    let partobj

                    partobj = {
                        text: trainingPhrasesPart,
                        entityType: `@${groupname}_question${qs_follow_up_array[0] + 1}`,
                        alias: `${groupname}_qs${qs_follow_up_array[0] + 1}`
                    }

                    const part = partobj
                    const trainingPhrase = {
                        type: 'EXAMPLE',
                        parts: [part],
                    };

                    trainingPhrases.push(trainingPhrase);
                });
                let parameter = {
                    "displayName": `${groupname}_qs${qs_follow_up_array[0] + 1}`,
                    "value": `$${groupname}_qs${qs_follow_up_array[0] + 1}`,
                    "entityTypeDisplayName": `@${groupname}_question${qs_follow_up_array[0] + 1}`,
                    "mandatory": true,
                    "prompts": ["รบกวนช่วยเลือกคำตอบจากในตัวเลือกนะครับ"]
                }
                params.push(parameter)
                action = "put_to_firebase"
                message.push({
                    "quickReplies": {
                        "title": question,
                        "quickReplies": answer
                    }
                })
                await createIntent(displayName, trainingPhrases, inputcontext, outputcontext, params, message, false, action, resetcontext, parent, accessToken, groupname)
                if (formArr[i].endquestion === true) {
                    console.log('endquestion')
                    displayName = `${groupname}_question${i + 1}_end`;
                    inputcontext = []
                    outputcontext = []
                    trainingPhrases = [];
                    message = []
                    trainingPhrasesParts = [];
                    resetcontext = true
                    action = "put_to_firebase"
                    let params = []
                    //สร้าง intent จบของแต่ละสาย
                    answer.forEach(ans => {
                        trainingPhrasesParts.push(ans)
                    })
                    inputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/${groupname}-qs${i + 1}-context`)
                    trainingPhrasesParts.forEach(trainingPhrasesPart => {
                        let partobj

                        partobj = {
                            text: trainingPhrasesPart,
                            entityType: `@${groupname}_question${i + 1}`,
                            alias: `${groupname}_qs${i + 1}`
                        }

                        const part = partobj
                        const trainingPhrase = {
                            type: 'EXAMPLE',
                            parts: [part],
                        };

                        trainingPhrases.push(trainingPhrase);
                    });
                    let parameter = {
                        "displayName": `${groupname}_qs${i + 1}`,
                        "value": `$${groupname}_qs${i + 1}`,
                        "entityTypeDisplayName": `@${groupname}_question${i + 1}`,
                        "mandatory": true,
                        "prompts": ["รบกวนช่วยเลือกคำตอบจากในตัวเลือกนะครับ"]
                    }
                    params.push(parameter)
                    message.push({
                        text: {
                            text: ['แบบสอบถามเสร็จสิ้น']
                        }
                    })
                    await createIntent(displayName, trainingPhrases, inputcontext, outputcontext, params, message, false, action, resetcontext, parent, accessToken, groupname)
                }
            }
        }

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
