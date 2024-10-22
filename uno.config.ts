import presetUno from '@unocss/preset-uno';
import transformerDirectives from '@unocss/transformer-directives';
import { defineConfig } from '@unocss/vite';

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist', '.git', '.husky', '.vscode', 'public', 'build', 'mock', './stats.html'],
    },
  },
  presets: [presetUno({ dark: 'class' })],
  transformers: [transformerDirectives()],
  rules: [
    [
      /^wh-(\d+)(.*)?$/,
      (match, raw) => {
        if (!match.input) { return; }
        const isImportant = raw.rawSelector.endsWith('!');
        const im = isImportant ? ' !important' : '';
        const imn = isImportant ? '\\!' : '';
        const t1 = match.input.split('.').join('\\.');
        const t2 = t1.replace('%', '\\%');
        match[2] = match[2] || 'px';
        return `.${t2}${imn} {
          width: ${match[1]}${match[2].replace('per', '%')}${im};
          height: ${match[1]}${match[2].replace('per', '%')}${im};
        }`;
      },
    ],
    [
      /^translate-(x|y)-(-?\d+)(.*)?$/,
      (match) => {
        if (!match.input) { return; }
        match[3] = match[3] || 'px';
        match[3] = match[3].replace('per', '%');
        return `.${match.input} {
          transform: translate${match[1].toUpperCase()}(${match[2]}${match[3]});
        }`;
      },
    ],
    [
      /^font-size-(\d+)(.*)?$/,
      (match) => {
        if (!match.input) { return; }
        match[2] = match[2] || 'rem';
        if (match[2] === '%') { return; }
        return `.${match.input} {
          font-size: ${match[1]}${match[2]};
        }`;
      },
    ],
    [
      /^grid-area-(.*)?$/,
      (match) => {
        if (!match.input) { return; }
        return `.${match.input} {
          grid-area: ${match[1]};
        }`;
      },
    ],
    ['ellipsis', { 'overflow': 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }],
    ['content-box', { 'box-sizing': 'content-box' }],
  ],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex-center flex-col',
    'flex-x-center': 'flex justify-center',
    'flex-y-center': 'flex items-center',
    'flex-2': 'flex-grow-2 flex-shrink-2 flex-basis-0',
    'i-flex-center': 'inline-flex justify-center items-center',
    'i-flex-x-center': 'inline-flex justify-center',
    'i-flex-y-center': 'inline-flex items-center',
    'flex-col': 'flex flex-col',
    'flex-col-stretch': 'flex-col items-stretch',
    'i-flex-col': 'inline-flex flex-col',
    'i-flex-col-stretch': 'i-flex-col items-stretch',
    'flex-1-hidden': 'flex-1 overflow-hidden',
    'absolute-lt': 'absolute left-0 top-0',
    'absolute-lb': 'absolute left-0 bottom-0',
    'absolute-rt': 'absolute right-0 top-0',
    'absolute-rb': 'absolute right-0 bottom-0',
    'absolute-tl': 'absolute-lt',
    'absolute-tr': 'absolute-rt',
    'absolute-bl': 'absolute-lb',
    'absolute-br': 'absolute-rb',
    'absolute-center': 'absolute-lt flex-center wh-full',
    'fixed-lt': 'fixed left-0 top-0',
    'fixed-lb': 'fixed left-0 bottom-0',
    'fixed-rt': 'fixed right-0 top-0',
    'fixed-rb': 'fixed right-0 bottom-0',
    'fixed-tl': 'fixed-lt',
    'fixed-tr': 'fixed-rt',
    'fixed-bl': 'fixed-lb',
    'fixed-br': 'fixed-rb',
    'fixed-center': 'fixed-lt flex-center wh-full',
    'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
    'ellipsis-text': 'nowrap-hidden text-ellipsis',
    'transition-base': 'transition-all duration-300 ease-in-out',
  },
  theme: {
    colors: {
      bgc: 'var(--n-color)',
      tc: 'var(--n-text-color)',
      gray: '#ccc',
      primary: 'rgb(var(--primary-color))',
      primary_hover: 'rgb(var(--primary-color-hover))',
      primary_pressed: 'rgb(var(--primary-color-pressed))',
      primary_active: 'rgba(var(--primary-color-active),0.1)',
      primary_1: 'rgb(var(--primary-color1))',
      primary_2: 'rgb(var(--primary-color2))',
      primary_3: 'rgb(var(--primary-color3))',
      primary_4: 'rgb(var(--primary-color4))',
      primary_5: 'rgb(var(--primary-color5))',
      primary_6: 'rgb(var(--primary-color6))',
      primary_7: 'rgb(var(--primary-color7))',
      primary_8: 'rgb(var(--primary-color8))',
      primary_9: 'rgb(var(--primary-color9))',
      info: 'rgb(var(--info-color))',
      info_hover: 'rgb(var(--info-color-hover))',
      info_pressed: 'rgb(var(--info-color-pressed))',
      info_active: 'rgb(var(--info-color-active),0.1)',
      success: 'rgb(var(--success-color))',
      success_hover: 'rgb(var(--success-color-hover))',
      success_pressed: 'rgb(var(--success-color-pressed))',
      success_active: 'rgb(var(--success-color-active),0.1)',
      warning: 'rgb(var(--warning-color))',
      warning_hover: 'rgb(var(--warning-color-hover))',
      warning_pressed: 'rgb(var(--warning-color-pressed))',
      warning_active: 'rgb(var(--warning-color-active),0.1)',
      error: 'rgb(var(--error-color))',
      error_hover: 'rgb(var(--error-color-hover))',
      error_pressed: 'rgb(var(--error-color-pressed))',
      error_active: 'rgb(var(--error-color-active),0.1)',
      dark: '#18181c',
    },
  },
});