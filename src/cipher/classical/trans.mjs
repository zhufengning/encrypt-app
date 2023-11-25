//columnar-transposition-cipher
export function columnarTransEncrypt(message, key) {
    message = message.replace(/ /g, '');
    let cipher = "";

    // 计算矩阵的列数
    const col = key.length;

    // 计算矩阵的最大行数
    const row = Math.ceil(message.length / col);

    // 添加填充字符'_'来填满矩阵的空白单元格
    const fill_null = row * col - message.length;
    message += '_'.repeat(fill_null);

    // 创建矩阵并按行插入信息和填充字符
    let matrix = [];
    for (let i = 0; i < message.length; i += col) {
        matrix.push(message.slice(i, i + col).split(''));
    }

    // 按照密钥的顺序读取矩阵的列
    const sortedKey = key.split('').sort();
    for (let i = 0; i < col; i++) {
        let currIndex = key.indexOf(sortedKey[i]);
        matrix.forEach(row => {
            cipher += row[currIndex];
        });
    }

    return cipher;
}

export function columnarTransDecrypt(cipher, key) {
    let message = "";

    const col = key.length;
    const row = Math.ceil(cipher.length / col);

    let sortedKey = key.split('').sort();

    // 创建一个空矩阵来存储解密的信息
    let decCipher = new Array(row).fill(null).map(() => new Array(col).fill(null));
    
    let kIndex = 0;
    let cIndex = 0;
    for (let i = 0; i < col; i++) {
        let currIndex = key.indexOf(sortedKey[kIndex]);
        for (let j = 0; j < row; j++) {
            decCipher[j][currIndex] = cipher[cIndex++];
        }
        kIndex++;
    }

    // 将解密信息矩阵转换为字符串
    try {
        message = decCipher.flat().join('');
    } catch (err) {
        throw new Error("Error handling repeating words.");
    }

    return message.replace(/_+$/, ''); // 移除末尾的填充字符
}

//Double-Transposition-cipher
function getColumnOrder(key) {
    const sortedKey = key.split('').sort().join('');
    let columnOrder = new Array(key.length);
    let p = 0, pch = '';

    for (let i = 0; i < sortedKey.length; i++) {
        if (pch !== sortedKey[i]) p = 0;
        pch = sortedKey[i];
        p = key.indexOf(pch, p);
        columnOrder[i] = p;
        p++;
    }

    return columnOrder;
}

function transpose(src, key) {
    const columnOrder = getColumnOrder(key);
    const columns = Array(key.length).fill('');
    for (let i = 0; i < src.length; i++) {
        columns[i % key.length] += src[i];
    }

    let dst = '';
    for (let i = 0; i < key.length; i++) {
        dst += columns[columnOrder[i]];
    }

    return dst;
}

function reverseTranspose(src, key) {
    const columnOrder = getColumnOrder(key);
    let p = 0;
    const columns = Array(key.length).fill('');
    for (let i = 0; i < key.length; i++) {
        let k = columnOrder[i];
        let l = Math.floor(src.length / key.length);
        if (k < src.length % key.length) l++;
        columns[k] = src.slice(p, p + l);
        p += l;
    }

    let dst = '';
    for (let i = 0; i < src.length; i++) {
        let k = i % key.length;
        dst += columns[k][Math.floor(i / key.length)];
    }

    return dst;
}

export function doubleTranspositionEncrypt(plaintext, key1, key2) {
    // 使用第一个密钥加密
    let intermediate = transpose(plaintext, key1);
    // 使用第二个密钥再次加密
    return transpose(intermediate, key2);
}

export function doubleTranspositionDecrypt(ciphertext, key1, key2) {
    // 使用第二个密钥解密
    let intermediate = reverseTranspose(ciphertext, key2);
    // 使用第一个密钥再次解密
    return reverseTranspose(intermediate, key1);
}
