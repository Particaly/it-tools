<template>
  <div class="pdf-marker flex-col h-full w-full">
    <div class="tool-bar w-full flex gap-10px p-10px bg-card">
      <n-icon class="press-button" size="22" @click="state.prevPage">
        <n-tooltip>
          <template #trigger>
            <NavigateBeforeRound></NavigateBeforeRound>
          </template>
          <div>上一页</div>
        </n-tooltip>
      </n-icon>
      <n-icon class="press-button" size="22" @click="state.nextPage">
        <n-tooltip>
          <template #trigger>
            <NavigateNextRound></NavigateNextRound>
          </template>
          <div>下一页</div>
        </n-tooltip>
      </n-icon>
      <n-icon class="press-button" size="22" @click="() => state.addNode()">
        <n-tooltip>
          <template #trigger>
            <AddFilled></AddFilled>
          </template>
          <div>添加覆盖物</div>
        </n-tooltip>
      </n-icon>
      <n-icon class="press-button" size="22">
        <label class="cursor-pointer" for="file">
          <n-tooltip>
            <template #trigger>
              <CloudDownloadOutlined></CloudDownloadOutlined>
            </template>
            <div>导入</div>
          </n-tooltip>
        </label>
      </n-icon>
      <n-icon class="press-button" size="22" @click="() => state.download()">
        <n-tooltip>
          <template #trigger>
            <CloudUploadOutlined></CloudUploadOutlined>
          </template>
          <div>导出</div>
        </n-tooltip>
      </n-icon>
    </div>

    <div ref="container" class="relative flex-1">
      <canvas id="canvas" :width="state.size.width" :height="state.size.height" class="wh-full!"></canvas>

      <div ref="el" class="absolute-lt w-240px bg-card shadow flex-col h-full overflow-auto">
        <div v-for="(t, i) in nodes.renderList" :key="i" class="list-it" :class="{ selected: nodes.current?.source === t }" @click="state.selectNode(t)">
          {{ t.title }}
        </div>
      </div>

      <div class="absolute-tr w-240px bg-card shadow p-12px flex-col overflow-auto h-full">
        <n-form>
          <n-form-item label="标题">
            <n-input v-model:value="nodes.model.title" placeholder="标题" @input="state.whenUpdateInfo"></n-input>
          </n-form-item>
          <n-form-item label="位置">
            <div class="flex gap-8px">
              <n-input v-model:value="nodes.model.x" placeholder="x" @input="state.whenUpdateInfo">
                <template #suffix>x</template>
              </n-input>
              <n-input v-model:value="nodes.model.y" placeholder="y" @input="state.whenUpdateInfo">
                <template #suffix>px</template>
              </n-input>
            </div>
          </n-form-item>
          <n-form-item label="类型">
            <n-select
              v-model:value="nodes.model.type"
              :options="nodes.options.type"
              placeholder="请选择插入类型"
              @update:value="state.whenUpdateInfo"
            ></n-select>
          </n-form-item>
          <n-form-item label="用例">
            <n-input v-model:value="nodes.model.value" placeholder="请输入用例" @input="state.whenUpdateInfo"></n-input>
          </n-form-item>
          <n-form-item v-if="nodes.model.type === 'text'" label="强制渲染">
            <n-input v-model:value="nodes.model.force" placeholder="强制渲染此处填入的值" @input="state.whenUpdateInfo"></n-input>
          </n-form-item>
          <n-form-item label="数据源">
            <n-input v-model:value="nodes.model.key" placeholder="key" @input="state.whenUpdateInfo"></n-input>
          </n-form-item>
          <n-form-item v-if="nodes.model.type === 'text'" label="是否格式化">
            <n-select
              v-model:value="nodes.model.format"
              :options="nodes.options.format"
              placeholder="是否格式化"
              @update:value="state.whenUpdateInfo"
            ></n-select>
          </n-form-item>
          <n-form-item v-if="nodes.model.type === 'text'" label="截断内容">
            <div class="flex gap-8px">
              <n-input v-model:value="nodes.model.spliceFrom" placeholder="起始下标" @input="state.whenUpdateInfo"></n-input>
              <n-input v-model:value="nodes.model.spliceTo" placeholder="终止下标" @input="state.whenUpdateInfo"></n-input>
            </div>
          </n-form-item>
          <n-form-item v-if="nodes.model.type === 'text'" label="显示条件">
            <div class="flex gap-8px items-center">
              <n-select v-model:value="nodes.model.compare" :options="nodes.options.compare" @update:value="state.whenUpdateInfo"></n-select>
              <n-input v-model:value="nodes.model.equals" placeholder="比较的值" @input="state.whenUpdateInfo"></n-input>
            </div>
          </n-form-item>
          <n-form-item v-if="nodes.model.type === 'text'" label="字体大小" @input="state.whenUpdateInfo">
            <n-input v-model:value="nodes.model.size" placeholder="字体大小"><template #suffix>px</template></n-input>
          </n-form-item>
          <n-form-item v-if="nodes.model.type === 'image'" label="图片大小">
            <n-input v-model:value="nodes.model.width" placeholder="宽" @input="state.whenUpdateInfo"><template #suffix>px</template></n-input>
            <n-input v-model:value="nodes.model.height" placeholder="高" @input="state.whenUpdateInfo"><template #suffix>px</template></n-input>
          </n-form-item>
          <n-form-item v-if="nodes.model.type === 'text'" label="文本间距" @input="state.whenUpdateInfo">
            <n-input v-model:value="nodes.model.gap" placeholder="文本间距"><template #suffix>px</template></n-input>
          </n-form-item>
        </n-form>
      </div>
    </div>

    <input id="file" type="file" style="display: none" @change="state.loadJSON" />
  </div>
