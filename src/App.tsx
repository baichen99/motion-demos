import { useState } from 'react'
import { examples } from './examples'
import ExampleList from './components/ExampleList'
import ExampleViewer from './components/ExampleViewer'
import LocaleToggle from './components/LocaleToggle'
import { useLocale } from './i18n/LocaleContext'
import './App.css'

function App() {
  const { t } = useLocale()
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(
    examples[0]?.id || null
  )

  const selectedExample = examples.find(ex => ex.id === selectedExampleId) || null

  return (
    <div className="relative flex min-h-screen bg-slate-100 text-slate-900">
      <header className="fixed right-4 top-4 z-50 flex items-center gap-3">
        <a
          href="https://github.com/baichen99/motion-demos"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-white"
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
          <span>{t('header.github')}</span>
        </a>
        <LocaleToggle />
      </header>
      <ExampleList
        examples={examples}
        selectedId={selectedExampleId}
        onSelect={setSelectedExampleId}
      />
      <ExampleViewer example={selectedExample} />
    </div>
  )
}

export default App
