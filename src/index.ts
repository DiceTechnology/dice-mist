import Evaporator from './Evaporator';
import EvaporatorThreaded from './EvaporatorThreaded';
import { IConfig } from './types';

const EvaporatorFactory = (config: IConfig = {} , files = []) => {
	return config.worker ? new EvaporatorThreaded(config, files) : new Evaporator(config, files);
};

export default EvaporatorFactory;
