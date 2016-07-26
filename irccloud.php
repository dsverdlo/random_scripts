<?php

/*
 * This PHP file, designed to be retrieved by a CRON task, will shortly log
 * a user into his IRCCLOUD account and get some activity in order to stay
 * connected. This will prevent the free trial from disconnecting the user.
 * 
 * Installation/usage instructions:
 * --------------------------------
 *
 * 1. A CRON job should wget this file so all the functions are executed. Since
 *	  the free trial expires after 2 hours of disconnection, every hour, or every
 *	  115 minutes is recommended for the CRON job interval. 
 *
 *	  |---CRON line---------------------------------------------------------|
 *	  | 0 * * * * wget -qO /dev/null FILELOCATION/irccloud.php		|
 *	  |---------------------------------------------------------------------|
 *
 * 2. In the same directory as where you place this file, another file must be made
 *    with the credentials of your IRCCLOUD account in the following format:
 *
 *	  |---creds.php---------------------------------------------------------|
 *	  | <?php return array( 'email'=>'a@b.com', 'password'=>'secret' ); ?>	|
 *	  |---------------------------------------------------------------------|
 *
 * 3. If you don't know a good place to set up cron jobs, make a free account at
 *	  000webhost.com. There you can upload this file via the file manager, add
 *	  the creds.php file and set up the cron job line.
 *
 * @author David Sverdlov
 * @date 2016-07-15
 */ 
 
 // For debugging purposes:
//error_reporting(E_ALL);
//ini_set('display_errors', 'On');

// This function will send a post request to the IRCCLOUD API to retrieve an auth-formtoken.
// Curl equivalent:
// curl -X POST "https://www.irccloud.com/chat/auth-formtoken" --header "content-length: 0"
function getformtoken() {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		'content-length: 0',
    ));
	curl_setopt($curl, CURLOPT_VERBOSE, 1);	
	curl_setopt($curl,CURLOPT_POST, 1);
	curl_setopt($curl,CURLOPT_POSTFIELDS, '');
	curl_setopt_array($curl, array(
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_URL => 'https://www.irccloud.com/chat/auth-formtoken'
	));
	$resp = curl_exec($curl);
	curl_close($curl);
	$resj = json_decode($resp);
	return $resj;
}

// Once a auth-formtoken has been received, it is used together with the user credentials
// to log the user in and retrieve a session key. Curl equivalent:
//curl -d email=MYEMAIL -d password=MYPASSWORD -d token=TOKEN --header "content-type: application/x-www-form-urlencoded" --header "x-auth-formtoken:TOKEN" "https://www.irccloud.com/chat/login" 
function login($formtoken) {

	$credentials = include 'creds.php';
	$email = $credentials['email'];
	$passw = $credentials['password'];
	
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		"content-type: application/x-www-form-urlencoded",
		"x-auth-formtoken: $formtoken",
    ));                               
	curl_setopt($curl,CURLOPT_POST, 1);	
	curl_setopt($curl, CURLOPT_POSTFIELDS, "email=$email&password=$passw&token=$formtoken");
	curl_setopt_array($curl, array(
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_URL => "https://www.irccloud.com/chat/login"));
	$resp = curl_exec($curl);
	curl_close($curl);
	$resj = json_decode($resp);
	return $resj;
}
	
// With a session key, a request is send to a stream to retrieve some values
// Todo: experiment with buffer, getting more output and posting a message. Curl equivalent:
// curl --cookie "session=SESSIONKEY" "https://www.irccloud.com/chat/stream"
function getsth($session) {
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	curl_setopt($curl, CURLOPT_COOKIE, "session=$session");
	curl_setopt_array($curl, array(
		CURLOPT_RETURNTRANSFER => 1,
		CURLOPT_URL => "https://www.irccloud.com/chat/stream",
	));
	$resp = curl_exec($curl);
	curl_close($curl);
	return $resp; // return complete string since embedded json strings can be divided by newlines
}

// Write something in the logfile and stop executing 
function logndie($msg) {
	try {
		$d = date(DATE_ATOM);
		$f = fopen('cronresults.txt', 'a');
		fwrite($f, "$d\t$msg\n");
		fclose($f);
	} catch (Exception $e) {
		continue;
	}
	die(0);
}


try {
	// Get form token
	$formtoken = getformtoken();
	if (!$formtoken) { logndie("No token returned..."); }
	if($formtoken->success != "true") {
		logndie("Formtoken Success=false, reason=".$formtoken->message);
	}
	// Use form token to login
	$login = login($formtoken->token);
	if (!$login) { logndie("Login return empty..."); }
	if($login->success != "true") {
		logndie("Login Success=false, reason=".$login->message);
	}
	// Use session ID to retrieve something
	$get = getsth($login->session);
	if(!$get) { logndie("Didn't get anything"); }
	$info = "";
	foreach(explode("\n", $get) as $line) {
		if($line == "") { continue; }
		$json = json_decode(trim($line, " \t\n"));
		if(isset($json->success) && $json->success != "true") { 
			logndie("Getting Success=false, reason=".$json->message); 
		}
		switch($json->type) {
			case "oob_timeout": break;
			case "header": break;
			case "stat_user": break;
			case "oob_include": break;
			case "num_invites": break;
			case "joined_channel": $info .= "[$json->nick joined $json->chan] "; break;
			case "nickchange": $info .= "[$json->oldnick renamed to $json->oldnick] "; break;
			case "buffer_msg": $info .= "[$json->chan $json->from: $json->msg] "; break;
			default: break;
		}
	}
	// Great success
	logndie("Succes! $info");
	
// If anything goes wrong
} catch (Exception $e) {
	logndie("Exception: $e");
}

// Shouldn't really get here, but let's just add it
echo "I have finished executing my tasks";
die(0);

?>