</template>

<script setup lang="ts">
import * as utils from '@/utils';
import { AddFilled, CloudDownloadOutlined, CloudUploadOutlined, NavigateBeforeRound, NavigateNextRound } from '@vicons/material';
import { useElementSize } from '@vueuse/core';
import { fabric } from 'fabric';
import { useThemeVars } from 'naive-ui';
import { useDraggable } from 'vue-draggable-plus';
import * as fb from './use-fabric';
import { usePDF } from './use-pdf';

console.log(fabric);

const theme = useThemeVars();

const container = ref();
const pdf = usePDF();
const el = ref();

const nodes = reactive<any>({
  current: null,
  list: [],
  objects: [],
  renderList: computed(() => {
    return nodes.list.filter(w => Number(w.page) === state.page);
  }),
  model: {
    x: '0',
    y: '0',
    size: '16',
    gap: '8',
    type: 'text',
    format: '',
    force: '',
    width: '100',
    height: '100',
    value: '',
    key: '',
    title: '',
    page: 0,
    spliceFrom: '0',
    spliceTo: '0',
    compare: '',
    equals: '',
  },
  options: {
    type: [
      {
        label: '文本',
        value: 'text',
      },
      {
        label: '图片',
        value: 'image',
      },
    ],
    format: [
      {
        label: '不进行格式化',
        value: '',
      },
      {
        label: '日期：YYYY-MM-DD HH:mm:ss',
        value: 'YYYY-MM-DD HH:mm:ss',
      },
    ],
    compare: [
      {
        label: '无条件渲染',
        value: '',
      },
      {
        label: '不相等',
        value: 'not-equal',
      },
      {
        label: '相等',
        value: 'equal',
      },
      {
        label: '包含',
        value: 'contains',
      },
      {
        label: '不包含',
        value: 'not-contains',
      },
    ],
  },
});

useDraggable(el, nodes.list, {
  animation: 150,
  onUpdate({ oldIndex, newIndex }) {
    const iox = nodes.list.findIndex(w => w === nodes.renderList[oldIndex!]);
    const inx = nodes.list.findIndex(w => w === nodes.renderList[newIndex!]);
    const tox = nodes.list[iox];
    nodes.list.splice(iox, 1);
    nodes.list.splice(inx, 0, tox);
  },
});

