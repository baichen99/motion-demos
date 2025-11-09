import { useMemo, useState } from 'react'
import type { Example } from '../types'
import Tabs from './Tabs'
import { examplesByCategory, getAllCategories, getCategoryLabel } from '../examples'
import { useLocale } from '../i18n/LocaleContext'

interface ExampleListProps {
  examples: Example[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function ExampleList({ examples, selectedId, onSelect }: ExampleListProps) {
  const { t, locale } = useLocale()
  const categories = getAllCategories()
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const currentExamples = useMemo(() => {
    if (activeCategory === 'all') {
      return examples
    }
    return examplesByCategory[activeCategory] || []
  }, [activeCategory, examples])

  const tabs = useMemo(() => {
    return [
      { id: 'all', label: t('tabs.all') },
      ...categories.map(cat => ({
        id: cat,
        label: getCategoryLabel(cat, locale),
      })),
    ]
  }, [categories, locale, t])

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-200 bg-white/90 pt-16 backdrop-blur">
      <div className="px-6">
        <h1 className="text-2xl font-semibold text-slate-900">{t('list.title')}</h1>
      </div>

      <div className="mt-6 px-4">
        <Tabs
          tabs={tabs}
          activeTab={activeCategory === 'all' ? 'all' : activeCategory}
          onTabChange={tabId => {
            setActiveCategory(tabId === 'all' ? 'all' : tabId)
          }}
        />
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-4 pb-8">
        {currentExamples.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500">
            {t('tabs.empty')}
          </div>
        ) : (
          <div className="space-y-3">
            {currentExamples.map(example => {
              const isActive = selectedId === example.id
              const title = example.titles?.[locale] ?? example.title
              const description = example.descriptions?.[locale] ?? example.description
              return (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => onSelect(example.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                    isActive
                      ? 'border-slate-800 bg-slate-900 text-white shadow-sm'
                      : 'border-transparent bg-white text-slate-900 shadow-sm hover:border-slate-200'
                  }`}
                >
                  <div className="text-sm font-semibold">{title}</div>
                  <div
                    className={`mt-1 text-xs ${
                      isActive ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {description}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}

