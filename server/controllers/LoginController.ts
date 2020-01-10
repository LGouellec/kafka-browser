import express, {Request, Response} from "express";
import TokenProvider from '../idp/TokenProvider';

export class LoginController {

    private readonly tokenProvider: TokenProvider;

    public async login(req: Request, res: Response) {
        res.send("COUCOU2");
    }
}

export default LoginController;
