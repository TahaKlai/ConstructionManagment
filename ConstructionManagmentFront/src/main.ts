import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

try {
  const adopted = (document as unknown as { adoptedStyleSheets?: unknown }).adoptedStyleSheets as
    | Array<unknown>
    | { length: number } & Record<string, unknown>
    | undefined;

  if (adopted && typeof (adopted as Array<unknown>).filter !== 'function') {
    (document as unknown as { adoptedStyleSheets?: Array<unknown> }).adoptedStyleSheets = Array.from(adopted as ArrayLike<unknown>);
  }
} catch (error) {
  console.debug('Unable to normalize adoptedStyleSheets; continuing without polyfill.', error);
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
