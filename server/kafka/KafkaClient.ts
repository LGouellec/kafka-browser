import { Kafka, Broker } from "kafkajs";


export class KafkaClient {

    public async login(user: string, password: string) {
        const clientId = process.env.CLIENT_ID || "kafka-browser-server";
        const brokers = process.env.BROKERS || "192.168.56.1:9092"
        const kafka = new Kafka({
            clientId: "kafka-node-test",
            brokers: ["192.168.56.1:9092"],
            sasl: {
                mechanism: "scram-sha-512",
                password: "Michelin/1",
                username: "admin"
            },
        });
    }

}

export default KafkaClient;