import axios from 'axios';
import { HaToken } from '../config/auth';
import { HaRestURL } from '../config/url';

const restRequest = axios.create({
    baseURL: HaRestURL,
    headers: {
        Authorization: `Bearer ${HaToken}`,
    },
});

const getStateByEntityId = async (entityId: string) => {
    return restRequest({
        method: 'GET',
        url: `/api/states/${entityId}`,
    }).catch((e) => {
        console.log('获取HA实体出错：', entityId);
    });
};

const updateStates = async (entityId: string, data: any) => {
    return restRequest({
        method: 'POST',
        url: `/api/states/${entityId}`,
        data,
    }).catch((e) => {
        console.log('更新设备到HA出错：', entityId, '\ndata: ', data);
    });
};

const removeStates = async (entityId: string) => {
    return restRequest({
        method: 'DELETE',
        url: `/api/states/${entityId}`,
    }).catch((e) => {
        console.log('删除HA实体出错：', entityId);
    });
};

export { getStateByEntityId, updateStates, removeStates };
