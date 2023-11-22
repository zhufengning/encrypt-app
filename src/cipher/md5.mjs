import { unit32Arr2Buffer, buffer2Uint32Arr } from "./utils.mjs";

function md5Calculate(arrayBuffer) {
    
    function rotateLeft(x, n) {
        return (x << n) | (x >>> (32 - n));
    }

    function FF(a, b, c, d, x, s, ac) {
        a += (b & c | ~b & d) + x + ac;
        a = rotateLeft(a, s);
        return a + b;
    }

    function GG(a, b, c, d, x, s, ac) {
        a += (b & d | c & ~d) + x + ac;
        a = rotateLeft(a, s);
        return a + b;
    }

    function HH(a, b, c, d, x, s, ac) {
        a += (b ^ c ^ d) + x + ac;
        a = rotateLeft(a, s);
        return a + b;
    }

    function II(a, b, c, d, x, s, ac) {
        a += (c ^ (b | ~d)) + x + ac;
        a = rotateLeft(a, s);
        return a + b;
    }



    // MD5 的填充函数
    function padding(buf) {
        const len = buf.byteLength * 8;
        const paddingLen = (448 - (len + 1) % 512 + 512) % 512;
        const totalLen = len + 1 + paddingLen + 64;
        const paddedLen = Math.ceil(totalLen / 8);
        const paddedBuf = new ArrayBuffer(paddedLen);
        const paddedView = new DataView(paddedBuf);

        new Uint8Array(paddedBuf).set(new Uint8Array(buf));

        paddedView.setUint8(len / 8, 0x80);

        // 末尾加长度
        paddedView.setBigUint64(paddedLen - 8, BigInt(len), true);

        return paddedBuf;
    }




    // 初始化MD5向量
    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;

    console.log(arrayBuffer);

    const words = buffer2Uint32Arr(padding(arrayBuffer));
    console.log(words);
    for (let i = 0; i < words.length; i += 16) {
        const aa = a;
        const bb = b;
        const cc = c;
        const dd = d;


        a = FF(a, b, c, d, words[i + 0], 7, 0xd76aa478);
        d = FF(d, a, b, c, words[i + 1], 12, 0xe8c7b756);
        c = FF(c, d, a, b, words[i + 2], 17, 0x242070db);
        b = FF(b, c, d, a, words[i + 3], 22, 0xc1bdceee);
        a = FF(a, b, c, d, words[i + 4], 7, 0xf57c0faf);
        d = FF(d, a, b, c, words[i + 5], 12, 0x4787c62a);
        c = FF(c, d, a, b, words[i + 6], 17, 0xa8304613);
        b = FF(b, c, d, a, words[i + 7], 22, 0xfd469501);
        a = FF(a, b, c, d, words[i + 8], 7, 0x698098d8);
        d = FF(d, a, b, c, words[i + 9], 12, 0x8b44f7af);
        c = FF(c, d, a, b, words[i + 10], 17, 0xffff5bb1);
        b = FF(b, c, d, a, words[i + 11], 22, 0x895cd7be);
        a = FF(a, b, c, d, words[i + 12], 7, 0x6b901122);
        d = FF(d, a, b, c, words[i + 13], 12, 0xfd987193);
        c = FF(c, d, a, b, words[i + 14], 17, 0xa679438e);
        b = FF(b, c, d, a, words[i + 15], 22, 0x49b40821);


        a = GG(a, b, c, d, words[i + 1], 5, 0xf61e2562);
        d = GG(d, a, b, c, words[i + 6], 9, 0xc040b340);
        c = GG(c, d, a, b, words[i + 11], 14, 0x265e5a51);
        b = GG(b, c, d, a, words[i + 0], 20, 0xe9b6c7aa);
        a = GG(a, b, c, d, words[i + 5], 5, 0xd62f105d);
        d = GG(d, a, b, c, words[i + 10], 9, 0x02441453);
        c = GG(c, d, a, b, words[i + 15], 14, 0xd8a1e681);
        b = GG(b, c, d, a, words[i + 4], 20, 0xe7d3fbc8);
        a = GG(a, b, c, d, words[i + 9], 5, 0x21e1cde6);
        d = GG(d, a, b, c, words[i + 14], 9, 0xc33707d6);
        c = GG(c, d, a, b, words[i + 3], 14, 0xf4d50d87);
        b = GG(b, c, d, a, words[i + 8], 20, 0x455a14ed);
        a = GG(a, b, c, d, words[i + 13], 5, 0xa9e3e905);
        d = GG(d, a, b, c, words[i + 2], 9, 0xfcefa3f8);
        c = GG(c, d, a, b, words[i + 7], 14, 0x676f02d9);
        b = GG(b, c, d, a, words[i + 12], 20, 0x8d2a4c8a);


        a = HH(a, b, c, d, words[i + 5], 4, 0xfffa3942);
        d = HH(d, a, b, c, words[i + 8], 11, 0x8771f681);
        c = HH(c, d, a, b, words[i + 11], 16, 0x6d9d6122);
        b = HH(b, c, d, a, words[i + 14], 23, 0xfde5380c);
        a = HH(a, b, c, d, words[i + 1], 4, 0xa4beea44);
        d = HH(d, a, b, c, words[i + 4], 11, 0x4bdecfa9);
        c = HH(c, d, a, b, words[i + 7], 16, 0xf6bb4b60);
        b = HH(b, c, d, a, words[i + 10], 23, 0xbebfbc70);
        a = HH(a, b, c, d, words[i + 13], 4, 0x289b7ec6);
        d = HH(d, a, b, c, words[i + 0], 11, 0xeaa127fa);
        c = HH(c, d, a, b, words[i + 3], 16, 0xd4ef3085);
        b = HH(b, c, d, a, words[i + 6], 23, 0x04881d05);
        a = HH(a, b, c, d, words[i + 9], 4, 0xd9d4d039);
        d = HH(d, a, b, c, words[i + 12], 11, 0xe6db99e5);
        c = HH(c, d, a, b, words[i + 15], 16, 0x1fa27cf8);
        b = HH(b, c, d, a, words[i + 2], 23, 0xc4ac5665);


        a = II(a, b, c, d, words[i + 0], 6, 0xf4292244);
        d = II(d, a, b, c, words[i + 7], 10, 0x432aff97);
        c = II(c, d, a, b, words[i + 14], 15, 0xab9423a7);
        b = II(b, c, d, a, words[i + 5], 21, 0xfc93a039);
        a = II(a, b, c, d, words[i + 12], 6, 0x655b59c3);
        d = II(d, a, b, c, words[i + 3], 10, 0x8f0ccc92);
        c = II(c, d, a, b, words[i + 10], 15, 0xffeff47d);
        b = II(b, c, d, a, words[i + 1], 21, 0x85845dd1);
        a = II(a, b, c, d, words[i + 8], 6, 0x6fa87e4f);
        d = II(d, a, b, c, words[i + 15], 10, 0xfe2ce6e0);
        c = II(c, d, a, b, words[i + 6], 15, 0xa3014314);
        b = II(b, c, d, a, words[i + 13], 21, 0x4e0811a1);
        a = II(a, b, c, d, words[i + 4], 6, 0xf7537e82);
        d = II(d, a, b, c, words[i + 11], 10, 0xbd3af235);
        c = II(c, d, a, b, words[i + 2], 15, 0x2ad7d2bb);
        b = II(b, c, d, a, words[i + 9], 21, 0xeb86d391);

        a = (a + aa) >>> 0;
        b = (b + bb) >>> 0;
        c = (c + cc) >>> 0;
        d = (d + dd) >>> 0;
    }

    // 将结果变量合并到 Uint32Array 中
    const resultWords = new Uint32Array([a, b, c, d]);

    return unit32Arr2Buffer(resultWords);
}

// const inputArrayBuffer = new TextEncoder().encode('Hello').buffer;
// const md5ArrayBuffer = md5Calculate(inputArrayBuffer);

// const md5Hex = Array.from(new Uint8Array(md5ArrayBuffer))
//     .map(byte => byte.toString(16).padStart(2, '0'))
//     .join('');
// console.log(`MD5: ${md5Hex}`);
