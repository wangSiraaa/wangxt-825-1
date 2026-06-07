import React from 'react';
import { ChangeRecord } from '../types';
import { History, Clock, User } from 'lucide-react';

interface ChangeHistoryProps {
  records: ChangeRecord[];
}

const ChangeHistory: React.FC<ChangeHistoryProps> = ({ records }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    if (action.includes('锁定') || action.includes('解锁')) return 'bg-yellow-100 text-yellow-700';
    if (action.includes('移动')) return 'bg-blue-100 text-blue-700';
    if (action.includes('分配') || action.includes('移除')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h3 className="text-xl font-bold text-wedding-secondary mb-6 flex items-center gap-2">
        <History size={24} />
        变更历史
      </h3>

      {records.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无变更记录</p>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          <div className="space-y-4">
            {records.map((record, index) => (
              <div key={record.id} className="relative pl-10">
                <div className="absolute left-2 top-1 w-5 h-5 rounded-full bg-white border-2 border-wedding-primary z-10"></div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getActionColor(record.action)}`}>
                      {record.action}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      {formatTime(record.timestamp)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm">{record.description}</p>
                  
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <User size={12} />
                    {record.operator}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeHistory;
