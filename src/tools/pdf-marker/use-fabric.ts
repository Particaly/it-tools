import * as utils from '@/utils';
import { fabric } from 'fabric';

export function useFabricViewport(canvas, opt?) {
  const state = {
    isSpacePressed: false,
    current: null,
  };
  window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      state.isSpacePressed = true;
    };
    if (e.code === 'Delete') {
      opt?.whenDelete?.();
    }
  });
  window.addEventListener('keyup', e => {
    if (e.code === 'Space') {
      state.isSpacePressed = false;
    };
  });
  canvas.on('mouse:wheel', option => {
    // 判断是放大还是缩小
    const delta = option.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    // 在鼠标位置缩放
    canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
    option.e.preventDefault();
    option.e.stopPropagation();
  });
  // 当鼠标按下时
  canvas.on('mouse:down', option => {
    const evt = option.e;
    if (state.isSpacePressed) {
      // 检查是否按下alt键
      canvas.isDragging = true;
      canvas.selection = false;
      canvas.lastPosX = evt.clientX;
      canvas.lastPosY = evt.clientY;
    }
  });

  // 当鼠标移动时
  canvas.on('mouse:move', option => {
    if (canvas.isDragging) {
      const e = option.e;
      const vpt = canvas.viewportTransform;
      vpt[4] += e.clientX - canvas.lastPosX;
      vpt[5] += e.clientY - canvas.lastPosY;
      canvas.requestRenderAll();
      canvas.lastPosX = e.clientX;
      canvas.lastPosY = e.clientY;
    }
  });

  // 当鼠标松开时
  canvas.on('mouse:up', option => {
    if (option.target) {
      state.current = option.target;
      opt?.whenSelect?.(option.target);
    }
    // 在鼠标松开时重新计算所有对象的交互
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.isDragging = false;
    canvas.selection = true;
  });

  canvas.on('mouse:down', async option => {
    if (state.isSpacePressed) return;
    const evt = option.e;
    if (option.target) {
      state.current = option.target;
      return opt?.whenSelect?.(option.target);
    }
    // 用transformPoint创建一个小方块
    // 注意 transformPoint 作用是将一个坐标从一个坐标系转换到另一个坐标系
    // 由于这里的将按下的视口坐标转换成 canvas画布坐标系，所以需要用 invertTransform 反转变换
    const x = fabric.util.transformPoint({ x: evt.offsetX, y: evt.offsetY }, fabric.util.invertTransform(canvas.viewportTransform)).x;
    const y = fabric.util.transformPoint({ x: evt.offsetX, y: evt.offsetY }, fabric.util.invertTransform(canvas.viewportTransform)).y;

    await opt?.whenClick?.(x, y);
    canvas.renderAll();
  });

  canvas.on('selection:created', ({ selected }) => {
    if (selected.length > 1) return;
    opt?.whenSelect?.(selected[0]);
    console.log('>>>选中', selected[0]);
  });
}

export const BanAllMovement = {
  evented: false,
  hasControls: false,
  lockMovementX: true,
  lockMovementY: true,
  lockRotation: true,
  lockScalingFlip: true,
  lockScalingX: true,
  lockScalingY: true,
  lockSkewingX: true,
  lockSkewingY: true,
};

export function getCenter(canvas) {
  const x = fabric.util.transformPoint({ x: canvas.width / 2, y: canvas.height / 2 }, fabric.util.invertTransform(canvas.viewportTransform)).x;
  const y = fabric.util.transformPoint({ x: canvas.width / 2, y: canvas.height / 2 }, fabric.util.invertTransform(canvas.viewportTransform)).y;
  return { x, y };
}

export function generatePlaceholderImage(w = 100, h = 100) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  Object.assign(canvas.style, { width: `${w}px`, height: `${h}px` });
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = utils.random.color();
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fff';
  ctx.font = '16px Arial';
  const text = `${w} x ${h}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2);
  return canvas.toDataURL();
}
