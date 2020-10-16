// import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import Question from './Question'
// import QuestionEditing from './QuestionEditing'
// import Paper from '@material-ui/core/Paper';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import GoogleBtn from './GoogleBtn'
// import Grid from '@material-ui/core/Grid';
// const axios = require('axios')

// let access_token, isLogined
// const projectId = 'saemp-project-ge99'
// const firebase_projectId = 'employee-satisfaction-su-2d1c4'

// class ShowQuestion extends Component {

//     handleEvent = async (e) => {
//         if (isLogined) {

//             this.props.dispatch({
//                 type: 'HIDE_PROGRESS',
//             });
//             //ตรวจดูใน firebase ว่าต้องลบ entity หรือไม่
//             const parent = `projects/${projectId}/agent`
//             let getIntent = await getIntent_Firebase()
//             let getEntity = await getEntity_Firebase()
//             let del_intent, del_entity
//             if (getEntity !== null && getIntent !== null) {
//                 //get entity_name จากfirebase เพื่อเอาไป batchDeleteที่ dialogflow
//                 let IntentName = []
//                 let entityTypeName = []
//                 let keys = Object.keys(getIntent)
//                 for (let i = 0; i < keys.length; i++) {
//                     IntentName.push(getIntent[[keys[i]]].name)
//                 }
//                 //console.log("IntentName: ", IntentName)
//                 let Intent = []
//                 IntentName.forEach(val => {
//                     let IntentPart = {
//                         name: val
//                     }
//                     Intent.push(IntentPart)
//                 })
//                 del_intent = await batchDeleteIntent(parent, Intent)
//                 keys = Object.keys(getEntity)
//                 for (let i = 0; i < keys.length; i++) {
//                     entityTypeName.push(getEntity[keys[i]].name)
//                 }
//                 //console.log("entityName: ", entityTypeName)
//                 let entityTypeNames = {
//                     entityTypeNames: entityTypeName
//                 }

//                 del_entity = await batchDeleteEntity(parent, entityTypeNames)
//             }
//             //
//             if (del_entity && del_intent) {
//                 let formArr = this.props.reducer.formReducer
//                 let len = formArr.length
//                 for (let i = 0; i < len; i++) {
//                     //เอาคำตอบไปสร้าง entity
//                     const entities = []
//                     let entity = formArr[i].answer
//                     entity.forEach(data => {
//                         entities.push({
//                             value: data,
//                             synonyms: [data]
//                         })
//                     });
//                     const entitydisplayName = `question${i + 1}`
//                     const entityKind = 'KIND_MAP'

//                     createEntity(parent, entitydisplayName, entityKind, entities)
//                     //
//                 }
//                 //สร้าง intent 
//                 let params = []
//                 for (let i = 0; i < len + 1; i++) {
//                     let displayName = `question${i + 1}`;
//                     let question = ''
//                     let answer = ''
//                     let fallbackinputcontext = []
//                     let inputcontext = []
//                     let outputcontext = []
//                     let trainingPhrases = [];
//                     let fallbackmessage = []
//                     let message = []
//                     let trainingPhrasesParts = [];
//                     let has_parameter
//                     let resetcontext
//                     let action = ""
//                     if (i === 0) {
//                         has_parameter = false
//                         trainingPhrasesParts.push('แบบทดสอบ', 'แบบสอบถาม', 'แบบวัดผล')
//                         fallbackinputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/qs1-fallback`)
//                         outputcontext.push(
//                             {
//                                 name: `projects/${projectId}/agent/sessions/-/contexts/qs1-context`,
//                                 lifespanCount: 3
//                             },
//                             {
//                                 name: `projects/${projectId}/agent/sessions/-/contexts/qs1-fallback`,
//                                 lifespanCount: 1
//                             },
//                             {
//                                 name: `projects/${projectId}/agent/sessions/-/contexts/qs-cancel`,
//                                 lifespanCount: 3
//                             }
//                         )
//                     }
//                     else {
//                         has_parameter = true
//                         trainingPhrasesParts = formArr[i - 1].answer
//                         inputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/qs${i}-context`)
//                         fallbackinputcontext.push(`projects/${projectId}/agent/sessions/-/contexts/qs${i + 1}-fallback`)
//                         outputcontext.push(
//                             {
//                                 name: `projects/${projectId}/agent/sessions/-/contexts/qs${i + 1}-context`,
//                                 lifespanCount: 3
//                             },
//                             {
//                                 name: `projects/${projectId}/agent/sessions/-/contexts/qs${i + 1}-fallback`,
//                                 lifespanCount: 1
//                             },
//                             {
//                                 name: `projects/${projectId}/agent/sessions/-/contexts/qs-cancel`,
//                                 lifespanCount: 3
//                             }
//                         )
//                     }

