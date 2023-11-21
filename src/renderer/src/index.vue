<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
var value = ref(0)
const router = useRouter()
function jmp(s) {
  router.push(s);
}
</script>

<template>
    <router-view></router-view>

    <v-layout class="overflow-visible" style="height: 56px;">
        <v-bottom-navigation v-model="value" active color="primary">
            <v-btn @click="jmp('/1');">
                <v-icon>mdi-history</v-icon>
                经典密码
            </v-btn>

            <v-btn @click="jmp('/2');">
                <v-icon>mdi-heart</v-icon>
                现代密码
            </v-btn>

            <v-btn @click="jmp('/3');">
                <v-icon>mdi-map-marker</v-icon>
                联机模式
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>
