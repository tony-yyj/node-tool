import * as ed from '@noble/ed25519';
import crypto from 'crypto';
import { decodeBase58, ethers } from "ethers";
import axios from "axios";
import { log } from 'console';

const apiUrl = 'https://qa-api-evm.orderly.org';

// global.crypto = crypto;

// const apiUrl = 'https://testnet-api-evm.orderly.org';
const sendRequest = async (apiUrl, accountId, privateKey, data) => {
    const method = 'POST';


    const path = `${apiUrl}/v1/order`;

    const headers = {
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
    };

    const authHeader = await handleSignature(path, method, method === 'delete' ? null : data, accountId, privateKey);
    Object.assign(headers, authHeader);
    console.log(headers);
    return axios.post(path, data, {
        headers,
    });

};


const handleSignature = async (url, method, params, accountId, privateKey) => {
    const urlParam = url.split(apiUrl)[1];
    const timestamp = new Date().getTime().toString();
    const message = [timestamp, method.toUpperCase(), urlParam, params ? JSON.stringify(params) : ''].join('');

    const signObj = await signatureByOrderlyKey(message, privateKey);

    return {
        'orderly-account-id': accountId,
        'orderly-key': signObj.publicKey,
        'orderly-timestamp': timestamp,
        'orderly-signature': signObj.signature
    };


};
const base64url = function (aStr) {
    return aStr.replace(/\+/g, '-').replace(/\//g, '_');
};

export async function signatureByOrderlyKey(message, privateKey) {
    const secretKey = decodeBase58(privateKey).toString(16);
    const u8 = Buffer.from(message);

    const signature = await ed.signAsync(u8, secretKey);

    const signHex = Buffer.from(signature).toString('base64');

    const b64 = base64url(signHex);
    const pubKey = await ed.getPublicKeyAsync(secretKey);
    const publicKey = `ed25519:${ethers.encodeBase58(pubKey)}`;
    return {
        signature: b64,
        publicKey
    };
}

async function init() {
    const auth = {
        // accountId: '0x803dd86bd281412031397f5b31fe70f2020f7c14cbe3a34dcf9f0ebbc6ff29e0',
        // privateKey: '8HGsNrviQB3g7q64h2uiC66XbHS47m8Bw2VuGmeZyky1'

        // accountId: '0x71f47c316a4fb4fb90dd368740bfb8db84f4ad22d909123bb3bbf1587f026da8',
        // privateKey: '3QqmLhuYVgsoRGDbQRDTQ3Zrn2aPQkFetzXn7yNUevv1'

        // wendy account config
        accountId: '0xd2590575a84c03e794e055dd70a3e8d5e0933342b1dbeb05c3d310f78a91fde7',
        privateKey: '7o5HPSj78tnbRNxtRorTn5Vued8EzTKraUQZJYJeWYJr',

        // accountId: '0xe966193fb6cc2cdb266d7f6f7cf5027f8ea28992c03f8d1aadd8f92f13f6b918',
        // privateKey: 'BHFBjyBu4fnc7vHaoWMwdfHcQmeTMv18jCjNjuoj8hsV',
    };

    // limit order
    const data = {
        "symbol": "PERP_ETH_USDC",
        "order_type": "LIMIT",
        "side": "BUY",
        "reduce_only": false,
        "order_quantity": "0.01",
        "visible_quantity": 0,
        "order_price": "3100",
        "order_tag": 'tony',
    };

    // stop order
    const stopOrder = { 
        "symbol": "PERP_ETH_USDC", "side": "BUY", "reduce_only": false, "visible_quantity": 0, "trigger_price": "3100.0", "algo_type": "STOP", "type": "LIMIT", "quantity": "0.4223", "price": "3050", "trigger_price_type": "MARK_PRICE", "order_price": "3050.0",
        order_tag: 'tony',
     };

    const apiUrl = 'https://qa-api-evm.orderly.org';

    try {
        // const res = await sendRequest(apiUrl, auth.accountId, auth.privateKey, data);
        const res = await sendRequest(apiUrl, auth.accountId, auth.privateKey, stopOrder);
        console.log('res', res.data);
    } catch (e) {
        console.log('error', e.message);
    }
}

init().then();
