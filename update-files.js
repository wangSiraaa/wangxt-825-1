const fs = require('fs');
const path = require('path');

const mockDataContent = `import { Table, Guest, MenuItem, ChangeRecord } from '../types';

export const mockTables: Table[] = [
  { id: 't1', name: '主桌', x: 400, y: 80, seats: 12, isLocked: true, guests: ['g1', 'g2', 'g3', 'g4'], area: '主宾区' },
  { id: 't2', name: '1号桌', x: 150, y: 250, seats: 10, isLocked: false, guests: ['g5', 'g6', 'g7'], area: '男方亲友区' },
  { id: 't3', name: '2号桌', x: 380, y: 250, seats: 10, isLocked: false, guests: ['g8', 'g9'], area: '男方亲友区' },
  { id: 't4', name: '3号桌', x: 610, y: 250, seats: 10, isLocked: false, guests: ['g10'], area: '女方亲友区' },
  { id: 't5', name: '4号桌', x: 150, y: 420, seats: 10, isLocked: false, guests: [], area: '女方亲友区' },
  { id: 't6', name: '5号桌', x: 380, y: 420, seats: 10, isLocked: true, guests: ['g11', 'g12'], area: '同事区' },
  { id: 't7', name: '6号桌', x: 610, y: 420, seats: 10, isLocked: false, guests: [], area: '同事区' },
];

export const mockGuests: Guest[] = [
  { id: 'g1', name: '张伟', phone: '13800000001', dietaryRestrictions: ['素食'], tableId: 't1', tags: ['长辈', '男方'] },
  { id: 'g2', name: '李娜', phone: '13800000002', dietaryRestrictions: [], tableId: 't1', tags: ['长辈', '女方'] },
  { id: 'g3', name: '王强', phone: '13800000003', dietaryRestrictions: ['海鲜过敏', '清真'], tableId: 't1', tags: ['长辈', '男方'] },
  { id: 'g4', name: '刘芳', phone: '13800000004', dietaryRestrictions: ['不吃辣'], tableId: 't1', tags: ['长辈', '女方'] },
  { id: 'g5', name: '陈明', phone: '13800000005', dietaryRestrictions: [], tableId: 't2', tags: ['朋友', '男方'] },
  { id: 'g6', name: '赵丽', phone: '13800000006', dietaryRestrictions: ['素食'], tableId: 't2', isDuplicateName: true, tags: ['同事', '女方'] },
  { id: 'g7', name: '孙磊', phone: '13800000007', dietaryRestrictions: [], tableId: 't2', tags: ['同学', '男方'] },
  { id: 'g8', name: '周婷', phone: '13800000008', dietaryRestrictions: ['坚果过敏'], tableId: 't3', tags: ['同事', '男方'] },
  { id: 'g9', name: '吴刚', phone: '13800000009', dietaryRestrictions: [], tableId: 't3', tags: ['朋友', '男方'] },
  { id: 'g10', name: '郑雪', phone: '13800000010', dietaryRestrictions: ['清真'], tableId: 't4', tags: ['闺蜜', '女方'] },
  { id: 'g11', name: '赵丽', phone: '13800000011', dietaryRestrictions: [], tableId: 't6', isDuplicateName: true, tags: ['同事', '男方'] },
  { id: 'g12', name: '冯杰', phone: '13800000012', dietaryRestrictions: ['海鲜过敏'], tableId: 't6', tags: ['领导', '男方'] },
  { id: 'g13', name: '何敏', phone: '13800000013', dietaryRestrictions: [], tableId: null, tags: ['同学', '女方'] },
  { id: 'g14', name: '马涛', phone: '13800000014', dietaryRestrictions: ['不吃香菜'], tableId: null, tags: ['同事', '男方'] },
  { id: 'g15', name: '林芳', phone: '13800000015', dietaryRestrictions: ['素食'], tableId: null, tags: ['闺蜜', '女方'] },
];

export const mockMenuItems: MenuItem[] = [
  { id: 'm1', name: '鸿运当头', description: '精选鲍鱼配花胶', dietaryTags: ['海鲜'] },
  { id: 'm2', name: '龙凤呈祥', description: '龙虾仔蒸粉丝', dietaryTags: ['海鲜', '辣'] },
  { id: 'm3', name: '百年好合', description: '百合西芹炒虾仁', dietaryTags: ['海鲜', '素食可调整'] },
  { id: 'm4', name: '金玉满堂', description: '金汤五谷海参', dietaryTags: ['海鲜'] },
  { id: 'm5', name: '甜甜蜜蜜', description: '红枣银耳莲子羹', dietaryTags: ['素食', '甜点'] },
  { id: 'm6', name: '团团圆圆', description: '清蒸多宝鱼', dietaryTags: ['海鲜'] },
];

export const mockChangeHistory: ChangeRecord[] = [
  { id: 'h1', timestamp: Date.now() - 3600000, action: '移动桌位', description: '将1号桌移动到新位置', operator: '策划师小王' },
  { id: 'h2', timestamp: Date.now() - 1800000, action: '分配宾客', description: '将郑雪分配到3号桌', operator: '策划师小王' },
  { id: 'h3', timestamp: Date.now() - 900000, action: '锁定桌位', description: '锁定主桌和5号桌', operator: '策划师小王' },
];
`;

fs.writeFileSync('/Users/mingyuan/workspace/sihuo/wangxtw3/825/src/data/mockData.ts', mockDataContent);
console.log('mockData.ts updated');
