<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {load} from "jinrishici"


var page = ref(0)
var shi = ref("")
const router = useRouter()
const route = useRoute()
const currentRouteName = computed(() => route.name)
function jmp(s) {
  // getShi();
  router.push(s);
}

var getShi=() => {
  load(result => {
    console.log(result);
    shi.value = "——"+result.data.content;
  });
}
onMounted(getShi)
</script>

<template>
  <v-layout>

    <v-app-bar color="teal-darken-4">
      <v-app-bar-title>{{ currentRouteName + shi }}</v-app-bar-title>
    </v-app-bar>
    <v-main><router-view></router-view></v-main>

    <v-bottom-navigation v-model="page" active color="primary">
      <v-btn @click="jmp('/1');">
        <v-icon>mdi-debian</v-icon>
        对称加密  
      </v-btn>

      <v-btn @click="jmp('/7');">
        <v-icon>mdi-ubuntu</v-icon>
        md5
      </v-btn>

      <v-btn @click="jmp('/3');">
        <v-icon>mdi-fedora</v-icon>
        联机模式
      </v-btn>
      <!-- <v-btn @click="jmp('/4');">
        <v-icon>mdi-map-marker</v-icon>
        ecc
      </v-btn> -->
      <!-- <v-btn @click="jmp('/dh');">
        <v-icon>mdi-map-marker</v-icon>
        dh
      </v-btn>
      <v-btn @click="jmp('/ecdh');">
        <v-icon>mdi-map-marker</v-icon>
        ecdh
      </v-btn> -->
      <v-btn @click="jmp('/5');">
        <v-icon>mdi-arch</v-icon>
        非对称密码
      </v-btn>
      <v-btn @click="jmp('/6');">
        <v-icon>mdi-linux</v-icon>
        密钥交换
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
