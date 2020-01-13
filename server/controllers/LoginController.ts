import {Request, Response} from "express";
import TokenProvider from "../idp/TokenProvider";
import KafkaClient from "../kafka/KafkaClient";

export class LoginController {

    public async login(req: Request, res: Response) {
        const client = new KafkaClient();
        const tokenProvider = new TokenProvider();
        const user = req.query.user;
        const pwd = req.query.password;
        const response = await client.login(user, pwd);
        if (response) {
            const tokenResponse = tokenProvider.generate(user);
            tokenProvider.add(tokenResponse.token, user, pwd, tokenResponse.expirationDate);
            res.send({
                token: tokenResponse.token,
                maxAge: tokenResponse.expireTime,
                expireDate: tokenResponse.expirationDate
            });
            res.end();
        } else {
            return res.status(401).end();
        }
    }

    public async refresh(req: Request, res: Response) {
        const token = req.header("authorization");
        const tokenProvider = new TokenProvider();
        var tokenInfo = tokenProvider.refresh(token);
        if(tokenInfo){
            res.send({
                token: tokenInfo.token,
                maxAge: tokenInfo.expireTime,
                expireDate: tokenInfo.expirationDate
            }).end();
        }
        else
          return res.status(400).end();
    }
}

export default LoginController;
