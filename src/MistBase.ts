export default abstract class MistBase {
	files: any[];
	config: any;
	onStart: (cancel: () => void, id: string) => null;
	onProgress: (percentage: number, id: string) => null;
	onSuccess: (id: string, data: any, awsObjectKey?: string) => null;
	onError: (reason: any, id: string) => null;

	constructor (config, files) {
		this.files = files;
		this.config = config;

		// default callbacks
		this.onStart = () => null;
		this.onProgress = () => null;
		this.onSuccess = () => null;
		this.onError = () => null;
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
