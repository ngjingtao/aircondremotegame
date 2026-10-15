/* ═══════════════════════════════════════════
   shared/store.js — namespaced global + safe storage
   ═══════════════════════════════════════════ */
window.ARG = window.ARG || {};

/* some WebViews / file:// pages block localStorage */
ARG.store = (function () {
  const mem = {};
  return {
    get(k) {
      try { const v = localStorage.getItem(k); return v === undefined || v === null ? (mem[k] ?? null) : v; }
      catch (e) { return mem[k] ?? null; }
    },
    set(k, v) {
      mem[k] = String(v);
      try { localStorage.setItem(k, String(v)); } catch (e) { /* ignore */ }
    }
  };
})();
