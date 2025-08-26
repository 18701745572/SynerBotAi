@echo off
echo ========================================
echo   智能体聊天应用 - 快速启动脚本
echo ========================================
echo.

echo 正在检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

echo.
echo 正在安装依赖...
npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成

echo.
echo 正在启动开发服务器...
echo 应用将在 http://localhost:3000 启动
echo.
echo 请确保 LM Studio 已启动并运行在端口 1234
echo.
echo 按 Ctrl+C 停止服务器
echo.

npm run dev

pause
