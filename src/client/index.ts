/**
 * dsh-theme-stardew — standalone Stardew-themed client plugin.
 *
 * Self-contained browser feature:
 *  - injects a <style data-plugin="dsh-theme-stardew"> tag carrying the full
 *    Stardew theme (all images inlined), so no shell/base.css hooks are needed;
 *  - drives the `data-sd-stardew` document attribute that gates every rule;
 *  - registers a "星露谷/默认" toggle row into Settings → General.
 *
 * The theme is OFF by default here (it is an opt-in plugin, not a shipped
 * default like ui-theme's). Set localStorage['dsh.ui-stardew.enabled']='on'
 * or flip the toggle in Settings to enable.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { StardewRowInjected } from './StardewRow.tsx'
import { StardewRow } from './StardewRow.tsx'
import { createStardewRowStore } from './stardew-store.ts'
import { STARDEW_CSS } from './theme-css.ts'

/** Document attribute gating every rule in the theme stylesheet. */
export const STARDEW_ATTR = 'data-sd-stardew'

/** localStorage key persisting the toggle. */
export const STARDEW_STORAGE_KEY = 'dsh.ui-stardew.enabled'

/** Settings locale namespace of the toggle row. */
export const STARDEW_NS = 'settings.stardew'

/** Toggle row dictionaries (zh is the key-set source of truth). */
const stardewZh = {
  'stardew.title': '主题风格',
  'stardew.on': '星露谷',
  'stardew.off': '默认',
} satisfies Record<string, string>
const stardewEn = {
  'stardew.title': 'Theme style',
  'stardew.on': 'Stardew Valley',
  'stardew.off': 'Default',
} satisfies Record<typeof stardewZh>

const PLUGIN_ID = 'dsh-theme-stardew'

const applyStardew = (enabled: boolean): void => {
  const root = document.documentElement
  if (enabled) root.setAttribute(STARDEW_ATTR, '')
  else root.removeAttribute(STARDEW_ATTR)
}

const readStardewEnabled = (): boolean => {
  try { return localStorage.getItem(STARDEW_STORAGE_KEY) === 'on' } catch { return false }
}
const persistStardew = (enabled: boolean): void => {
  try { localStorage.setItem(STARDEW_STORAGE_KEY, enabled ? 'on' : 'off') } catch { /* storage unavailable */ }
}

/** Inject or refresh the theme <style>; always rewrite text so local rebuilds show up after reload. */
const injectTheme = (): void => {
  if (typeof document === 'undefined') return
  const key = `${PLUGIN_ID}/stardew.css`
  let tag = document.querySelector(`style[data-plugin-css="${key}"]`) as HTMLStyleElement | null
  if (tag === null) {
    tag = document.createElement('style')
    tag.dataset.plugin = PLUGIN_ID
    tag.dataset.pluginCss = key
    document.head.appendChild(tag)
  }
  tag.textContent = STARDEW_CSS
}

/** Plugin object handed to the cordis loader for the browser half. */
export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext & { locale: { register: (ns: string, dict: Record<string, unknown>) => void } }): void {
  // The theme sheet is gated on the attribute; inject it once at boot.
  injectTheme()

  ctx.effect(() => {
    return ctx.locale.register(STARDEW_NS, { zh: stardewZh, en: stardewEn })
  }, 'dsh-theme-stardew: toggle row dictionaries')

  // Default OFF for an opt-in plugin; apply whatever was persisted.
  applyStardew(readStardewEnabled())

  const store = createStardewRowStore()
  let bound: BoundActions<ReturnType<typeof createStardewRowStore>> | undefined
  let revision = 0
  const sync = (enabled: boolean): void => {
    revision += 1
    bound?.sync(enabled, revision)
  }
  const injected = (actions: BoundActions<ReturnType<typeof createStardewRowStore>>): StardewRowInjected => {
    bound = actions
    sync(readStardewEnabled())
    return {
      setEnabled: (enabled: boolean) => {
        applyStardew(enabled)
        persistStardew(enabled)
        sync(enabled)
      },
    }
  }

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'stardew-theme',
    order: 20,
    store,
    locale: STARDEW_NS,
    inject: injected,
  }, StardewRow))
}
