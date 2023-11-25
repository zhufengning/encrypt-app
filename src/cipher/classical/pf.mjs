export function generateKeyTable(key) {
    const size = 5;
    let keyTable = Array.from({ length: size }, () => new Array(size));
    let dict = Array.from({ length: 26 }, () => 0);
    dict['J'.charCodeAt(0) - 65] = 1;

    key = key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    let distinctLetters = [...new Set(key)];

    let row = 0, col = 0;
    for (let letter of distinctLetters) {
        if (dict[letter.charCodeAt(0) - 65] === 0) {
            dict[letter.charCodeAt(0) - 65] = 2;
            keyTable[row][col] = letter;
            col++;
            if (col === size) {
                row++;
                col = 0;
            }
        }
    }

    for (let i = 0; i < 26; i++) {
        let letter = String.fromCharCode(i + 65);
        if (dict[i] === 0 && letter !== 'J') {
            keyTable[row][col] = letter;
            col++;
            if (col === size) {
                row++;
                col = 0;
            }
        }
    }

    return keyTable;
}

export function playfairEncrypt(plaintext, key) {
    let keyTable = generateKeyTable(key);
    plaintext = plaintext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

    // Prepare plaintext
    let preparedText = "";
    for (let i = 0; i < plaintext.length; i += 2) {
        preparedText += plaintext[i];
        if (i + 1 === plaintext.length || plaintext[i] === plaintext[i + 1]) {
            preparedText += 'X';
        } else {
            preparedText += plaintext[i + 1];
        }
    }

    return preparedText.match(/.{1,2}/g).map(pair => encryptPair(pair, keyTable)).join('');
}

export function playfairDecrypt(ciphertext, key) {
    let keyTable = generateKeyTable(key);
    ciphertext = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');

    return ciphertext.match(/.{1,2}/g).map(pair => decryptPair(pair, keyTable)).join('');
}

export function findPosition(letter, keyTable) {
    for (let row = 0; row < keyTable.length; row++) {
        for (let col = 0; col < keyTable[row].length; col++) {
            if (keyTable[row][col] === letter) {
                return { row, col };
            }
        }
    }
    return null;
}

export function encryptPair(pair, keyTable) {
    let pos1 = findPosition(pair[0], keyTable);
    let pos2 = findPosition(pair[1], keyTable);

    if (pos1.row === pos2.row) {
        return keyTable[pos1.row][(pos1.col + 1) % 5] + keyTable[pos2.row][(pos2.col + 1) % 5];
    } else if (pos1.col === pos2.col) {
        return keyTable[(pos1.row + 1) % 5][pos1.col] + keyTable[(pos2.row + 1) % 5][pos2.col];
    } else {
        return keyTable[pos1.row][pos2.col] + keyTable[pos2.row][pos1.col];
    }
}

export function decryptPair(pair, keyTable) {
    let pos1 = findPosition(pair[0], keyTable);
    let pos2 = findPosition(pair[1], keyTable);

    if (pos1.row === pos2.row) {
        return keyTable[pos1.row][(pos1.col + 4) % 5] + keyTable[pos2.row][(pos2.col + 4) % 5];
    } else if (pos1.col === pos2.col) {
        return keyTable[(pos1.row + 4) % 5][pos1.col] + keyTable[(pos2.row + 4) % 5][pos2.col];
    } else {
        return keyTable[pos1.row][pos2.col] + keyTable[pos2.row][pos1.col];
    }
}
