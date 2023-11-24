import os
os.system("wasm-pack build ./my-rsa --target web")
os.system("wasm-pack build ./my-ecc --target web")
os.system("npm i")
