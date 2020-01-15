import { Kafka, ResourceTypes, DescribeConfigResponse } from "kafkajs";
import { SchemaRegistry }  from '@kafkajs/confluent-schema-registry';

export interface KafkaPartition {
	partitionErrorCode: number;
	partitionId: number;
	leader: number;
	replicas: Array<number>;
	isr: Array<number>;
}

export interface KafkaTopic {
	topic: string;
	partitions: KafkaPartition[];
}

export interface KafkaConfig {
	resourceName: string;
	resourceType: string;
	config: KafkaConfigEntry[];
}

export interface KafkaConfigEntry {
	configName: string
	configValue: string
	isDefault: boolean
	readOnly: boolean
}

export interface KafkaTopicOffset{
	partition: number;
	offset: number;
	high: number;
	low: number;
}

export class KafkaClient {

	private groupId: string = "kafka-browser-client"
	private readonly registryUrl: string = undefined;
	private readonly registry: SchemaRegistry = undefined;

	constructor() {
		if (process.env.REGISTRY) {
			this.registryUrl = process.env.REGISTRY;
			this.registry = new SchemaRegistry({ host: this.registryUrl });
		}
	}

	public async login(user: string, password: string): Promise<boolean> {
		var kafka = this.createKafkaClient(user, password);

		const admin = kafka.admin();
		try {
			await admin.connect();
			return true;
		} catch (KafkaJSConnectionError) {
			return false;
		} finally {
			await admin.disconnect();
		}
	}

	public async getAllTopics(user: string, password: string): Promise<KafkaTopic[]> {
		var kafka = this.createKafkaClient(user, password);

		const admin = kafka.admin();

		try {
			await admin.connect();
			const res = await admin.fetchTopicMetadata({ topics: undefined });
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
		} catch (KafkaJSConnectionError) {
			return [];
		} finally {
			await admin.disconnect();
		}
	}

	public async getConfig(user: string, password: string, topicName: string): Promise<KafkaConfig> {

		var kafka = this.createKafkaClient(user, password);

		const admin = kafka.admin();

		try {
			await admin.connect();
			var response = await admin.describeConfigs({
				includeSynonyms: false,
				resources: [
					{
						type: ResourceTypes.TOPIC,
						name: topicName
					}
				]
			});

			var rsType = "UNKNOWN"
			switch(response.resources[0].resourceType)
			{
				case ResourceTypes.TOPIC:
					rsType = "TOPIC";
					break;
				case ResourceTypes.GROUP:
					rsType = "GROUP";
					break;
				case ResourceTypes.CLUSTER:
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
					}
				})
			};
		} catch (KafkaJSConnectionError) {
			return undefined;
		} finally {
			await admin.disconnect();
		}
	}

	public async getOffsets(user: string, password: string, topicName: string): Promise<Array<KafkaTopicOffset>> {

		var kafka = this.createKafkaClient(user, password);
		const admin = kafka.admin();

		try {
			await admin.connect();
			var response = await admin.fetchTopicOffsets(topicName);
			return response.map(r => {
				return {
					partition: r.partition,
					offset: +r.offset,
					high: +r.high,
					low: +r.low,
				}
			})
		} catch (KafkaJSConnectionError) {
			return undefined;
		} finally {
			await admin.disconnect();
		}
	}
	
	public async consume(user: string, password: string, topicName: string, partition: string | number, seek: string, offset: number) : Promise<Array<any>>{

		var kafka = this.createKafkaClient(user, password);
		var offsets = await this.getOffsets(user, password, topicName);
		const admin = kafka.admin();
		// Reset offset to begin
		await admin.setOffsets({
			groupId: this.groupId,
			topic: topicName,
			partitions: offsets.map(o => {
				return {
					partition: o.partition,
					offset: o.low.toString()
				}
			})
		});

		const consumer = kafka.consumer({ groupId: this.groupId })
		await consumer.connect();
		await consumer.subscribe({ topic: topicName, fromBeginning: true });

		var promise = new Promise<Array<any>>(async (resolve, reject) => {
			var array = new Array();
			
			await consumer.run({
				partitionsConsumedConcurrently: 3,
				autoCommitThreshold: 200,
				eachMessage: async ({ topic, partition, message }) => {
					if (this.registry) {
						const decodedKey = await this.registry.decode(message.key);
						const decodedValue = await this.registry.decode(message.value);
						console.log({ decodedKey, decodedValue });
					}
					array.push(message);
				}
			});

			setTimeout(async () => {
				await consumer.disconnect();
				resolve(array);
			}, 2000);
		});

		return promise;
	}
	
	private getClientId(): string { return process.env.CLIENT_ID || "kafka-browser-server"; }
	private getbrokers(): string[] { return process.env.BROKERS ? process.env.BROKERS.split(",") : ["192.168.56.1:9092"]; }

	private createKafkaClient(user: string, pwd: string): Kafka {
		const clientId = this.getClientId();
		const brokers = this.getbrokers();
		return new Kafka({
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

export default KafkaClient;
