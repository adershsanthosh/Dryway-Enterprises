@echo off
:: Batch script to allow mobile access to Dryway development server
echo ========================================================
echo   Configuring Windows Firewall for Dryway Phone Access
echo ========================================================
echo.

netsh advfirewall firewall delete rule name="Dryway App" >nul 2>&1
netsh advfirewall firewall delete rule name="Dryway App Port 5173" >nul 2>&1
netsh advfirewall firewall delete rule name="Dryway App Port 5001" >nul 2>&1

netsh advfirewall firewall add rule name="Dryway App Port 5173" dir=in action=allow protocol=TCP localport=5173
netsh advfirewall firewall add rule name="Dryway App Port 5001" dir=in action=allow protocol=TCP localport=5001

echo.
echo ========================================================
echo   SUCCESS! Windows Firewall is now open.
echo.
echo   Open this URL on your phone's browser:
echo   http://192.168.1.7:5173
echo ========================================================
echo.
pause
