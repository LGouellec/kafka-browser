import { Kafka, ResourceTypes, DescribeConfigResponse } from "kafkajs";

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
