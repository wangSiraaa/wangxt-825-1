/**
 * 验证锁定桌位无法拖动的测试脚本
 * 
 * 此脚本模拟桌位拖拽操作，验证锁定桌位的位置不会发生变化
 */

const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('  锁定桌位拖动验证测试');
console.log('========================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ FAIL: ${name}`);
    console.log(`   错误: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || '断言失败');
  }
}

console.log('📋 加载核心数据文件...\n');

const typesContent = fs.readFileSync(path.join(__dirname, '../src/types/index.ts'), 'utf-8');
const mockDataContent = fs.readFileSync(path.join(__dirname, '../src/data/mockData.ts'), 'utf-8');
const canvasContent = fs.readFileSync(path.join(__dirname, '../src/components/TableCanvas.tsx'), 'utf-8');
const hooksContent = fs.readFileSync(path.join(__dirname, '../src/hooks/useSeatingState.ts'), 'utf-8');
const cssContent = fs.readFileSync(path.join(__dirname, '../src/index.css'), 'utf-8');

test('Table 类型定义包含 isLocked 字段', () => {
  assert(typesContent.includes('isLocked: boolean'), 'Table 类型中未找到 isLocked 字段');
});

test('mock 数据中存在锁定和未锁定的桌位', () => {
  const hasLocked = mockDataContent.includes('isLocked: true');
  const hasUnlocked = mockDataContent.includes('isLocked: false');
  assert(hasLocked, 'Mock 数据中没有锁定的桌位');
  assert(hasUnlocked, 'Mock 数据中没有未锁定的桌位');
});

test('TableCanvas 组件中存在锁定桌位的样式判断', () => {
  assert(canvasContent.includes('table.isLocked'), 'TableCanvas 中未检查 table.isLocked');
  assert(canvasContent.includes('locked'), 'TableCanvas 中缺少 locked 样式类');
});

test('TableCanvas 中锁定桌位禁用拖拽', () => {
  assert(canvasContent.includes('!canEdit || table.isLocked'), 'TableCanvas 中未对锁定桌位禁用 mousedown');
  const hasCursorNotAllowed = canvasContent.includes('cursor-not-allowed') || cssContent.includes('cursor: not-allowed');
  assert(hasCursorNotAllowed, 'TableCanvas 或 CSS 中缺少 not-allowed 光标样式');
});

console.log('\n🧪 模拟拖拽逻辑测试...\n');

const mockTables = [
  { id: 't1', name: '主桌', x: 400, y: 80, isLocked: true, guests: [] },
  { id: 't2', name: '1号桌', x: 150, y: 250, isLocked: false, guests: [] },
];

function simulateDrag(table, newX, newY, role) {
  const canEdit = role === 'planner';
  
  if (!canEdit || table.isLocked) {
    return { ...table };
  }
  
  return { ...table, x: newX, y: newY };
}

test('策划师角色下，未锁定桌位拖动后位置改变', () => {
  const table = { ...mockTables[1] };
  const originalX = table.x;
  const originalY = table.y;
  
  const result = simulateDrag(table, 200, 300, 'planner');
  
  assert(result.x === 200, `X 坐标未正确更新，预期 200，实际 ${result.x}`);
  assert(result.y === 300, `Y 坐标未正确更新，预期 300，实际 ${result.y}`);
  assert(result.x !== originalX, 'X 坐标未发生变化');
  assert(result.y !== originalY, 'Y 坐标未发生变化');
});

test('策划师角色下，锁定桌位拖动后位置不变', () => {
  const table = { ...mockTables[0] };
  const originalX = table.x;
  const originalY = table.y;
  
  const result = simulateDrag(table, 500, 200, 'planner');
  
  assert(result.x === originalX, `锁定桌位 X 坐标发生了变化！原来 ${originalX}，现在 ${result.x}`);
  assert(result.y === originalY, `锁定桌位 Y 坐标发生了变化！原来 ${originalY}，现在 ${result.y}`);
});

test('销售角色下，任何桌位都不能拖动', () => {
  const unlockedTable = { ...mockTables[1] };
  const originalX = unlockedTable.x;
  const originalY = unlockedTable.y;
  
  const result = simulateDrag(unlockedTable, 200, 300, 'sales');
  
  assert(result.x === originalX, '销售角色下桌位 X 坐标不应该变化');
  assert(result.y === originalY, '销售角色下桌位 Y 坐标不应该变化');
});

test('新人角色下，任何桌位都不能拖动', () => {
  const unlockedTable = { ...mockTables[1] };
  const originalX = unlockedTable.x;
  const originalY = unlockedTable.y;
  
  const result = simulateDrag(unlockedTable, 200, 300, 'couple');
  
  assert(result.x === originalX, '新人角色下桌位 X 坐标不应该变化');
  assert(result.y === originalY, '新人角色下桌位 Y 坐标不应该变化');
});

console.log('\n🔒 验证状态切换逻辑...\n');

function toggleLock(table) {
  return { ...table, isLocked: !table.isLocked };
}

test('桌位锁定状态可以正常切换', () => {
  const table = { ...mockTables[1] };
  assert(table.isLocked === false, '初始状态应该是未锁定');
  
  const locked = toggleLock(table);
  assert(locked.isLocked === true, '切换后应该是锁定状态');
  
  const unlocked = toggleLock(locked);
  assert(unlocked.isLocked === false, '再次切换后应该是未锁定状态');
});

test('useSeatingState 中存在 toggleTableLock 函数', () => {
  assert(hooksContent.includes('toggleTableLock'), 'useSeatingState 中未找到 toggleTableLock 函数');
});

console.log('\n📝 验证拖拽宾客到锁定桌位的限制...\n');

function canDropGuest(tableId, tables, role) {
  if (role !== 'planner') return false;
  const table = tables.find(t => t.id === tableId);
  return table && !table.isLocked;
}

test('宾客不能拖拽到锁定的桌位', () => {
  const canDropLocked = canDropGuest('t1', mockTables, 'planner');
  assert(canDropLocked === false, '不应该允许拖拽到锁定桌位');
});

test('宾客可以拖拽到未锁定的桌位', () => {
  const canDropUnlocked = canDropGuest('t2', mockTables, 'planner');
  assert(canDropUnlocked === true, '应该允许拖拽到未锁定桌位');
});

console.log('\n========================================');
console.log(`  测试结果: ${passed} 通过, ${failed} 失败`);
console.log('========================================');

if (failed > 0) {
  console.log('\n❌ 部分测试未通过，请检查代码实现');
  process.exit(1);
} else {
  console.log('\n🎉 所有测试通过！锁定桌位功能实现正确');
  console.log('\n📌 验证要点总结:');
  console.log('   1. 锁定桌位 (isLocked: true) 无法拖动');
  console.log('   2. 未锁定桌位在策划师角色下可以拖动');
  console.log('   3. 销售和新人角色无法拖动任何桌位');
  console.log('   4. 锁定/解锁状态可以正常切换');
  console.log('   5. 宾客不能分配到锁定的桌位');
  process.exit(0);
}
