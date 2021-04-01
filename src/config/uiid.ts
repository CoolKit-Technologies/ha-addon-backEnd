const switchUiidSet = new Set<number>([
    1, // 单通道插座
    6, // 单通道开关
    14, // 开关改装模块
]);

const multiChannelSwitchUiidSet = new Set<number>([
    2, // 双通道插座
    3, // 三通道插座
    4, // 四通道插座
    7, // 双通道开关
    8, // 三通道开关
]);

export { switchUiidSet, multiChannelSwitchUiidSet };
