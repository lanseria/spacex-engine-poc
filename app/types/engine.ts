export type EngineVariant = 'sealevel' | 'vacuum'

export interface EngineLayoutDef {
  id: EngineVariant
  name: string
  description?: string
}

export const ENGINE_LAYOUTS: EngineLayoutDef[] = [
  { id: 'sealevel', name: '9机布局 (Merlin 1D)' },
  { id: 'vacuum', name: '二级布局 (Vacuum)' },
]
