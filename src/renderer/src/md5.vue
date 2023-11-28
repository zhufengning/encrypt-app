  
<script setup>
import { ref } from "vue";
import * as md5 from '../../cipher/hash/md5.mjs';
import * as utils from '../../cipher/utils.mjs';

var selectedCipherCategory = ref('');
var cipherCategories = ref(['散列函数']);
var selectedCipher = ref('');
var ciphers = ref([]);
var inputText = ref('');
var outputText = ref('');
var chosen_file = ref();
var isFile = ref(true);

function updateCipherOptions() {
    const cipherOptions = {
        '散列函数': ['md5'],
    };
    ciphers.value = cipherOptions[selectedCipherCategory.value] || [];
    selectedCipher.value = "";
    // console.log(ciphers.value, selectedCipherCategory.value)

}
function operate() {
    if (isFile.value) {
        hashC();
    }
    else {
        file_change();
    }
}

async function hashC() {
    try {
        switch (selectedCipher.value) {
            case 'md5':
                if (chosen_file.value[0]) {
                    outputText.value = utils.arrayBuffer2HexString(md5.md5Calculate(new Uint8Array(inputText.value)));
                }
                else {
                    outputText.value = utils.arrayBuffer2HexString(md5.md5Calculate(utils.str2ArrayBuffer(inputText.value)));
                }
                break;
            default:
                outputText.value = '请选择一个哈希摘要算法';
        }
    } catch (error) {
        outputText.value = '加密过程中出现错误: ' + error.message;
    }

}

function file_change() {
    let reader = new FileReader();

    reader.readAsText(chosen_file.value[0]);
    reader.onload = () => {
        inputText.value = reader.result;
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

        <v-row>
            <v-file-input label="导入文件" prepend-icon="mdi-import" v-model="chosen_file" @change="file_change" chips
                accept="*">
            </v-file-input>
        </v-row>

        <v-row>
            <v-col>
                <v-btn color="black" @click="operate">计算</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
