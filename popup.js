document.addEventListener('DOMContentLoaded', function() {
	var goToIssuesButton = document.getElementById("go_to_eissues");
	if (goToIssuesButton) {
		goToIssuesButton.addEventListener("click", goToIssuesSite, false);
	}
	// TODO: We would like to bind this function to Elliot's menu option
	sendIssueDetailAndStartTimer();
});

function goToIssuesSite() {
	chrome.tabs.update({
     url: "https://resckapp05d.research.chop.edu/eISSUESDev/"
	});
}

function sendIssueDetailAndStartTimer() {
	// Show harvest functionality in eISSUES site
	console.log(chrome.tabs)
	chrome.tabs.executeScript({
		code: '(' + function(){
			var xhr = new XMLHttpRequest();
			var issueId="eIRB_00001650";//TODO: Get from Elliot?
			var url = "https://resckapp05d.research.chop.edu/eISSUESDev/CustomLayouts/eIssues/IssueDetails?issueId="+issueId
			xhr.open('GET', url);
			xhr.onload = function() {
				if (xhr.status === 200) {
					var issueDetail = JSON.parse(xhr.responseText,null,null);
					alert(issueDetail.id);
					alert(issueDetail.name);
					// TODO: Raph will be using this information to start / stop timer
				}
				else {
					alert('Request failed.  Returned status of ' + xhr.status);
				}
			};
			xhr.send();
		} + ')();'
	}, function(results) {
		console.log(results[0]);
	});
}