//                     if (i !== len) {
//                         resetcontext = false
//                         question = formArr[i].question[0]
//                         answer = formArr[i].answer
//                         message.push({
//                             "quickReplies": {
//                                 "title": question,
//                                 "quickReplies": answer
//                             }
//                         })
//                         fallbackmessage.push(
//                             {
//                                 text: {
//                                     text: ['ขอโทษครับผมไม่เข้าใจรบกวนเลือกจากในตัวเลือกนะครับ']
//                                 }
//                             },
//                             {
//                                 "quickReplies": {
//                                     "title": question,
//                                     "quickReplies": answer
//                                 }
//                             }
//                         )
//                         action = ""
//                     } else if (i === len) {
//                         resetcontext = true
//                         message.push({
//                             text: {
//                                 text: ['แบบสอบถามเสร็จสิ้น']
//                             }
//                         })
//                         action = "put_to_firebase"
//                     }
//                     trainingPhrasesParts.forEach(trainingPhrasesPart => {
//                         let partobj
//                         if (has_parameter) {
//                             partobj = {
//                                 text: trainingPhrasesPart,
//                                 entityType: `@question${i}`,
//                                 alias: `qs${i}`
//                             }
//                         } else {
//                             partobj = {
//                                 text: trainingPhrasesPart
//                             }
//                         }
//                         const part = partobj
//                         const trainingPhrase = {
//                             type: 'EXAMPLE',
//                             parts: [part],
//                         };

//                         trainingPhrases.push(trainingPhrase);
//                     });
//                     let parameter = {
//                         "displayName": `qs${i}`,
//                         "value": `$qs${i}`,
//                         "entityTypeDisplayName": `@question${i}`,
//                         "mandatory": true,
//                         "prompts": ["รบกวนช่วยเลือกคำตอบจากในตัวเลือกนะครับ"]
//                     }
//                     if (i !== 0) {
//                         params.push(parameter)
//                     }
//                     await createIntent(displayName, trainingPhrases, inputcontext, outputcontext, params, message, false, action, resetcontext, parent)
//                     if (i < len) {
//                         await createIntent(displayName + 'fallback', [], fallbackinputcontext, outputcontext, params, fallbackmessage, true, action, resetcontext, parent)
//                     }

//                     if (i < len && i !== 0) {
//                         params[i - 1].value = `#qs${i}-context.qs${i}`
//                         params[i - 1].mandatory = false
//                         delete params[i - 1]["prompts"]
//                     }
//                 }

//                 this.props.dispatch({
//                     type: 'SHOW_PROGRESS',
//                 });
//                 //
//             }
//             else {
//                 this.props.dispatch({
//                     type: 'NOT_USER',
//                 });
//             }
//         }
//         else {
//             alert('กรุณากดปุ่ม Login ก่อนนะครับ')
//         }
//     }

//     accesTokenprops = (accessToken) => {
//         access_token = accessToken
//         //console.log('accesstoken: ',access_token)
//     }

//     isSignedInprops = (isSignedIn) => {
//         isLogined = isSignedIn
//         console.log('isLogined: ', isLogined)
//     }

//     render() {

//         return (
//             <div>
//                 {this.props.reducer.formReducer.length !== 0 &&
//                     <div>
//                         {this.props.reducer.formReducer.map((form, index) => (
//                             <div key={form.id}>
//                                 <Typography fontWeight="fontWeightBold" fontFamily="Monospace" variant="h4" color="textPrimary" gutterBottom >คำถามที่{(index*2)+1}</Typography>
//                                 <Grid container spacing={3}>
//                                     <Grid item xs={12} sm={6} >
//                                         <Paper elevation={3}> {form.editing ? <QuestionEditing key={index} form={form} index={index } /> : <Question key={index} form={form} index={index} />} </Paper>
//                                     </Grid>
//                                 </Grid>
//                             </div>
//                         ))}
//                         <br />
//                         <GoogleBtn accesstoken={this.accesTokenprops} signInState={this.isSignedInprops} />
//                         <br /><br />
//                         <Button variant="contained" color="primary" onClick={this.handleEvent}>สร้าง Intent</Button>

//                         {showProgress(this.props.reducer.showprogressReducer)}
//                         {/*<Paper elevation={0}>
//                             {form.editing ? <QuestionEditing key={index} form={form} index={index} /> : <Question key={index} form={form} index={index} />}
//                         </Paper>*/}
//                     </div>

//                 }
//             </div>
//         );
//     }

// }
// const mapStateToProps = (state) => { //ส่งค่าข้าม components
//     return {
//         reducer: state
//     }
// }


// const showProgress = (props) => {
//     switch (props) {
//         case 'INITIAL':
//             return
//         case true:
//             return <p color="black">สร้าง Intent เสร็จเรียบร้อยสามารถดูได้<a href="https://dialogflow.cloud.google.com/#/agent/saemp-project-ge99/intents">ที่นี่</a></p>
//         case false:
//             return <p color="black">กำลังสร้าง Intent ...</p>
//         case 'not user':
//             return <p color="black">กรุณาติดต่อเจ้าของโปรเจ็ค</p>
//         default:
//             return
//     }
// }

