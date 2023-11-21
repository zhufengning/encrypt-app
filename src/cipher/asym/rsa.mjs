import { BN } from "bn.js";
import { getRandomBN } from "../utils.mjs";

export function rsaKeyGen(len_bit) {
  // if (!(len_bit instanceof BN)) {
  //   throw new Error("Type error: len_bit must be BN")
  // }

  if (len_bit.mod(new BN('16')) != 0) {
    throw new Error("长度必须被16整除")
  }

}
