export type EngineVariant = 'sealevel' | 'vacuum' | 'cz7a' | 'cz7a-stage2'

export interface EngineLayoutDef {
  id: EngineVariant
  name: string
  description?: string
}

export const ENGINE_LAYOUTS: EngineLayoutDef[] = [
  { id: 'sealevel', name: '9机布局 (猎鹰9号Stage 1)' },
  { id: 'vacuum', name: '1机布局 (猎鹰9号Stage 2)' },
  { id: 'cz7a', name: 'CZ-7A (芯一级 + 4助推)' },
  { id: 'cz7a-stage2', name: 'CZ-7A (二级 2机)' },
]
