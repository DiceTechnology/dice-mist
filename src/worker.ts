// import Evaporate from 'evaporate';
// import SparkMD5 from 'spark-md5';
// import { sha256 } from 'js-sha256';

// class Worker {
// 	evaporate: any;
// 	constructor() {
// 		this.evaporate = null;
// 		this.listenToEvents();
// 	}
//
// 	private listenToEvents = () => {
// 		self.onmessage = async ({ data }) => {
// 			const { type, id, config } = data;
//
// 			switch (type) {
// 				case 'cancel':
// 					if (this.evaporate) this.evaporate.cancel(id);
// 					else console.error('Cannot cancel, evaporate not initialised');
// 					break;
// 				case 'upload':
// 					const augmentedConfig = this.augmentConfig(config);
// 					this.evaporate = await Evaporate.create(augmentedConfig);
// 					this.upload(data);
// 					break;
// 			}
// 		};
// 	}
//
// 	private upload = ({ config, files, fileMeta })  => {
// 		files.forEach( async ({file, data}, index) => {
// 			const formattedConfig = this.generateFileConfig(file, data, fileMeta[index]);
// 			const cancelId = `${data.bucketName}/${data.path}`;
//
// 			postMessage({type: 'start', file: fileMeta[index], cancelId});
//
// 			this.evaporate.add(formattedConfig)
// 				.then(
// 					awsObjectKey => postMessage({type: 'success', file: fileMeta[index], data, awsObjectKey}),
// 					reason => postMessage({type: 'error', reason, file: fileMeta[index]})
// 				);
//
// 			try {
// 				const awsObjectKey = await this.evaporate.add(formattedConfig);
// 				postMessage({type: 'success', file: fileMeta[index], data, awsObjectKey});
// 			} catch (reason) {
// 				postMessage({type: 'error', reason, file: fileMeta[index]});
// 			}
//
// 		});
// 	}
//
// 	private augmentConfig = config => ({
// 		...config,
// 		cryptoMd5Method: data => btoa(SparkMD5.ArrayBuffer.hash(data, true)),
// 		cryptoHexEncodedHash256: data =>  {
// 			const hash = sha256.create();
// 			hash.update(data);
// 			return hash.hex();
// 		}
// 	})
//
// 	private generateFileConfig = (file, {data: { path : name, bucketName : bucket }}, guid) => ({
// 		name,
// 		file,
// 		bucket,
// 		progress: progress => postMessage({ type: 'progress', progress, guid })
// 	})
//
// }


// self.onmessage = async ({ data }) => {
// 	const { type, id, config } = data;
//
// 	switch (type) {
// 		case 'cancel':
// 			if (this.evaporate) this.evaporate.cancel(id);
// 			else console.error('Cannot cancel, evaporate not initialised');
// 			break;
// 		case 'upload':
// 			const augmentedConfig = this.augmentConfig(config);
// 			this.evaporate = await Evaporate.create(augmentedConfig);
// 			this.upload(data);
// 			break;
// 	}
// };

console.log("WOOT WOOT")
const ctx: Worker = self as any;

// Respond to message from parent thread
ctx.addEventListener('message', (event) => console.log(event));

export default null as any;
