import { registerService } from '../apis/restApi';

export default () => {
    registerService('switch', 'toggle');
    registerService('switch', 'turn_on');
    registerService('switch', 'turn_off');
    registerService('light', 'toggle');
    registerService('light', 'turn_on');
    registerService('light', 'turn_off');
};
