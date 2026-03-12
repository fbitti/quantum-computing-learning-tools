/**
 * Google Analytics helper – loads gtag.js only after consent and
 * exposes lightweight wrappers for custom events & SPA page-views.
 */

const GA_ID = "G-4BL3623XBW";

let loaded = false;

/** Dynamically inject the gtag.js script (called once on consent). */
export function loadGA() {
  if (loaded) return;
  loaded = true;

  // gtag snippet
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID, { send_page_view: true });

  // expose for later calls
  window.gtag = gtag;
}

/* ------------------------------------------------------------------ */
/*  Event helpers                                                      */
/* ------------------------------------------------------------------ */

function send(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/** Fire a virtual page-view (for SPA route changes). */
export function trackPageView(path: string, title?: string) {
  if (typeof window.gtag === "function") {
    window.gtag("config", GA_ID, {
      page_path: path,
      page_title: title ?? document.title,
    });
  }
}

/** User opened a tool page. */
export function trackToolLaunch(tool: string) {
  send("tool_launch", { tool_name: tool });
}

/** Crank rotation completed on Bloch Sphere. */
export function trackRotation(axis: string, angle: number) {
  send("bloch_rotation", { axis, angle_rad: Math.round(angle * 1000) / 1000 });
}

/** Preset button clicked on Bloch Sphere. */
export function trackPresetClick(label: string) {
  send("bloch_preset", { preset_label: label });
}

/** Pauli Trainer answer checked. */
export function trackPauliCheck(correct: boolean) {
  send("pauli_check", { is_correct: correct });
}

/** Email signup submitted. */
export function trackSignup() {
  send("email_signup");
}

/** Scroll depth milestone reached (25 / 50 / 75 / 100). */
export function trackScrollDepth(percent: number) {
  send("scroll_depth", { percent });
}

/* ------------------------------------------------------------------ */
/*  TypeScript: augment Window                                         */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
