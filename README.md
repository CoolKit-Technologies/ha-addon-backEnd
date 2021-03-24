### 数据接口

```
interface ICloudDeviceParams {
    bindInfos: any;
    version: number;
    sledOnline: string;
    ssid: string;
    bssid: string;
    switch: string;
    fwVersion: string;
    rssi: number;
    staMac: string;
    startup: string;
    init: number;
    pulse: string;
    pulseWidth: number;
}

interface ICloudDevice<P = ICloudDeviceParams> {
    name: string;
    deviceid: string;
    apikey: string;
    extra: {
        model: string;
        ui: string;
        uiid: number;
        description: string;
        manufacturer: string;
        mac: string;
        apmac: string;
        modelInfo: string;
        brandId: string;
        staMac: string;
        chipid: string;
    };
    brandName: string;
    brandLogo: string;
    showBrand: false;
    productModel: string;
    devConfig: Object;
    settings: {
        opsNotify: 0;
        opsHistory: 1;
        alarmNotify: 1;
        wxAlarmNotify: 0;
        wxOpsNotify: 0;
        wxDoorbellNotify: 0;
        appDoorbellNotify: 1;
    };
    family: {
        familyid: string;
        index: number;
    };
    shareTo: string[];
    devicekey: string;
    online: true;
    params: P;
    denyFeatures: string[];
}
```

### 错误码描述

| 值  |          说明          |
| :-: | :--------------------: |
|  0  |          成功          |
| 404 | 请求地址错误，路由错误 |
| 401 |   传递参数错误或为空   |
| 402 |      查询不到设备      |
| 500 |       服务器错误       |

### 接口

#### 登录

-   URL: /login
-   方法: POST
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | countryCode | string | N | 国家码 |
    | phoneNumber | string | Y | 手机号 |
    | email | string | Y | 邮箱 |
    | password | string | N | 密码 |
    | lang | string | N | 语言 |

-   返回值:
    {error:0,msg:"success",data: v2 接口返回值}

#### 获取设备列表

-   URL: /devices
-   方法: GET
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | type | number | N | 1:diy;2:lan;4:cloud |

-   返回值:
    {error:0,msg:"success",data:any}

#### 刷新设备列表

-   URL: /devices/refresh
-   方法: GET
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | type | number | N | 1:diy;2:lan;4:cloud |

-   返回值:
    {error:0,msg:"success",data:any}

#### 禁用/启用设备

-   URL: /devices/status
-   方法: POST
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | id | boolean | N | deviceid |
    | disabled | boolean | N | 禁用/启用 |

-   返回值:
    {error:0,msg:"success",data:boolean}
