/* eslint-disable prettier/prettier */
import BN from "bn.js";
import fs from 'fs';

/**
 *
 * @param {string} s
 * @returns {ArrayBuffer}
 */
export function str2ArrayBuffer(s) {
  return new TextEncoder().encode(s).buffer
}

/**
 *
 * @param {ArrayBuffer} s
 * @returns {string}
 */
export function arrayBuffer2Str(s) {
  return new TextDecoder().decode(s)
}

/**
 *
 * @param {string} hexString
 * @returns {Uint8Array}
 */
export function hexString2U8Array(hexString) {
  if (hexString.length % 2 != 0) {
    hexString = "0" + hexString
  }
  return Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
}


/**
 *
 * @param {Uint8Arraystring} bytes
 * @returns {string}
 */
export function U8Array2hexString(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

export function arrayBuffer2HexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}


/**
 *
 * @param {number} len_byte 长度byte
 * @returns {ArrayBuffer}
 */
export function getRandomArrayBuffer(len_byte) {
  // 创建一个指定大小的 ArrayBuffer
  const buffer = new ArrayBuffer(len_byte); // 这里的 10 是 ArrayBuffer 的大小，单位是字节
  // 创建一个与 ArrayBuffer 相关联的 Uint8Array 视图
  const view = new Uint8Array(buffer);
  // 使用循环填充随机数据
  for (let i = 0; i < view.length; i++) {
    view[i] = Math.floor(Math.random() * 256); // 生成 0 到 255 之间的随机整数
  }
  return buffer;
}

/**
 *
 * @param {number} len_byte 长度（单位byte）
 * @returns {BN} BN.js的大数字
 */
export function getRandomBN(len_byte) {
  return new BN(new Uint8Array(getRandomArrayBuffer(len_byte)))
}

/**
 *
 * @param {BN} p
 * @param {number} n
 * @returns {boolean}
 */
export function millerRabin(p, n) {
  let zero = new BN("0");
  let one = new BN("1");
  let two = new BN("2");
  if (p.lte(zero)) {
    return false;
  }
  if (p.eq(one)) {
    return false;
  }
  if (p.eq(new BN("3"))) {
    return true;
  }
  if (p.isEven()) {
    if (p.eq(two)) {
      return true;
    } else {
      return false;
    }
  }

  let d = p.sub(one);
  let r = one.clone();
  while (d.mod(two).eq(zero)) {
    // console.log(d.toString())
    d = d.div(two);
    r.iadd(one);
  }
  // console.log("r:", r.toString(), "d:", d.toString())
  let flag = true;
  let ri = p.sub(two);
  for (let i = 0; i < n; i++) {
    // console.log("Round:", i)
    let a;
    do {
      a = getRandomBN(ri.byteLength())
    }
    while (!(a.gte(two) && a.lte(ri)));
    // console.log(a.toString())
    var red = BN.mont(p);
    var redA = a.toRed(red);
    let redX = redA.redPow(d);
    let redOne = one.toRed(red);
    let redP = p.toRed(red);
    if (redX.eq(redOne) || redX.eq(redP.redSub(redOne))) {
      continue;
    }
    let flag2 = false;
    for (let j = zero.clone(); j < r.sub(one); j.iadd(one)) {
      redX = redX.redMul(redX);
      if (redX.eq(redP.redSub(redOne))) {
        flag2 = true;
        break;
      }
    }
    if (!flag2) {
      flag = false;
      break;
    }
  }
  return flag;
}

/**
 *
 * @param {number} len_byte 长度（单位byte）
 * @returns {BN} BN.js的大数字
 */
export function getRandomPrime(len_byte) {
  let r;
  do {
    r = getRandomBN(len_byte);
    let ra = r.toArray(Uint8Array, "be");
  } while (!millerRabin(r, 10));
  return r;
}


/**
 *
 * @param {Uint8Array} array
 * @param {number} maxLength
 * @returns
 */
