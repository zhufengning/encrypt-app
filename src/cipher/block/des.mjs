const PC1_Table = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
];

const PC2_Table = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
];

const shifts = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const IP_Table = [
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7
];

const IPR_Table = [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28, 35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41, 9, 49, 17, 57, 25
];

const E_Table = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1
];

const P_Table = [
    16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25
];


const S_Box = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ],
];

function leftRotation(array, num) {
    const length = array.length;
    num = num % length; // 防止旋转次数大于数组长度

    const rotatedArray = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        rotatedArray[i] = array[(i + num) % length];
    }

    return rotatedArray;
}

function keyInit(key) {

    // 将16字节的密钥转换为比特数组
    const keyBytes = new Uint8Array(key);
    const keyBits = new Uint8Array(64);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            keyBits[i * 8 + j] = (keyBytes[i] >> (7 - j)) & 1;
        }
    }

    // 初始置换 PC-1
    const keyPC1 = new Uint8Array(56);
    for (let i = 0; i < 56; i++) {
        keyPC1[i] = keyBits[PC1_Table[i] - 1];
    }



    // 分为左右两部分
    let left = keyPC1.slice(0, 28);
    let right = keyPC1.slice(28);

    // 生成16轮子密钥
    const roundKeys = [];
    for (let round = 0; round < 16; round++) {
        // 循环左移
        left=leftRotation(left,shifts[round]);
        right=leftRotation(right,shifts[round]);

        // 合并左右部分
        const combined = new Uint8Array(56);
        combined.set(left, 0);
        combined.set(right, 28);

        // 子密钥置换 PC-2
        const roundKey = new Uint8Array(48);
        for (let i = 0; i < 48; i++) {
            roundKey[i] = combined[PC2_Table[i] - 1];
        }
        // 存储子密钥
        roundKeys.push(roundKey);
    }


    return roundKeys;
}





// 初始置换 IP
function IP(inputData) {
    const block = new Uint8Array(64);
    for (let i = 0; i < IP_Table.length; i++) {
        block[i] = (inputData[(IP_Table[i] - 1) >> 3] >> (7 - (IP_Table[i] - 1) % 8)) & 1;//提取有效位
    }
    return block;
}

// 逆初始置换 IPR
function IPR(block) {
    const outputData = new Uint8Array(8);
    for (let i = 0; i < IPR_Table.length; i++) {
        outputData[i >> 3] |= block[IPR_Table[i] - 1] << (7 - (i % 8));
    }
    return outputData;
}

// Feistel网络运算
function S(block, roundKey) {
    const left = block.slice(0, 32);
    const right = block.slice(32);

    const expandedRight = new Uint8Array(48);
    for (let i = 0; i < E_Table.length; i++) {
        expandedRight[i] = right[E_Table[i] - 1];
    }

    // 与轮密钥异或
    for (let i = 0; i < 48; i++) {
        expandedRight[i] ^= roundKey[i];
    }

    // S盒替代
    const substituted = new Uint8Array(32);
    for (let i = 0; i < 8; i++) {
        const row = (expandedRight[i * 6] << 1) | expandedRight[i * 6 + 5];
        const col = (expandedRight[i * 6 + 1] << 3) | (expandedRight[i * 6 + 2] << 2) | (expandedRight[i * 6 + 3] << 1) | expandedRight[i * 6 + 4];
        const value = S_Box[i][row][col];
        for (let j = 0; j < 4; j++) {
            substituted[i * 4 + j] = (value >> (3 - j)) & 1;
        }
    }
    // 置换运算 P
    const permuted = new Uint8Array(32);
    for (let i = 0; i < P_Table.length; i++) {
        permuted[i] = substituted[P_Table[i] - 1];
    }

    // 左右部分进行异或
    const newRight = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        newRight[i] = left[i] ^ permuted[i];
    }

    // 返回新的左右部分
    const result = new Uint8Array(64);
    result.set(right, 0);
    result.set(newRight, 32);

    return result;
}


export function desEncrypt(data, key) {
    // 将输入数据和密钥转换为Uint8Array
    const inputData = new Uint8Array(data);
    const inputKey = new Uint8Array(key);

    // 初始置换 IP
    let block = IP(inputData);

    // 将密钥扩展为16轮子密钥
    const roundKeys = keyInit(inputKey);
    //console.log(roundKeys);

    // 进行16轮Feistel网络运算
    for (let round = 0; round < 16; round++) {
        block = S(block, roundKeys[round]);
    }
    //最后一轮不用换位
    const left = block.slice(0, 32);
    const right = block.slice(32);
    block = new Uint8Array(64);
    block.set(right, 0);
    block.set(left, 32);
    // 逆初始置换 IPR
    block = IPR(block);
    
    // 返回加密结果
    return block.buffer;
}

export function desDecrypt(data, key) {
    const inputData = new Uint8Array(data);
    const inputKey = new Uint8Array(key);

    let block = IP(inputData);

    const roundKeys = keyInit(inputKey);

    for (let round = 0; round < 16; round++) {
        block = S(block, roundKeys[15 - round]);
    }
    const left = block.slice(0, 32);
    const right = block.slice(32);
    block = new Uint8Array(64);
    block.set(right, 0);
    block.set(left, 32);
    block = IPR(block);

    // 返回加密结果
    return block.buffer;
}

// 例子
const inputData = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);
const key = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF]);

const encryptedData = desEncrypt(inputData.buffer, key.buffer);
const decryptedData = desDecrypt(encryptedData, key.buffer);

const dataHex = Array.from(new Uint8Array(inputData))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
const enHex = Array.from(new Uint8Array(encryptedData))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
const deHex = Array.from(new Uint8Array(decryptedData))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
console.log(dataHex);
console.log(enHex);
console.log(deHex);