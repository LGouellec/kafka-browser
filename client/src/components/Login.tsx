import React, { useState } from "react";
import { FormGroup, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';
import '../css/Login.css';
import { History, LocationState } from "history";

interface LoginState {
    user: string;
    password: string;
}

interface LoginProps {
    history: History<LocationState>;
}

export class Login extends React.Component<LoginProps, LoginState>{

    constructor(props: LoginProps, context: {}) {
        super(props, context);
        this.state = {
            user: '',
            password: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);

        this.setUser = this.setUser.bind(this);
        this.setPassword = this.setPassword.bind(this);
    }

    handleSubmit() {
        fetch(`/api/login?user=${this.state.user}&password=${this.state.password}`)
            .then(async (response) => {
                if (response.status === 200)
                {
                    var body = await response.json();
                    localStorage.setItem("token", body.token);
                    this.props.history.push('/');
                }
            })
    }

    setUser(e: any) {
        this.setState({
            user: e.target.value
        });
    }

    setPassword(e: any) {
        this.setState({
            password: e.target.value
        });
    }

    render() {
        return (<div className="Login">
            <form>
                <FormGroup >
                    <InputLabel>User</InputLabel>
                    <Input id="login" aria-describedby="login-helper" onChange={this.setUser} />
                    <FormHelperText id="login-helper">Kafka user</FormHelperText>
                </FormGroup>
                <FormGroup >
                    <InputLabel>Password</InputLabel>
                    <Input id="pwd" aria-describedby="pwd-helper" type="password" onChange={this.setPassword} />
                    <FormHelperText id="pwd-helper">Kafka password</FormHelperText>
                </FormGroup>
                <Button onClick={this.handleSubmit}>
                    Login
                </Button>
            </form>
        </div>);
    }
}

export default Login;