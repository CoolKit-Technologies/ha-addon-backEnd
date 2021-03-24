import HaSocket from '../class/HASocketClass';
// HaSocket.getConfig()
(async () => {
    const status = await HaSocket.init();
    if (status === 0) {
        console.log('success');
    }
})();
