"use client";

export const CERTIFICATE_WIDTH = 1123;
export const CERTIFICATE_HEIGHT = 794;
export const CERTIFICATE_BACKGROUND = "#FCFCF9";

const CAPTURE_TIMEOUT_MS = 45000;
const IMAGE_TIMEOUT_MS = 30000;

let fontCssCache: Promise<string | undefined> | null = null;

function withTimeout<T>(promise: Promise<T>, ms: number, what: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${what} timed out after ${ms}ms.`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function waitForFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return Promise.resolve();
  return document.fonts.ready.then(() => undefined);
}

function waitForImages(root: ParentNode): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  if (!images.length) return Promise.resolve();
  return withTimeout(
    Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          })
      )
    ).then(() => undefined),
    IMAGE_TIMEOUT_MS,
    "Waiting for certificate images"
  );
}

/**
 * Builds the CSS needed to re-embed the site's self-hosted web fonts (Geist)
 * as data URIs. html-to-image normally does this internally, but it re-fetches
 * every font on each call and can hang when a font request stalls. Computing it
 * once and caching the result makes downloads fast and deterministic.
 */
function getFontEmbedCss(source: Element): Promise<string | undefined> {
  if (!fontCssCache) {
    fontCssCache = (async () => {
      try {
        const { getFontEmbedCSS } = await import("html-to-image");
        const css = await withTimeout(
          getFontEmbedCSS(source as HTMLElement),
          20000,
          "Embedding certificate fonts"
        );
        return css || undefined;
      } catch {
        fontCssCache = null;
        return undefined;
      }
    })();
  }
  return fontCssCache;
}

/**
 * Captures the on-screen certificate preview (`#certificate-print-area`) and
 * produces an A4-landscape PDF that is visually identical to the browser
 * preview. It renders the live DOM (not the server pdf-lib engine) so fonts,
 * spacing and line breaks match the preview exactly.
 */
export async function downloadCertificatePdf(
  fileName: string,
  fallbackUrl?: string
): Promise<void> {
  try {
    await waitForFonts();

    const source = document.getElementById("certificate-print-area");
    if (!source) throw new Error("Certificate preview not found.");

    const scaleEl = source.querySelector<HTMLElement>(".certificate-print-scale");
    const target = scaleEl ?? source;

    // Clone at fixed full size with the responsive transform removed so the
    // capture is never influenced by the on-screen scale or breakpoints. The
    // clone itself must NOT be repositioned off-screen: html-to-image copies
    // computed styles into an SVG <foreignObject>, so `left:-100000px` on the
    // node would push the content out of the render. Instead the clone stays
    // in normal flow inside an off-screen wrapper.
    const clone = target.cloneNode(true) as HTMLElement;
    clone.id = "certificate-print-capture";
    clone.style.width = `${CERTIFICATE_WIDTH}px`;
    clone.style.height = `${CERTIFICATE_HEIGHT}px`;
    clone.style.transform = "none";
    clone.style.visibility = "visible";
    clone.style.opacity = "1";
    clone.style.pointerEvents = "none";

    const wrapper = document.createElement("div");
    wrapper.setAttribute("aria-hidden", "true");
    wrapper.style.cssText =
      `position:absolute;left:-100000px;top:0;width:${CERTIFICATE_WIDTH}px;` +
      `height:${CERTIFICATE_HEIGHT}px;pointer-events:none;`;
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      await waitForImages(clone);

      const [fontCss, { toCanvas }, { jsPDF }] = await Promise.all([
        getFontEmbedCss(source),
        import("html-to-image"),
        import("jspdf"),
      ]);

      const canvas = await withTimeout(
        toCanvas(clone, {
          width: CERTIFICATE_WIDTH,
          height: CERTIFICATE_HEIGHT,
          pixelRatio: 3,
          backgroundColor: CERTIFICATE_BACKGROUND,
          cacheBust: false,
          fontEmbedCSS: fontCss,
        }),
        CAPTURE_TIMEOUT_MS,
        "Rendering certificate to image"
      );

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
        compress: true,
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const image = canvas.toDataURL("image/png");
      pdf.addImage(image, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      pdf.save(fileName);
    } finally {
      document.body.removeChild(wrapper);
    }
  } catch (error) {
    console.error("[certificate-download] Client PDF generation failed:", error);
    if (fallbackUrl) {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      return;
    }
    throw error;
  }
}
