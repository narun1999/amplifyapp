import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GoogleLogin } from 'react-google-login';
import Button from '@material-ui/core/Button';

import StorageIcon from '@material-ui/icons/Storage';
import { withStyles } from '@material-ui/core/styles';
import { Scheduled } from './Scheduled';
const CLIENT_ID = "482184180474-vosgudhaspfh5qimdab4d3d8dndv67lf.apps.googleusercontent.com";

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    }
});

class FirebaseBtn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLogined: false,
            accessToken: ''
        };

        this.login = this.login.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    }

    async login(response) {
        if (response.accessToken) {
            this.setState(state => ({
                isLogined: true,
                accessToken: response.accessToken
            }));
        }
        this.props.dispatch({
            type: 'ON_PROGRESS'
        })
        this.props.dispatch({
            type: 'HIDE_FORM',
        });
        this.props.dispatch({
            type: 'CLEAR_FORM'
        })

        var data_on_time = {};
        for (var i = 0; i < this.props.reducer.formReducer.length; i++) {
        
            var Question =
            {
                question: this.props.reducer.formReducer[i].question[0],
                answer: this.props.reducer.formReducer[i].answer
            };
            data_on_time[`qs${i+1}`] = Question
            
        }
        const DATE = this.props.reducer.adddate.finaldate
        const GROUPNAME = this.props.reducer.GroupNameReducer.toUpperCase()
        let isSuccess = await Scheduled(this.state.accessToken, data_on_time, GROUPNAME, DATE)

        if (isSuccess === true) {
            this.props.dispatch({
                type: 'IS_SUCCESS'
            })
        }
    }
    logout(response) {
        this.setState(state => ({
            isLogined: false,
            accessToken: ''
        }));

        this.props.signInState(this.state.isLogined)
    }

    handleLoginFailure(response) {
        alert('Failed to log in')
    }

    handleLogoutFailure(response) {
        alert('Failed to log out')
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <GoogleLogin
                    clientId={CLIENT_ID}
                    render={(renderProps) => (
                        <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            startIcon={<StorageIcon />}
                        >
                            Create Question on Timeset
                        </Button>
                    )}
                    scope='https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database'
                    onSuccess={this.login}
                    onFailure={this.handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                    responseType='code,token'
                />
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        reducer: state
    }
}

export default connect(mapStateToProps)(withStyles(styles)(FirebaseBtn));