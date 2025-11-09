interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '2px solid #e0e0e0',
      marginBottom: '20px',
      gap: '4px',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderBottom: activeTab === tab.id ? '2px solid #646cff' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === tab.id ? '#646cff' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: activeTab === tab.id ? '600' : '400',
            transition: 'all 0.2s',
            marginBottom: '-2px',
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.color = '#646cff'
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.color = '#666'
            }
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

