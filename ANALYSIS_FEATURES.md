# 计算历史数据分析功能

## 功能概述

本计算器应用新增了强大的数据分析功能，可以追踪、分析和可视化用户的计算习惯。

## 主要功能

### 1. 计算历史记录

- 自动记录每次计算的表达式、结果和时间戳
- 捕获计算错误并分类记录
- 分析每次计算使用的函数和操作符
- 本地存储，最多保留1000条记录

### 2. 数据分析统计

#### 概览统计
- 总计算次数
- 成功/失败次数统计
- 错误率分析
- 常用函数排名
- 常用操作符排名
- 错误类型分布
- 使用习惯分析（日均计算次数、高峰时段）

### 3. 数据可视化

使用Chart.js库提供多种图表展示：

#### 饼图
- 函数使用分布
- 操作符使用分布
- 错误类型分布

#### 柱状图
- 操作符使用频率

#### 折线图
- 近7日计算趋势
- 24小时计算分布

### 4. 时间段筛选

- 按开始日期和结束日期筛选数据
- 支持自定义时间范围
- 重置筛选功能

### 5. 报告导出

支持两种格式导出分析报告：

#### JSON格式
包含完整的统计数据和前50条记录

#### CSV格式
包含前100条记录的详细信息，适合Excel分析

## 使用说明

### 开始使用

1. **进行计算** - 执行任意计算后，底部会显示两个按钮：
   - "查看分析" - 打开数据分析面板
   - "生成测试数据" - 生成50条模拟计算记录（用于演示）

2. **查看分析面板**
   - 点击"查看分析"按钮打开分析面板
   - 面板包含三个标签页：
     - **概览** - 统计数据表格视图
     - **图表** - 可视化图表展示
     - **历史记录** - 详细计算记录列表

3. **筛选数据**
   - 点击"显示筛选器"按钮
   - 选择开始日期和结束日期
   - 点击"应用筛选"更新分析结果

4. **导出报告**
   - 在分析面板顶部点击"导出JSON"或"导出CSV"
   - 报告文件会自动下载到浏览器默认下载位置

## 文件结构

```
src/
├── history/
│   └── HistoryManager.js      # 历史记录管理模块
├── components/
│   ├── AnalysisPanel.js       # 数据分析面板主组件
│   └── charts/
│       ├── PieChart.js        # 饼图组件
│       ├── BarChart.js        # 柱状图组件
│       └── LineChart.js       # 折线图组件
└── App.js                     # 主应用（已集成分析功能）
```

## 核心模块说明

### HistoryManager.js

提供历史记录管理的核心功能：

```javascript
// 主要方法
HistoryManager.addRecord(expression, result, error)    // 添加计算记录
HistoryManager.getHistory()                            // 获取所有记录
HistoryManager.getRecordsByTimeRange(start, end)       // 按时间范围筛选
HistoryManager.getStatistics(records)                  // 生成统计数据
HistoryManager.getCalculationsByDay(records, days)     // 获取每日计算数据
HistoryManager.getCalculationsByHour(records)          // 获取每小时计算数据
HistoryManager.generateTestData(count)                 // 生成测试数据
```

### AnalysisPanel.js

数据分析面板组件，包含：
- 时间段筛选器
- 三个标签页（概览、图表、历史记录）
- 报告导出功能
- 响应式布局设计

### 图表组件

三个独立的图表组件：
- **PieChart** - 饼图，适合展示比例分布
- **BarChart** - 柱状图，适合展示数量比较
- **LineChart** - 折线图，适合展示时间趋势

## 技术栈

- React 17
- React-Bootstrap (UI组件)
- Chart.js 3.9.1 (图表库)
- react-chartjs-2 4.3.1 (React封装)
- file-saver (文件导出)
- LocalStorage (数据持久化)

## 数据存储

计算历史记录存储在浏览器的LocalStorage中，键名为 `calculator_history`。

记录结构：
```javascript
{
  id: 时间戳,
  timestamp: ISO时间字符串,
  expression: "计算表达式",
  result: "计算结果或null",
  error: {                    // 错误信息或null
    type: "错误类型",
    message: "错误消息"
  },
  functionsUsed: ["使用的函数列表"],
  operations: ["使用的操作符列表"]
}
```

## 错误类型

系统会自动识别以下错误类型：
- SyntaxError - 语法错误
- EvaluationError - 计算错误
- InvalidOperand - 无效操作数
- DivisionByZero - 除零错误
- 以及其他JavaScript标准错误类型

## 函数识别

系统会识别以下数学函数：
- sqrt - 平方根
- sin - 正弦
- cos - 余弦
- tan - 正切
- log10 - 常用对数
- ln - 自然对数
- exp - 指数
- factorial - 阶乘
- inversion - 倒数

## 注意事项

1. 数据仅存储在本地，清除浏览器数据会丢失历史记录
2. 最多保留1000条最新记录
3. 导出的CSV文件使用UTF-8编码，建议用Excel或WPS打开
4. 测试数据功能会在现有记录基础上添加新记录，不会覆盖

## 示例使用流程

1. 在计算器中输入 `2 + 3`，点击 = 执行计算
2. 底部出现"查看分析"和"生成测试数据"按钮
3. 点击"生成测试数据"生成50条模拟记录
4. 点击"查看分析"打开分析面板
5. 切换到"图表"标签页查看可视化数据
6. 使用"显示筛选器"选择特定时间段
7. 点击"导出JSON"或"导出CSV"下载报告

## 开发说明

### 添加新功能

如需扩展功能，请参考现有模块的结构：

1. 在HistoryManager.js中添加新的统计方法
2. 在AnalysisPanel.js中添加新的UI组件
3. 如需新的图表类型，在charts目录下创建新组件

### 本地化

所有显示的文字都已使用中文，如需修改语言：
- HistoryManager.js：修改 `FUNCTIONS_MAP` 和 `errorMap`
- AnalysisPanel.js：修改UI文字
- 图表组件：修改标题文字
