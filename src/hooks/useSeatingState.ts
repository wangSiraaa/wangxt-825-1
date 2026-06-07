import { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Guest, MenuItem, ChangeRecord, Role, SeatingState, FilterContext } from '../types';
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

const getInitialFilterContext = (): FilterContext => ({
  areas: [],
  tags: [],
  lockStatus: 'all'
});

export const useSeatingState = () => {
  const [state, setState] = useState<SeatingState>(getInitialState);
  const [filterContext, setFilterContext] = useState<FilterContext>(getInitialFilterContext);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addChangeRecord = useCallback((action: string, description: string, operator: string, filterCtx?: FilterContext) => {
    setState(prev => ({
      ...prev,
      changeHistory: [
        {
          id: `h${Date.now()}`,
          timestamp: Date.now(),
          action,
          description,
          operator,
          filterContext: filterCtx
        },
        ...prev.changeHistory
      ].slice(0, 50)
    }));
  }, []);

  const recordLockedTableDragAttempt = useCallback((tableId: string) => {
    const table = state.tables.find(t => t.id === tableId);
    if (table) {
      addChangeRecord(
        '尝试移动锁定桌位',
        `尝试移动${table.name}但被拒绝（桌位已锁定）`,
        getRoleName(state.currentRole),
        filterContext
      );
    }
  }, [state.tables, state.currentRole, filterContext, addChangeRecord]);

  const updateTablePosition = useCallback((tableId: string, x: number, y: number) => {
    const table = state.tables.find(t => t.id === tableId);
    
    if (table?.isLocked) {
      recordLockedTableDragAttempt(tableId);
      return;
    }
    
    setState(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId ? { ...t, x, y } : t
      )
    }));
    if (table) {
      addChangeRecord('移动桌位', `将${table.name}移动到新位置`, getRoleName(state.currentRole), filterContext);
    }
  }, [state.tables, state.currentRole, filterContext, addChangeRecord, recordLockedTableDragAttempt]);

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
      addChangeRecord(action, `${action}${table.name}`, getRoleName(state.currentRole), filterContext);
    }
  }, [state.tables, state.currentRole, filterContext, addChangeRecord]);

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
      addChangeRecord('分配宾客', `将${guest.name}分配到${table.name}`, getRoleName(state.currentRole), filterContext);
    } else if (guest && !tableId) {
      addChangeRecord('移除宾客', `将${guest.name}从桌位移除`, getRoleName(state.currentRole), filterContext);
    }
  }, [state.guests, state.tables, state.currentRole, filterContext, addChangeRecord]);

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
    setFilterContext(getInitialFilterContext());
  }, [state.currentRole]);

  const setAreasFilter = useCallback((areas: string[]) => {
    setFilterContext(prev => ({ ...prev, areas }));
  }, []);

  const setTagsFilter = useCallback((tags: string[]) => {
    setFilterContext(prev => ({ ...prev, tags }));
  }, []);

  const setLockStatusFilter = useCallback((lockStatus: 'all' | 'locked' | 'unlocked') => {
    setFilterContext(prev => ({ ...prev, lockStatus }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterContext(getInitialFilterContext());
  }, []);

  const getFilteredTables = useCallback((): Table[] => {
    return state.tables.filter(table => {
      if (filterContext.areas.length > 0 && !filterContext.areas.includes(table.area)) {
        return false;
      }
      if (filterContext.lockStatus === 'locked' && !table.isLocked) {
        return false;
      }
      if (filterContext.lockStatus === 'unlocked' && table.isLocked) {
        return false;
      }
      return true;
    });
  }, [state.tables, filterContext]);

  const getFilteredGuests = useCallback((): Guest[] => {
    const filteredTableIds = getFilteredTables().map(t => t.id);
    
    return state.guests.filter(guest => {
      if (filterContext.tags.length > 0) {
        const hasMatchingTag = filterContext.tags.some(tag => guest.tags.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }
      if (guest.tableId && !filteredTableIds.includes(guest.tableId)) {
        return false;
      }
      return true;
    });
  }, [state.guests, filterContext, getFilteredTables]);

  const getFilteredHistory = useCallback((): ChangeRecord[] => {
    return state.changeHistory;
  }, [state.changeHistory]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filterContext.areas.length;
    count += filterContext.tags.length;
    if (filterContext.lockStatus !== 'all') count += 1;
    return count;
  }, [filterContext]);

  return {
    tables: state.tables,
    guests: state.guests,
    menuItems: state.menuItems,
    changeHistory: state.changeHistory,
    currentRole: state.currentRole,
    filterContext,
    activeFilterCount,
    setAreasFilter,
    setTagsFilter,
    setLockStatusFilter,
    clearAllFilters,
    getFilteredTables,
    getFilteredGuests,
    getFilteredHistory,
    recordLockedTableDragAttempt,
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
