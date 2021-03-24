export default async (millisecond: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(0);
        }, millisecond);
    });
};
