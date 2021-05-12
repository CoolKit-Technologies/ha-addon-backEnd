import { debugMode } from './config';

// prod
let appId = '4s1FXKC9FaGfoqXhmXSJneb3qcm1gOak';
let appSecret = 'oKvCM06gvwkRbfetd6qWRrbC3rFrbIpV';

if (debugMode) {
    appId = 'KOBxGJna5qkk3JLXw3LHLX3wSNiPjAVi';
    appSecret = '4v0sv6X5IM2ASIBiNDj6kGmSfxo40w7n';
}

export { appId, appSecret };
