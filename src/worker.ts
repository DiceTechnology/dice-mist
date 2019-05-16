import * as Evaporate from 'evaporate';
import * as SparkMD5 from 'spark-md5';
import { sha256 } from 'js-sha256';
import { WorkerMessages } from './types';

class Worker {
	evaporate: any;
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
					const augmentedConfig = this.augmentConfig(config);
					this.evaporate = await Evaporate.create(augmentedConfig);
					this.upload(data);
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
				progress: progress => postMessage({ type: WorkerMessages.PROGRESS, progress, id })
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
		}
	})
}

export default new Worker();
