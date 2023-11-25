//vigenere
export function vigenereEncrypt(str, key) {
    const plaintextAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    key = generateKey(str, key.toUpperCase());
    str = str.toUpperCase();

    return str.split('').map((char, index) => {
        if (char.match(/[a-zA-Z]/)) {
            let charIndex = plaintextAlphabet.indexOf(char);
            let keyIndex = plaintextAlphabet.indexOf(key[index]);
            // 应用 Vigenère Cipher 加密公式
            return plaintextAlphabet[(charIndex + keyIndex) % 26];
        }
        return char;
    }).join('');
}

export function vigenereDecrypt(str, key) {
    const plaintextAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    key = generateKey(str, key.toUpperCase());
    str = str.toUpperCase();

    return str.split('').map((char, index) => {
        if (char.match(/[a-zA-Z]/)) {
            let charIndex = plaintextAlphabet.indexOf(char);
            let keyIndex = plaintextAlphabet.indexOf(key[index]);
            // 应用 Vigenère Cipher 解密公式
            return plaintextAlphabet[(charIndex - keyIndex + 26) % 26];
        }
        return char;
    }).join('');
}

export function generateKey(str, key) {
    if (str.length === key.length) return key;
    let temp = key.length;
    for (let i = 0; i < (str.length - temp); i++) {
        key += key[i % temp];
    }
    return key;
}

//autokey ciphertext
export function autokeyCiphertextEncrypt(plaintext, key) {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    plaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
    key = key.toUpperCase().replace(/[^A-Z]/g, "");

    let fullKey = key;
    let ciphertext = "";

    for (let i = 0; i < plaintext.length; i++) {
        let row = alpha.indexOf(fullKey.charAt(i % fullKey.length));
        let column = alpha.indexOf(plaintext.charAt(i));
        let index = (row + column) % 26;
        ciphertext += alpha.charAt(index);
        fullKey += alpha.charAt(index); // 使用密文的字符作为后续密钥的一部分
    }

    return ciphertext;
}

export function autokeyCiphertextDecrypt(ciphertext, key) {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    ciphertext = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
    key = key.toUpperCase().replace(/[^A-Z]/g, "");

    let fullKey = key;
    let plaintext = "";

    for (let i = 0; i < ciphertext.length; i++) {
        let row = alpha.indexOf(fullKey.charAt(i % fullKey.length));
        let column = alpha.indexOf(ciphertext.charAt(i));
        let index = (column - row + 26) % 26;
        plaintext += alpha.charAt(index);
        fullKey += alpha.charAt(index); // 使用明文的字符作为后续密钥的一部分
    }

    return plaintext;
}


//autokey plaintext
export function autokeyPlaintextEncrypt(plaintext, key) {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    plaintext = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
    key = key.toUpperCase().replace(/[^A-Z]/g, "");

    let fullKey = key + plaintext; // 使用明文的字符作为后续密钥的一部分
    let ciphertext = "";

    for (let i = 0; i < plaintext.length; i++) {
        let row = alpha.indexOf(fullKey.charAt(i));
        let column = alpha.indexOf(plaintext.charAt(i));
        let index = (row + column) % 26;
        ciphertext += alpha.charAt(index);
    }

    return ciphertext;
}

export function autokeyPlaintextDecrypt(ciphertext, key) {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    ciphertext = ciphertext.toUpperCase().replace(/[^A-Z]/g, "");
    key = key.toUpperCase().replace(/[^A-Z]/g, "");

    let plaintext = "";
    let fullKey = key;

    for (let i = 0; i < ciphertext.length; i++) {
        let row = alpha.indexOf(fullKey.charAt(i));
        let column = alpha.indexOf(ciphertext.charAt(i));
        let index = (column - row + 26) % 26;
        plaintext += alpha.charAt(index);
        fullKey += plaintext.charAt(i); // 使用明文的字符作为后续密钥的一部分
    }

    return plaintext;
}
