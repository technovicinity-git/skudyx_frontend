const DEFAULT_PREVIEW_SIZE = 256; // px

export const resizeImageToDataUrl = (
  file,
  maxEdge = DEFAULT_PREVIEW_SIZE,
  quality = 0.85
) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      return reject(new Error("File must be an image"));
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result;
    };
    reader.onerror = (err) => reject(err);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      const ratio = img.width / img.height;
      let w = img.width;
      let h = img.height;

      if (Math.max(w, h) > maxEdge) {
        if (w > h) {
          w = maxEdge;
          h = Math.round(maxEdge / ratio);
        } else {
          h = maxEdge;
          w = Math.round(maxEdge * ratio);
        }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(dataUrl);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    reader.readAsDataURL(file);
  });
};
