<script setup>
import { reactive } from 'vue'
import { str2ArrayBuffer } from '../../../cipher/utils'
const versions = reactive({ ...window.electron.process.versions })
const hello = str2ArrayBuffer()
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="v8-version">V8 v{{ versions.v8 }}</li>
    {{ hello }}
  </ul>
</template>
