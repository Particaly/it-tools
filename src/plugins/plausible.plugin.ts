import type { App } from 'vue';
import { config } from '@/config';
import Plausible from 'plausible-tracker';

export const plausible = {
  install: (app: App) => {
    const plausible = Plausible(config.plausible);
    plausible.enableAutoPageviews();

    app.config.globalProperties.$plausible = plausible;
  },
};
