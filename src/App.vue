<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <NGlobalStyle />
    <NMessageProvider placement="bottom">
      <component :is="layout">
        <RouterView />
      </component>
    </NMessageProvider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, NGlobalStyle, NMessageProvider } from 'naive-ui';
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { layouts } from './layouts';
import { useStyleStore } from './stores/style.store';
import { darkThemeOverrides, lightThemeOverrides } from './themes';

const route = useRoute();
const layout = computed(() => route?.meta?.layout ?? layouts.base);
const styleStore = useStyleStore();

const theme = computed(() => (styleStore.isDarkTheme ? darkTheme : null));
const themeOverrides = computed(() => (styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides));
</script>

<style>
@font-face {
  font-family: 'consola';
  src: url('@/assets/consola.ttf') format('truetype');
}
body {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
svg:focus {
  outline: none;
}
</style>
