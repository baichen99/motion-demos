import { useState, useMemo } from 'react'
import type { Example } from '../types'
import Tabs from './Tabs'
import { getCategoryLabel, getAllCategories, examplesByCategory } from '../examples'

interface ExampleListProps {
  examples: Example[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function ExampleList({ examples, selectedId, onSelect }: ExampleListProps) {
  const categories = getAllCategories()
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // 当前分类的示例列表
  const currentExamples = useMemo(() => {
    if (activeCategory === 'all') {
      return examples
    }
    return examplesByCategory[activeCategory] || []
  }, [activeCategory, examples])

  // 构建 Tab 列表
  const tabs = useMemo(() => {
    return [
      { id: 'all', label: '全部' },
      ...categories.map(cat => ({
        id: cat,
        label: getCategoryLabel(cat)
      }))
    ]
  }, [categories])

  return (
    <div style={{ 
      width: '300px', 
      borderRight: '1px solid #e0e0e0',
      padding: '20px',
      overflowY: 'auto',
      height: '100vh',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h1 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px' }}>
        Motion 示例
      </h1>
      
      <Tabs 
        tabs={tabs}
        activeTab={activeCategory === 'all' ? 'all' : activeCategory}
        onTabChange={(tabId) => {
          setActiveCategory(tabId === 'all' ? 'all' : tabId)
        }}
      />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentExamples.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            暂无示例
          </div>
        ) : (
          currentExamples.map((example) => (
            <div
              key={example.id}
              onClick={() => onSelect(example.id)}
              style={{
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: selectedId === example.id ? '#646cff' : '#fff',
                color: selectedId === example.id ? '#fff' : '#333',
                border: selectedId === example.id ? 'none' : '1px solid #e0e0e0',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedId !== example.id) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedId !== example.id) {
                  e.currentTarget.style.backgroundColor = '#fff'
                }
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                {example.title}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {example.description}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

