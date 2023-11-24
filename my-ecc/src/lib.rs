mod utils;
use std::fmt::format;

use curve25519_dalek::{
    edwards::CompressedEdwardsY, scalar::Scalar, EdwardsPoint, MontgomeryPoint,
};
use js_sys::{Array, ArrayBuffer, Uint8Array};
use lazy_static::lazy_static;
use rand_core::OsRng;
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

lazy_static! {
    static ref POINT_TABLE: Vec<EdwardsPoint> = {
        let mut p = Vec::<EdwardsPoint>::new();
        let mut g = curve25519_dalek::constants::ED25519_BASEPOINT_POINT;
        for _ in 0..65536 {
            p.push(g);
            g += curve25519_dalek::constants::ED25519_BASEPOINT_POINT;
        }
        p
    };
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn test_ecc0() {
    let mut csprng = OsRng;
    let g = curve25519_dalek::constants::ED25519_BASEPOINT_POINT;
    let k: Scalar = Scalar::random(&mut csprng);
    let K = k * g;
    let r = Scalar::random(&mut csprng);
    let m = g * Scalar::from(225u8);
    let c1 = r * g;
    let c2 = m + r * K;
    let jm = c2 - k * c1;
    log(&format!("{}", jm == m));
    log(&format!(
        "{}",
        k == Scalar::from_bytes_mod_order(k.to_bytes())
    ));
}

#[wasm_bindgen]
pub fn test_ecc() {
    let mut csprng = OsRng;
    let g = curve25519_dalek::constants::ED25519_BASEPOINT_POINT;
    let k: Scalar = Scalar::from_bytes_mod_order(
        hex::decode("5e96b5d6bf3f99e003a44cf38b737a19df8bad5a2442f5c543ff06b34d0add02")
            .unwrap()
            .try_into()
            .unwrap(),
    );
    let K = CompressedEdwardsY(
        hex::decode("ea23afe657cf6230e51e5620a58067b58a83f10b5c14da7a0875ad7ba92c392d")
            .unwrap()
            .try_into()
            .unwrap(),
    )
    .decompress()
    .unwrap();
    let r = Scalar::random(&mut csprng);
    let m = g * Scalar::from(97u8);
    let c1 = r * g;
    let c2 = m + r * K;
    let c1_mon = c1.compress();
    let c2_mon = c2.compress();

    let c1_str = hex::encode(c1_mon.to_bytes());
    let c2_str = hex::encode(c2_mon.to_bytes());

    let c1_u8: [u8; 32] = hex::decode(c1_str).unwrap().try_into().unwrap();
    let c2_u8: [u8; 32] = hex::decode(c2_str).unwrap().try_into().unwrap();

    let c1_mon_r = CompressedEdwardsY(c1_u8);
    let c2_mon_r = CompressedEdwardsY(c2_u8);

    let c1_restore = c1_mon_r.decompress().unwrap();
    let c2_restore = c2_mon_r.decompress().unwrap();

    let jm = c2_restore - k * c1_restore;
    log(&format!("{}", jm == m));
}

#[wasm_bindgen]
pub fn ecc_keygen() -> JsValue {
    let mut csprng = OsRng;
    let g = curve25519_dalek::constants::ED25519_BASEPOINT_POINT;
    let k: Scalar = Scalar::random(&mut csprng);
    let K = k * g;
    JsValue::from(format!(
        "{},{}",
        hex::encode(k.to_bytes()),
        hex::encode(K.compress().as_bytes())
    ))
}

pub fn ecc_encrypt(data: &[u8], key: &[u8; 32]) -> String {
    let mut csprng = OsRng;
    let K = CompressedEdwardsY(*key).decompress().unwrap();

    let g = curve25519_dalek::constants::ED25519_BASEPOINT_POINT;
    let mut res = String::new();
    for i in data {
        let r = Scalar::random(&mut csprng);
        let m = POINT_TABLE[*i as usize];
        let c1 = r * g;
        let c2 = m + r * K;

        res += &format!(
            "{},{};",
            hex::encode(c1.compress().as_bytes()),
            hex::encode(c2.compress().as_bytes())
        );
    }
    res
}

pub fn ecc_decrypt(data: Vec<([u8; 32], [u8; 32])>, key: &[u8; 32]) -> Vec<u8> {
    let k = Scalar::from_bytes_mod_order(*key);

    let mut res = Vec::new();
    for (c1, c2) in data {
        let c1 = CompressedEdwardsY(c1).decompress().unwrap();
        let c2 = CompressedEdwardsY(c2).decompress().unwrap();
        let jm = c2 - k * c1;
        let g = curve25519_dalek::constants::ED25519_BASEPOINT_POINT;
        let mut flag = false;
        for i in 0u8..=255u8 {
            if POINT_TABLE[i as usize] == jm {
                res.push(i);
                flag = true;
                break;
            }
        }
        if !flag {
            panic!("Could not find point.")
        }
    }
    res
}

#[wasm_bindgen]
pub fn js_ecc_encrypt(data: Uint8Array, key: &str) -> JsValue {
    let data = data.to_vec();
    let key = hex::decode(key).unwrap();
    JsValue::from(ecc_encrypt(&data, &key.try_into().unwrap()))
}

fn parse_hex_string(input: &str) -> Vec<([u8; 32], [u8; 32])> {
    input
        .split(';')
        .filter(|s| !s.is_empty())
        .map(|pair| {
            let mut parts = pair.split(',');
            let first_hex = parts.next().unwrap();
            let second_hex = parts.next().unwrap();

            let first_bytes = hex::decode(first_hex).unwrap().try_into().unwrap();
            let second_bytes = hex::decode(second_hex).unwrap().try_into().unwrap();

            (first_bytes, second_bytes)
        })
        .collect()
}

#[wasm_bindgen]
pub fn js_ecc_decrypt(data: &str, key: &str) -> Uint8Array {
    set_panic_hook();
    let data = parse_hex_string(data);
    let key = hex::decode(key).unwrap();
    Uint8Array::from(ecc_decrypt(data, &key.try_into().unwrap()).as_slice())
}