export function splitUInt8Array(array, maxLength) {
  let result = [];
  for (let i = 0; i < array.length; i += maxLength) {
    result.push(array.slice(i, i + maxLength));
  }
  return result;
}

export function saveArrayBufferAsFile(arrayBuffer, fileName) {
  // 创建一个新的Blob对象，使用ArrayBuffer数据
  const blob = new Blob([arrayBuffer]);

  // 创建一个链接元素
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // 将链接添加到DOM并触发点击事件来开始下载
  document.body.appendChild(link);
  link.click();

  // 清理DOM并释放Blob URL
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function padIfOdd(str) {
  if (str.length % 2 !== 0) {
    str = "0" + str;
  }
  return str;
}

export function padArrayWithZeros(originalArray, targetLength) {
  // 检查原数组长度是否已经满足目标长度
  if (originalArray.length >= targetLength) {
    return originalArray;
  }

  // 创建一个新的数组，长度为目标长度，预填充为0
  let paddedArray = new Uint8Array(targetLength);

  // 计算需要填充0的数量
  let zerosToFill = targetLength - originalArray.length;

  // 将原数组的内容复制到新数组的指定位置
  paddedArray.set(originalArray, zerosToFill);

  return paddedArray;
}

export function concatenateUint8Arrays(arrays) {
  // 计算所有Uint8Arrays的总长度
  let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

  // 创建一个新的Uint8Array来存储所有数据
  let result = new Uint8Array(totalLength);

  // 将每个数组复制到result中
  let offset = 0;
  arrays.forEach(array => {
    result.set(array, offset);
    offset += array.length;
  });

  return result;
}

/**
 *@param {ArrayBuffer} data 
 * @param {number} blockSize
 * @param {Function} functionName 
 * @param {ArrayBuffer} key
 * @returns {ArrayBuffer}
 */
export function dealBufferBlock(data, blockSize, functionName, key) {
  const dealBlocks = new Uint8Array(data.byteLength);
  for (let i = 0; i < data.byteLength; i += blockSize) {
    const block = data.slice(i, i + blockSize);
    const dealBlock = functionName(block, key);
    dealBlocks.set(new Uint8Array(dealBlock), i);
  }
  //const concatenatedBuffer = new Uint8Array(dealBlocks.reduce((acc, block) => [...acc, ...block], []));
  console.log(data.byteLength,"\n",dealBlocks);
  return dealBlocks.buffer;


}

/**
 *@param {ArrayBuffer} data 
 *@param {number} size 
 * @returns {ArrayBuffer}
 */
export function padding(data, size) {
  const originalView = new Uint8Array(data);

  // 计算需要填充的字节数
  const paddingSize = size - (originalView.length % size);

  // 判断是否需要填充
  if (paddingSize !== size) {
    // 计算填充后的新大小
    const newSize = originalView.length + paddingSize;

    // 创建一个新的 ArrayBuffer 来存储填充后的数据
    const paddedBuffer = new ArrayBuffer(newSize);

    // 创建视图以便写入填充数据
    const paddedView = new Uint8Array(paddedBuffer);

    // 复制原始数据到新的 ArrayBuffer
    paddedView.set(originalView);

    // 使用 0x20 进行填充
    for (let i = originalView.length; i < newSize; i++) {
      paddedView[i] = 0x20;
    }

    return paddedView;
  } else {
    // 如果不需要填充，直接返回原始数据
    return data;
  }
}

// 这个函数将一个十六进制字符串转换为一个ArrayBuffer
export function hexStringToArrayBuffer(hexString) {
  if (hexString.length !== 64) {
    throw new Error('十六进制字符串长度必须为 64，对应 32 字节');
  }
  var buffer = new ArrayBuffer(32);
  var dataView = new DataView(buffer);
  for (var i = 0; i < 32; i++) {
    var byte = parseInt(hexString.substring(i * 2, i * 2 + 2), 16);
    dataView.setUint8(i, byte);
  }
  return buffer;
}

