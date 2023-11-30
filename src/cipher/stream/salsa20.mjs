'use strict'
/**
 * Construct SalSa20 instance with key and nonce
 * Key should be Uint8Array with 32 bytes
 * None should be Uint8Array with 8 bytes
 *
 *
 * @throws {Error}
 * @param {Uint8Array} key
 * @param {Uint8Array} nonce
 */
/**
 * Construct SalSa20 instance with key and nonce
 * Key should be Uint8Array with 32 bytes
 * None should be Uint8Array with 8 bytes
 *
 *
 * @throws {Error}
 * @param {Uint8Array} key
 * @param {Uint8Array} nonce
 */
export class JSSalsa20 {
  constructor(key, nonce) {
    if (!(key instanceof Uint8Array) || key.length !== 32) {
      throw new Error('Key should be 32 byte array!')
    }

    if (!(nonce instanceof Uint8Array) || nonce.length !== 8) {
      throw new Error('Nonce should be 8 byte array!')
    }

    this.rounds = 20
    this.sigma = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]
    this.param = [
      // Constant
      this.sigma[0],
      // Key
      this._get32(key, 0),
      this._get32(key, 4),
      this._get32(key, 8),
      this._get32(key, 12),
      this.sigma[1],
      // Nonce
      this._get32(nonce, 0),
      this._get32(nonce, 4),
      // Counter
      0,
      0,
      // Constant
      this.sigma[2],
      // Key
      this._get32(key, 16),
      this._get32(key, 20),
      this._get32(key, 24),
      this._get32(key, 28),
      // Const
      this.sigma[3]
    ]

