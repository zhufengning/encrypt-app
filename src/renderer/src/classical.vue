<script setup>
import { ref } from "vue";
import * as monoalpha from '../../cipher/classical/monoalpha.mjs';
import * as trans from '../../cipher/classical/trans.mjs';
import * as polyalpha from '../../cipher/classical/polyalpha.mjs';
import * as playfair from '../../cipher/classical/pf.mjs';
import * as rc4 from '../../cipher/stream/rc4.mjs';
import * as ca from '../../cipher/stream/ca.mjs';
import { aesEncrypt, aesDecrypt } from '../../cipher/block/aes.mjs';
import { desEncrypt, desDecrypt } from '../../cipher/block/des.mjs';
import * as utils from '../../cipher/utils.mjs';

var selectedCipherCategory = ref('');
var cipherCategories = ref(['单表替代密码', '多表替代密码', '多图替代密码', '置换密码', '块密码', '流密码']);
var selectedCipher = ref('');
var ciphers = ref([]);
var inputText = ref('');
var key = ref('');
var key2 = ref('');
var cavalue = ref('');
var carule = ref('');
var casource = ref('');
var outputText = ref('');
var isEncrypt = ref(true);
var counter = ref('');
var nonce = ref('');

function needsKey() {

    return selectedCipher.value !== '';
}

function updateCipherOptions() {
    const cipherOptions = {
        '单表替代密码': ['Caesar cipher', 'Keyword cipher', 'Affine cipher', 'Multiliteral cipher'],
        '多表替代密码': ['Vigenere cipher', 'Autokey ciphertext', 'Autokey plaintext'],
        '多图替代密码': ['Playfair cipher'],
        '置换密码': ['Column permutation cipher', 'Double-Transposition cipher'],
        '块密码': ['aes', 'des'],
        '流密码': ['rc4', 'ca'],
    };
    ciphers.value = cipherOptions[selectedCipherCategory.value] || [];
    selectedCipher.value = "";
    // console.log(ciphers.value, selectedCipherCategory.value)

}
function operate() {
    if (isEncrypt.value) {
        encrypt();
    } else {
        decrypt();
    }
}


async function encrypt() {
    try {
        switch (selectedCipher.value) {
            case 'Caesar cipher':
                outputText.value = monoalpha.caesarEncrypt(inputText.value, key.value);
                break;
            case 'Keyword cipher':
                outputText.value = monoalpha.keywordEncrypt(inputText.value, key.value);
                break;
            case 'Affine cipher':
                outputText.value = monoalpha.affineEncrypt(inputText.value, key.value);
                break;
            case 'Multiliteral cipher':
                outputText.value = monoalpha.multiliteralEncrypt(inputText.value, key.value);
                break;
            case 'Vigenere cipher':
                outputText.value = polyalpha.vigenereEncrypt(inputText.value, key.value);
                break;
            case 'Autokey ciphertext':
                outputText.value = polyalpha.autokeyCiphertextEncrypt(inputText.value, key.value);
                break;
            case 'Autokey plaintext':
                outputText.value = polyalpha.autokeyPlaintextEncrypt(inputText.value, key.value);
                break;
            case 'Playfair cipher':
                outputText.value = playfair.playfairEncrypt(inputText.value, key.value);
                break;
            case 'Column permutation cipher':
                outputText.value = trans.columnarTransEncrypt(inputText.value, key.value);
                break;
            case 'Double-Transposition cipher':
                // For double transposition, the key is expected to be an array [key1, key2]
                const keys = key.value.split(','); // Assuming the keys are separated by commas
                outputText.value = trans.doubleTranspositionEncrypt(inputText.value, keys[0], keys[1]);
                break;
            case 'des':
                var keyP = utils.padding(utils.str2ArrayBuffer(key.value), 8);
                keyP = keyP.slice(0, 8);
                var encryptMsg = utils.padding(utils.str2ArrayBuffer(inputText.value), 8);
                encryptMsg = utils.dealBufferBlock(encryptMsg, 8, desEncrypt, keyP);
                outputText.value = utils.arrayBuffer2HexString(encryptMsg);
                break;
            case 'aes':
                keyP = utils.padding(utils.str2ArrayBuffer(key.value), 16);
                keyP = keyP.slice(0, 16);
                var encryptMsg = utils.padding(utils.str2ArrayBuffer(inputText.value), 16);
                encryptMsg = utils.dealBufferBlock(encryptMsg, 16, aesEncrypt, keyP);
                outputText.value = utils.arrayBuffer2HexString(encryptMsg);
                break;
            case 'rc4':
                outputText.value = utils.arrayBuffer2HexString(rc4.rc4Encrypt(utils.str2ArrayBuffer(inputText.value), key.value));
                break;
                的加密逻辑
            case 'ca':
                outputText.value = ca.caEncrypt(cavalue.value, Number(carule.value), Number(casource.value), inputText.value);
                break;
            default:
                outputText.value = '请选择一个加密算法';
        }
    } catch (error) {
        outputText.value = '加密过程中出现错误: ' + error.message;
    }

}
async function decrypt() {
    try {
        switch (selectedCipher.value) {
            case 'Caesar cipher':
                outputText.value = monoalpha.caesarDecrypt(inputText.value, key.value);
                break;
            case 'Keyword cipher':
                outputText.value = monoalpha.keywordDecrypt(inputText.value, key.value);
                break;
            case 'Affine cipher':
                outputText.value = monoalpha.affineDecrypt(inputText.value, key.value);
                break;
            case 'Multiliteral cipher':
                outputText.value = monoalpha.multiliteralDecrypt(inputText.value, key.value);
                break;
            case 'Vigenere cipher':
                outputText.value = polyalpha.vigenereDecrypt(inputText.value, key.value);
                break;
            case 'Autokey ciphertext':
                outputText.value = polyalpha.autokeyCiphertextDecrypt(inputText.value, key.value);
                break;
            case 'Autokey plaintext':
                outputText.value = polyalpha.autokeyPlaintextDecrypt(inputText.value, key.value);
                break;
            case 'Playfair cipher':
                outputText.value = playfair.playfairDecrypt(inputText.value, key.value);
                break;
            case 'Column permutation cipher':
                outputText.value = trans.columnarTransDecrypt(inputText.value, key.value);
                break;
            case 'Double-Transposition cipher':
                // For double transposition, the key is expected to be an array [key1, key2]
                const keys = key.value.split(','); // Assuming the keys are separated by commas
                outputText.value = trans.doubleTranspositionDecrypt(inputText.value, keys[0], keys[1]);
                break;
            case 'des':
                var keyP = utils.padding(utils.str2ArrayBuffer(key.value), 16);
                keyP = keyP.slice(0, 16);
                var decryptMsg = utils.padding(utils.hexString2U8Array(inputText.value), 8);
                decryptMsg = utils.dealBufferBlock(decryptMsg, 8, desDecrypt, keyP);
                outputText.value = utils.arrayBuffer2Str(decryptMsg);
                break;
            case 'aes':
                keyP = utils.padding(utils.str2ArrayBuffer(key.value), 32);
                keyP = keyP.slice(0, 32);
                var encryptMsg = utils.padding(utils.hexString2U8Array(inputText.value), 16);
                encryptMsg = utils.dealBufferBlock(encryptMsg, 16, aesDecrypt, keyP);
                outputText.value = utils.arrayBuffer2Str(encryptMsg);
                break;
            case 'rc4':
                outputText.value = utils.arrayBuffer2Str(rc4.rc4Encrypt(utils.hexString2U8Array(inputText.value), key.value));
                break;
            case 'ca':
                const keyStream = ca.generateKeyStream(ca.stringToInts(cavalue.value), Number(carule.value), Number(casource.value), inputText.value.length);
                outputText.value = ca.caDecrypt(inputText.value, ca.intsToString(keyStream));
                break;
            default:
                outputText.value = '请选择一个解密算法';
        }
    } catch (error) {
        outputText.value = '解密过程中出现错误: ' + error.message;
    }
}
</script>
  
