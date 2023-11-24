mod utils;

use ibig::{
    modular::{Modulo, ModuloRing},
    ubig, UBig,
};
use lazy_static::lazy_static;
use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::*;

lazy_static! {
    static ref DH_P: UBig = UBig::from_str_with_radix_prefix("0xffffffffffffffffadf85458a2bb4a9aafdc5620273d3cf1d8b9c583ce2d3695a9e13641146433fbcc939dce249b3ef97d2fe363630c75d8f681b202aec4617ad3df1ed5d5fd65612433f51f5f066ed0856365553ded1af3b557135e7f57c935984f0c70e0e68b77e2a689daf3efe8721df158a136ade73530acca4f483a797abc0ab182b324fb61d108a94bb2c8e3fbb96adab760d7f4681d4f42a3de394df4ae56ede76372bb190b07a7c8ee0a6d709e02fce1cdf7e2ecc03404cd28342f619172fe9ce98583ff8e4f1232eef28183c3fe3b1b4c6fad733bb5fcbc2ec22005c58ef1837d1683b2c6f34a26c1b2effa886b423861285c97ffffffffffffffff").unwrap();
    static ref DH_RING: ModuloRing = ModuloRing::new(&DH_P);
    static ref DH_G: UBig = ubig!(2);
}
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn test_miller() -> i32 {
    for _i in 0u32..5u32 {
        log(&format!("{}", get_random_prime(1024 / 8)));
    }
    return 0;
}

#[wasm_bindgen]
pub fn rsa_keygen(nbit: usize) -> String {
    let prime_len = nbit / 16;
    let mut p = get_random_prime(prime_len);
    let mut q = get_random_prime(prime_len);
    let mut n = &p * &q;
    while n.bit_len() > nbit || n.bit_len() <= nbit / 2 {
        p = get_random_prime(prime_len);
        q = get_random_prime(prime_len);
        n = &p * &q;
    }

    let phi: UBig = (&p - 1) * (&q - 1);
    let mut e = thread_rng().gen_range(ubig!(2)..phi.clone());
    while e.gcd(&phi) != ubig!(1) {
        e = thread_rng().gen_range(ubig!(2)..phi.clone());
    }
    let (_, d, _) = e.extended_gcd(&phi);
    return format!(
        "{}|{}|{},{}|{}|{}",
        nbit,
        n.in_radix(16).to_string(),
        e.in_radix(16).to_string(),
        nbit,
        n.in_radix(16).to_string(),
        d.in_radix(16).to_string()
    );
}

pub fn rsa_key_split(key: &str) -> (usize, UBig, UBig) {
    let mut iter = key.split("|");
    let klen = iter.next().unwrap().parse().unwrap();
    let k1 = UBig::from_str_radix(iter.next().unwrap(), 16).unwrap();
    let k2 = UBig::from_str_radix(iter.next().unwrap(), 16).unwrap();
    return (klen, k1, k2);
}

#[wasm_bindgen]
pub fn js_rsa_encrypt(key: &str, content: js_sys::Uint8Array) -> JsValue {
    return JsValue::from_str(&rsa_encrypt(key, &content.to_vec()));
}

pub fn rsa_encrypt(key: &str, content: &[u8]) -> String {
    let (_klen, n, e) = rsa_key_split(key);
    let m = UBig::from_be_bytes(content);
    // log(&format!("encrypting: {}", m));
    if m > n {
        return String::from("内容过长");
    }
    let ring = ModuloRing::new(&n);
    let m = ring.from(&m);
    return m.pow(&e).residue().in_radix(16).to_string();
}

pub fn get_random_ub(nb: usize) -> UBig {
    let mut random_bytes: Vec<u8> = (0..nb).map(|_| rand::random::<u8>()).collect();
    random_bytes[0] &= 0b10000000u8;
    return UBig::from_be_bytes(&random_bytes);
}

pub fn get_random_prime(nb: usize) -> UBig {
    let mut r = get_random_ub(nb);
    while !miller_rabin(&r, 1000) {
        r = get_random_ub(nb);
    }
    return r;
}

pub fn miller_rabin(p: &UBig, n: u32) -> bool {
    if p <= &ubig!(3) || p % 2 == 0 {
        return p == &ubig!(2) || p == &ubig!(3);
    }

    let ri: UBig = p - 1;
    let mut d = ri.clone();
    let mut r = ubig!(1);
    while &d % 2 == 0 {
        d = &d / 2;
        r = &r + 1;
    }

    for _ in 0..n {
        let ring = ModuloRing::new(&p);
        let a = ring.from(thread_rng().gen_range(ubig!(2)..ri.clone()));
        let mut x = a.pow(&d);
        if &x == &ring.from(1) || &x == &ring.from(&ri) {
            continue;
        }

        let mut i = ubig!(0);
        let mut flag2 = false;
        while i < &r - 1 {
            x = x.pow(&ubig!(2));
            if x == ring.from(&ri) {
                flag2 = true;
                break;
            }
            i += 1;
        }
        if !flag2 {
            return false;
        }
    }
    return true;
}

fn ubig_mod_pow(base: &UBig, exp: &UBig, modulus: &UBig) -> UBig {
    if modulus == &ubig!(1) {
        return ubig!(0);
    }
    let mut result = ubig!(1);
    let mut base = base % modulus;
    let mut exp = exp.clone();
    while exp > ubig!(0) {
        if &exp % 2 == 1 {
            result = &result * &base % modulus;
        }
        exp = &exp / &ubig!(2);
        base = &base * &base % modulus;
    }
    result
}

#[wasm_bindgen]
pub fn dh_pri_keygen() -> JsValue {
    JsValue::from(hex::encode(
        (0..2048 / 8)
            .map(|_| rand::random::<u8>())
            .collect::<Vec<u8>>(),
    ))
}

#[wasm_bindgen]
pub fn dh_pub_keygen(prik: &str) -> JsValue {
    let a = UBig::from_be_bytes(&hex::decode(prik).unwrap());
    JsValue::from(
        (DH_RING.from(DH_G.clone()).pow(&a))
            .residue()
            .in_radix(16)
            .to_string(),
    )
}

#[wasm_bindgen]
pub fn dh_fin_keygen(prik: &str, pubk: &str) -> JsValue {
    let a = UBig::from_be_bytes(&hex::decode(prik).unwrap());
    let b = DH_RING.from(UBig::from_be_bytes(&hex::decode(pubk).unwrap()));
    JsValue::from((b.pow(&a)).residue().in_radix(16).to_string())
}
