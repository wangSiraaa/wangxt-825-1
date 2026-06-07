import sys

content = '''import React, { useState } from 'react';
import { FilterContext } from '../types';
import { Filter, ChevronDown, ChevronUp, X, MapPin, Tag, Lock, Unlock, Layers } from 'lucide-react';

interface FilterPanelProps {
  filterContext: FilterContext;
  activeFilterCount: number;
  availableAreas: string[];
  availableTags: string[];
  onAreasChange: (areas: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  onLockStatusChange: (lockStatus: 'all' | 'locked' | 'unlocked') => void;
  onClearAll: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterContext,
  activeFilterCount,
  availableAreas,
  availableTags,
  onAreasChange,
  onTagsChange,
  onLockStatusChange,
  onClearAll
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleArea = (area: string) => {
    if (filterContext.areas.includes(area)) {
      onAreasChange(filterContext.areas.filter(a => a !== area));
    } else {
      onAreasChange([...filterContext.areas, area]);
    }
  };

  const toggleTag = (tag: string) => {
    if (filterContext.tags.includes(tag)) {
      onTagsChange(filterContext.tags.filter(t => t !== tag));
    } else {
      onTagsChange([...filterContext.tags, tag]);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter size={20} className="text-wedding-primary" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="font-semibold text-gray-700">筛选条件</span>
          {activeFilterCount > 0 && (
            <span className="text-sm text-gray-500">
              已激活 {activeFilterCount} 个筛选
            </span>
          )}
        </div>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-600">桌位区域</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableAreas.map(area => (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    filterContext.areas.includes(area)
                      ? 'bg-wedding-primary text-white border-wedding-primary shadow-sm'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-wedding-primary hover:text-wedding-primary'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-600">宾客标签</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    filterContext.tags.includes(tag)
                      ? 'bg-wedding-accent text-white border-wedding-accent shadow-sm'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-wedding-accent hover:text-wedding-accent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-600">锁定状态</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'all', label: '全部', icon: Layers },
                { value: 'locked', label: '已锁定', icon: Lock },
                { value: 'unlocked', label: '未锁定', icon: Unlock }
              ].map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => onLockStatusChange(option.value as 'all' | 'locked' | 'unlocked')}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border transition-all ${
                      filterContext.lockStatus === option.value
                        ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon size={14} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearAll();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full justify-center"
              >
                <X size={16} />
                清除全部筛选条件
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
'''

with open('/Users/mingyuan/workspace/sihuo/wangxtw3/825/src/components/FilterPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('File written successfully')
