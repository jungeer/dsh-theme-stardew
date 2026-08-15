/**
 * Node half of dsh-theme-stardew. The theme is browser-only (a client plugin);
 * this entry exists so the package resolves a node-side `lib/index.js` for the
 * host Loader. No client/runtime imports — theme logic lives entirely in the
 * browser client bundle.
 */
export const THEME_PLUGIN_ID = 'dsh-theme-stardew'
