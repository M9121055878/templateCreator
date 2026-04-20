import { toPng, toJpeg } from 'html-to-image';

function downloadDataUrl(dataUrl, fileName) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
}

function buildFileName(template, format) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `template-${template.id}-${timestamp}.${format}`;
}

export async function exportTemplateNodeAsPng(node, template) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 1,
    canvasWidth: template.width,
    canvasHeight: template.height,
  });

  downloadDataUrl(dataUrl, buildFileName(template, 'png'));
}

export async function exportTemplateNodeAsJpeg(node, template) {
  const dataUrl = await toJpeg(node, {
    cacheBust: true,
    pixelRatio: 1,
    quality: 0.95,
    canvasWidth: template.width,
    canvasHeight: template.height,
  });

  downloadDataUrl(dataUrl, buildFileName(template, 'jpg'));
}
