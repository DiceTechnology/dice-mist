import EvaporatorBase from './EvaporatorBase';
import Worker = require('worker-loader?inline=true!./worker');
console.log(Worker);

enum WorkerMessage {
	PROGRESS = 'progress',
	SUCCESS = 'success',
	START = 'start',
	ERROR = 'error'
}

export default class EvaporatorThreaded extends EvaporatorBase {
	completedFiles: number;
	numFiles: number;
	worker: any;

	constructor(config, files) {
		super(config, files);

		const fileMeta = files.map(file => file.file.guid);

		this.numFiles = files.length;
		this.completedFiles = 0;
		this.worker = new Worker();
		this.listenToMessages();
		this.worker.postMessage({
			type: 'upload',
			config,
			files,
			fileMeta
		});
	}

	private listenToMessages = () => {
		this.worker.onmessage = ({data: { type, progress, guid, data, file, cancelId, reason }}) => {
			switch (type) {
				case (WorkerMessage.PROGRESS):
					this.onProgress(progress, guid);
					break;
				case (WorkerMessage.SUCCESS):
					this.onSuccess(file, data);
					this.completedFiles += 1;
					break;
				case (WorkerMessage.START):
					const cancel = this.generateCancel(cancelId);
					this.onStart(cancel, file);
					break;
				case (WorkerMessage.ERROR):
					this.onError(reason, file);
					this.completedFiles += 1;
			}

			this.checkCompletion();
		};
	}

	private generateCancel = (id) => (() => {
		this.completedFiles += 1;
		this.checkCompletion();
		this.worker.postMessage({
			type: 'cancel',
			id,
		});
	})

	private checkCompletion = () => {
		if (this.completedFiles === this.numFiles) {
			this.worker.terminate();
		}
	}
}
