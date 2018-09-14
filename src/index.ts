import Evaporator from './Evaporator';
import EvaporatorThreaded from './EvaporatorThreaded';

interface IConfig {
	worker?: boolean;
	[key: string]: any;
}

const EvaporatorFactory = (config: IConfig = {} , files = []) => {
	return config.worker ? new EvaporatorThreaded(config, files) : new Evaporator(config, files);
};

export default EvaporatorFactory;
