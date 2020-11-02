import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
class LoginForm extends React.Component {

    handleSubmit = async (e) => {
        e.preventDefault()
        const username = document.getElementById("username").value
        const password = document.getElementById("password").value
        const data = {
            username: username,
            password: password
        }
        await axios({
            method: 'post',
            url: 'http://localhost:5000/auth',
            data: data
        }).then(res => {
            const status = res.data.status
            if(status === 1){
                this.props.dispatch({
                    type: 'loggined'
                })
                
            }
            else if(status === 2){
                alert('Incorrect Username and/or Password')
            }
            else {
                alert('Please enter Username ande Password!')
            }
        }).catch(err => {
            console.error(err)
        })
    }
    render() {
        return (
            <div>
                <div style={{ "width": "300px", "margin": "0 auto", "fontFamily": "Arial, Helvetica, sans-serif" }}>
                    <h1 style={{ "textAlign": "center", "color": "#4d4d4d", "fontSize": "24px", "padding": "20px 0 20px 0" }}>Login Form</h1>
                    <form >
                        <input style={{ "width": "100%", "padding": "15px", "border": "1px solid #ddd", "marginBottom": "15px", "boxSizing": "border-box" }} type="text" id="username" name="username" placeholder="Username" required></input>
                        <input style={{ "width": "100%", "padding": "15px", "border": "1px solid #ddd", "marginBottom": "15px", "boxSizing": "border-box" }} type="password" id="password" name="password" placeholder="Password" required></input>
                        <button style={{ "width": "100%", "padding": "15px", "backgroundColor": "#535b63", "border": "0", "boxSizing": "border-box", "cursor": "pointer", "fontWeight": "bold", "color": "#fff" }} onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        reducer: state
    }
}

export default connect(mapStateToProps)(LoginForm);
