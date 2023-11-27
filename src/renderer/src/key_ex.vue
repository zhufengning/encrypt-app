<script setup>
import { ref, onMounted } from "vue";
import dh from './dh.vue'
import ecdh from './ecdh.vue'
var tab = ref("");
</script>

<template>
    <v-container>
        <v-card>
            <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
                <v-tab value="dh">DH</v-tab>
                <v-tab value="ecdh">ECDH</v-tab>
            </v-tabs>

            <v-card-text>
                <v-window v-model="tab">
                    <v-window-item value="dh">
                        <dh></dh>
                    </v-window-item>
                    <v-window-item value="ecdh">
                        <ecdh></ecdh>
                </v-window-item>
            </v-window>
        </v-card-text>
    </v-card>
</v-container>

    <!-- <div v-if="isRsa">
                    <dh></dh>
                </div>
                <div v-if="isEcc">
                    <ecdh></ecdh>
                </div> -->
</template>