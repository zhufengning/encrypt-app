<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
var page = ref(0)
const router = useRouter()
const route = useRoute()
const currentRouteName = computed(() => route.name)
function jmp(s) {
  router.push(s);
}

</script>

<template>
  <v-layout>

    <v-app-bar>
      <v-app-bar-title>{{ currentRouteName }}</v-app-bar-title>
    </v-app-bar>
    <v-main><router-view></router-view></v-main>

    <v-bottom-navigation v-model="page" active color="primary">
      <v-btn @click="jmp('/1');">
        <v-icon>mdi-history</v-icon>
        经典密码
      </v-btn>

      <v-btn @click="jmp('/2');">
        <v-icon>mdi-heart</v-icon>
        rsa
      </v-btn>

      <v-btn @click="jmp('/3');">
        <v-icon>mdi-map-marker</v-icon>
        联机模式
      </v-btn>
      <v-btn @click="jmp('/4');">
        <v-icon>mdi-map-marker</v-icon>
        ecc
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
