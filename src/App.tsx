import { useState } from 'react'
import { examples } from './examples'
import ExampleList from './components/ExampleList'
import ExampleViewer from './components/ExampleViewer'
import './App.css'

function App() {
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(
    examples[0]?.id || null
  )

  const selectedExample = examples.find(ex => ex.id === selectedExampleId) || null

  return (
    <div className="flex h-full min-h-screen">
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
