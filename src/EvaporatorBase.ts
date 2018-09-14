export default abstract class EvaporatorBase {
	files: any[];
	config: any;
	onStart: (cancel: () => void, id: string) => null;
	onProgress: (percentage: number, id: string) => null;
	onSuccess: (id: string, data: any, awsObjectKey?: string) => null;
	onError: (reason: any, id: string) => null;

	constructor (config, files) {
		this.files = files;
		this.config = config;
	}

	public start = onStart => {
		this.onStart = onStart;
		return this;
	}

	public progress = onProgress => {
		this.onProgress = onProgress;
		return this;
	}

	public success = onSuccess => {
		this.onSuccess = onSuccess;
		return this;
	}

	public error = onError => {
		this.onError = onError;
		return this;
	}
}
