import type { Example, CategoryConfig, LocaleKey } from '../types'
import Plaza from './Plaza'
import StickerWall from './StickerWall'

export const examples: Example[] = [
  {
    id: 'sticker-wall',
    title: 'Sticker Wall',
    description: 'Drag & drop sticker wall with highlight sweep',
    category: 'interactions',
    component: StickerWall,
    titles: {
      zh: '贴纸墙',
      en: 'Sticker Wall',
    },
    descriptions: {
      zh: '可以拖拽贴纸，自由组合出自己的贴纸墙布局。',
      en: 'Drag stickers freely to compose your own sticker wall layout.',
    },
    sourceUrl: 'https://github.com/baichen99/motion-demos/blob/main/src/examples/StickerWall.tsx',
  },
  {
    id: 'plaza',
    title: 'Plaza',
    description: 'Pan-able plaza canvas with spiral layout',
    category: 'interactions',
    component: Plaza,
    titles: {
      zh: 'Plaza 画布',
      en: 'Plaza',
    },
    descriptions: {
      zh: '一个可平移的大画布，卡片围绕中心展开并根据距离自动缩放。',
      en: 'A pannable canvas where cards radiate from the center and scale with their distance.',
    },
    sourceUrl: 'https://github.com/baichen99/motion-demos/blob/main/src/examples/Plaza.tsx',
  },
]

export const categoryConfig: Record<string, CategoryConfig> = {
  interactions: {
    labels: {
      zh: '交互体验',
      en: 'Interactive Experiments',
    },
    order: 1,
  },
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

export const getCategoryLabel = (category: string, locale: LocaleKey): string => {
  const labels = categoryConfig[category]?.labels
  if (labels && labels[locale]) {
    return labels[locale]
  }
  return category
}

