import {Request, Response} from "express";
import TokenProvider from "../idp/TokenProvider";
import KafkaClient from "../kafka/KafkaClient";

export class TopicController {

    public async getTopics(req: Request, res: Response) {
        const client = new KafkaClient();
        const tokenProvider = new TokenProvider();
        const t = req.header("authorization");
        const tokenInfo = tokenProvider.get(t);

        const topics = await client.getAllTopics(tokenInfo.user, tokenInfo.password);
        res.send(topics);
    }

    public async getConfig(req: Request, res: Response){
        const client = new KafkaClient();
        const tokenProvider = new TokenProvider();
        const t = req.header("authorization");
        const tokenInfo = tokenProvider.get(t);

        const configs = await client.getConfig(tokenInfo.user, tokenInfo.password, req.params.topicName);
        res.send(configs);
    }

    public async getOffsets(req: Request, res: Response){
        const client = new KafkaClient();
        const tokenProvider = new TokenProvider();
        const t = req.header("authorization");
        const tokenInfo = tokenProvider.get(t);

        const offsets = await client.getOffsets(tokenInfo.user, tokenInfo.password, req.params.topicName);
        res.send(offsets);
    }
}

export default TopicController;
