import React from 'react';
import { Role } from '../types';
import { Palette, Users, Heart } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

const roles: { id: Role; name: string; icon: React.ReactNode; description: string }[] = [
  { id: 'planner', name: '婚礼策划师', icon: <Palette size={18} />, description: '拖拽桌位、分配宾客、锁定桌位' },
  { id: 'sales', name: '宴会销售', icon: <Users size={18} />, description: '查看宾客名单和桌位安排' },
  { id: 'couple', name: '新人', icon: <Heart size={18} />, description: '确认忌口信息和同名宾客' }
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="flex items-center gap-2">
      {roles.map(role => (
        <button
          key={role.id}
          onClick={() => onRoleChange(role.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentRole === role.id
              ? 'bg-wedding-primary text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-wedding-accent'
          }`}
          title={role.description}
        >
          {role.icon}
          <span className="text-sm font-medium">{role.name}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
