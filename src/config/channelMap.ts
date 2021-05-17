const channelMap = new Map<number, number>([
    [2, 2], // 双通道插座
    [3, 3], // 三通道插座
    [4, 4], // 四通道插座
    [7, 2], // 双通道开关
    [8, 3], // 三通道开关
    [77, 1], // 三通道开关
    [112, 1], // 单通道开关微波雷达版
    [113, 2], // 双通道开关微波雷达版
    [114, 3], // 三通道开关微波雷达版
    [126, 2], // DualR3
]);

const getMaxChannelByUiid = (uiid: number) => {
    return channelMap.get(uiid)!;
};

export { getMaxChannelByUiid };
