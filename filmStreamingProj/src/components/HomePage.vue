<script setup>
import { ref } from 'vue'
// import Login from "./Authentication/Login.vue"
import Login from "./Authentication/Login.jsx"
defineProps({
  msg: String,
})

const count = ref(0)

</script>

<template>

  <button type="button" @click="count++">count is {{ count }}</button>
  <Login></Login>
  <!-- <LOGIN></LOGIN> -->
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
