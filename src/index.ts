import Mist from './Mist';
import MistThreaded from './MistThreaded';
import { IConfig } from './types';

const MistFactory = (config: IConfig = {} , files = []) => {
	return config.worker ? new MistThreaded(config, files) : new Mist(config, files);
};

export default MistFactory;
