@echo off
echo Starting Portfolio Server...
echo.
echo Checking dependencies...

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Failed to install dependencies. Please check your internet connection.
        pause
        exit /b 1
    )
)

REM Check if database exists (optional)
echo.
echo Starting server on port 1000...
echo.
echo Server will be available at: http://localhost:1000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm start

pause
