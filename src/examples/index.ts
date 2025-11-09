import type { Example, CategoryConfig } from '../types'
import Plaza from './Plaza'
import StickerWall from './StickerWall'

export const examples: Example[] = [
  {
    id: 'sticker-wall',
    title: 'Sticker Wall',
    description: 'Drag & drop sticker wall with highlight sweep',
    category: 'interactions',
    component: StickerWall,
  },
  {
    id: 'plaza',
    title: 'Plaza',
    description: 'Pan-able plaza canvas with spiral layout',
    category: 'experiments',
    component: Plaza,
  },
]

export const categoryConfig: Record<string, CategoryConfig> = {
  interactions: { label: '交互体验', order: 1 },
  experiments: { label: '画布实验', order: 2 },
}

export const examplesByCategory = examples.reduce((acc, example) => {
  if (!acc[example.category]) {
    acc[example.category] = []
  }
  acc[example.category].push(example)
  return acc
}, {} as Record<string, Example[]>)

export const getAllCategories = (): string[] => {
  const categories = Array.from(new Set(examples.map(ex => ex.category)))
  return categories.sort((a, b) => {
    const configA = categoryConfig[a]
    const configB = categoryConfig[b]
    if (configA?.order && configB?.order) {
      return configA.order - configB.order
    }
    if (configA?.order) return -1
    if (configB?.order) return 1
    return a.localeCompare(b)
  })
}

export const getCategoryLabel = (category: string): string => {
  return categoryConfig[category]?.label || category
}

