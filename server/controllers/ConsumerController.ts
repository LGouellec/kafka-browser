import {Request, Response} from "express";
import TokenProvider from "../idp/TokenProvider";
import KafkaClient from "../kafka/KafkaClient";

export interface ConsumeBody {
    partition: number|string;
    seek: "from_beginning" | "to_end";
    offset: number|undefined;
}

export class ConsumerController {

    public async consume(req: Request, res: Response) {
        const client = new KafkaClient();
        const tokenProvider = new TokenProvider();
        const t = req.header("authorization");
        const tokenInfo = tokenProvider.get(t);
        var body = req.body as ConsumeBody;
        
        const messages = await client.consume(tokenInfo.user, tokenInfo.password, req.params.topicName, body.partition, body.seek, body.offset);
        res.send(messages);
    }

}

export default ConsumerController;
