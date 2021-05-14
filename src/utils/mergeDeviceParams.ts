import _ from 'lodash';

export default (source: any, params: any) => {
    return _.mergeWith(source, params, (objVal, srcVal) => {
        if (Array.isArray(objVal) && Array.isArray(srcVal)) {
            for (let item of srcVal) {
                objVal[item.outlet] = item;
            }
            return objVal;
        }
    });
};
