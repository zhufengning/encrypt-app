mod utils;

use ibig::{modular::ModuloRing, ubig, UBig};

use rand::{thread_rng, Rng};
use wasm_bindgen::prelude::*;

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
