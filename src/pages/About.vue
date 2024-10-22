<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({ title: 'About - IT Tools' });
</script>

<template>
  <div class="about-page">
    <n-h1>关于</n-h1>
    <n-p>
      Fork 自 <a href="https://github.com/CorentinTh/it-tools">CorentinTh/it-tools</a> 的2.5.2版本项目，基于 MIT 协议，感谢原作者的付出。
    </n-p>
  </div>
</template>

<style scoped lang="less">
.about-page {
  max-width: 600px;
  margin: 50px auto;
  box-sizing: border-box;

  .n-h2 {
    margin-bottom: 0px;
  }

  .n-p {
    text-align: justify;
  }
}
</style>
