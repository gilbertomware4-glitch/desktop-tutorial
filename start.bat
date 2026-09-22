	@echo off
	cd /d "%~dp0"
	where python >nul 2>&1
	if %errorlevel%==0 (
		start "Flowline" http://localhost:8000/index.html
		python -m http.server 8000
		goto :end
	)
	start "Flowline server" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
	start "Flowline" http://localhost:8000/index.html
	echo Python is not installed, so Flowline is being served with PowerShell.
	:end
