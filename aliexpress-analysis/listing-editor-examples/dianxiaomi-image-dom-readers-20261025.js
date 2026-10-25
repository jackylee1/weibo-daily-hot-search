/**
 * Observed Dianxiaomi editor DOM readers, 2026-10-25.
 * Read docs before use. Pass a browser tab already selected and verified by the user.
 * No navigation, save, publication, hidden application state, API endpoint, or deduplication.
 * Expand the product-image area's "查看更多" with normal UI first.
 * Selectors and 120px/78px were observed in this editor version; re-inspect before reuse.
 */
export async function readImageOccurrences(tab) {
  return await tab.playwright.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('.img-out.dxm-preview-img img'));
    const extract = (items) => items.map((im, i) => ({
      position: i + 1,
      source_url: im.currentSrc || im.src,
      width: im.naturalWidth,
      height: im.naturalHeight,
      table_context: im.closest('tr')?.innerText || ''
    }));
    return {
      product_images: extract(imgs.filter(im => im.closest('.img-out')?.getAttribute('style')?.includes('120px'))),
      // Every DOM occurrence retained here, including a second rendering in the SKU table.
      // Associate these records with actual SKU options rather than counting all as variants.
      sku_display_occurrences: extract(imgs.filter(im => im.closest('.img-out')?.getAttribute('style')?.includes('78px')))
    };
  });
}

/**
 * First click the visible PC description "源码" button using normal UI.
 * Re-inspect the current editor selector; do not assume ckeditor31 everywhere.
 * Invoke with the observed selector, then restore preview using normal UI.
 */
export async function readDescriptionSource(tab, observedEditorSelector) {
  return await tab.playwright.evaluate((selector) => {
    const el = document.querySelector(selector);
    if (!el || el.tagName !== 'TEXTAREA') throw new Error('Observed source textarea not found');
    const source = el.value;
    const parsed = new DOMParser().parseFromString(source, 'text/html');
    return {
      source,
      images: Array.from(parsed.querySelectorAll('img')).map((im, i) => ({
        position: i + 1,
        source_url: im.getAttribute('src'),
        alt: im.getAttribute('alt') || ''
      }))
    };
  }, observedEditorSelector);
}
