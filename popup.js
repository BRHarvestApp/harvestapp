document.addEventListener('DOMContentLoaded', function() {
	var goToIssuesButton = document.getElementById("go_to_eissues");
	if (goToIssuesButton) {
		goToIssuesButton.addEventListener("click", goToIssuesSite, false);
	}
});

function goToIssuesSite() {
	chrome.tabs.update({
     url: "https://resckapp05d.research.chop.edu/eISSUESDev/"
	});
}