<template>
    <v-container>
        <!-- 主密码类别选择 -->
        <v-row>
            <v-col cols="12" sm="6">
                <v-combobox v-model="selectedCipherCategory" :items="cipherCategories" label="选择密码类别" outlined
                    @update:modelValue=updateCipherOptions></v-combobox>
            </v-col>
            <v-col cols="12" sm="6">
                <!-- 具体的密码算法选择 -->
                <v-combobox v-model="selectedCipher" :items="ciphers" label="选择具体算法" outlined></v-combobox>
            </v-col>
        </v-row>


        <!-- 输入文本和输出结果 -->
        <v-row>
            <v-col cols="12" sm="6">
                <v-textarea v-model="inputText" label="原文/密文" outlined></v-textarea>
            </v-col>
            <v-col cols="12" sm="6">
                <v-textarea v-model="outputText" label="密文/原文" outlined readonly></v-textarea>
            </v-col>
        </v-row>

        <!-- 密钥输入 -->
        <v-row>
            <v-col cols="12">
                <v-text-field v-if="selectedCipher !== 'ca'" v-model="key" label="密钥1" hint="请输入密钥" persistent-hint
                    outlined></v-text-field>

                <!-- 如果是双重置换密码，显示第二个密钥输入框 -->
                <v-text-field v-if="selectedCipher === 'Double-Transposition cipher'" v-model="key2" label="密钥2"
                    hint="请输入第二密钥" persistent-hint outlined></v-text-field>

                <!-- 一维元胞自动机(CA)算法的特定输入 -->
                <v-text-field v-if="selectedCipher === 'ca'" v-model="cavalue" label="CA初始值" hint="请输入CA初始值" persistent-hint
                    outlined></v-text-field>
                <v-text-field v-if="selectedCipher === 'ca'" v-model="carule" label="规则" hint="请输入CA规则（整数）" persistent-hint
                    outlined></v-text-field>
                <v-text-field v-if="selectedCipher === 'ca'" v-model="casource" label="源位置" hint="请输入CA源位置（整数）"
                    persistent-hint outlined></v-text-field>
            </v-col>
        </v-row>

        <!-- 操作类型选择 -->
        <v-row>
            <v-col cols="12" sm="6">
                <v-switch color="primary" v-model="isEncrypt" :label="`操作类型： ${isEncrypt ? '加密' : '解密'}`"></v-switch>
            </v-col>
        </v-row>

        
        <!-- 操作按钮 -->
        <v-row>
            <v-col>
                <v-btn color="black" @click="operate">开始操作</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
