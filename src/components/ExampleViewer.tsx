import type { Example } from '../types'
import { useLocale } from '../i18n/LocaleContext'

interface ExampleViewerProps {
  example: Example | null
}

export default function ExampleViewer({ example }: ExampleViewerProps) {
  const { t, locale } = useLocale()

  if (!example) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center bg-slate-50 pt-16 text-slate-500">
        <div className="rounded-xl border border-dashed border-slate-300 px-10 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-700">{t('viewer.placeholderTitle')}</h2>
          <p className="mt-2 text-sm text-slate-500">{t('viewer.placeholderDesc')}</p>
        </div>
      </section>
    )
  }

  const Component = example.component
  const title = example.titles?.[locale] ?? example.title
  const description = example.descriptions?.[locale] ?? example.description

  return (
    <section className="flex flex-1 overflow-y-auto bg-slate-50 pt-16">
      <div className="mx-auto w-full max-w-5xl px-6 pb-10">
        <header className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          {example.sourceUrl && (
            <a
              href={example.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.52 0 12.34c0 5.45 3.44 10.07 8.2 11.7.6.11.82-.27.82-.6 0-.29-.01-1.05-.02-2.05-3.34.75-4.05-1.66-4.05-1.66-.55-1.43-1.36-1.81-1.36-1.81-1.11-.78.08-.76.08-.76 1.22.09 1.86 1.28 1.86 1.28 1.09 1.9 2.86 1.35 3.56 1.03.11-.81.43-1.35.78-1.66-2.67-.31-5.47-1.37-5.47-6.11 0-1.35.46-2.45 1.22-3.31-.12-.31-.53-1.57.12-3.27 0 0 1.01-.33 3.3 1.24a11.2 11.2 0 0 1 3.01-.41c1.02.01 2.05.14 3.01.41 2.29-1.57 3.3-1.24 3.3-1.24.65 1.7.24 2.96.12 3.27.76.86 1.22 1.97 1.22 3.31 0 4.76-2.81 5.8-5.48 6.1.44.39.83 1.16.83 2.35 0 1.7-.02 3.07-.02 3.48 0 .33.22.72.83.6C20.56 22.4 24 17.78 24 12.34 24 5.52 18.63 0 12 0Z" />
              </svg>
              <span>{t('viewer.viewSource')}</span>
            </a>
          )}
        </header>
        <Component />
      </div>
    </section>
  )
}

