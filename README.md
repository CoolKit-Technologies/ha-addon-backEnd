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
    | id | string | N | deviceid |
    | disabled | boolean | N | 禁用/启用 |

-   返回值:
    {error:0,msg:"success",data:boolean}

#### 修改设备名称

-   URL: /devices/updateName
-   方法: POST
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | id | string | N | deviceid |
    | newName | string | N | 新名字 |

-   返回值:
    {error:0,data:null}

#### 修改设备子通道名称

-   URL: /devices/updateChannelName
-   方法: POST
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | id | string | N | deviceid |
    | tags | Object | N | {[outlet: string]: string} |

-   返回值:
    {error:0,data:null}

#### 设置设备通电反应/点动状态/网络指示灯/互锁

-   URL: /devices/proxy2ws
-   方法: POST
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | id | string | N | deviceid |
    | apikey | string | N | apikey |
    | params | Object | N |any |

-   返回值:
    {error:0,data:null}

#### 获取设备更新信息

-   URL: /devices/getOTAinfo
-   方法: POST
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | list | Array<{ deviceid: string; model: string; version: string; }> | N |deviceid:设备 ID,model:设备的模块型号,version:当前设备的固件版本号 |

-   返回值:
    {error:0,data:null}

#### 修改 DIY 设备状态/通电反应/点动状态

-   URL: /devices/diy
-   方法: POST
-   业务请求参数:
    | 名称 | 类型 | 允许空 | 说明 |
    | ------- | ------ | :----: | --- |
    | id | string | N | deviceid |
    | type | string | N | 'switch' or 'startup' or 'pulse' or 'sledOnline' |
    | params | Object | N | { state: string; width?: number} |
-   返回值:
    {error:0,data:null}

#### Todo

-   寻找注册相关服务的集成（重要紧急）
-   Web UI 优化（重要紧急）
-   支持更多设备配置项（重要不紧急）
-   支持更多设备（重要不紧急）
-   映射为设备而非实体（重要不紧急）
-   自动生成长期访问令牌（重要不紧急）
-   安装速度优化（紧急不重要）
