import MistBase from './MistBase';
import MistWorker = require('worker-loader?inline=true&fallback=false!./worker');
import { WorkerMessages } from './types';

export default class MistThreaded extends MistBase {
	completedFiles: number;
	numFiles: number;
	worker: any;

	constructor(config, files) {
		super(config, files);

		const fileMeta = files.map(file => file.file.id);

		this.numFiles = files.length;
		this.completedFiles = 0;
		this.worker = new MistWorker();
		this.listenToMessages();
		this.worker.postMessage({
			type: WorkerMessages.UPLOAD,
			config,
			files,
			fileMeta
		});
	}

	private listenToMessages = () => {
		this.worker.onmessage = (message) => {
			const { data: {
				id,
				type,
				progress,
				data,
				cancelId,
				reason,
				awsObjectKey
			}} = message;

			switch (type) {
				case (WorkerMessages.PROGRESS):
					this.onProgress(progress, id);
					break;
				case (WorkerMessages.SUCCESS):
					this.onSuccess(id, data, awsObjectKey);
					this.completedFiles += 1;
					break;
				case (WorkerMessages.START):
					const cancel = this.generateCancel(cancelId);
					this.onStart(cancel, id);
					break;
				case (WorkerMessages.ERROR):
					this.onError(reason, id);
					this.completedFiles += 1;
			}

			this.checkCompletion();
		};
	}

	private generateCancel = (id) => (() => {
		this.completedFiles += 1;
		this.checkCompletion();
		this.worker.postMessage({id, type: WorkerMessages.CANCEL });
	})

	private checkCompletion = () => {
		if (this.completedFiles === this.numFiles) {
			this.worker.terminate();
		}
	}

	public updateConfig = config => this.worker.postMessage({ type: WorkerMessages.CONFIG, config });
}
