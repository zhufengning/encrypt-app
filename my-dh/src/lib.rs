mod utils;

use curve25519_dalek::{edwards::CompressedEdwardsY, scalar::Scalar, EdwardsPoint};
use rand_core::OsRng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn pri_keygen() -> JsValue {
    let mut rng = OsRng;
    JsValue::from(hex::encode(Scalar::random(&mut rng).as_bytes()))
}

#[wasm_bindgen]
pub fn pub_keygen(pk: &str) -> JsValue {
    let a = Scalar::from_bytes_mod_order(hex::decode(pk).unwrap().try_into().unwrap());
    JsValue::from(hex::encode(
        (a * curve25519_dalek::constants::ED25519_BASEPOINT_POINT)
            .compress()
            .to_bytes(),
    ))
}

#[wasm_bindgen]
pub fn final_keygen(a: &str, g: &str) -> JsValue {
    let a = Scalar::from_bytes_mod_order(hex::decode(a).unwrap().try_into().unwrap());
    let g = CompressedEdwardsY(hex::decode(g).unwrap().try_into().unwrap())
        .decompress()
        .unwrap();
    JsValue::from(hex::encode((a * g).compress().as_bytes()))
}
