import { Injectable } from '@angular/core';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Carga Google Analytics 4 (gtag) y Meta Pixel solo si hay IDs en environment.
 * En rutas SPA, llamar trackPageView() en cada NavigationEnd.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private gaId: string | null = null;
  private pixelId: string | null = null;
  private scriptsInjected = false;

  /**
   * @param googleAnalyticsMeasurementId ID GA4 (G-XXXXXXXX)
   * @param metaPixelId ID numérico del píxel de Meta
   */
  init(googleAnalyticsMeasurementId?: string | null, metaPixelId?: string | null): void {
    if (this.scriptsInjected || typeof document === 'undefined') {
      return;
    }

    const ga = googleAnalyticsMeasurementId?.trim() || '';
    const px = metaPixelId?.trim() || '';
    const pixelDigits = px.replace(/\D/g, '');
    const validGa = !!ga && /^G-[A-Z0-9]+$/i.test(ga);
    const validPx = !!pixelDigits && /^\d{10,20}$/.test(pixelDigits);

    if (!validGa && !validPx) {
      if (ga || px) {
        console.warn('[Analytics] No se cargaron scripts: revisa googleAnalyticsMeasurementId (G-…) y metaPixelId (numérico).');
      }
      return;
    }

    this.scriptsInjected = true;

    if (validGa) {
      this.gaId = ga;
      this.injectGoogleAnalytics(ga);
    }

    if (validPx) {
      this.pixelId = pixelDigits;
      this.injectMetaPixel(pixelDigits);
    }
  }

  /** Vista de página en navegación interna (Angular Router). */
  trackPageView(path: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.gaId && typeof window.gtag === 'function') {
      window.gtag('config', this.gaId, {
        page_path: path
      });
    }

    if (this.pixelId && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }

  private injectGoogleAnalytics(measurementId: string): void {
    const id = measurementId.trim();
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(gtagScript);

    const inline = document.createElement('script');
    // send_page_view: false — las vistas las envía el Router (evita duplicados en SPA)
    inline.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}', { send_page_view: false });
    `;
    document.head.appendChild(inline);
  }

  private injectMetaPixel(pixelId: string): void {
    const inline = document.createElement('script');
    inline.textContent = `
      !function(f,b,e,v,n,t,s){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
    `;
    document.head.appendChild(inline);
  }
}