// const createEntity = async (parent, displayname, kind, entities) => {
//     let data = ({
//         displayName: displayname,
//         kind: kind,
//         entities: entities
//     })
//     let is_success
//     let entityname = await axios({
//         method: 'post',
//         url: `https://dialogflow.googleapis.com/v2/${parent}/entityTypes`,
//         headers: { Authorization: `Bearer ${access_token}` },
//         data: data
//     })
//         .then((res) => {
//             //console.log(JSON.stringify(res.data));
//             is_success = true
//             return res.data.name
//         })
//         .catch((err) => {
//             is_success = false
//             console.error(err)
//         })
//     //console.log(entityname)

//     //นำentityname ไปเก็บใน firebase เพื่อใช้สำหรับการตรวจสอบข้อมูล
//     if (is_success) {
//         let firebasedata = {
//             name: entityname
//         }
//         axios({
//             method: 'put',
//             url: `https://${firebase_projectId}.firebaseio.com/entity/${displayname}.json`,
//             data: firebasedata
//         }).then((res) => {
//             console.log('put entitiy to firebase')
//         }).catch((err) => {
//             console.error(err)
//         })
//     }
//     //
// }

// const batchDeleteEntity = async (parent, entityTypeNames) => {
//     let delete_success
//     let oper = await axios({
//         method: 'post',
//         url: `https://dialogflow.googleapis.com/v2/${parent}/entityTypes:batchDelete`,
//         headers: { Authorization: `Bearer ${access_token}` },
//         data: entityTypeNames
//     }).then((res) => {
//         delete_success = true
//         return res.data.done
//     }).catch((err) => {
//         delete_success = false
//         console.error(err)
//         alert(err)
//     })
//     if (delete_success) {
//         axios({
//             method: 'delete',
//             url: `https://${firebase_projectId}.firebaseio.com/entity.json`,
//         }).then((res) => {
//             console.log('delete data firebase')
//         }).catch((err) => {
//             console.error(err)
//         })
//     }
//     return oper
// }

// const batchDeleteIntent = async (parent, Intent) => {
//     let data = {
//         intents: Intent
//     }
//     let delete_success
//     let oper = await axios({
//         method: 'post',
//         url: `https://dialogflow.googleapis.com/v2/${parent}/intents:batchDelete`,
//         headers: { Authorization: `Bearer ${access_token}` },
//         data: data
//     }).then((res) => {
//         delete_success = true
//         return res.data.done
//     }).catch((err) => {
//         console.error(err)
//         delete_success = false
//         return false
//     })
//     if (delete_success) {
//         axios({
//             method: 'delete',
//             url: `https://${firebase_projectId}.firebaseio.com/intent.json`,
//         }).then((res) => {
//             console.log('delete data firebase')
//         }).catch((err) => {
//             console.error(err)
//         })
//     }
//     return oper
// }

// const getEntity_Firebase = async () => {

//     let entity = await axios({
//         method: 'get',
//         url: `https://${firebase_projectId}.firebaseio.com/entity.json`
//     })
//         .then((res) => {

//             return res.data
//         })
//         .catch((err) => {
//             console.error(err)
//         })
//     //console.log(entity)
//     return entity
// }

// const getIntent_Firebase = async () => {
//     let intent = await axios({
//         method: 'get',
//         url: `https://${firebase_projectId}.firebaseio.com/intent.json`
//     })
//         .then((res) => {


//             return res.data
//         })
//         .catch((err) => {
//             console.error(err)
//         })
//     //console.log(intent)
//     return intent
// }

// const createIntent = async (displayName, trainingPhrases, inputcontext, outputcontext, params, message, fallback, action, resetcontext, parent) => {
//     let intent = {
//         displayName: displayName,
//         action: action,
//         trainingPhrases: trainingPhrases,
//         inputContextNames: inputcontext,
//         outputContexts: outputcontext,
//         resetContexts: resetcontext,
//         parameters: params,
//         isFallback: fallback,
//         messages: message
//     }
//     //await axios
//     //console.log(JSON.stringify(intent))
//     let is_success
//     let intentname = await axios({
//         method: 'post',
//         url: `https://dialogflow.googleapis.com/v2/${parent}/intents`,
//         headers: { Authorization: `Bearer ${access_token}` },
//         data: intent
//     })
//         .then((res) => {
//             is_success = true
//             //console.log(res.data.name)
//             return res.data.name
//         })
//         .catch((err) => {
//             is_success = false
//             console.error(err)
//         })
//     //console.log(intentname)
//     //นำintentname ไปเก็บใน firebase เพื่อใช้สำหรับการตรวจสอบข้อมูล
//     if (is_success) {
//         let firebasedata = {
//             name: intentname
//         }
//         axios({
//             method: 'put',
//             url: `https://${firebase_projectId}.firebaseio.com/intent/${displayName}.json`,
//             data: firebasedata
//         }).then((res) => {
//             console.log('put intent to firebase')
//         }).catch((err) => {
//             console.error(err)
//         })
//     }
//     //

// }

// export default connect(mapStateToProps)(ShowQuestion)

