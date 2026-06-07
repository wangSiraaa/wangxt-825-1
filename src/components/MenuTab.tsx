import React from 'react';
import { MenuItem, Guest } from '../types';
import { Utensils, AlertCircle } from 'lucide-react';

interface MenuTabProps {
  menuItems: MenuItem[];
  guests: Guest[];
  tables: { id: string; name: string; guests: string[] }[];
}

const MenuTab: React.FC<MenuTabProps> = ({ menuItems, guests, tables }) => {
  const getDietarySummary = () => {
    const summary: Record<string, string[]> = {};
    guests.forEach(guest => {
      guest.dietaryRestrictions.forEach(r => {
        if (!summary[r]) summary[r] = [];
        summary[r].push(guest.name);
      });
    });
    return summary;
  };

  const dietarySummary = getDietarySummary();

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h3 className="text-xl font-bold text-wedding-secondary mb-6 flex items-center gap-2">
        <Utensils size={24} />
        宴会菜单
      </h3>

      <div className="grid gap-4 mb-8">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-wedding-primary text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
                </div>
                <p className="text-gray-500 mt-2 ml-10">{item.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 ml-10">
              {item.dietaryTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-wedding-accent text-wedding-secondary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
          <AlertCircle size={20} />
          宾客忌口统计（用于菜单卡标识）
        </h4>
        
        {Object.keys(dietarySummary).length === 0 ? (
          <p className="text-gray-500">暂无忌口宾客</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(dietarySummary).map(([restriction, names]) => (
              <div key={restriction} className="flex items-start gap-3">
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded font-medium whitespace-nowrap">
                  {restriction}
                </span>
                <span className="text-gray-700 text-sm">
                  {names.join('、')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-wedding-secondary mb-3">各桌忌口情况</h4>
        <div className="grid gap-3">
          {tables.map(table => {
            const tableGuests = guests.filter(g => g.tableId === table.id);
            const tableRestrictions = new Set<string>();
            tableGuests.forEach(g => g.dietaryRestrictions.forEach(r => tableRestrictions.add(r)));
            
            return (
              <div key={table.id} className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="font-medium text-gray-800 mb-2">{table.name}</div>
                {tableRestrictions.size > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {Array.from(tableRestrictions).map((r, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">无特殊忌口</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuTab;
