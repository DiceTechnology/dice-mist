export default abstract class EvaporatorBase {
	files: any[];
	config: any;
	onStart: (cancel: () => void, guid: string) => null;
	onProgress: (percentage: number, guid: string) => null;
	onSuccess: (guid: string, data: any, awsObjectKey?: string) => null;
	onError: (reason: any, guid: string) => null;

	constructor (config, files) {
		this.files = files;
		this.config = config;
	}

	protected getConfig = (file, { data: { path: name } }) => ({
		name,
		file,
		progress: (percentage) => this.onProgress(percentage, file.guid),
	})

	start = onStart => {
		this.onStart = onStart;
		return this;
	}

	progress = onProgress => {
		this.onProgress = onProgress;
		return this;
	}

	success = onSuccess => {
		this.onSuccess = onSuccess;
		return this;
	}

	error = onError => {
		this.onError = onError;
		return this;
	}
}
