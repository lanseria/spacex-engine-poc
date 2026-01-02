export type EngineVariant = 'falcon9b5-stage1' | 'falcon9b5-stage2' | 'cz7a-stage1' | 'cz7a-stage2'

export interface EngineLayoutDef {
  id: EngineVariant
  name: string
  description?: string
}

export const ENGINE_LAYOUTS: EngineLayoutDef[] = [
  { id: 'falcon9b5-stage1', name: 'Falcon 9 B5 Stage 1 (9机)' },
  { id: 'falcon9b5-stage2', name: 'Falcon 9 B5 Stage 2 (1机)' },
  { id: 'cz7a-stage1', name: 'CZ-7A Stage 1 (芯级+助推)' },
  { id: 'cz7a-stage2', name: 'CZ-7A Stage 2 (2机)' },
]
