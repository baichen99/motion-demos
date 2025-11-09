export type LocaleKey = 'zh' | 'en'

export interface Example {
  id: string
  title: string
  description: string
  category: string
  component: React.ComponentType
  titles?: Partial<Record<LocaleKey, string>>
  descriptions?: Partial<Record<LocaleKey, string>>
  sourceUrl?: string
}

export interface CategoryConfig {
  labels: Record<LocaleKey, string>
  order?: number
}

