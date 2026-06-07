# 婚礼宴会桌位编排系统

一个功能完整的婚礼宴会桌位编排前端应用，支持策划师拖拽编排桌位、宴会销售查看宾客名单、新人确认忌口和同名宾客。

## 功能特性

### 👨‍💼 婚礼策划师 (Planner)
- **拖拽桌位**：在画布上自由拖动桌位进行布局
- **锁定桌位**：锁定重要桌位（如主桌），防止误操作
- **分配宾客**：通过拖拽将宾客分配到指定桌位
- **解锁桌位**：随时解锁已锁定的桌位进行调整

### 💼 宴会销售 (Sales)
- **查看宾客名单**：浏览所有宾客信息及分配状态
- **查看桌位安排**：查看各桌位的宾客分布
- **搜索筛选**：按姓名、电话搜索宾客，按分配状态筛选

### 💑 新人 (Couple)
- **确认忌口**：查看所有宾客的饮食禁忌
- **同名宾客提示**：系统自动标识同名宾客，提示核对手机号
- **菜单卡标识**：查看各桌位的忌口统计，用于菜单卡制作

### 通用功能
- **桌位画布**：可视化宴会厅布局，直观展示桌位分布
- **宾客侧栏**：完整的宾客名单管理
- **菜单标签**：宴会菜单展示及各桌忌口统计
- **变更历史**：记录所有操作变更，支持溯源
- **本地存储**：所有编排结果自动保存到浏览器本地存储
- **重置功能**：一键恢复到默认数据

## 技术栈

- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **拖拽**：React DnD
- **图标**：Lucide React
- **容器化**：Docker + Nginx

## 快速开始

### 开发模式

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### Docker 部署

```bash
# 构建镜像
docker build -t wedding-seating .

# 运行容器
docker run -p 8080:80 wedding-seating
```

访问 http://localhost:8080 查看应用。

## 项目结构

```
.
├── src/
│   ├── components/          # React 组件
│   │   ├── TableCanvas.tsx      # 桌位画布组件
│   │   ├── GuestSidebar.tsx     # 宾客侧栏组件
│   │   ├── MenuTab.tsx          # 菜单标签组件
│   │   ├── ChangeHistory.tsx    # 变更历史组件
│   │   └── RoleSelector.tsx     # 角色选择器组件
│   ├── hooks/               # 自定义 Hooks
│   │   └── useSeatingState.ts   # 座位编排状态管理
│   ├── types/               # TypeScript 类型定义
│   ├── data/                # Mock 数据
│   ├── App.tsx              # 应用主组件
│   ├── main.tsx             # 应用入口
│   └── index.css            # 全局样式
├── Dockerfile               # Docker 配置
├── nginx.conf               # Nginx 配置
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 验证锁定桌位功能

项目提供了自动化测试脚本用于验证锁定桌位无法拖动的功能：

```bash
# 运行锁定桌位测试
npm run test-lock
```

测试脚本会模拟拖拽操作，验证：
1. 未锁定的桌位可以正常拖动
2. 已锁定的桌位无法拖动
3. 锁定状态切换功能正常

## 核心数据模型

### Table (桌位)
```typescript
{
  id: string;           // 桌位唯一标识
  name: string;         // 桌位名称
  x: number;            // X 坐标
  y: number;            // Y 坐标
  seats: number;        // 座位数
  isLocked: boolean;    // 是否锁定
  guests: string[];     // 宾客 ID 列表
}
```

### Guest (宾客)
```typescript
{
  id: string;                    // 宾客唯一标识
  name: string;                  // 姓名
  phone: string;                 // 手机号
  dietaryRestrictions: string[]; // 饮食禁忌
  tableId: string | null;        // 所属桌位
  isDuplicateName?: boolean;     // 是否同名
}
```

## 使用说明

1. **切换角色**：点击顶部角色按钮切换不同身份体验不同功能
2. **移动桌位**：策划师身份下，拖动未锁定的桌位调整位置
3. **锁定/解锁**：点击桌位卡片右上角的锁图标切换锁定状态
4. **分配宾客**：策划师身份下，从侧栏拖拽宾客到目标桌位
5. **查看菜单**：切换到"菜单设置"标签查看宴会菜单及忌口统计
6. **查看历史**：切换到"变更历史"标签查看所有操作记录
7. **重置数据**：点击右上角"重置"按钮恢复默认数据

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License
