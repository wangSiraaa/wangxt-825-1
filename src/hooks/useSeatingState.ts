import { useState, useEffect, useCallback } from 'react';
import { Table, Guest, MenuItem, ChangeRecord, Role, SeatingState } from '../types';
import { mockTables, mockGuests, mockMenuItems, mockChangeHistory } from '../data/mockData';

const STORAGE_KEY = 'wedding-seating-state';

const getInitialState = (): SeatingState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fall through
    }
  }
  return {
    tables: mockTables,
    guests: mockGuests,
    menuItems: mockMenuItems,
    changeHistory: mockChangeHistory,
    currentRole: 'planner'
  };
};

export const useSeatingState = () => {
  const [state, setState] = useState<SeatingState>(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addChangeRecord = useCallback((action: string, description: string, operator: string) => {
    setState(prev => ({
      ...prev,
      changeHistory: [
        {
          id: `h${Date.now()}`,
          timestamp: Date.now(),
          action,
          description,
          operator
        },
        ...prev.changeHistory
      ].slice(0, 50)
    }));
  }, []);

  const updateTablePosition = useCallback((tableId: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId ? { ...t, x, y } : t
      )
    }));
    const table = state.tables.find(t => t.id === tableId);
    if (table) {
      addChangeRecord('移动桌位', `将${table.name}移动到新位置`, getRoleName(state.currentRole));
    }
  }, [state.tables, state.currentRole, addChangeRecord]);

  const toggleTableLock = useCallback((tableId: string) => {
    setState(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId ? { ...t, isLocked: !t.isLocked } : t
      )
    }));
    const table = state.tables.find(t => t.id === tableId);
    if (table) {
      const action = table.isLocked ? '解锁桌位' : '锁定桌位';
      addChangeRecord(action, `${action}${table.name}`, getRoleName(state.currentRole));
    }
  }, [state.tables, state.currentRole, addChangeRecord]);

  const assignGuestToTable = useCallback((guestId: string, tableId: string | null) => {
    setState(prev => {
      const guest = prev.guests.find(g => g.id === guestId);
      const oldTableId = guest?.tableId;
      
      return {
        ...prev,
        guests: prev.guests.map(g =>
          g.id === guestId ? { ...g, tableId } : g
        ),
        tables: prev.tables.map(t => {
          let newGuests = t.guests.filter(gId => gId !== guestId);
          if (tableId === t.id) {
            newGuests = [...newGuests, guestId];
          }
          return { ...t, guests: newGuests };
        })
      };
    });
    
    const guest = state.guests.find(g => g.id === guestId);
    const table = tableId ? state.tables.find(t => t.id === tableId) : null;
    if (guest && table) {
      addChangeRecord('分配宾客', `将${guest.name}分配到${table.name}`, getRoleName(state.currentRole));
    } else if (guest && !tableId) {
      addChangeRecord('移除宾客', `将${guest.name}从桌位移除`, getRoleName(state.currentRole));
    }
  }, [state.guests, state.tables, state.currentRole, addChangeRecord]);

  const setCurrentRole = useCallback((role: Role) => {
    setState(prev => ({ ...prev, currentRole: role }));
  }, []);

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      tables: mockTables,
      guests: mockGuests,
      menuItems: mockMenuItems,
      changeHistory: mockChangeHistory,
      currentRole: state.currentRole
    });
  }, [state.currentRole]);

  return {
    tables: state.tables,
    guests: state.guests,
    menuItems: state.menuItems,
    changeHistory: state.changeHistory,
    currentRole: state.currentRole,
    updateTablePosition,
    toggleTableLock,
    assignGuestToTable,
    setCurrentRole,
    resetToDefault
  };
};

const getRoleName = (role: Role): string => {
  const names: Record<Role, string> = {
    planner: '婚礼策划师',
    sales: '宴会销售',
    couple: '新人'
  };
  return names[role];
};
