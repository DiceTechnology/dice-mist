export enum WorkerMessages {
	PROGRESS = 'progress',
	SUCCESS = 'success',
	START = 'start',
	ERROR = 'error'
}

export interface IConfig {
	worker?: boolean;
	[key: string]: any;
}
