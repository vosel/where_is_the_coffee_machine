var hostsAppearences = null;
function initFilteringFacilities()
{
	if (hostsAppearences == null) {
		var tmpMap = new Array();
		var hosts_count = 0;
		for (var i = 0; i < video2Hosts.length; ++i) {
			var currentVideoInfo = video2Hosts[i];
			for (var j = 0; j < currentVideoInfo.hosts.length; ++j) {
				var currentHostName = currentVideoInfo.hosts[j];
				if (tmpMap[currentHostName] == null) {
					tmpMap[currentHostName] = {name:currentHostName, checkboxID: "hostCheckbox_" + hosts_count, videos: new Array() };
					++hosts_count;
				}
				tmpMap[currentHostName].videos.push(currentVideoInfo.id);
			}
		}
		hostsAppearences = new Array();
		for (var entry in tmpMap) {
			if (tmpMap.hasOwnProperty(entry)) {
				hostsAppearences.push(tmpMap[entry]);
			}
		}
		
		hostsAppearences.sort(function(first, second) {
			return first.videos.length < second.videos.length ? 1 : (first.videos.length > second.videos.length ? -1 : 0);
		});
	}
}

function loadFilteringTable(htmlIDForTargetElement)
{
	document.getElementById(htmlIDForTargetElement).innerHTML = getTableHtmlForFilteringByHosts();
}

function getTableHtmlForFilteringByHosts()
{
	initFilteringFacilities();
	var COLS_COUNT = 8;
	var currentHostIndex = 0;
	var result = "<table>";
	for (var i = 0; i < hostsAppearences.length; ++i) {
		if (i % COLS_COUNT == 0) {
			if (i > 0) {
				result += "</tr>";
			}
			result += "<tr>";
		}
		var currentHost = hostsAppearences[i];
		result += "<td>";
		result += "<input type='checkbox' onclick='hostsFilteringSetChanged()' checked='true' id='" + currentHost.checkboxID + "'>" + currentHost.name + "(" + currentHost.videos.length + ")" + "</input>";
		result += "</td>";

	}
	result += "</tr>";
	return result;
}

function deselectEveryoneFromFiltering()
{
	setFilteringValuesToAll(false);
}

function selectEveryoneForFiltering()
{
	setFilteringValuesToAll(true);
}

function setFilteringValuesToAll(valueToSet)
{
	for (var i = 0; i < hostsAppearences.length; ++i) {
		document.getElementById(hostsAppearences[i].checkboxID).checked = valueToSet;
	}
}

function filterOutVideosIDs(arrayToProcess, shouldContainAllSelectedHosts)
{
	return filterOutArrayAccordingToHosts(arrayToProcess, shouldContainAllSelectedHosts, function(entry, callbackForFilteringLogic) {
		return callbackForFilteringLogic(entry.videoID);
	} );
}

function filterOutQuestionsByVideoIDs(arrayToProcess, shouldContainAllSelectedHosts)
{
	return filterOutArrayAccordingToHosts(arrayToProcess, shouldContainAllSelectedHosts, function(entry, callbackForFilteringLogic) {
		for (var i = 0; i < entry.videos.length; ++i) {
			if (callbackForFilteringLogic(entry.videos[i])) {
				return true;
			}
		}
		return false;
	} );
}

//functor_shouldKeepEntry - a function object, which tells the algorithm, if it should keep an element, or throw it away
function filterOutArrayAccordingToHosts(arrayToProcess, shouldContainAllSelectedHosts, functor_shouldKeepEntry)
{
	var totallySelectedHostsCount = 0;
	//this object is a map, which for each of the videoIDs contains the number of selected hosts, which appear in this video
	var videosCountsSelectedForFiltering = new Array();
	for (var i = 0; i < hostsAppearences.length; ++i) {
		if (document.getElementById(hostsAppearences[i].checkboxID).checked) {
			++totallySelectedHostsCount;
			var currentHostVideosList = hostsAppearences[i].videos;
			for (var j = 0; j < currentHostVideosList.length; ++j) {
				var currentVideoID = currentHostVideosList[j];
				if (videosCountsSelectedForFiltering[currentVideoID] == null) {
					videosCountsSelectedForFiltering[currentVideoID] = 0;				
				}
				++videosCountsSelectedForFiltering[currentVideoID];
			}
		}
	}

	var shouldWeKeepTheVideoID_functor = function (videoID) {
		var thresholdValue = shouldContainAllSelectedHosts ? totallySelectedHostsCount : 1;
		return videosCountsSelectedForFiltering[videoID] >= thresholdValue;
	};
	
	//actual filtering is done here.
	var outputArray = new Array();
	for (var i = 0; i < arrayToProcess.length; ++i) {
		var currentEntry = arrayToProcess[i];
		if (functor_shouldKeepEntry(currentEntry, shouldWeKeepTheVideoID_functor)) {
			outputArray.push(currentEntry);
		}
	}
	return outputArray;
}

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