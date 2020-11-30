import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GoogleLogin } from 'react-google-login';
import Button from '@material-ui/core/Button';
import { RealTimeDB } from "./RealTimeDB"
import StorageIcon from '@material-ui/icons/Storage';
import { withStyles } from '@material-ui/core/styles';
const CLIENT_ID = "482184180474-vosgudhaspfh5qimdab4d3d8dndv67lf.apps.googleusercontent.com";

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  }
});

class DialogflowBtn extends Component {
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
    this.props.dispatch({
      type: 'INIT_NUM'
    })
    let isSuccess = await RealTimeDB(this.state.accessToken, this.props.reducer.formReducer, this.props.reducer.GroupNameReducer.toUpperCase())
    
    if(isSuccess === true){
      this.props.dispatch({
        type: 'IS_SUCCESS'
      })
    }
    // this.giveAccessToken(this.state.accessToken)
    // this.props.signInState(this.state.isLogined)
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
              Create Dialogflow Intent
            </Button>
          )}
          scope='https://www.googleapis.com/auth/dialogflow https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database'
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

export default connect(mapStateToProps)(withStyles(styles)(DialogflowBtn));
