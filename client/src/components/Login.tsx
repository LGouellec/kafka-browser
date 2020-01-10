import React from "react";
import { FormGroup, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';
import '../css/Login.css';

export class Login extends React.Component<{}, {}>{

    constructor(props: {}, context: {}) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {

    }

    render() {
        return (<div className="Login">
            <form onSubmit={this.handleSubmit}>
                <FormGroup >
                    <InputLabel>User</InputLabel>
                    <Input id="login" aria-describedby="login-helper" />
                    <FormHelperText id="login-helper">Kafka user</FormHelperText>
                </FormGroup>
                <FormGroup >
                    <InputLabel>Password</InputLabel>
                    <Input id="pwd" aria-describedby="pwd-helper" type="password" />
                    <FormHelperText id="pwd-helper">Kafka password</FormHelperText>
                </FormGroup>
                <Button type="submit">
                    Login
                </Button>
            </form>
        </div>);
    }
}

export default Login;