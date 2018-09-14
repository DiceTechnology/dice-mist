import * as Evaporate from 'evaporate';
import EvaporatorBase from './EvaporatorBase';

export default class Evaporator extends EvaporatorBase {
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
				};
				console.log(formattedConfig);
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
