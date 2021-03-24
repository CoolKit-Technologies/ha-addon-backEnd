// @ts-ignore
import multicastDns from 'multicast-dns';
const mdns = new multicastDns();

mdns.on('response', function (response: any) {
    const { answers } = response;
    if (Array.isArray(answers)) {
        answers.map((item) => {
            const tmp = item.data.toString();
            if (item.type === 'TXT') {
                const arr = tmp.split(/(?<!\{.*),(?!\}.*)/);
                console.log('Jia ~ file: index.ts ~ line 13 ~ answers.map ~ arr', arr);
                const data: { [key: string]: any } = {};
                arr.map((str: string) => {
                    const [key, value] = str.split('=');
                    data[key] = value;
                });
                console.log(item.type, '\t', JSON.stringify(data, null, 2));
            } else if (item.type === 'SRV') {
                console.log(item.type, '\t', JSON.stringify(item.data, null, 2));
            } else {
                console.log(item.type, '\t', item.data.toString());
            }
        });
    }
});

// mdns.on('query', function (query: any) {
//     console.log('got a query packet:', query.questions[0]);
// });

// // lets query for an A record for 'brunhilde.local'
mdns.query(
    {
        questions: [
            {
                name: '_ewelink._tcp.local',
                type: 'PTR',
            },
        ],
    },
    () => {
        console.log(123);
    }
);

// mdns.respond(
//     {
//         answers: [
//             {
//                 name: 'brunhilde.local',
//                 type: 'PTR',
//                 ttl: 1,
//                 data: '123',
//             },
//         ],
//     },
//     () => {
//         console.log('456');
//     }
// );
