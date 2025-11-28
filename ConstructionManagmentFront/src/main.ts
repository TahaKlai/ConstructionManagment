import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

try {
  const doc = document as unknown as {
    adoptedStyleSheets?: ArrayLike<unknown> & Partial<Array<unknown>>;
  };

  const sheets = doc.adoptedStyleSheets;
  if (sheets && typeof sheets.length === 'number' && typeof (sheets as Array<unknown>).filter !== 'function') {
    const backingStore = Array.from(sheets);

    Object.defineProperty(doc, 'adoptedStyleSheets', {
      configurable: true,
      enumerable: true,
      get: () => backingStore,
      set: (value: ArrayLike<unknown>) => {
        backingStore.length = 0;
        backingStore.push(...Array.from(value));
      }
    });
  }
} catch (error) {
  console.debug('Unable to normalize adoptedStyleSheets; continuing without polyfill.', error);
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
