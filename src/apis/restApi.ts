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

const registerService = async (domain: string, service: string) => {
    return restRequest({
        method: 'POST',
        url: `/api/services/${domain}/${service}`,
        data: {
            entity_id: 'switch.Ceiling',
        },
    }).catch((e) => {
        console.log('注册服务', domain, ':', service, '出错');
        console.log('Jia ~ file: restApi.ts ~ line 55 ~ registerService ~ e', e);
    });
    // return restRequest({
    //     method: 'POST',
    //     url: `/api/events/service_registered`,
    //     data: {
    //         domain,
    //         service,
    //     },
    // }).catch((e) => {
    //     console.log('注册服务', domain, ':', service, '出错');
    // });
};

export { getStateByEntityId, updateStates, removeStates, registerService };
