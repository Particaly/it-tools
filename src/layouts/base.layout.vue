<template>
  <MenuLayout class="menu-layout" :class="{ isSmallScreen: styleStore.isSmallScreen }">
    <template #sider>
      <RouterLink to="/" class="hero-wrapper">
        <HeroGradient class="gradient" />
        <div class="text-wrapper">
          <div class="title">{{ name }}</div>
          <div class="divider" />
          <div class="subtitle">工具包</div>
        </div>
      </RouterLink>

      <div class="sider-content">
        <n-space v-if="styleStore.isSmallScreen" justify="center">
          <NavbarButtons />
        </n-space>

        <n-menu class="menu" :value="String(route.name)" :collapsed-width="64" :collapsed-icon-size="22" :options="menuOptions" :indent="20" />

        <div class="footer">
          <div>
            {{ name }}

            <n-button text> v{{ version }} </n-button>

            <template v-if="commitSha && commitSha.length > 0">
              -
              <n-button
                text
                tag="a"
                target="_blank"
                rel="noopener"
                type="primary"
                depth="3"
                :href="`https://github.com/CorentinTh/it-tools/tree/${commitSha}`"
              >
                {{ commitSha }}
              </n-button>
            </template>
          </div>
          <div>
            © {{ new Date().getFullYear() }}
            <n-button text> ydys.cc </n-button>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <div class="navigation">
        <n-button
          :size="styleStore.isSmallScreen ? 'medium' : 'large'"
          circle
          quaternary
          aria-label="Toogle menu"
          @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
        >
          <NIcon size="25" :component="Menu2" />
        </n-button>

        <RouterLink to="/" #="{ navigate, href }" custom>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                tag="a"
                :href="href"
                :size="styleStore.isSmallScreen ? 'medium' : 'large'"
                circle
                quaternary
                aria-label="Home"
                @click="navigate"
              >
                <NIcon size="25" :component="Home2" />
              </n-button>
            </template>
            Home
          </n-tooltip>
        </RouterLink>

        <SearchBar />

        <n-tooltip v-if="false" trigger="hover">
          <template #trigger>
            <n-button type="primary" tag="a" href="https://github.com/sponsors/CorentinTh" rel="noopener" target="_blank">
              <NIcon v-if="!styleStore.isSmallScreen" :component="Heart" style="margin-right: 5px" />
              Sponsor
            </n-button>
          </template>
          ❤ Support IT Tools developement !
        </n-tooltip>

        <NavbarButtons v-if="!styleStore.isSmallScreen" />
      </div>
      <slot />
    </template>
  </MenuLayout>
</template>

<script lang="ts" setup>
import type { ITool } from '@/tools/tool';
import MenuIconItem from '@/components/MenuIconItem.vue';
import { config } from '@/config';
import { useStyleStore } from '@/stores/style.store';
import { toolsByCategory } from '@/tools';
import { Heart, Home2, Menu2 } from '@vicons/tabler';
import { type MenuGroupOption, NIcon, useThemeVars } from 'naive-ui';
import { h } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import HeroGradient from '../assets/hero-gradient.svg?component';
import MenuLayout from '../components/MenuLayout.vue';
import NavbarButtons from '../components/NavbarButtons.vue';
import SearchBar from '../components/SearchBar.vue';

const themeVars = useThemeVars();
const route = useRoute();
const styleStore = useStyleStore();
const version = config.app.version;
const name = config.app.name;
const commitSha = config.app.lastCommitSha.slice(0, 7);

const makeLabel = (tool: ITool) => () => h(RouterLink, { to: tool.path }, { default: () => tool.name });
const makeIcon = (tool: ITool) => () => h(MenuIconItem, { tool });

const menuOptions: MenuGroupOption[] = toolsByCategory.map(category => ({
  label: category.name,
  key: category.name,
  type: 'group',
  children: category.components.map(tool => ({
    label: makeLabel(tool),
    icon: makeIcon(tool),
    key: tool.name,
  })),
}));
</script>

<style lang="scss" scoped>
// ::v-deep(.n-layout-scroll-container) {
//     @percent: 4%;
//     @position: 25px;
//     @size: 50px;
//     @color: #eeeeee25;
//     background-image: radial-gradient(@color @percent, transparent @percent),
//         radial-gradient(@color @percent, transparent @percent);
//     background-position: 0 0, @position @position;
//     background-size: @size @size;
// }

.footer {
  text-align: center;
  color: #838587;
  margin-top: 20px;
  padding: 20px 0;
}

.sider-content {
  padding-top: 160px;
  padding-bottom: 200px;
}

.hero-wrapper {
  position: absolute;
  display: block;
  left: 0;
  width: 100%;
  z-index: 10;
  overflow: hidden;

  .gradient {
    margin-top: -65px;
  }

  .text-wrapper {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    top: 16px;
    color: #fff;

    .title {
      font-size: 25px;
      font-weight: 600;
    }

    .divider {
      width: 50px;
      height: 2px;
      border-radius: 4px;
      background-color: v-bind('themeVars.primaryColor');
      margin: 0 auto 5px;
    }

    .subtitle {
      font-size: 16px;
    }
  }
}

// ::v-deep(.n-menu-item-content-header) {
//   overflow: visible !important;
//   // overflow-x: hidden !important;
// }

.navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  & > *:not(:last-child) {
    margin-right: 5px;
  }

  .search-bar {
    // width: 100%;
    flex-grow: 1;
  }
}
</style>
