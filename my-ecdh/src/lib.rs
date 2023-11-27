mod utils;

use curve25519_dalek::{scalar::Scalar, MontgomeryPoint};
use rand_core::OsRng;
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn pri_keygen() -> JsValue {
    // set_panic_hook();
    let mut rng = OsRng;
    JsValue::from(hex::encode(Scalar::random(&mut rng).as_bytes()))
}

#[wasm_bindgen]
pub fn pub_keygen(pk: &str) -> JsValue {
    let a = Scalar::from_bytes_mod_order(hex::decode(pk).unwrap().try_into().unwrap());
    JsValue::from(hex::encode(
        (a * curve25519_dalek::constants::X25519_BASEPOINT).to_bytes(),
    ))
}

#[wasm_bindgen]
pub fn final_keygen(a: &str, g: &str) -> JsValue {
    let a = Scalar::from_bytes_mod_order(hex::decode(a).unwrap().try_into().unwrap());
    let g = MontgomeryPoint(hex::decode(g).unwrap().try_into().unwrap());
    JsValue::from(hex::encode((a * g).as_bytes()))
}
