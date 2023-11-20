<script setup>
import { ref } from 'vue';
var value = ref(0)
</script>

<template>
    <router-view></router-view>


    <v-layout class="overflow-visible" style="height: 56px;">
        <v-bottom-navigation v-model="value" active color="primary">
            <v-btn @click="this.$router.push('/');">
                <v-icon>mdi-history</v-icon>
                经典密码
            </v-btn>

            <v-btn @click="this.$router.push('/about');">
                <v-icon>mdi-heart</v-icon>

                现代密码
            </v-btn>

            <v-btn>
                <v-icon>mdi-map-marker</v-icon>
                联机模式
            </v-btn>
        </v-bottom-navigation>
    </v-layout>
</template>