    // init block 64 bytes //
    this.block = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]

    // internal byte counter //
    this.byteCounter = 0
  }
  /**
   *  Encrypt or Decrypt data with key and nonce
   *
   * @param {Uint8Array} data
   * @return {Uint8Array}
   * @private
   */
  _update(data) {
    if (!(data instanceof Uint8Array) || data.length === 0) {
      throw new Error('Data should be type of bytes (Uint8Array) and not empty!')
    }

    var output = new Uint8Array(data.length)

    // core function, build block and xor with input data //
    for (var i = 0; i < data.length; i++) {
      if (this.byteCounter === 0 || this.byteCounter === 64) {
        this._salsa()
        this._counterIncrement()
        this.byteCounter = 0
      }

      output[i] = data[i] ^ this.block[this.byteCounter++]
    }

    return output
  }
  /**
   *  Encrypt data with key and nonce
   *
   * @param {Uint8Array} data
   * @return {Uint8Array}
   */
  encrypt(data) {
    return this._update(data)
  }
  /**
   *  Decrypt data with key and nonce
   *
   * @param {Uint8Array} data
   * @return {Uint8Array}
   */
  decrypt(data) {
    return this._update(data)
  }
  _counterIncrement() {
    // Max possible blocks is 2^64
    this.param[8] = (this.param[8] + 1) >>> 0
    if (this.param[8] === 0) {
      this.param[9] = (this.param[9] + 1) >>> 0
    }
  }
  _salsa() {
    var mix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var i = 0
    var b = 0

    // copy param array to mix //
    for (i = 0; i < 16; i++) {
      mix[i] = this.param[i]
    }

    // mix rounds //
    for (i = 0; i < this.rounds; i += 2) {
      mix[4] = (mix[4] ^ this._rotl(mix[0] + mix[12], 7)) >>> 0
      mix[8] = (mix[8] ^ this._rotl(mix[4] + mix[0], 9)) >>> 0
      mix[12] = (mix[12] ^ this._rotl(mix[8] + mix[4], 13)) >>> 0
      mix[0] = (mix[0] ^ this._rotl(mix[12] + mix[8], 18)) >>> 0
      mix[9] = (mix[9] ^ this._rotl(mix[5] + mix[1], 7)) >>> 0
      mix[13] = (mix[13] ^ this._rotl(mix[9] + mix[5], 9)) >>> 0
      mix[1] = (mix[1] ^ this._rotl(mix[13] + mix[9], 13)) >>> 0
      mix[5] = (mix[5] ^ this._rotl(mix[1] + mix[13], 18)) >>> 0
      mix[14] = (mix[14] ^ this._rotl(mix[10] + mix[6], 7)) >>> 0
      mix[2] = (mix[2] ^ this._rotl(mix[14] + mix[10], 9)) >>> 0
      mix[6] = (mix[6] ^ this._rotl(mix[2] + mix[14], 13)) >>> 0
      mix[10] = (mix[10] ^ this._rotl(mix[6] + mix[2], 18)) >>> 0
      mix[3] = (mix[3] ^ this._rotl(mix[15] + mix[11], 7)) >>> 0
      mix[7] = (mix[7] ^ this._rotl(mix[3] + mix[15], 9)) >>> 0
      mix[11] = (mix[11] ^ this._rotl(mix[7] + mix[3], 13)) >>> 0
      mix[15] = (mix[15] ^ this._rotl(mix[11] + mix[7], 18)) >>> 0
      mix[1] = (mix[1] ^ this._rotl(mix[0] + mix[3], 7)) >>> 0
      mix[2] = (mix[2] ^ this._rotl(mix[1] + mix[0], 9)) >>> 0
      mix[3] = (mix[3] ^ this._rotl(mix[2] + mix[1], 13)) >>> 0
      mix[0] = (mix[0] ^ this._rotl(mix[3] + mix[2], 18)) >>> 0
      mix[6] = (mix[6] ^ this._rotl(mix[5] + mix[4], 7)) >>> 0
      mix[7] = (mix[7] ^ this._rotl(mix[6] + mix[5], 9)) >>> 0
      mix[4] = (mix[4] ^ this._rotl(mix[7] + mix[6], 13)) >>> 0
      mix[5] = (mix[5] ^ this._rotl(mix[4] + mix[7], 18)) >>> 0
      mix[11] = (mix[11] ^ this._rotl(mix[10] + mix[9], 7)) >>> 0
      mix[8] = (mix[8] ^ this._rotl(mix[11] + mix[10], 9)) >>> 0
      mix[9] = (mix[9] ^ this._rotl(mix[8] + mix[11], 13)) >>> 0
      mix[10] = (mix[10] ^ this._rotl(mix[9] + mix[8], 18)) >>> 0
      mix[12] = (mix[12] ^ this._rotl(mix[15] + mix[14], 7)) >>> 0
      mix[13] = (mix[13] ^ this._rotl(mix[12] + mix[15], 9)) >>> 0
      mix[14] = (mix[14] ^ this._rotl(mix[13] + mix[12], 13)) >>> 0
      mix[15] = (mix[15] ^ this._rotl(mix[14] + mix[13], 18)) >>> 0
    }

    for (i = 0; i < 16; i++) {
      // add
      mix[i] += this.param[i]

      // store
      this.block[b++] = mix[i] & 0xFF
      this.block[b++] = (mix[i] >>> 8) & 0xFF
      this.block[b++] = (mix[i] >>> 16) & 0xFF
      this.block[b++] = (mix[i] >>> 24) & 0xFF
    }
  }
  /**
   * Little-endian to uint 32 bytes
   *
   * @param {Uint8Array|[number]} data
   * @param {number} index
   * @return {number}
   * @private
   */
  _get32(data, index) {
    return data[index++] ^ (data[index++] << 8) ^ (data[index++] << 16) ^ (data[index] << 24)
  }
  /**
   * Cyclic left rotation
   *
   * @param {number} data
   * @param {number} shift
   * @return {number}
   * @private
   */
  _rotl(data, shift) {
    return ((data << shift) | (data >>> (32 - shift)))
  }
}


// EXPORT //
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JSSalsa20
}

