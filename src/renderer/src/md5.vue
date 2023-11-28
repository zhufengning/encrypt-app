  
<script setup>
import { ref, onMounted } from "vue";
import * as md5 from '../../cipher/hash/md5.mjs';


var selectedCipherCategory = ref('');
var cipherCategories = ref(['散列函数']);
var selectedCipher = ref('');
var ciphers = ref([]);
var inputText = ref('');
var key = ref('');
var key2 = ref('');
var outputText = ref('');
var isEncrypt = ref(true);

function needsKey() {

    return selectedCipher.value != 'md5';
}

function updateCipherOptions() {
    const cipherOptions = {
        '散列函数': ['md5'],
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
            case 'md5':
                outputText.value = md5.md5Calculate(inputText.value);
                break;
            default:
                outputText.value = '请选择一个加密算法';
        }
    } catch (error) {
        outputText.value = '加密过程中出现错误: ' + error.message;
    }

}
// async function decrypt() {
//     try {
//         switch (selectedCipher.value) {
//             case 'md5':
//                 outputText.value = md5.caesarEncrypt(inputText.value, key.value);
//                 break;
//             default:
//                 outputText.value = '请选择一个解密算法';
//         }
//     } catch (error) {
//         outputText.value = '解密过程中出现错误: ' + error.message;
//     }
// }

// watch: {
//     selectedCipherCategory(newVal, oldVal) {
//         if (newVal !== oldVal) {
//             updateCipherOptions.value();
//         }
//     }
// }
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
        <!-- <v-row v-if="needsKey()">
                <v-col cols="12">
                    <v-text-field v-model="key" label="密钥1" hint="请输入密钥" persistent-hint outlined></v-text-field>
                
                    <v-text-field v-if="selectedCipher === 'Double-Transposition cipher'" v-model="key2" label="密钥2"
                        hint="请输入第二密钥" persistent-hint outlined></v-text-field>
                </v-col>
            </v-row> -->

        <!-- 操作类型选择 -->
        <!-- <v-row v-if="needsKey()">
            <v-col cols="12" sm="6">
                <v-switch color="primary" v-model="isEncrypt" :label="`操作类型： ${isEncrypt ? '加密' : '解密'}`"></v-switch>
            </v-col>
        </v-row> -->

        <!-- 操作按钮 -->
        <v-row>
            <v-col>
                <v-btn color="black" @click="operate">加密</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
