// https://www.freecodecamp.org/news/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0/
// https://www.npmjs.com/package/@kafkajs/confluent-schema-registry
import bodyParser from "body-parser";
import express from "express";
import { Kafka } from "kafkajs";
import LoginController from "./controllers/LoginController";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const kafka = new Kafka({
//   clientId: "kafka-node-test",
//   brokers: ["192.168.56.1:9092"],
//   sasl: {
//     mechanism: "scram-sha-512",
//     password: "Michelin/1",
//     username: "admin"
//   },
// });

// const admin = kafka.admin();
// const adminConsole = async () => {
//   await admin.connect();
//   const topics = await admin.fetchTopicMetadata({topics: undefined});
//   topics.topics.forEach((t) => {
//     console.log(t.name);
//   });
// };

// adminConsole();

// const producer = kafka.producer();
// const getRandomNumber = () => Math.round(Math.random() * 1000);
// const createMessage = (num: number) => ({
//   key: `key-${num}`,
//   value: `value-${num}-${new Date().toISOString()}`,
// });

// const connect = async function() {
//   await producer.connect();
// };

// connect();

// app.get("/api/send", async (req, res) => {
//   producer.send({
//     topic: "kafka-browser",
//     messages: [createMessage(getRandomNumber())]
//   })
//     .then(console.log)
//     .catch((e) => console.error(`[example/producer] ${e.message}`, e));

//   res.send("Message sent !");
// });

const login = new LoginController();
app.get("/api/coucou", login.login);

app.listen(port, () => console.log(`Listening on port ${port}`));

const errorTypes = ["unhandledRejection", "uncaughtException"] as const;
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"] as const;

errorTypes.map((type) => {
  (process as NodeJS.EventEmitter).on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      // await consumer.disconnect()
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.map((type) => {
  process.once(type, async () => {
    try {
      // await consumer.disconnect()
    } finally {
      process.kill(process.pid, type);
    }
  });
});
