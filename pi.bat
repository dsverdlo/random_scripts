@echo off
setlocal enableextensions enabledelayedexpansion
color 0B

echo Grabbing IP...
for /f "usebackq tokens=5" %%a in (`curl https://api.hackertarget.com/dnslookup/?q^=dsverdlo.ddns.net -s`) do (
	set "ip=%%a"
)

echo Starting putty...

putty -ssh !ip! 2023

echo Terminating!
color 07