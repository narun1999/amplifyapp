import React, { Component } from 'react';
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import UpdateIcon from '@material-ui/icons/Update';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import MessageIcon from '@material-ui/icons/Message';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Box from '@material-ui/core/Box';

class QuestionEditing extends Component {

    handleSubmit = (e) => {
        //e.preventDefault(); //ไม่ต้องเปลี่ยนหน้า
        //const message = []
        const newquestion = []
        const newanswer = []
        let is_full = true
        let num = this.props.form.formnumber
        for (let i = 0; i < parseInt(num) + 1; i++) {
            if (i === 0) {
                newquestion.push((document.getElementById("newquestion" + i).value))
            }
            else {
                newanswer.push((document.getElementById("newquestion" + i).value))
            }

        }
        newanswer.forEach(val => {
            if (val === "" || newquestion[0] === "") {
                is_full = false
            }
        })
        if (is_full) {
            const data = {
                newquestion,
                newanswer
            }
            console.log(data)

            this.props.dispatch({
                type: 'UPDATE_FORM',
                id: this.props.form.id,
                data: data
            });


        }
        else {
            alert("กรุณากรอกข้อมูลให้ครบถ้วนครับ")
        }
    }

    cancelupdate = (e) => {
        this.props.dispatch({ 
            type: "EDIT_FORM", 
            id: this.props.form.id 
        })
    }
    
    render() {
        return (
            <div>
                {this.props.reducer.showformReducer &&
                    <div>
                        <br />
                        {makeform(this.props.form.formnumber)}
                        <br />
                        <Box component="span" m={1}><Button variant="contained" color="default" startIcon={<UpdateIcon />} onClick={this.handleSubmit}>อัพเดต</Button></Box>
                        <Box component="span" m={1}><Button variant="contained" color="secondary" startIcon={<RotateLeftIcon />} onClick={this.cancelupdate}>ยกเลิก</Button></Box>
                    </div>
                }
            </div>
        );
    }

}
const mapStateToProps = (state) => { //ส่งค่าข้าม components
    return {
        reducer: state
    }
}
const makeform = (num) => {
    let form = []

    for (var i = 0; i < parseInt(num) + 1; i++) {
        if (i === 0) {
            form.push(<TextField required type="text" placeholder="คำถาม" id={"newquestion" + i} key={"newquestion" + i} variant="outlined" style={{ width: 380 }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><QuestionAnswerOutlinedIcon /></InputAdornment>) }} />)
            form.push(<br id={"break" + i} key={"break" + i} />, <br id={"break" + i + 1} key={"break" + i + 1} />)
        }


        else {
            form.push(<TextField required type="text" placeholder="คำตอบ" id={"newquestion" + i} key={"newquestion" + i} variant="outlined" helperText="value can't contain more than 20 character A-Z a-z $ # [ ] / or ." 
            InputProps={{ startAdornment: (<InputAdornment position="start"><MessageIcon /></InputAdornment>) }} />)
            form.push(<br id={"break" + i} key={"break" + i} />)
        }

    }
    return form
}

export default connect(mapStateToProps)(QuestionEditing)