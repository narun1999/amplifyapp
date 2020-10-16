import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import MessageIcon from '@material-ui/icons/Message';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Question from './Question';
import QuestionEditing from './QuestionEditing';
import DialogflowBtn from './DialogflowBtn'
import FirebaseBtn from './FirebaseBtn'
import Title from "./Title";
import Container from '@material-ui/core/Container';
// import Box from '@material-ui/core/Box';
// import Link from '@material-ui/core/Link';
// import Typography from '@material-ui/core/Typography';
import 'date-fns';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from '@material-ui/pickers';
// import StorageIcon from '@material-ui/icons/Storage';
import axios from 'axios';

const styles = theme => ({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        position: 'relative',
        width: '100%',
        height: '100%',

    },

    InputStyle: {
        color: "black",
        fontWeight: "bold",
        fontSize: "24px"
    },
    paper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(3),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    GridBtn: {
        textAlign: 'center',
    },
    GridCenter: {
        alignContent: 'center',
        justify: 'center',
    },
    container: {
        paddingTop: theme.spacing(4),

    },
    paper2: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(8.6),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(3),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    paper3: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: theme.spacing(3),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
});

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

class MainForm extends Component {
    handleDateChange = (date) => {
        this.props.dispatch({
            type: 'SET_QUESTIONDATE',
            data: date
        })

    };
    showtest = (title) => {
        const data = {
            id: Date.now(),
            question: new Array(title.question),
            answer: title.answer,
            editing: false,
            formnumber: title.answer.length,
        }
        this.props.dispatch({
            type: 'ADD_FORM',
            data
        });
        this.props.dispatch({
            type: 'SHOW_QUESTION'
        })
    };
    submit = async () => {
        await this.calldata();
        const datetime = this.props.reducer.DateQuestionReducer;
        var dateday = datetime.getDate();
        if (dateday >= 1 && dateday <= 9) {
            dateday = "0" + dateday;
        }
        var month = datetime.getMonth() + 1;
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        var finaldate = dateday + '_' + month + '_' + datetime.getFullYear()
        const data = {
            finaldate
        }
        this.props.dispatch({
            type: 'ADD_DATE',
            data
        });
        this.props.dispatch({
            type: 'IS_SUCCESS'
        });
    }
    calldata = async () => {
        let status
        var res = await axios({
            method: 'get',
            url: `https://employee-satisfaction-su-2d1c4.firebaseio.com/scheduled/KEEPQUESTION.json`
        }).then((res) => {
            status = true
            return res.data
        }).catch((err) => {
            status = false
            return err.data
        })
        const tile = []
        if (status === true && res !== null) {
            Object.keys(res).forEach((key1, index) => {
                tile.push(res[key1])
            })
            this.props.dispatch({
                type: 'ADD_TILE',
                data: tile
            })
        } else {

        }
    }

    handleSubmit = async (e) => {
        e.preventDefault(); //ไม่ต้องเปลี่ยนหน้า
        await this.submit()
        const num = this.getNum.value; //ดีงค่าจาก <input>
        const groupname = this.groupName.value
        const cur_groupname = this.props.reducer.GroupNameReducer
        const letters = /^[A-Za-z][A-Za-z0-9_]+$/g
        if (groupname !== cur_groupname) {
            this.props.dispatch({
                type: 'CLEAR_NUM'
            })
            this.props.dispatch({
                type: 'CLEAR_GROUP'
            })
            this.props.dispatch({
                type: 'CLEAR_FORM'
            })
        }
        if (num > 0 && num <= 10 && groupname !== "" && letters.test(groupname)) {
            const data = {
                id: Date.now(),
                num,
            }
            //const groupNameData = this.props.reducer.GroupNameReducer
            this.props.dispatch({
                type: 'ADD_NUM',
                data
            });
            this.props.dispatch({
                type: "ADD_GROUP",
                data: groupname
            })
            this.props.dispatch({
                type: 'SHOW_FORM',
            });
        }
        else {
            alert("กรุณากรอกข้อมูลให้ถูกต้องครบถ้วนครับ")
            this.getNum.value = ""
            this.groupName.value = ""
        }
    }

