import {Request, Response} from "express";
import TokenProvider from "../idp/TokenProvider";
import KafkaClient from "../kafka/KafkaClient";

export class ConsumerController {

    public async test(req: Request, res: Response) {

    }

}

export default ConsumerController;