const state = reactive<any>({
  page: 12,
  scale: 4,
  size: useElementSize(container),
  async renderPage() {
    const data = await pdf.getPage(state.page, state.scale);
    state.canvas.remove(state.image);
    state.image = new fabric.Image(data.img, fb.BanAllMovement);
    state.canvas.add(state.image);
    nodes.objects.forEach(w => {
      state.canvas.remove(w);
    });
    nodes.objects = [];

    nodes.list.forEach(w => {
      if (w.page === state.page) {
        state.createNode(w);
      }
    });
  },
  async nextPage() {
    state.page = Math.min(state.page + 1, pdf.pages);
    state.renderPage();
  },
  async prevPage() {
    state.page = Math.max(state.page - 1, 1);
    state.renderPage();
  },
  async init() {
    await pdf.loadPDF('http://yl.dev.ydys.cc/static/app/xx.pdf');
    const data = await pdf.getPage(state.page, state.scale);
    state.width = data.width;
    state.height = data.height;
    state.canvas = new fabric.Canvas('canvas');
    state.image = new fabric.Image(data.img, fb.BanAllMovement);
    state.canvas.add(state.image);
    fb.useFabricViewport(state.canvas, {
      whenDelete: state.whenDelete,
      whenSelect: state.whenSelect,
      whenUpdate: state.whenUpdateInfo,
    });
  },

  whenDelete() {
    if (nodes.current) {
      nodes.list.splice(nodes.list.indexOf(nodes.current.source), 1);
      nodes.objects.splice(nodes.objects.indexOf(nodes.current), 1);
      state.canvas.remove(nodes.current);
      nodes.current = null;
    }
  },
  whenSelect(obj) {
    nodes.current = obj;
    obj.source.x = String(obj.left);
    obj.source.y = String(obj.top);
    Object.assign(nodes.model, obj.source);
  },
  addNode(x, y) {
    const option = {
      ...nodes.model,
      x: utils.isEmpty(x) ? nodes.model.x : x,
      y: utils.isEmpty(y) ? nodes.model.y : y,
      page: state.page,
    };
    state.createNode(option);
  },
  getValue(source) {
    const needSlice = Number(source.spliceFrom) || Number(source.spliceTo);
    let value = needSlice ? source.value.slice(source.spliceFrom, source.spliceTo) : source.value;

    switch (source.compare) {
      case '': break;
      case 'not-equal':
        if (value === source.equals) {
          return '';
        }
        break;
      case 'equal':
        if (value !== source.equals) {
          return '';
        }
        break;
      case 'contains':
        if (!value.includes(source.equals)) {
          return '';
        }
        break;
      case 'not-contains':
        if (value.includes(source.equals)) {
          return '';
        }
        break;
      default: break;
    }

    value = source.force || value;

    return value;
  },
  createNode(source) {
    const center = fb.getCenter(state.canvas);
    source.x = source.x || center.x;
    source.y = source.y || center.y;
    source.title = source.title || '默认文字';
    source.value = source.value || '默认文字';
    source.format = source.format || '';
    source.spliceFrom = source.spliceFrom || '0';
    source.spliceTo = source.spliceTo || '0';
    source.compare = source.compare || '';
    source.equals = source.equals || '';

    const value = state.getValue(source);

    let node: any;
    if (source.type === 'text') {
      node = new fabric.Textbox(value, {
        left: Number(source.x),
        top: Number(source.y),
        fontSize: source.size,
        fill: '#000000',
        textAlign: 'left',
        originX: 'left',
        originY: 'bottom',
        charSpacing: source.gap,
        source,
      });
    } else {
      const url = fb.generatePlaceholderImage(source.width, source.height);
      const img = new Image();
      img.src = url;
      node = new fabric.Image(img, {
        left: Number(source.x),
        top: Number(source.y),
        width: Number(source.width),
        height: Number(source.height),
        source,
      });
    }

    node.source = source;
    !nodes.list.includes(source) && nodes.list.push(source);
    nodes.objects.push(node);

    state.canvas.add(node);
    state.canvas.setActiveObject(node);
    // node.
  },
  selectNode(node) {
    nodes.current = nodes.objects.find(o => o.source === node);
    state.canvas.setActiveObject(nodes.current);
    state.whenSelect(nodes.current);
    state.canvas.renderAll();
  },
  whenUpdateInfo() {
    if (!nodes.current) return;
    const source = nodes.current.source;
    Object.assign(nodes.current.source, nodes.model);

    if (nodes.current.type === 'textbox') {
      const value = state.getValue(source);
      nodes.current.setOptions({
        text: value,
        left: Number(nodes.model.x),
        top: Number(nodes.model.y),
        fontSize: Number(nodes.model.size),
        charSpacing: Number(nodes.model.gap),
      });
    } else {
      const img = fb.generatePlaceholderImage(nodes.model.width, nodes.model.height);

      nodes.current.setOptions({
        left: Number(nodes.model.x),
        top: Number(nodes.model.y),
        width: Number(nodes.model.width),
        height: Number(nodes.model.height),
      });
      nodes.current.setSrc(img, () => state.canvas.renderAll());
    }

    state.canvas.renderAll();
  },

  loadJSON(ev) {
    const reader = new FileReader();
    reader.onload = e => {
      const json = JSON.parse(e.target!.result as string);

      nodes.list = json;

      state.renderPage(state.page);
    };
    reader.readAsText(ev.target.files[0]);
  },
  download() {
    const json = JSON.stringify(nodes.list);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  },
});

onMounted(() => {
  state.init();
});
</script>

<style scoped lang="scss">
.pdf-marker {
  .press-button {
    @apply: flex-center shadow;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    box-shadow: 0px 0px 40px -15px var(--n-text-color);
    cursor: pointer;
    user-select: none;
    &:hover {
      border: 1px solid #18a058;
      color: #18a058;
      background: rgba(#18a058, 0.12);
    }
  }
  ::v-deep(.canvas-container) {
    width: 100% !important;
    height: 100% !important;
  }
  .list-it {
    padding: 8px 16px;
    cursor: pointer;
    &:hover,
    &.selected {
      color: #18a058;
      background: rgba(#18a058, 0.12);
    }
  }

  .bg-card {
    background: v-bind('theme.cardColor')
  }
}
</style>
