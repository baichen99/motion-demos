import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { LocaleKey } from '../types'

const translations = {
  zh: {
    'header.github': '在 GitHub 查看',
    'list.title': '动效示例',
    'tabs.all': '全部',
    'tabs.empty': '暂无示例',
    'viewer.placeholderTitle': '请选择一个示例',
    'viewer.placeholderDesc': '从左侧列表选择示例以查看动效演示。',
    'locale.zh': '中文',
    'locale.en': 'English',
    'viewer.viewSource': '查看源码',
  },
  en: {
    'header.github': 'View on GitHub',
    'list.title': 'Motion Demos',
    'tabs.all': 'All',
    'tabs.empty': 'No demos available',
    'viewer.placeholderTitle': 'Pick a demo to start',
    'viewer.placeholderDesc': 'Choose one of the demos on the left to preview its motion behavior.',
    'locale.zh': '中文',
    'locale.en': 'English',
    'viewer.viewSource': 'View Source',
  },
} as const

type TranslationKey = keyof (typeof translations)['zh']

type LocaleContextValue = {
  locale: LocaleKey
  setLocale: (locale: LocaleKey) => void
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<LocaleKey>('zh')

  const t = useCallback(
    (key: TranslationKey) => {
      const dictionary = translations[locale] ?? translations.zh
      return dictionary[key] ?? key
    },
    [locale],
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

export const availableLocales: LocaleKey[] = ['zh', 'en']
export const localeLabels: Record<LocaleKey, string> = {
  zh: translations.zh['locale.zh'],
  en: translations.en['locale.en'],
}

