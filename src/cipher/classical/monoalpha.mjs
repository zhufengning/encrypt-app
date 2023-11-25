import { padArrayWithZeros } from '../utils.mjs';
//kaisa
export function caesarEncrypt(str, k) {
    return str.split('').map(char => {
        let code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) { // 大写字母
            return String.fromCharCode(((code - 65 + k) % 26) + 65);
        } else if (code >= 97 && code <= 122) { // 小写字母
            return String.fromCharCode(((code - 97 + k) % 26) + 97);
        }
        return char;
    }).join('');
}

export function caesarDecrypt(str, k) {
    return caesarEncrypt(str, -k);
}

//关键字密码
import { concatenateUint8Arrays } from '../utils.mjs';

export function keywordEncrypt(str, key) {
    const encoded = generateEncodedAlphabet(key.toUpperCase());
    const plaintextAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return str.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
            let upperChar = char.toUpperCase();
            let index = plaintextAlphabet.indexOf(upperChar);
            return encoded[index];
        }
        return char;
    }).join('');
}

export function keywordDecrypt(str, key) {
    const encoded = generateEncodedAlphabet(key.toUpperCase());
    const plaintextAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return str.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
            let upperChar = char.toUpperCase();
            let index = encoded.indexOf(upperChar);
            return plaintextAlphabet[index];
        }
        return char;
    }).join('');
}

export function generateEncodedAlphabet(key) {
    const plaintextAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let arr = new Array(26).fill(0);
    let encoded = "";

    for (let i = 0; i < key.length; i++) {
        if (key[i] >= 'A' && key[i] <= 'Z') {
            if (arr[key.charCodeAt(i) - 65] == 0) {
                encoded += key[i];
                arr[key.charCodeAt(i) - 65] = 1;
            }
        }
    }

    for (let i = 0; i < 26; i++) {
        if (arr[i] == 0) {
            arr[i] = 1;
            encoded += String.fromCharCode(65 + i);
        }
    }

    return encoded;
}


//affine cipher
import { splitUInt8Array } from '../utils.mjs';

export function affineEncrypt(str, a, b) {
    const plaintextAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return str.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
            let upperChar = char.toUpperCase();
            let index = plaintextAlphabet.indexOf(upperChar);
            // 应用 Affine Cipher 加密公式
            return String.fromCharCode(((a * index + b) % 26) + 65);
        }
        return char;
    }).join('');
}

export function affineDecrypt(str, a, b) {
    const plaintextAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let aInverse = findMultiplicativeInverse(a, 26);
    return str.split('').map(char => {
        if (char.match(/[a-zA-Z]/)) {
            let upperChar = char.toUpperCase();
            let index = plaintextAlphabet.indexOf(upperChar);
            // 应用 Affine Cipher 解密公式
            return String.fromCharCode((aInverse * (index - b + 26)) % 26 + 65);
        }
        return char;
    }).join('');
}

export function findMultiplicativeInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) return i;
    }
    return 1; // 如果没有找到，则返回默认值1
}
