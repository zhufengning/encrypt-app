// Convert a string to an integer array
export function stringToInts(s) {
    return s.split('').map(char => parseInt(char, 10));
}

// Convert an integer array to a string
export function intsToString(arr) {
    return arr.join('');
}

// Generate the key stream for CA encryption
export function generateKeyStream(CA, rule, source, length) {
    let CA1 = [...CA];
    let keyStream = new Array(length);
    keyStream[0] = CA[source];

    let ruleString = rule.toString(2).padStart(8, '0');
    let ruleArray = stringToInts(ruleString);

    for (let i = 1; i < length; i++) {
        for (let j = 0; j < CA.length; j++) {
            let left = j === 0 ? CA[CA.length - 1] : CA[j - 1];
            let right = j === CA.length - 1 ? CA[0] : CA[j + 1];
            let neighborhood = '' + left + CA[j] + right;
            let ruleIndex = parseInt(neighborhood, 2);
            CA1[j] = ruleArray[ruleIndex];
        }
        keyStream[i] = CA1[source];
        CA = [...CA1];
    }

    return keyStream;
}

// Encrypt a plaintext using CA
export function caEncrypt(CA_value, rule, source, plaintext) {
    let CA = stringToInts(CA_value);
    let plaintextArray = stringToInts(plaintext);
    let keyStream = generateKeyStream(CA, rule, source, plaintextArray.length);

    let ciphertext = plaintextArray.map((val, index) => val ^ keyStream[index]);
    return intsToString(ciphertext);
}

// Decrypt a ciphertext using the key stream
export function caDecrypt(ciphertext, keystream) {
    let ciphertextArray = stringToInts(ciphertext);
    let keystreamArray = stringToInts(keystream);

    let plaintextArray = ciphertextArray.map((val, index) => val ^ keystreamArray[index]);
    return intsToString(plaintextArray);
}

