#!/usr/bin/env node

/**
 * Created by Shohei Yokoyama on 2022/05/14.
 */

const crypto = require('crypto');
const prompts = require('prompts');
(async () => {
    const questionK = {
        type: 'text', // インプットタイプ
        name: 'myValue', // 変数名
        message: 'Flickr API Keyを入力してください',
    };
    const responseK = await prompts(questionK);

    const questions = {
        type: 'text', // インプットタイプ
        name: 'myValue', // 変数名
        message: '新しいパスワードを入力してください',
    };
    const response = await prompts(questions);

    const password = response.myValue;
    const apikey_origin = responseK.myValue;
    const algorithm = 'aes-128-ecb'; //ecbモードは前のブロックを使わない単純な暗号利用モードらしい。なのでivが不要
    const password_md5 = crypto.createHash('md5').update(password, 'utf8').digest();
    const cipher = crypto.createCipheriv(algorithm, password_md5, null); // aes-128-ecbの場合、iv指定が不要（使わないから）
    const apikey_encrypted = cipher.update(apikey_origin, 'utf8', 'hex') + cipher.final('hex');
    console.log("新しい暗号化されたAPIKEYです。execute.jsに埋め込んでご利用ください。");
    console.log(apikey_encrypted);
})();
