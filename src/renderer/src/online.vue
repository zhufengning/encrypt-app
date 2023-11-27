<script setup>
import { ref, onMounted } from 'vue';
import { io } from "socket.io-client";
import init, { pri_keygen, final_keygen, pub_keygen } from "my-ecdh"
import { aesEncrypt, aesDecrypt } from "../../cipher/block/aes.mjs"
import { desEncrypt, desDecrypt } from "../../cipher/block/des.mjs"
import { rc4Encrypt, rc4Decrypt } from "../../cipher/stream/rc4.mjs"
import { hexString2U8Array, padding } from "../../cipher/utils.mjs"
var server_port = ref("3000");
var client_url = ref("ws://localhost:3000");
var conn_type = ref("none");
var msgs = ref([]);
var pri_key = ref("");
var pub_key = ref("");
var message = ref("");
var final_key = ref("");

var selectedCipher = ref('None');
var ciphers = ref(['DES', 'AES', 'RC4', 'None']);

var client_socket;

function reset() {
  conn_type.value = "none";
  final_key.value = '';
  msgs.value = [];
  keygen();
  try { window.api.closeWsServer(); }
  catch (e) { }
  if (conn_type == "client") client_socket.disconnect();
}

function keygen() {
  pri_key.value = pri_keygen();
  pub_key.value = pub_keygen(pri_key.value);
  console.log("pri_key:", pri_key.value);
  console.log("pub_key:", pub_key.value)
}

function createServer() {
  window.api.createWsServer(parseInt(server_port.value), pub_key.value, gotKey, gotMsg);
  conn_type.value = "server";
}

function gotKey(key) {
  console.log("got key:", key);
  final_key.value = final_keygen(pri_key.value, key);
  console.log("final key:", final_key.value);
}

function gotMsg(msg) {
  console.log(selectedCipher.value, msg);
  var decryptMsg;
  var key = hexString2U8Array(final_key.value).buffer;
  var decodedMsg = msg;
  switch (selectedCipher.value) {
    case "None":
      decryptMsg = msg;
      break;
    case "AES":
      decryptMsg = new TextDecoder().decode(aesDecrypt(decodedMsg, key));
      break;
    case "DES":
      key = key.slice(0, 16);
      decryptMsg = new TextDecoder().decode(desDecrypt(decodedMsg, key));
      break;
    case "RC4":
      var res = rc4Decrypt(decodedMsg, key);
      decryptMsg = new TextDecoder().decode(new Uint8Array(res));
      break;
    default:
      alert("No!");
  }
  msgs.value.push({ name: "Someone: " + decryptMsg, value: msgs.value.length });
}

function connectServer() {
  client_socket = io(client_url.value)
  client_socket.on("server-key-send", (key) => {
    console.log("Client got key:", key);
    final_key.value = final_keygen(pri_key.value, key);
    console.log("final key:", final_key.value);
  });
  client_socket.on("server-msg", gotMsg);
  client_socket.on("connect", () => {
    client_socket.emit("client-key-send", pub_key.value)
  });
  client_socket.on("disconnect", reset);
  console.log("connected");
  conn_type.value = "client";
}

function sendMessage() {
  var encryptMsg;
  var key = hexString2U8Array(final_key.value).buffer;
  var encodedMsg = new TextEncoder().encode(message.value);
  switch (selectedCipher.value) {
    case "None":
      encryptMsg = message.value;
      break;
    case "AES":
      encodedMsg = padding(encodedMsg, 32);
      encryptMsg = aesEncrypt(encodedMsg.buffer, key);
      break;
    case "DES":
      encodedMsg = padding(encodedMsg, 16);
      key = key.slice(0, 16);
      encryptMsg = desEncrypt(encodedMsg.buffer, key);
      break;
    case "RC4":
      encryptMsg = rc4Encrypt(encodedMsg.buffer, key);
      console.log(encodedMsg.buffer, key, encryptMsg)
      break;
    default:
      alert("No!");
  }
  if (conn_type.value == "client") {
    client_socket.emit("client-msg", encryptMsg);
  } else if (conn_type.value == "server") {
    window.api.sendMsg(encryptMsg)
  }
  msgs.value.push({ name: "You: " + message.value, value: msgs.value.length })
  message.value = "";
}

onMounted(async () => {

  try { window.api.closeWsServer(); } catch (e) { }
  await init();
  keygen();
})

</script>

<template>
  <v-container class="ga-2">
    <v-row>
      <v-col>联机模式</v-col>
      <v-btn density="compact" icon="mdi-refresh" @click="reset"></v-btn>
    </v-row>
    <div v-if="conn_type == 'none'">
      <v-row>
        <v-col>
          <v-text-field label="服务器端口" v-model="server_port"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field label="客户端连接" v-model="client_url"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="createServer">启动服务器</v-btn>
        </v-col>
        <v-col>
          <v-btn @click="connectServer">连接服务器</v-btn>
        </v-col>
      </v-row>
    </div>
    <v-row>
      ecdh私钥：{{ pri_key }}
    </v-row>
    <v-row>
      ecdh公钥：{{ pub_key }}
    </v-row>
    <v-row>
      已交换密钥：{{ final_key }}
    </v-row>
    <v-row v-if="conn_type == 'server'">
      服务器模式，端口：{{ server_port }}
    </v-row>
    <v-row v-if="conn_type == 'client'">
      客户端模式，服务器：{{ client_url }}
    </v-row>
    <v-row>
      <v-col>
        <v-combobox v-model="selectedCipher" :items="ciphers" label="选择密码类别" outlined></v-combobox>
      </v-col>
    </v-row>
    <v-row style="overflow-y: scroll; height:50vh" height="300">
      <v-col>
        <v-card class="mx-auto">
          <v-list :items="msgs" item-title="name" item-subtitle="name" item-value="msg">
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="final_key">
      <v-text-field v-model="message" append-icon="mdi-send" label="Message" type="text"
        @click:append="sendMessage"></v-text-field>
    </v-row>
  </v-container>
</template>

