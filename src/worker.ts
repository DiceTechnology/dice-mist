import * as Evaporate from 'evaporate';
import * as SparkMD5 from 'spark-md5';
import { sha256 } from 'js-sha256';
import { WorkerMessages } from './types';

class Worker {
	evaporate: any;
	signHeaders: any;

	constructor() {
		this.evaporate = null;
		this.listenToEvents();
	}

	private listenToEvents = () => {
		// @ts-ignore
		self.onmessage = async ({ data }) => {
			const { type, id, config } = data;

			switch (type) {
				case WorkerMessages.CANCEL:
					if (this.evaporate) this.evaporate.cancel(id);
					// @ts-ignore
					else console.error('Cannot cancel, evaporate not initialised');
					break;
				case WorkerMessages.UPLOAD:
					// Save initial values
					this.signHeaders = { ...config.signHeaders };
					const augmentedConfig = this.augmentConfig(config);
					this.evaporate = await Evaporate.create(augmentedConfig);
					this.upload(data);
					break;
				case WorkerMessages.CONFIG:
					// Save updated values
					this.signHeaders = { ...config.signHeaders };
					break;
			}
		};
	}

	private upload = ({ config, files, fileMeta })  => {
		files.forEach( async ({ file, data, data: { path : name, bucketName : bucket } }, index) => {
			const id = fileMeta[index];
			const cancelId = `${bucket}/${name}`;
			const formattedConfig = {
				name,
				file,
				bucket,
				progress: progress => postMessage({ type: WorkerMessages.PROGRESS, progress, id }),
				contentType: config.sendFileContentType ? file.type : undefined, // if not specified or affected by external factors, the content-type of the file in the bucket will be `application/octet-stream`. The `sendFileContentType` config keeps this backwards compatible.
			};

			postMessage({type: WorkerMessages.START, id, cancelId});

			try {
				const awsObjectKey = await this.evaporate.add(formattedConfig);
				postMessage({type: WorkerMessages.SUCCESS, id, data, awsObjectKey});
			} catch (reason) {
				postMessage({type: WorkerMessages.ERROR, reason, id });
			}
		});
	}

	private augmentConfig = config => ({
		...config,
		// @ts-ignore
		cryptoMd5Method: data => btoa(SparkMD5.ArrayBuffer.hash(data, true)),
		cryptoHexEncodedHash256: data =>  {
			const hash = sha256.create();
			hash.update(data);
			return hash.hex();
		},
		// Transform values into getters
		signHeaders: Object.keys(config.signHeaders)
			.reduce((headers, key) => {
				return {
					...headers,
					[key]: () => this.signHeaders[key]
				};
			}, {})
	})
}

export default new Worker();
