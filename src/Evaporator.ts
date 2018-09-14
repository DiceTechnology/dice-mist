import Evaporate from 'evaporate';
import EvaporatorBase from './EvaporatorBase';

export default class Evaporator extends EvaporatorBase {
	constructor(config, files) {
		super(config, files);

		Evaporate.create(config).then(evaporate => {
			this.files.forEach(({file, data}) => {
				const { guid } = file;
				const formattedConfig = this.getConfig(file, data);
				const cancel = () => evaporate.cancel(`${data.bucketName}/${data.path}`);

				this.onProgress(0, guid);
				this.onStart(cancel, guid);

				evaporate.add(formattedConfig)
					.then(
						awsObjectKey => this.onSuccess(guid, data, awsObjectKey),
						reason => this.onError(reason, guid)
					);
			});
		});
	}
}
