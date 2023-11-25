<script setup>
import init, { rsa_keygen, js_rsa_encrypt } from "my-rsa-dh";
import { ref, onMounted } from "vue";
import { splitUInt8Array, hexString2U8Array, U8Array2hexString, saveArrayBufferAsFile, padIfOdd, padArrayWithZeros, concatenateUint8Arrays } from "../../cipher/utils.mjs"

var rsa_key1 = ref("");
var rsa_key2 = ref("");
var content = ref("");
var output = ref("");
var input_key = ref("");
var input_type = ref("raw");
var key_len = ref(1024);
var chosen_file = ref();
function on_rsa_keygen_click() {
  let key = rsa_keygen(key_len.value).split(',');
  rsa_key1.value = key[0]
  rsa_key2.value = key[1]
}

function on_rsa_encrypt_click(save) {
  let raws;
  let raw;
  let raw_len;
  let klen = parseInt(input_key.value.split("|")[0]);
  if (input_type.value == "密文") {
    let ms = content.value.split("&");
    raws = ms[0].split(",");
    raw_len = parseInt(ms[1]);
    //console.log(raws);
    raws = raws.map(hexString2U8Array);
  } else {
    switch (input_type.value) {
      case "hex":
        raw = hexString2U8Array(content.value);
        break;
      case "raw":
        raw = new TextEncoder().encode(content.value);
        break;
    }
    raws = splitUInt8Array(raw, klen / 16);
  }
  let res = "";
  for (var i of raws) {
    res += padIfOdd(js_rsa_encrypt(input_key.value, i));
    res += ",";
  }
  res = res.slice(0, -1);
  // console.log(res);
  if (input_type.value == "密文") {
    let reses = res.split(",");
    for (let i = 0; i < reses.length; i++) {
      let th = hexString2U8Array(reses[i]);
      reses[i] = padArrayWithZeros(th, i == reses.length - 1 ? raw_len % (klen / 16) : klen / 16)
    }
    res = concatenateUint8Arrays(reses);
    if (save) {
    } else {
      res = new TextDecoder().decode(res)
    }
  } else {
    res += "&";
    res += raw.length.toString()
    if (save) {
      res = new TextEncoder().encode(res);
    }
  }
  if (save) {
    saveArrayBufferAsFile(res.buffer, "save");
    output.value = "文件已保存"
  } else {
    output.value = res;
  }
}

function file_change() {
  let reader = new FileReader();
  if (input_type.value == "密文") {
    reader.readAsText(chosen_file.value[0]);
    reader.onload = () => {
      content.value = reader.result;
    }
  } else {
    input_type.value = "hex";
    reader.readAsArrayBuffer(chosen_file.value[0]);
    reader.onload = () => {
      content.value = U8Array2hexString(new Uint8Array(reader.result));
    }
  }
}

onMounted(async () => await init())

</script>

<template>
  <v-container class="ga-2">
    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel title="生成密钥">
            <v-expansion-panel-text>
              <v-card-title>生成密钥</v-card-title>
              <v-text-field label="密钥长度" v-model="key_len"></v-text-field>

              <v-textarea label="密钥1" v-model="rsa_key1"></v-textarea>
              <v-textarea label="密钥2" v-model="rsa_key2"></v-textarea>

              <v-btn @click="on_rsa_keygen_click">生成</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-item>
            <v-card-title>加/解密</v-card-title>
          </v-card-item>
          <v-card-text>
            <v-textarea label="输入密钥" v-model="input_key"></v-textarea>
            <v-select label="输入格式" :items="['raw', 'hex', '密文']" v-model="input_type"></v-select>
            <v-file-input label="导入文件" prepend-icon="mdi-import" v-model="chosen_file" @change="file_change" chips
              accept="*">
            </v-file-input>
            <v-textarea v-model="content"></v-textarea>
            <v-textarea v-model="output"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="on_rsa_encrypt_click(false);">加/解密</v-btn>
            <v-btn @click="on_rsa_encrypt_click(true);">加/解密并下载</v-btn></v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

