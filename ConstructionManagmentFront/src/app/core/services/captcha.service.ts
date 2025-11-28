import { Injectable } from '@angular/core';

interface CaptchaWindow extends Window {
  grecaptcha?: {
    ready(callback: () => void): void;
    execute(siteKey: string, options: { action: string }): Promise<string>;
  };
}

@Injectable({ providedIn: 'root' })
export class CaptchaService {
  private readonly siteKey = (import.meta.env['NG_APP_RECAPTCHA_SITE_KEY'] ?? '').trim();
  private readonly enabled = (import.meta.env['NG_APP_RECAPTCHA_ENABLED'] ?? 'true').toLowerCase() !== 'false';
  private scriptLoadingPromise: Promise<void> | null = null;

  isEnabled(): boolean {
    return this.enabled && !!this.siteKey;
  }

  async execute(action: string): Promise<string> {
    if (!this.isEnabled()) {
      return 'captcha-disabled';
    }

    await this.ensureScriptLoaded();

    const captcha = (window as CaptchaWindow).grecaptcha;
    if (!captcha) {
      throw new Error('reCAPTCHA library is not available');
    }

    return new Promise<string>((resolve, reject) => {
      try {
        captcha.ready(() => {
          captcha.execute(this.siteKey, { action })
            .then(resolve)
            .catch(reject);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private ensureScriptLoaded(): Promise<void> {
    if (!this.isEnabled()) {
      return Promise.resolve();
    }

    if ((window as CaptchaWindow).grecaptcha) {
      return Promise.resolve();
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }
}
