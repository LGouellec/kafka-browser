"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
class KafkaClient {
    login(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var kafka = this.createKafkaClient(user, password);
            const admin = kafka.admin();
            try {
                yield admin.connect();
                return true;
            }
            catch (KafkaJSConnectionError) {
                return false;
            }
            finally {
                yield admin.disconnect();
            }
        });
    }
    getAllTopics(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var kafka = this.createKafkaClient(user, password);
            const admin = kafka.admin();
            try {
                yield admin.connect();
                const res = yield admin.fetchTopicMetadata({ topics: undefined });
                return res.topics.map((e) => {
                    return {
                        topic: e.name,
                        partitions: e.partitions.map(p => {
                            return {
                                partitionErrorCode: p.partitionErrorCode,
                                partitionId: p.partitionId,
                                leader: p.leader,
                                replicas: p.replicas,
                                isr: p.isr
                            };
                        })
                    };
                });
            }
            catch (KafkaJSConnectionError) {
                return [];
            }
            finally {
                yield admin.disconnect();
            }
        });
    }
    getConfig(user, password, topicName) {
        return __awaiter(this, void 0, void 0, function* () {
            var kafka = this.createKafkaClient(user, password);
            const admin = kafka.admin();
            try {
                yield admin.connect();
                var response = yield admin.describeConfigs({
                    includeSynonyms: false,
                    resources: [
                        {
                            type: kafkajs_1.ResourceTypes.TOPIC,
                            name: topicName
                        }
                    ]
                });
                var rsType = "UNKNOWN";
                switch (response.resources[0].resourceType) {
                    case kafkajs_1.ResourceTypes.TOPIC:
                        rsType = "TOPIC";
                        break;
                    case kafkajs_1.ResourceTypes.GROUP:
                        rsType = "GROUP";
                        break;
                    case kafkajs_1.ResourceTypes.CLUSTER:
                        rsType = "CLUSTER";
                        break;
                }
                return {
                    resourceName: response.resources[0].resourceName,
                    resourceType: rsType,
                    config: response.resources[0].configEntries.map(c => {
                        return {
                            configName: c.configName,
                            configValue: c.configValue,
                            isDefault: c.isDefault,
                            readOnly: c.readOnly
                        };
                    })
                };
            }
            catch (KafkaJSConnectionError) {
                return undefined;
            }
            finally {
                yield admin.disconnect();
            }
        });
    }
    getOffsets(user, password, topicName) {
        return __awaiter(this, void 0, void 0, function* () {
            var kafka = this.createKafkaClient(user, password);
            const admin = kafka.admin();
            try {
                yield admin.connect();
                var response = yield admin.fetchTopicOffsets(topicName);
                return response.map(r => {
                    return {
                        partition: r.partition,
                        offset: +r.offset,
                        high: +r.high,
                        low: +r.low,
                    };
                });
            }
            catch (KafkaJSConnectionError) {
                return undefined;
            }
            finally {
                yield admin.disconnect();
            }
        });
    }
    getClientId() { return process.env.CLIENT_ID || "kafka-browser-server"; }
    getbrokers() { return process.env.BROKERS ? process.env.BROKERS.split(",") : ["192.168.56.1:9092"]; }
    createKafkaClient(user, pwd) {
        const clientId = this.getClientId();
        const brokers = this.getbrokers();
        return new kafkajs_1.Kafka({
            clientId,
            brokers,
            sasl: {
                mechanism: "scram-sha-512",
                password: pwd,
                username: user
            },
        });
    }
}
exports.KafkaClient = KafkaClient;
exports.default = KafkaClient;
//# sourceMappingURL=KafkaClient.js.map