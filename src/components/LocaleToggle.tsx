import { availableLocales, localeLabels, useLocale } from '../i18n/LocaleContext'

export default function LocaleToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-300 bg-white/80 p-1 shadow-sm backdrop-blur">
      {availableLocales.map(option => {
        const isActive = option === locale
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLocale(option)}
            className={`min-w-[72px] rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {localeLabels[option]}
          </button>
        )
      })}
    </div>
  )
}

