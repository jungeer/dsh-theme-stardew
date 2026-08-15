/**
 * Stardew theme toggle row slot store: mirrors the plugin's enabled state.
 * The plugin's apply-world handler is the only writer; the row component
 * reads via props.useStore.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'

/** Store state mirrored from the stardew toggle. */
export interface StardewRowState {
  /** Whether the Stardew Valley look is applied. */
  enabled: boolean
  /** Local change counter; -1 until first sync so revision 0 lands. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type StardewRowActions = {
  sync: (draft: StardewRowState, enabled: boolean, revision: number) => void
}

/**
 * Declares the stardew toggle state and write surface.
 * @returns the store handle.
 */
export function createStardewRowStore(): EngineStoreHandle<StardewRowState, StardewRowActions> {
  return defineStore({
    init: (): StardewRowState => ({ enabled: true, revision: -1 }),
    actions: {
      sync: (d, enabled: boolean, revision: number) => {
        if (revision <= d.revision) return
        d.enabled = enabled
        d.revision = revision
      },
    },
  })
}
