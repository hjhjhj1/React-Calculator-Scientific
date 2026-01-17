# React-Calculator-Scientific

React-Calculator-Scientific full functional in react with react bootstrap and Favicon libraries.
![image](https://github.com/user-attachments/assets/079ffb77-73f0-4128-bdae-2682ea12561a)


# Installation
Use npm Install to build the project.
Use npm start to run
React with React-bootstrap
React-icons

# Brief
small application in react with functional component and reusable components

首轮
报错index.js:18  Uncaught Error: Module parse failed: Unexpected token

2轮输入
报错index.js:18  Uncaught Error: Module parse failed: Unexpected token
修复Chart.js 版本与项目的 babel 配置不兼容

3轮输入
报错 Uncaught TypeError: chart_js__WEBPACK_IMPORTED_MODULE_2__.Chart.register is not a function
原因： Chart.js 2.x 版本不支持 register() 方法（这是 v3+ 的 API）
解决方案： 移除了不兼容的 Chart.js 模块注册代码，Chart.js 2.x 会自动注册所有组件

完成主体功能，页面较丑陋