function getQuestion(questionID)
{
	return questions.find(function(elem) {return elem.id == questionID; } );
}

function getVideoEntryCorrectionFormCode(videoID, entryID, fieldToCorrect)
{
	var result = "<form action='https://docs.google.com/forms/d/e/1FAIpQLSf0hjGsvOCrbDU1VXfKVkc5FtAkgG5gzTzWfmK-dO5ITakD8Q/formResponse' method='post' target='_blank'>"
	 + "<input type='hidden' name='entry.1251312794' value='" + videoID + "'></input>"
	 + "<input type='hidden' name='entry.1719810943' value='" + entryID + "'></input>"
	 + "<input type='hidden' name='entry.144359646' value='" + fieldToCorrect + "'></input>"
	 + "<input type='text' name='entry.1642459692' placeholder='new value' required></input>"
	 + "<button>submit</button>"
	 + "</form>";

	return result;
}
function getQuestionFieldCorrectionFormCode(questionID, fieldToCorrect)
{
	var result = "<form action='https://docs.google.com/forms/d/e/1FAIpQLSdT0sFHwc-XVJ2yRfrrOxPikxb0rNVpmkf-XbDROlXZO1LRRg/formResponse' method='post' target='_blank'>"
	 + "<input type='hidden' name='entry.1538524474' value='" + questionID + "'></input>"
	 + "<input type='hidden' name='entry.1856597797' value='" + fieldToCorrect + "'></input>"
	 + "<input type='text' name='entry.741206655' placeholder='new value' required></input>"
	 + "<button>submit</button>"
	 + "</form>";
	return result;
}

function embedVideo(frameID, videoID, offset, shouldPlay)
{
	var url = "https://www.youtube.com/embed/" + videoID + "?start=" + offset;
	if (shouldPlay) {
		url += "&autoplay=1"
	}
	document.getElementById(frameID).src = url;
}
function timeCodeToString(timecode)
{
	var result = "";
	var hours = Math.floor(timecode/3600);
	if (hours > 0) {
		result += padWithZeros(hours) + ":";
	}
	var mins = Math.floor((timecode - hours * 3600)/60);
	result += padWithZeros(mins) + ":";
	var sec = timecode % 60;
	result += padWithZeros(sec);
	return result;
}
function padWithZeros(num)
{
	if (num < 10) {
		return "0" + num;
	}
	return "" + num;
}