export type Role = 'planner' | 'sales' | 'couple';

export interface Guest {
  id: string;
  name: string;
  phone: string;
  dietaryRestrictions: string[];
  tableId: string | null;
  isDuplicateName?: boolean;
  tags: string[];
}

export interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  seats: number;
  isLocked: boolean;
  guests: string[];
  area: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  dietaryTags: string[];
}

export interface FilterContext {
  areas: string[];
  tags: string[];
  lockStatus: 'all' | 'locked' | 'unlocked';
}

export interface ChangeRecord {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  operator: string;
  filterContext?: FilterContext;
}

export interface SeatingState {
  tables: Table[];
  guests: Guest[];
  menuItems: MenuItem[];
  changeHistory: ChangeRecord[];
  currentRole: Role;
}
