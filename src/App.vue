<template>
  <h1>Hello {{ msg }}</h1>
  <div>
    <a href="tel:10086">拨打10086</a>
  </div>

  <router-link active-class="active" :to="{path:'/'}">home</router-link>||
    <router-link active-class="active" :to="{path:'/about'}">about</router-link>||
     <router-link active-class="active" :to="{path:'/usercenter'}">userCenter</router-link>||
     <router-link active-class="active" :to="{path:'/chat'}">chat聊天室</router-link>
    <router-view/>
</template>

<script setup lang="ts">
import { ref } from "vue";
const msg = ref<string>("World");
</script>
<style>
.active{
  color:blue
}
</style>