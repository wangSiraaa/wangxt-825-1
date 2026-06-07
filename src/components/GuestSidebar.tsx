import React, { useState } from 'react';
import { Guest, Role, Table } from '../types';
import { User, Phone, AlertTriangle, Utensils, Search } from 'lucide-react';

interface GuestSidebarProps {
  guests: Guest[];
  tables: Table[];
  currentRole: Role;
  onAssignGuest: (guestId: string, tableId: string | null) => void;
}

const GuestSidebar: React.FC<GuestSidebarProps> = ({
  guests,
  tables,
  currentRole,
  onAssignGuest
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'assigned'>('all');
  const [showPhoneModal, setShowPhoneModal] = useState<Guest | null>(null);

  const canEdit = currentRole === 'planner';

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.includes(searchTerm) || g.phone.includes(searchTerm);
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unassigned' ? !g.tableId :
      g.tableId;
    return matchesSearch && matchesFilter;
  });

  const duplicateNames = guests
    .map(g => g.name)
    .filter((name, index, arr) => arr.indexOf(name) !== index);

  const handleDragStart = (e: React.DragEvent, guest: Guest) => {
    if (!canEdit) return;
    e.dataTransfer.setData('guestId', guest.id);
  };

  const getTableName = (tableId: string | null) => {
    if (!tableId) return '未分配';
    const table = tables.find(t => t.id === tableId);
    return table?.name || '未知';
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-lg text-wedding-secondary mb-3 flex items-center gap-2">
          <User size={20} />
          宾客名单
        </h3>
        
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索宾客姓名或电话..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wedding-primary"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'unassigned', 'assigned'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === f
                  ? 'bg-wedding-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? '全部' : f === 'unassigned' ? '未分配' : '已分配'}
            </button>
          ))}
        </div>
      </div>

      {currentRole === 'couple' && duplicateNames.length > 0 && (
        <div className="mx-4 mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-700 text-sm font-medium mb-2">
            <AlertTriangle size={16} />
            发现同名宾客
          </div>
          <p className="text-xs text-orange-600">
            请核对以下同名宾客的手机号
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {filteredGuests.map(guest => (
            <div
              key={guest.id}
              draggable={canEdit}
              onDragStart={(e) => handleDragStart(e, guest)}
              className={`guest-item p-3 rounded-lg border border-gray-100 ${
                canEdit ? 'cursor-grab active:cursor-grabbing' : ''
              } ${guest.isDuplicateName ? 'border-orange-300 bg-orange-50' : 'bg-white'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{guest.name}</span>
                    {guest.isDuplicateName && (
                      <button
                        onClick={() => setShowPhoneModal(guest)}
                        className="text-orange-500 hover:text-orange-700"
                        title="同名宾客，请核对手机号"
                      >
                        <AlertTriangle size={14} />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Phone size={12} />
                    <span>{guest.phone}</span>
                  </div>
                </div>
                
                <span className={`text-xs px-2 py-1 rounded-full ${
                  guest.tableId 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {getTableName(guest.tableId)}
                </span>
              </div>

              {guest.dietaryRestrictions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {guest.dietaryRestrictions.map((restriction, idx) => (
                    <span
                      key={idx}
                      className="dietary-tag bg-red-50 text-red-600 border border-red-200"
                    >
                      <Utensils size={10} className="inline mr-1" />
                      {restriction}
                    </span>
                  ))}
                </div>
              )}

              {canEdit && guest.tableId && (
                <button
                  onClick={() => onAssignGuest(guest.id, null)}
                  className="mt-2 text-xs text-red-500 hover:text-red-700"
                >
                  从桌位移除
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
        共 {guests.length} 位宾客，{guests.filter(g => !g.tableId).length} 位未分配
      </div>

      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="text-orange-500" />
              核对宾客信息
            </h4>
            <div className="space-y-2 mb-4">
              <p><span className="text-gray-500">姓名：</span>{showPhoneModal.name}</p>
              <p><span className="text-gray-500">手机号：</span>{showPhoneModal.phone}</p>
              <p><span className="text-gray-500">当前桌位：</span>{getTableName(showPhoneModal.tableId)}</p>
              {showPhoneModal.dietaryRestrictions.length > 0 && (
                <p>
                  <span className="text-gray-500">忌口：</span>
                  {showPhoneModal.dietaryRestrictions.join('、')}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowPhoneModal(null)}
              className="w-full py-2 bg-wedding-primary text-white rounded-lg hover:bg-wedding-secondary"
            >
              确认
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestSidebar;
