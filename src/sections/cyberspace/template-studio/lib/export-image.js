import { toPng, toJpeg } from 'html-to-image';

function downloadDataUrl(dataUrl, fileName) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
}

async function waitForFonts() {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
}

async function preloadImages(node) {
  const images = node.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    if (!img.src || img.src.startsWith('data:')) return Promise.resolve();
    return new Promise((resolve) => {
      const newImg = new Image();
      newImg.crossOrigin = 'anonymous';
      newImg.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = newImg.naturalWidth || img.width || 100;
          canvas.height = newImg.naturalHeight || img.height || 100;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(newImg, 0, 0);
          img.src = canvas.toDataURL('image/png');
        } catch {
          // Ignore CORS errors, keep original src
        }
        resolve();
      };
      newImg.onerror = () => resolve();
      newImg.src = img.src;
    });
  });
  await Promise.all(promises);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function buildFileName(template, format) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `template-${template.id}-${timestamp}.${format}`;
}

export async function exportTemplateNodeAsPng(node, template, options = {}) {
  await waitForFonts();
  await preloadImages(node);
  await delay(500);

  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: options.pixelRatio || 1,
    width: template.width,
    height: template.height,
    skipFonts: false,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });

  if (options.skipDownload) {
    return dataUrl;
  }

  downloadDataUrl(dataUrl, buildFileName(template, 'png'));
  return dataUrl;
}

export async function exportTemplateNodeAsJpeg(node, template, options = {}) {
  await waitForFonts();
  await preloadImages(node);
  await delay(500);

  const dataUrl = await toJpeg(node, {
    cacheBust: true,
    pixelRatio: 1,
    quality: options.quality || 0.95,
    width: template.width,
    height: template.height,
    backgroundColor: '#ffffff',
    skipFonts: false,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });

  if (options.skipDownload) {
    return dataUrl;
  }

  downloadDataUrl(dataUrl, buildFileName(template, 'jpg'));
  return dataUrl;
}
