import LanControlAuthenticationUtils from '../utils/lanControlAuthenticationUtils';
function test() {
    let iv = 'NDExODI1MDIzNTA5NzYzNw';
    iv = LanControlAuthenticationUtils.decryptionBase64(iv);

    const key = '232a7913-9182-4c2c-ba5d-3cc394cdc57c';
    const data =
        'XYkJvP6mF+U/nO55RFhlKfJlsSYzYbuFFSqEITqvDgah9LiZgm4qViUesgVE8SSAtch/5r4UWtEI8X4lQxoDELB47c98j8Blt/bsnFUA9UWRh6+04qCBzKS1CAjhoGPdpUCzlM2zd4P3t837QVf/9PeSwob7UHt1dzKqbAITzkMZrMqxuWfzVtWX10tvG8N5oLdHx4KdvLOAI04ys37887vDqyJAnyRTOx+N7z2KIyruTYdwneez/72SY+CYMLvy0ogpPFNU+74sB9ahbA6FtagTh7wLqF4uDnaB1UOjzFZvTay6KeT8y8tsywVHLHRZ';

    console.log('iv ', iv);
    console.log('key ', key);
    // console.log('salt ', salt);
    console.log('data ', data);

    // console.log('----------------------------------------------------------------');

    // let baseCiper = LanControlAuthenticationUtils.encryptionData({iv, salt, key, data});
    // console.log('加密:', baseCiper);

    console.log('----------------------------------------------------------------');
    let decryptedData = LanControlAuthenticationUtils.decryptionData({ data, iv, key });

    console.log('解密:', decryptedData);
}

test();

// let _base64Str = LanControlAuthenticationUtils.encryptionBase64('1234567890123456');
// let tmp = `12345${Date.now()}67890`.slice(0, 16);
// console.log(tmp.length);
// const str = LanControlAuthenticationUtils.encryptionBase64(tmp);
// console.log(str);

// console.log('base64加密', _base64Str);
// console.log('base64解密', LanControlAuthenticationUtils.decryptionBase64('RDuhJiY1n0J6W4tZfL4jVA=='));
