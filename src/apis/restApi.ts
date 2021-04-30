import axios from 'axios';
import AuthClass from '../class/AuthClass';
import { HaToken } from '../config/auth';
import { HaRestURL } from '../config/url';

const restRequest = axios.create({
    baseURL: HaRestURL,
});

restRequest.interceptors.request.use((val) => {
    val.headers = {
        Authorization: `Bearer ${HaToken}`,
    };
    return val;
});

const restRequestWithoutAuth = axios.create({
    baseURL: HaRestURL,
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
        console.log('Jia ~ file: restApi.ts ~ line 10 ~ AuthClass.curAuth', AuthClass.curAuth);
        console.log('Jia ~ file: restApi.ts ~ line 50 ~ updateStates ~ e', e);
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

const registerService = async (domain: string, service: string) => {
    return restRequest({
        method: 'POST',
        url: `/api/events/service_registered`,
        data: {
            domain,
            service,
        },
    }).catch((e) => {
        console.log('注册服务', domain, ':', service, '出错');
    });
};

const getAuth = async (clientId: string, code: string) => {
    const res = restRequestWithoutAuth({
        method: 'POST',
        url: '/auth/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: `grant_type=authorization_code&client_id=${clientId}&code=${code}`,
    });
    res.catch((e) => {
        console.log('获取Auth出错:', clientId, '\ncode:' + code + '\n', e);
    });
    return await res;
};

const refreshAuth = async (clientId: string, refreshToken: string) => {
    const res = restRequestWithoutAuth({
        method: 'POST',
        url: '/auth/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: `grant_type=refresh_token&client_id=${clientId}&refresh_token=${refreshToken}`,
    });
    res.catch((e) => {
        console.log('刷新Auth出错:', clientId, '\n', e);
    });
    return await res;
};

export { getStateByEntityId, updateStates, removeStates, registerService, getAuth, refreshAuth };
