import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker';

export function usePDF() {
  const state = reactive<any>({
    ctx: null,
    pages: 0,
    loadPDF,
    getPage,
  });

  const canvas = document.createElement('canvas');
  state.ctx = canvas.getContext('2d');

  async function loadPDF(url) {
    state.pdf = pdfjsLib.getDocument(url).promise;

    const book = await state.pdf;
    if (!book) return;
    state.pages = book.numPages;
    console.log(`PDF loaded with ${book.numPages} pages`);
  }

  async function getPage(pageNo, scale) {
    const book = await state.pdf;
    const page = await book.getPage(pageNo);
    const viewport = page.getViewport({ scale });
    const context = state.ctx;
    canvas.setAttribute('width', viewport.width);
    canvas.setAttribute('height', viewport.height);
    Object.assign(canvas.style, { width: `${viewport.width}px`, height: `${viewport.height}px` });

    // 渲染页面到 Canvas
    const renderContext = {
      canvasContext: context,
      viewport,
    };

    await page.render(renderContext).promise;
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    return {
      width: viewport.width,
      height: viewport.height,
      url: canvas.toDataURL(),
      img,
    };
  }

  return state;
}
