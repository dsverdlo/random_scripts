#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

$space::
{
	Random, Num,1,20

	if (Num = 1) {
		return
	} 
	Send,{vk20}
	return
}

$e::
{
	Random, Num,1,50

	if (Num = 1) {
		return
	} 
	Send,{vk45}
	return
}

$a::
{
	Random, Num,1,50

	if (Num = 1) {
		return
	} 
	Send,{vk41}
	return
}