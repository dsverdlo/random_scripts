Set objSWbemServices = GetObject ("winmgmts:\\.\root\cimv2")

Set shl = CreateObject("WScript.Shell")
Set colProcess = objSWbemServices.ExecQuery ("Select * From Win32_Process where Name LIKE '%spotify.exe' ")
Dim delay
delay = 220

'WScript.Echo WScript.ScriptName'

For Each objProcess In colProcess
      	'WScript.Echo objProcess.Name, objProcess.ProcessId, objProcess.CommandLine'
	shl.AppActivate(objProcess.ProcessId)
	WScript.Sleep delay
	shl.SendKeys ("^{right}")
	WScript.Sleep delay
	shl.SendKeys ("%{TAB}")
	Exit For
    
Next
