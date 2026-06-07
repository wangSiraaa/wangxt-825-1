import React, { useRef } from 'react';
import { Table, Guest, Role } from '../types';
import { Lock, Unlock, Users, Utensils } from 'lucide-react';

interface TableCanvasProps {
  tables: Table[];
  guests: Guest[];
  currentRole: Role;
  onTableMove: (tableId: string, x: number, y: number) => void;
  onToggleLock: (tableId: string) => void;
  onGuestDrop: (guestId: string, tableId: string) => void;
}

const TableCanvas: React.FC<TableCanvasProps> = ({
  tables,
  guests,
  currentRole,
  onTableMove,
  onToggleLock,
  onGuestDrop
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ id: string; startX: number; startY: number; tableStartX: number; tableStartY: number } | null>(null);

  const canEdit = currentRole === 'planner';

  const handleMouseDown = (e: React.MouseEvent, table: Table) => {
    if (!canEdit || table.isLocked) return;
    e.preventDefault();
    
    draggingRef.current = {
      id: table.id,
      startX: e.clientX,
      startY: e.clientY,
      tableStartX: table.x,
      tableStartY: table.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current || !canvasRef.current) return;
    
    const dx = e.clientX - draggingRef.current.startX;
    const dy = e.clientY - draggingRef.current.startY;
    
    const newX = Math.max(20, draggingRef.current.tableStartX + dx);
    const newY = Math.max(20, draggingRef.current.tableStartY + dy);
    
    onTableMove(draggingRef.current.id, newX, newY);
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
  };

  const handleDrop = (e: React.DragEvent, tableId: string) => {
    e.preventDefault();
    if (!canEdit) return;
    const guestId = e.dataTransfer.getData('guestId');
    if (guestId) {
      const table = tables.find(t => t.id === tableId);
      if (table && !table.isLocked) {
        onGuestDrop(guestId, tableId);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getDietaryBadges = (tableGuests: string[]) => {
    const allRestrictions = new Set<string>();
    tableGuests.forEach(gId => {
      const guest = guests.find(g => g.id === gId);
      guest?.dietaryRestrictions.forEach(r => allRestrictions.add(r));
    });
    return Array.from(allRestrictions);
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-gradient-to-br from-wedding-ivory to-wedding-accent rounded-lg overflow-hidden"
      style={{ minHeight: '600px' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={(e) => {
        e.preventDefault();
        if (!canEdit) return;
        const guestId = e.dataTransfer.getData('guestId');
        if (guestId) {
          onGuestDrop(guestId, '');
        }
      }}
      onDragOver={handleDragOver}
    >
      <div className="absolute top-4 left-4 text-wedding-secondary font-medium">
        宴会厅布局图
      </div>
      
      <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-wedding-secondary">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>已锁定</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-wedding-primary"></div>
          <span>可编辑</span>
        </div>
      </div>

      {tables.map(table => {
        const tableGuests = guests.filter(g => g.tableId === table.id);
        const dietaryBadges = getDietaryBadges(table.guests);
        
        return (
          <div
            key={table.id}
            className={`absolute table-card rounded-xl shadow-lg border-2 p-3
              ${table.isLocked 
                ? 'border-yellow-500 bg-yellow-50 locked' 
                : 'border-wedding-primary bg-white cursor-move hover:shadow-xl'
              }
              ${canEdit && !table.isLocked ? 'cursor-move' : ''}
            `}
            style={{
              left: table.x,
              top: table.y,
              minWidth: '140px'
            }}
            onMouseDown={(e) => handleMouseDown(e, table)}
            onDrop={(e) => handleDrop(e, table.id)}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-wedding-secondary text-sm">{table.name}</span>
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(table.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {table.isLocked ? (
                    <Lock size={14} className="text-yellow-600" />
                  ) : (
                    <Unlock size={14} className="text-gray-400" />
                  )}
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Users size={12} />
              <span>{tableGuests.length}/{table.seats} 人</span>
            </div>

            {dietaryBadges.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {dietaryBadges.map((tag, idx) => (
                  <span
                    key={idx}
                    className="dietary-tag bg-red-100 text-red-700"
                  >
                    <Utensils size={10} className="inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-1 max-h-24 overflow-y-auto">
              {tableGuests.map(guest => (
                <div
                  key={guest.id}
                  className={`text-xs p-1 rounded ${
                    guest.isDuplicateName ? 'duplicate-warning bg-orange-100 text-orange-800' : 'bg-gray-50 text-gray-700'
                  }`}
                  title={guest.isDuplicateName ? `同名宾客，请核对手机号: ${guest.phone}` : guest.phone}
                >
                  {guest.name}
                  {guest.dietaryRestrictions.length > 0 && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableCanvas;
