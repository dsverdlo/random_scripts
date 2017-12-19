LButton::
	Click, 2
	Send ^v
	Return

RButton::  
; terminate this ahk script. Place in appropriate folder or update link
	Run, C:\Users\David\Data\Autohotkey\kill_process_instance.bat AutoHotkey.exe easy_replace,,Hide
	Pause
	Suspend
	Return
