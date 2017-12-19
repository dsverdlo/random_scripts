LButton::
	Click, 2
	Send ^v
	Return

RButton::  
; stopahk.bat will terminate an ahk script. Place in appropriate folder or update link
	Run, C:\Users\David\Data\Autohotkey\stopahk.bat AutoHotkey.exe easy_replace,,Hide
	Pause
	Suspend
	Return
