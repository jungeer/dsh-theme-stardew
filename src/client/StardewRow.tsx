/**
 * Stardew theme preference row registered into the General section item slot:
 * title + a two-option toggle (默认 / 星露谷). The state is the plugin-owned
 * enabled flag; the whole sheet (styles/stardew.css) is gated on the
 * `data-sd-stardew` attribute this row drives.
 */
import clsx from 'clsx'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { createStardewRowStore } from './stardew-store.ts'
import css from './StardewRow.module.css'

/** Injected business face: the toggle write (t rides the standard locale seat). */
export interface StardewRowInjected {
  /** Switch the stardew look on or off. */
  setEnabled: (enabled: boolean) => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type StardewRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createStardewRowStore>>
  & PropsLocale<'settings.stardew'> & StardewRowInjected

/**
 * Render the Stardew theme toggle row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export function StardewRow({ t, setEnabled, useStore }: StardewRowComponentProps) {
  const enabled = useStore(s => s.enabled)
  return (
    <div className={css.group}>
      <div className={css.title}>{t('stardew.title')}</div>
      <div className={css.optionRow}>
        <button
          type="button"
          className={clsx(css.option, enabled && css.selected)}
          aria-pressed={enabled}
          onClick={() => { setEnabled(true) }}
        >
          {t('stardew.on')}
        </button>
        <button
          type="button"
          className={clsx(css.option, !enabled && css.selected)}
          aria-pressed={!enabled}
          onClick={() => { setEnabled(false) }}
        >
          {t('stardew.off')}
        </button>
      </div>
    </div>
  )
}
