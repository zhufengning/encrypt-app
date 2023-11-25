<script setup>
import init, { ecc_keygen, js_ecc_encrypt, js_ecc_decrypt } from "my-ecc";
import { ref, onMounted } from "vue";
import { hexString2U8Array, U8Array2hexString, saveArrayBufferAsFile } from "../../cipher/utils.mjs"

var ecc_key1 = ref("");
var ecc_key2 = ref("");
var content = ref("");
var output = ref("");
var input_key = ref("");
var input_type = ref("raw");
var chosen_file = ref();
function on_ecc_keygen_click() {
  let key = ecc_keygen().split(',');
  ecc_key1.value = key[0]
  ecc_key2.value = key[1]
}

function on_ecc_encrypt_click(save) {
  if (input_type.value == "密文") {
    let res = js_ecc_decrypt(content.value, input_key.value);
    if (save) {
      saveArrayBufferAsFile(res.buffer);
      output.value = "文件已保存"
    } else {
      output.value = new TextDecoder().decode(res);
    }
  } else {
    let raw;
    switch (input_type.value) {
      case "hex":
        raw = hexString2U8Array(content.value);
        break;
      case "raw":
        raw = new TextEncoder().encode(content.value);
        break;
    }
    let res = js_ecc_encrypt(raw, input_key.value);
    if (save) {
      saveArrayBufferAsFile(new TextEncoder().encode(res).buffer);
      output.value = "文件已保存"
    } else {
      output.value = res;
    }
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

function test() {
  // test_ecc();
  let k1 = "5e96b5d6bf3f99e003a44cf38b737a19df8bad5a2442f5c543ff06b34d0add02";
  let k2 = "ea23afe657cf6230e51e5620a58067b58a83f10b5c14da7a0875ad7ba92c392d";
  let mi = js_ecc_encrypt(new TextEncoder().encode("abc"), k2);
  console.log(mi);
  console.log(new TextDecoder().decode(js_ecc_decrypt(mi, k1)));
}

</script>

<template>
  <v-container class="ga-2">
    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel title="生成密钥">
            <v-expansion-panel-text>
              <v-card-title>生成密钥</v-card-title>

              <v-textarea label="私钥（解密）" v-model="ecc_key1"></v-textarea>
              <v-textarea label="公钥（加密）" v-model="ecc_key2"></v-textarea>

              <v-btn @click="on_ecc_keygen_click">生成</v-btn>
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
            <v-btn @click="on_ecc_encrypt_click(false);">加/解密</v-btn>
            <v-btn @click="on_ecc_encrypt_click(true);">加/解密并下载</v-btn></v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

