document.addEventListener('DOMContentLoaded', function() {
	var goToIssuesButton = document.getElementById("go_to_eissues");
	if (goToIssuesButton) {
		goToIssuesButton.addEventListener("click", goToIssuesSite, false);
	}
	// TODO: We would like to bind this function to Elliot's menu option
	//sendIssueDetailAndStartTimer();
});

function goToIssuesSite() {
	chrome.tabs.update({
     url: "https://resckapp05d.research.chop.edu/eISSUESDev/"
	});
}
