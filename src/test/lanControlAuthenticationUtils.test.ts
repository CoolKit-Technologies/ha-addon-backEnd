import LanControlAuthenticationUtils from '../utils/lanControlAuthenticationUtils';
function test() {
    let iv = 'OTU0MTc4NTg3MjQzMjU4Mw';
    iv = LanControlAuthenticationUtils.decryptionBase64(iv);

    const key = '8a031b29-8ee1-4bd4-b5ce-143738445bfd';
    const data =
        'p1wW+Dj1ZvRR8VAEXje6z4Ba18gSyzt3bid6TyHGaMuvmhB9s5Zb+qV82PFnA5g/f1lg+2IXxiDORnwA9/XujxdMFlIJ785occlOe6ZV/COIRjBAtTQ/4aaeu3C3DBIJlPGEyV305/b/LuqLLW+OQdbUodnV4AGdjy5ArT8Mc18nSuUdSphdyPDFVFDHDhFwRcYbU+VkaDr8qSLIjKrEFegGxjfyPDciSwmHJDrfgH7lMuJK4qNHviSOijm3lZWf2kjE35ospFqH4oMCSrF1H4g6SuT03PEIMCfXtTDa2xjgY9qYlTdmJl3Ou3y4pPu/jupi8kzKUSkTyy/Tw1GOvjKY8Q5A9EAa4fnSlZQhs/Fww88JCPvtew9GxobZsmFhrFHqWPNtzv19Vh4FziIQoqNTVy+SDm8jzyRP/E2307jVe/9VZzLotLgshkhn4ctenoP51/rk5UQbM7p+XCyhFuwQMF1RIPuizK8tpnpoPMVQDH6ZqSMJMK8POUb+y9yRXkRei52XEfJpMsJy8q4yd1QvmPkJvXtK53xIQjQNF+TMQNZ5hOKDDu++aiP8QXaR7DQQwBhW99n+eH7Pc4UgFw';

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
