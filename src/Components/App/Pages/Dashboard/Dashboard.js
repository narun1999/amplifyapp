import 'date-fns';
import React, { Component } from 'react'
import {
    Paper,
    Typography,
    Button
} from '@material-ui/core'
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart, Pie, Cell
} from "recharts";
import GoogleLogin from 'react-google-login';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { connect } from 'react-redux'

// const timeElapsed = Date.now();
// const today = new Date(timeElapsed);
const axios = require('axios')
const styles = (theme) => ({
    root: {
        margin: 20,
        padding: 20,
        maxWidth: 300
    },
    form: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-evenly'
    },
    Gridroot: {
        flexGrow: 1,
    },
    paper: {
        padding: 20,
        textAlign: 'center',
    },
    container: {
        paddingTop: theme.spacing(4),

    },
    GridCenter: {
        alignContent: 'center',
        justify: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    }
})




class Dashboard extends Component {

    handleType = (event) => {

        if (event.target.value === 'Bar Chart') {
            this.props.dispatch({
                type: 'HANDLE_BAR'
            })
            this.props.dispatch({
                type: 'SHOW_BAR'
            })
            this.props.dispatch({
                type: 'HIDE_PIE'
            })
        } else if (event.target.value === 'Pie Chart') {
            this.props.dispatch({
                type: 'HANDLE_PIE'
            })
            this.props.dispatch({
                type: 'SHOW_PIE'
            })
            this.props.dispatch({
                type: 'HIDE_BAR'
            })
        }
    }


    handleDateChange = (date) => {

        this.props.dispatch({
            type: 'SET_DATE',
            data: date
        })
    };



    Call = (res) => {

        const accessToken = res.accessToken
        var date = new Date(this.props.reducer.DateDashboardReducer)

        var dateday = date.getDate();
        if (dateday >= 1 && dateday <= 9) {
            dateday = "0" + dateday;
        }

        var month = date.getMonth() + 1;
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        var finaldate = dateday + '_' + month + '_' + date.getFullYear()
        // console.log(finaldate);
        this.calldata(finaldate, accessToken);

    }

