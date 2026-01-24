import type React from 'react'
import { useState } from 'react'

interface TabsProps {
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
  }>
  defaultTabId?: string
  onChange?: (tabId: string) => void
}

export default function Tabs({ tabs, defaultTabId, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div>
      <div className="flex border-b border-purple-500/20 gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-3 font-medium transition relative ${
              activeTab === tab.id
                ? 'text-purple-300'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            )}
          </button>
        ))}
      </div>
      <div>
        {tabs.map((tab) => (
          activeTab === tab.id && (
            <div key={tab.id} className="animate-fadeIn">
              {tab.content}
            </div>
          )
        ))}
      </div>
    </div>
  )
}
