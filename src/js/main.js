var BLINK_TIME = 600;
var MAX_MESSAGES = 5;
var MIN_MESSAGE_TIME = 500;
var MAX_MESSAGE_TIME = 1500;

window.onload = init;

var terminalWindow = null;
var typingArea = null;
var cursor = null;

var stringArr = new Array();

var returnCtr = 0;

var allowedKeys = new Array();
allowedKeys["8"] = 1; //Backspace key
allowedKeys["13"] = 1; //Return/Enter key
allowedKeys["32"] = 1; //Space bar

function init() {
	terminalWindow = document.getElementById("terminal_window");

	$(document).keydown(function(event) {
		var keyVal = String.fromCharCode(event.keyCode);

		if(/[A-Z0-9]/.test(keyVal) || event.keyCode == 32) { //only allow alphanumerics and space
			if(event.keyCode == 32) {
				typingArea.innerHTML += "&nbsp;"
				stringArr.push("&nbsp;");
			} //end if
			else {
				typingArea.innerHTML += keyVal;
				stringArr.push(keyVal);
			} //end else
		} //end if
		else if(allowedKeys[event.keyCode.toString()]) { //handle special keys
			switch(event.keyCode) {
				case 8: //backspace
					event.preventDefault();

					stringArr[stringArr.length - 1] = null; //remove last character
					stringArr.length = stringArr.length - 1;
					typingArea.innerHTML = stringArr.join(""); //write stored characters to typing area
					break;
				case 13: //return/enter
					event.preventDefault();

					processInput();

					//create new line
					stringArr = new Array();
					typingArea.id = "typing_area_old_" + returnCtr++;
					$(cursor).before('<br />user@holycow2.com:~$&gt; <span id="typing_area"></span>');
					typingArea = document.getElementById("typing_area");
					break;
			} //end switch
		} //end else if

		$(terminalWindow).scrollTo("100%", 0); //scroll to the bottom of the terminal window
	});

	displayBootMessage(); //start boot sequence
} //end function init

var bootMsgCnt = 0;
var loadedMsgs = new Object();
function displayBootMessage() {
	if(bootMsgCnt >= MAX_MESSAGES) { //stop writing messages when we've reached the max
		window.setTimeout(finalizeInit, getRandomNumber(MIN_MESSAGE_TIME, MAX_MESSAGE_TIME));
		return;
	} //end if

	//get random message index ensuring that an index is not selected more than once
	var msgIdx = -1;
	while(true) {
		msgIdx = getRandomNumber(0, bootMessages.length - 1);
		if(!loadedMsgs[msgIdx]) {
			loadedMsgs[msgIdx] = 1;
			break;
		} //end if
	} //end while

	//display boot message
	terminalWindow.innerHTML += bootMessages[msgIdx] + "......";
	window.setTimeout(function() { //wait a moment before writing "Done."
		++bootMsgCnt;
		terminalWindow.innerHTML += "Done.<br />";
		displayBootMessage();
	}, getRandomNumber(MIN_MESSAGE_TIME, MAX_MESSAGE_TIME));
} //end function displayBootMessage

function finalizeInit() {
	terminalWindow.innerHTML += '<br /><br />' + 
'To view information about examples of my work, please enter one of the available commands:<br />' + 
'1. YAHTZEE<br />' + 
'2. TILEGAME<br />' + 
'3. OPTMANIP<br /><br />' + 
'Type \'HELP\' at any time to view these options again.<br /><br />' + 
'user@holycow2.com:~$&gt; <span id="typing_area"></span><span id="cursor">_</span>';

	//get necessary references for typing area
	typingArea = document.getElementById("typing_area");
	cursor = document.getElementById("cursor");

	blinkOn(); //start cursor blinking
} //end function finalizeInit

function processInput() {
	//collect input
	var input = stringArr.join("");
	input = input.replace(/[&nbsp;]+/g, " "); //convert HTML spaces to single spaces

	if(input.length > 0) {
		if(IO[input.toLowerCase()])
			$(typingArea).after("<br />" + IO[input.toLowerCase()]);
		else
			$(typingArea).after("<br />" + "Unknown command '" + input + "'");
	} //end if
} //end function processInput

function blinkOn() {
	cursor.style.display = "inline";
	window.setTimeout(blinkOff, BLINK_TIME);
} //end function blinkOn

function blinkOff() {
	cursor.style.display = "none";
	window.setTimeout(blinkOn, BLINK_TIME);
} //end function blinkOff

function getRandomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
} //end method getRandomNumber