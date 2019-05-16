export enum WorkerMessages {
	PROGRESS = 'progress',
	SUCCESS = 'success',
	START = 'start',
	UPLOAD = 'upload',
	CANCEL = 'cancel',
	ERROR = 'error',
}

export interface IConfig {
	worker?: boolean;
	[key: string]: any;
}
