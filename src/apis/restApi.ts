import axios from 'axios';

const restRequest = axios.create({
    // baseURL: 'http://supervisor/core/api',
    baseURL: 'http://homeassistant:8123',
    headers: {
        Authorization:
            'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIxZmZkNmVlNmQ2ZWI0YjE4ODIzZDk5MTM4NTM3OGY4ZCIsImlhdCI6MTYxNTE4OTY1NCwiZXhwIjoxOTMwNTQ5NjU0fQ.f24cfdrwefx2_g1wbq1azzH9EbEA9NR2_huRkCkw8Uw',
    },
});

const getStates = async () => {
    return restRequest({
        method: 'GET',
        url: '/api/states',
    });
};

const updateStates = async (entityId: string, data: any) => {
    return restRequest({
        method: 'POST',
        url: `/api/states/${entityId}`,
        data,
    });
};

const removeStates = async (entityId: string) => {
    return restRequest({
        method: 'DELETE',
        url: `/api/states/${entityId}`,
    });
};

export { getStates, updateStates, removeStates };
