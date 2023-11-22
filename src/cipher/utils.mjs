import BN from "bn.js";

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
  if (p.isEven()) {
    if (p.eq(two)) {
      return true;
    } else {
      return false;
    }
  }
  if (p.eq(one)) {
    return false;
  }

  let d = p.sub(one);
  let r = one.clone();
  while (d.mod(two) == 0) {
    d.idiv(two);
    r.add(one);
  }
  let flag = true;
  let ri = p.sub(two);
  for (let i = 0; i < n; i++) {
    let a;
    do {
      a = getRandomBN(ri.byteLength())
    }
    while (!(a.gte(two) && a.lte(ri)));
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
  // TODO
}