    calldata = async (num, accessToken) => {

        let status 
        var res = await axios({
            method: 'get',
            url: `https://employee-satisfaction-su-2d1c4.firebaseio.com/dashboard/${num}.json`,
            headers: { 'Authorization': `Bearer ${accessToken}` }
        }).then((res) => {
            status = true
            return res.data
        }).catch((err) => {
            status = false
            return err.data
        })
        
        //console.log(Object.keys(res))
        if (status === true && res !== null) {
            this.props.dispatch({
                type: 'SHOW_GRAPH'
            })
            this.createdatasource_barchart(res);
            this.createdatasource_piechart(res);
        } else {
            alert('ไม่พบข้อมูล')
        }

    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    createdatasource_barchart = (data) => {
        const BarChart = data
        const group = [], dataBar = [], labels = []
        Object.keys(BarChart).forEach(key1 => {
            Object.keys(BarChart[key1]).forEach((key2, index) => {
                const label = [], bar = []
                Object.keys(BarChart[key1][key2]).forEach(key3 => {
                    if (key3 !== 'name') {
                        label.push(key3)
                    }
                })
                bar.push(BarChart[key1][key2])
                dataBar.push(bar)
                group.push(key1 + ` Question ${index + 1}`)
                labels.push(label)
            })
        })

        const mydata = {
            Bar: dataBar,
            Group: group,
            Labels: labels
        }

        this.props.dispatch({
            type: 'SET_BAR',
            data: mydata
        })
    }

    createdatasource_piechart = (data) => {
        const PieChart = data
        const group = [], dataPie = [], question = []
        Object.keys(PieChart).forEach(key1 => {
            Object.keys(PieChart[key1]).forEach((key2, index) => {
                const dataArrays = []
                Object.keys(PieChart[key1][key2]).forEach(key3 => {
                    const obj = {}
                    if (key3 !== 'name') {
                        obj['name'] = key3
                        obj['value'] = PieChart[key1][key2][key3]
                        dataArrays.push(obj)
                    }
                })
                group.push(key1 + ` Question ${index + 1}`)
                question.push(PieChart[key1][key2].name)
                dataPie.push(dataArrays)
            })

        })
        const mydata = {
            Pie: dataPie,
            Group: group,
            Question: question
        }

        this.props.dispatch({
            type: 'SET_PIE',
            data: mydata
        })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    responseGoogleOnFail = (err) => {
        alert('เกิดข้อผิดพลาด ', err)
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    render() {

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#F03119'];
        const { classes } = this.props;
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

            return (
                `${(percent * 100).toFixed(0)}%`
            );
        };
        return (
            <div>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3} >
                        <Grid item xs={12} className={classes.GridCenter}>
                            <Paper className={classes.paper}>
                                <Typography variant="h5">
                                    กรุณาเลือกวันที่ที่ต้องการ
                                </Typography>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                        minDate={new Date(2020, 7, 24)}
                                        margin="normal"
                                        label="Date picker"
                                        disableFuture
                                        value={this.props.reducer.DateDashboardReducer}
                                        format="dd/MM/yyyy"
                                        onChange={this.handleDateChange}
                                    />
                                </MuiPickersUtilsProvider>


                                <br />
                                <br />
                                <GoogleLogin
                                    clientId="482184180474-vosgudhaspfh5qimdab4d3d8dndv67lf.apps.googleusercontent.com"
                                    render={renderProps => (
                                        <Button variant="contained" color="primary"
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}>
                                            Summit
                                        </Button>
                                    )}
                                    scope='https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database'
                                    onSuccess={this.Call}
                                    onFailure={this.responseGoogleOnFail}
                                    cookiePolicy={'single_host_origin'}
                                />
                                
                            </Paper>

                        </Grid>
                    </Grid>
                    {this.props.reducer.showgraphReducer &&
                        <Grid container spacing={2} >
                            <Grid item xs={12} sm={12} className={classes.GridCenter}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="selected-type">Type</InputLabel>
                                    <Select
                                        labelId="selected-type"
                                        id="selected-type"
                                        value={this.props.reducer.ChartTypeReducer}
                                        onChange={this.handleType}
                                    >
                                        <MenuItem value={'Bar Chart'}>Bar Chart</MenuItem>
                                        <MenuItem value={'Pie Chart'}>Pie Chart</MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                            {this.props.reducer.showBarChartReducer && (
                                this.props.reducer.BarChartReducer.Bar.map((converted, index) => (
                                    <Grid item xs={6} sm={6} className={classes.GridCenter}>
                                        <Paper className={classes.paper}>
                                            <Typography variant="h5">
                                                {this.props.reducer.BarChartReducer.Group[index]}
                                            </Typography>
                                            <br />
                                            <ResponsiveContainer width="100%" height={300}>
                                                <BarChart
                                                    height={300}
                                                    data={converted}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}

                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend align="center" />
                                                    {this.props.reducer.BarChartReducer.Labels[index].map((label, index) => (
                                                        <Bar key={`bar-${index}`} dataKey={label} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Paper>
                                    </Grid>
                                ))
                            )}
                            {this.props.reducer.showPieChartReducer && (
                                this.props.reducer.PieChartReducer.Pie.map((datapie, index) => (
                                    <Grid item xs={6} sm={6} className={classes.GridCenter}>
                                        <Paper className={classes.paper}>
                                            <Typography variant="h5">
                                                {this.props.reducer.PieChartReducer.Group[index]}
                                            </Typography>
                                            <br />
                                            <Typography variant="h5">
                                                {this.props.reducer.PieChartReducer.Question[index]}
                                            </Typography>
                                            <PieChart width={400} height={300} >
                                                <Pie
                                                    isAnimationActive={false}
                                                    labelLine={true}
                                                    label={renderCustomizedLabel}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    data={datapie}
                                                >
                                                    {datapie.map((entry, index) => (

                                                        <Cell fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                                            </PieChart>
                                        </Paper>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    }
                </Container>
            </div>

        )
    }
}

const mapStateToProps = (state) => { //ส่งค่าข้าม components
    return {
        reducer: state
    }
}
export default connect(mapStateToProps)(withStyles(styles)(Dashboard));