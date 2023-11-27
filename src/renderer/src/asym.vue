<script setup>
import { ref, onMounted } from "vue";
import rsa from './rsa.vue'
import ecc from './ecc.vue'
var tab = ref("");
</script>

<template>
    <v-container>
        <v-card>
            <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
                <v-tab value="rsa">RSA</v-tab>
                <v-tab value="ecc">ECC</v-tab>
            </v-tabs>

            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="rsa">
                        <rsa></rsa>
                    </v-window-item>
                    <v-window-item value="ecc">
                        <ecc></ecc>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</v-container>

    <!-- <div v-if="isRsa">
                    <rsa></rsa>
                </div>
                <div v-if="isEcc">
                    <ecc></ecc>
                </div> -->
</template>