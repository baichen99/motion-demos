import type { Example } from '../types'

interface ExampleViewerProps {
  example: Example | null
}

export default function ExampleViewer({ example }: ExampleViewerProps) {
  if (!example) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#999'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>请从左侧选择一个示例</h2>
          <p>选择任意示例查看 Motion 动画效果</p>
        </div>
      </div>
    )
  }

  const Component = example.component

  return (
    <div style={{ 
      flex: 1, 
      padding: '20px',
      overflowY: 'auto',
      height: '100vh',
      backgroundColor: '#fff'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Component />
      </div>
    </div>
  )
}

