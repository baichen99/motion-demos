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
    <div className="flex gap-2 border-b-2 border-slate-200 pb-1">
      {tabs.map(tab => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

