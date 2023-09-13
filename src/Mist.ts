import * as Evaporate from 'evaporate';
import MistBase from './MistBase';

export default class Mist extends MistBase {
	constructor(config, files) {
		super(config, files);

		Evaporate.create(config).then(evaporate => {
			this.files.forEach(({file, data}) => {
				const { id } = file;
				const { path: name } = data;
				const formattedConfig = {
					name,
					file,
					progress: (percentage) => this.onProgress(percentage, file.id),
					contentType: config.sendFileContentType ? file.type : undefined, // if not specified or affected by external factors, the content-type of the file in the bucket will be `application/octet-stream`. The `sendFileContentType` config keeps this backwards compatible.
				};
				const cancel = () => evaporate.cancel(`${data.bucketName}/${data.path}`);

				this.onProgress(0, id);
				this.onStart(cancel, id);

				evaporate.add(formattedConfig)
					.then(
						awsObjectKey => this.onSuccess(id, data, awsObjectKey),
						reason => this.onError(reason, id)
					);
			});
		});
	}
}