    handleForm = (e) => {
        //e.preventDefault(); //ไม่ต้องเปลี่ยนหน้า
        //const message = []
        const regex = /[$#[\].]/g
        const question = []
        const answer = []
        let iscorrect = true
        let is_full = true
        let num = this.props.reducer.addnumberReducer.num
        for (let i = 1; i < parseInt(num) + 1; i++) {
            const answerChoice = document.getElementById("question" + i).value
            if (regex.test(answerChoice)) {
                iscorrect = false
                break
            }
            if (answerChoice.length >= 20) {
                iscorrect = false
                break
            }
        }
        if (iscorrect === true) {
            for (let i = 0; i < parseInt(num) + 1; i++) {
                if (i === 0) {
                    question.push((document.getElementById("question" + i).value))
                }
                else {
                    answer.push((document.getElementById("question" + i).value))
                }
            }
            answer.forEach(val => {
                if (val === "" || question[0] === "") {
                    is_full = false
                }
            })

            if (is_full) {
                //console.log(message)
                const data = {
                    id: Date.now(),
                    question,
                    answer,
                    editing: false,
                    formnumber: num
                }


                this.props.dispatch({
                    type: 'ADD_FORM',
                    data
                });

                this.props.dispatch({
                    type: 'SHOW_QUESTION'
                })
                for (let i = 0; i < parseInt(num) + 1; i++) {
                    document.getElementById("question" + i).value = ""
                }
            }
            else {
                alert("กรุณากรอกข้อมูลให้ครบถ้วนครับ")
            }

        }
        else {
            alert("value can't contain $ # [ ] / or .")
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Container maxWidth="md" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} className={classes.GridCenter}>

                            <Paper className={classes.paper} elevation={3} >
                                <div>
                                    <Title>กรุณากรอกข้อมูล</Title>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <DatePicker
                                            minDate={today}
                                            margin="normal"
                                            label="วัน/เดือน/ปี"
                                            value={this.props.reducer.DateQuestionReducer}
                                            format="dd/MM/yyyy"
                                            onChange={this.handleDateChange}
                                        />
                                        <br /><br />

                                    </MuiPickersUtilsProvider>
                                    <form onSubmit={this.handleSubmit}>
                                        <TextField required type="number" id="number_of_choice" variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><AssignmentOutlinedIcon /></InputAdornment>) }} fullWidth inputProps={{ min: "1", max: "10" }} label="ระบุจำนวนคำตอบ" helperText="Positive Integer(1-10)" inputRef={(input) => this.getNum = input} defaultValue={this.props.reducer.addnumberReducer.num} /><br /><br />
                                        <TextField required type="text" id="text_of_group" variant="outlined" InputProps={{ startAdornment: (<InputAdornment position="start"><AssignmentIcon /></InputAdornment>) }} fullWidth label="ชื่อกลุ่ม" helperText="A-Z, a-z, 0-9, _ (underscore) And it should start with a letter." inputRef={(input) => this.groupName = input} defaultValue={this.props.reducer.GroupNameReducer} /><br /><br />
                                        {this.props.reducer.ButtonCreateForm ? <Button variant="contained" color="primary" onClick={this.handleSubmit}>สร้างฟอร์ม</Button> :
                                            <Button disabled variant="contained" color="primary">สร้างฟอร์ม</Button>}
                                    </form>
                                </div>
                            </Paper>

                        </Grid>

                        <Grid item xs={6} sm={6} className={classes.GridCenter}>
                            {this.props.reducer.showformReducer &&
                                <Paper className={classes.paper} elevation={3}>
                                    <div>
                                        <br />
                                        {makeform(this.props.reducer.addnumberReducer.num)}
                                        <br />
                                        <Button variant="contained" color="primary" onClick={this.handleForm}>สร้างคำถาม</Button>
                                    </div>
                                </Paper>
                            }
                        </Grid>

                        {this.props.reducer.showformReducer &&
                            <Grid item>
                                <Paper className={classes.paper} elevation={3} >
                                    <Title> เลือกคำถามที่ต้องการจะเพิ่ม </Title>
                                    <List className={classes.list}>
                                        {this.props.reducer.tileDataReducer.map((title, index) =>
                                            <ListItem key={title.index} >
                                                <ListItemText
                                                    primary={title.question}
                                                />
                                                <ListItemSecondaryAction id={title.question} onClick={() => this.showtest(title)} >
                                                    <IconButton edge="end">
                                                        <AddIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )}
                                    </List>
                                </Paper>
                            </Grid>
                        }

                        {this.props.reducer.showquestionReducer && this.props.reducer.formReducer.length !== 0 &&
                            this.props.reducer.formReducer.map((form, index) => (
                                <Grid item xs sm={6} >
                                    <Paper elevation={3} className={classes.paper}>
                                        <Title>คำถามที่{index + 1}</Title>
                                        <Paper elevation={0}> {form.editing ? <QuestionEditing key={index} form={form} index={index} /> : <Question key={index} form={form} index={index} />} </Paper>
                                    </Paper>
                                </Grid>
                            ))
                        }
                    </Grid>

                    {this.props.reducer.showquestionReducer && this.props.reducer.formReducer.length !== 0 &&
                        <Grid item xs={12} sm={12} className={classes.GridBtn}>
                            <DialogflowBtn />
                            <FirebaseBtn />
                        </Grid>}
                    {/* <Box pt={4}>
                        <Typography variant="body2" color="textSecondary" align="center">
                            {'Copyright © '}<Link color="inherit" href="">Your Website</Link>{' '}{new Date().getFullYear()}{'.'}
                        </Typography>
                    </Box> */}
                </Container>
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
            form.push(<TextField type="text" placeholder="คำถาม" id={"question" + i} key={"question" + i} variant="outlined" style={{ width: 380 }}
                InputProps={{ startAdornment: (<InputAdornment position="start"><QuestionAnswerOutlinedIcon /></InputAdornment>) }} />)
            form.push(<br id={"break" + i} key={"break" + i} />, <br id={"break" + i + 1} key={"break" + i + 1} />)
        }

        else {
            form.push(<TextField type="text" placeholder="คำตอบ" id={"question" + i} key={"question" + i} variant="outlined" helperText="value can't contain more than 20 character A-Z a-z $ # [ ] / or ."
                InputProps={{ startAdornment: (<InputAdornment position="start"><MessageIcon /></InputAdornment>) }} />)
            form.push(<br id={"break" + i} key={"break" + i} />)
        }

    }
    return form
}

export default connect(mapStateToProps)(withStyles(styles)(MainForm));

