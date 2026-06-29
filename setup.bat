@echo off
echo Installing Infinite Canvas...
set IP=InfiniteCanvas
mkdir "%ProgramFiles%\%IP%" 2>nul
xcopy /E /Y /I . "%ProgramFiles%\%IP%\" >nul 2>&1
echo.
echo Installed! Starting...
start "" "%ProgramFiles%\%IP%\start.bat"
