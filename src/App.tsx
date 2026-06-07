import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSeatingState } from './hooks/useSeatingState';
import TableCanvas from './components/TableCanvas';
import GuestSidebar from './components/GuestSidebar';
import MenuTab from './components/MenuTab';
import ChangeHistory from './components/ChangeHistory';
import RoleSelector from './components/RoleSelector';
import { LayoutGrid, Utensils, History, RefreshCw } from 'lucide-react';

type TabType = 'seating' | 'menu' | 'history';

function App() {
  const {
    tables,
    guests,
    menuItems,
    changeHistory,
    currentRole,
    updateTablePosition,
    toggleTableLock,
    assignGuestToTable,
    setCurrentRole,
    resetToDefault
  } = useSeatingState();

  const [activeTab, setActiveTab] = useState<TabType>('seating');
  const [showSidebar, setShowSidebar] = useState(true);

  const handleGuestDrop = (guestId: string, tableId: string) => {
    if (tableId) {
      assignGuestToTable(guestId, tableId);
    } else {
      assignGuestToTable(guestId, null);
    }
  };

  const tabs: { id: TabType; name: string; icon: React.ReactNode }[] = [
    { id: 'seating', name: '桌位编排', icon: <LayoutGrid size={18} /> },
    { id: 'menu', name: '菜单设置', icon: <Utensils size={18} /> },
    { id: 'history', name: '变更历史', icon: <History size={18} /> }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-wedding-secondary">
                💒 婚礼宴会桌位编排系统
              </h1>
              <div className="flex items-center gap-1 ml-4">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-wedding-accent text-wedding-secondary font-medium'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span className="text-sm">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <RoleSelector currentRole={currentRole} onRoleChange={setCurrentRole} />
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="重置为默认数据"
              >
                <RefreshCw size={16} />
                重置
              </button>
              {activeTab === 'seating' && (
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  {showSidebar ? '隐藏侧栏' : '显示侧栏'}
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {activeTab === 'seating' && (
            <>
              <div className="flex-1 p-4 overflow-hidden">
                <TableCanvas
                  tables={tables}
                  guests={guests}
                  currentRole={currentRole}
                  onTableMove={updateTablePosition}
                  onToggleLock={toggleTableLock}
                  onGuestDrop={handleGuestDrop}
                />
              </div>
              {showSidebar && (
                <GuestSidebar
                  guests={guests}
                  tables={tables}
                  currentRole={currentRole}
                  onAssignGuest={assignGuestToTable}
                />
              )}
            </>
          )}

          {activeTab === 'menu' && (
            <div className="flex-1 overflow-hidden">
              <MenuTab menuItems={menuItems} guests={guests} tables={tables} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="flex-1 overflow-hidden">
              <ChangeHistory records={changeHistory} />
            </div>
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 px-6 py-2 text-xs text-gray-400 flex items-center justify-between">
          <span>数据自动保存到本地存储</span>
          <span>当前角色: {currentRole === 'planner' ? '婚礼策划师' : currentRole === 'sales' ? '宴会销售' : '新人'}</span>
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;
