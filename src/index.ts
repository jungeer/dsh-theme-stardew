/**
 * Node half of dsh-theme-stardew. The theme is browser-only (a client plugin);
 * this entry exists so the Host Loader can resolve the package root as a Cordis
 * plugin. Empty `apply` is required — Cordis rejects modules without it.
 * Theme logic lives entirely in the browser client bundle (`./client`).
 */
export const THEME_PLUGIN_ID = 'dsh-theme-stardew'

/** Host loader entry: no host-side behavior. */
export function apply(): void {}
