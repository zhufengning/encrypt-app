import os
os.system("wasm-pack build ./my-rsa-dh --target web")
os.system("wasm-pack build ./my-ecc --target web")
os.system("wasm-pack build ./my-ecdh --target web")
os.system("npm i")
