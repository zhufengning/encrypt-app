export function rc4Encrypt(data, key) {
    // 将ArrayBuffer转换为Uint8Array以便处理
    const dataArray = new Uint8Array(data);
    const keyArray = new Uint8Array(key);

    // 初始化S盒
    let s = [];
    for (let i = 0; i < 256; i++) {
        s[i] = i;
    }

    let j = 0;
    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + keyArray[i % keyArray.length]) % 256;
        // 交换s[i]和s[j]
        const temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }

    let i = 0;
    j = 0;
    const result = new Uint8Array(dataArray.length);
    for (let k = 0; k < dataArray.length; k++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        // 交换s[i]和s[j]
        const temp = s[i];
        s[i] = s[j];
        s[j] = temp;
        // 生成密钥流
        const keyStream = s[(s[i] + s[j]) % 256];
        // 对数据进行异或操作
        result[k] = dataArray[k] ^ keyStream;
    }

    // 将Uint8Array转换为ArrayBuffer并返回
    return result.buffer;
}

export function rc4Decrypt(data, key) {
    // 加密和解密使用相同的算法
    return rc4Encrypt(data, key);
}


// const plaintext = new TextEncoder().encode("Hello, RC4!");
// const key = new TextEncoder().encode("SecretKey");
// const encryptedData = rc4Encrypt(plaintext, key);
// const decryptedData = rc4Decrypt(encryptedData, key);

// console.log("Plaintext:", new TextDecoder().decode(plaintext));
// const rc4Hex = Array.from(new Uint8Array(encryptedData))
//     .map(byte => byte.toString(16).padStart(2, '0'))
//     .join('');
// console.log(`Encrypted: ${rc4Hex}`);
// console.log("Decrypted:", new TextDecoder().decode(new Uint8Array(decryptedData)));
