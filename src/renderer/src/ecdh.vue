<script setup>
import { ref, onMounted } from "vue"
import init, { pri_keygen, final_keygen, pub_keygen } from "my-ecdh"
var dh_pri_key = ref("");
var dh_my_pub_key = ref("");
var dh_pub_key = ref("");
var dh_fin_key = ref("");

function on_pri_keygen_click() {
  dh_pri_key.value = pri_keygen();
  dh_fin_key.value = ""
  dh_pub_key.value = ""
  update_pub_key()
}

function update_pub_key() {
  dh_my_pub_key.value = pub_keygen(dh_pri_key.value);
}

function on_fin_keygen_click() {
  //console.log(dh_pri_key.value, dh_pub_key.value);
  dh_fin_key.value = final_keygen(dh_pri_key.value, dh_pub_key.value);
}

onMounted(async () => await init())
</script>

<template>
  <v-container class="ga-2">
    <v-row>
      <v-col>
        <v-card>
          <v-card-item>
            <v-card-title>DH密钥交换</v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field v-model="dh_pri_key" append-icon="mdi-refresh" label="私钥" type="text"
              @click:append="on_pri_keygen_click" @change="update_pub_key"></v-text-field>
            <v-text-field v-model="dh_my_pub_key" append-icon="mdi-play" label="我的公钥" @click:append="update_pub_key"
              type="text"></v-text-field>
            <v-text-field v-model="dh_pub_key" append-icon="mdi-play" label="别的公钥" type="text"
              @click:append="on_fin_keygen_click"></v-text-field>
            <v-text-field v-model="dh_fin_key" label="最终密钥" type="text"></v-text-field>
          </v-card-text>
          <v-card-actions>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

