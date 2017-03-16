
	function hello() {
		alert("HELLO :)")
		//console.log("PortalTools:"+PortalTools);
		var harvestButton = document.getElementById("harvest_startTimer");
		if (harvestButton !== null && harvestButton !== undefined) {
			harvestButton.style.display = "inline-block";

		}
		else {
			// TODO: Replace with Elliot's code
			harvestButton = document.createElement("span");
			harvestButton.id="harvest_startTimer";
			harvestButton.innerHTML = "Start Timer!";
			harvestButton.style = "color:pink;font-weight:bold;";
			//TODO: Call Raph's method to Start / stop timer
			harvestButton.onclick = function() {
				alert("AAAAAAa")
				//	var result = PortalTools.callRemoteMethod("eIssuesRemoteMethods.getIssueData", null, null);
					//console.log("RESULT:")
					//console.log(result);
			};
			var issueId = document.getElementById("__Issue.ID_container");
			issueId.appendChild(harvestButton);
		}
	}