@echo off

echo	Reading arguments...
if [%1] == [] (
	echo Incorrect usage, expected: ^<process.exe^> ^<namepart^>
	exit /B 1 
) else (
	echo Caption given: "%1"
)

if [%2] == [] (
	echo Incorrect usage, expected: ^<process.exe^> ^<namepart^>
	exit /B 1 
) else (
	echo Name given: "%2"
)

echo	Searching for processes...
for /f "skip=1 tokens=2 " %%A in ('
wmic process where "Caption = '%1' and Commandline like '%%%2%%' " get Caption^,ProcessId
') do set "GETPID=%%A"


if [%GETPID%] == [] (
	echo No matching processes found...
) else (
	echo	Found PID: %GETPID%... firing killshot
	tasklist /FI "PID eq %GETPID%"
	taskkill /PID %GETPID%
)

echo	Exiting...
pause
