var prefixSiteMap = {
    'eISS_':    'eIssues',
    'IT_':      'IT',
    'eSPA_':    'eSPA',
    'eAGREE_':  'eAgreements',
    'eRPT_':    'eRPT',
    'TBOX_':    'Toolbox',
    'eIBC_':    'eIBC',
    'eSAFETY_': 'eSAFETY',
    'eCOI_':    'eCOI',
    'eTRACK_':  'eTRACK',
    'eIACUC_':  'eIACUC',
    'ACCT_':    'Accounts',
    'eIRB_':    'eIRB/eCTRC'
};

var siteProjectMap = {
    'eAgreements': 'CHOP Agreements FY17',
    'eCOI':        'CHOP eCOI FY17',
    'eIACUC':      'CHOP eIACUC FY17',
    'eIBC':        'CHOP eIBC FY17',
    'eIRB/eCTRC':  'CHOP eIRB FY17',
    'eIssues':     'CHOP eISSUES FY17', 
    'eSAFETY':     'CHOP eSAFETY FY17',
    'eSPA':        'CHOP eSPA FY17',
    'eTRACK':      'CHOP eTRACK FY17',
    'Toolbox':     'CHOP TBOX FY17',
}

function getCurrentTabUrl(callback) {
    
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-quer,
    var queryInfo = {
	active: true,
	currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
	// chrome.tabs.query invokes the callback with a list of tabs that match the
	// query. When the popup is opened, there is certainly a window and at least
	// one tab, so we can safely assume that |tabs| is a non-empty array.
	// A window can only have one active tab at a time, so the array consists of
	// exactly one tab.
	var tab = tabs[0];

	// A tab is a plain object that provides information about the tab.
	// See https://developer.chrome.com/extensions/tabs#type-Tab
	var url = tab.url;

	// tab.url is only available if the "activeTab" permission is declared.
	// If you want to see the URL of other tabs (e.g. after removing active:true
	// from |queryInfo|), then the "tabs" permission is required to see their
	// "url" properties.
	console.assert(typeof url == 'string', 'tab.url should be a string');

	console.log("Calling callback for " + url);

	callback(url);
    });

    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, function(tabs) {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function httpRequest(operation, URL, params) {
    return new Promise(function(resolve, reject) {
	// Standard XHR to load an image
	var request = new XMLHttpRequest();
	console.log("HTTP Request for URL " + URL);
	console.log("HTTP Request PARMS   " + params);
	request.open(operation, URL);
	request.setRequestHeader('Content-Type', 'application/json');
	request.setRequestHeader('Accept', 'application/json');
	request.responseType = 'json';

	request.onload = function() {
	    var response = request.response;
	    if (request.status == 200 || request.status == 201 || (response && response.length>0)) {
		// If successful, resolve the promise by passing back the request response
		console.log("RESPONSE OK");
		resolve(response);
	    } else {
		console.log("RESPONSE FAIL " + JSON.stringify(request.status));
		console.log("RESPONSE FAIL " + JSON.stringify(response));
		reject(Error("Response fail: " + request.status + " " + request.statusText));		
	    }
	    
	};
	
	request.onerror = function() {
	    // Also deal with the case when the entire request fails to begin with
	    // This is probably a network error, so reject the promise with an appropriate message
	    reject(Error('There was a network error.'));
	};

	// Send the request
	request.send(params);
    });
}

function renderStatus(statusText) {
    console.log(statusText);
    //document.getElementById('status').textContent = statusText;
}

// http://resckapp05d.research.chop.edu/eISSUESDev/CustomLayouts/eIssues/IssueDetails

function getHarvestProjects(response, issuePrefix) {
    
    var today = new Date();

    return new Promise(function(resolve, reject) {

	var projects = response.projects;
	
	var siteName = prefixSiteMap[issuePrefix];

	if(!siteName) {
	    reject(Error("can't find site for issue prefix " + issuePrefix));
	} else {

	    var projectName = siteProjectMap[siteName];

	    if(!projectName) {
		reject(Error("can't find project name for site " + siteName));
		
	    } else {
		
		var proj = projects.find(function (elt) {
		    return elt.name==projectName;
		});
		
		if(!proj) {
		    reject(Error("can't find project for projectName " + projectName));
		} else {
		    
		    var task = proj.tasks.find(function (elt) {
			return elt.name=="Development";
		    });

		    if(!task) {
			reject(Error("can't find development task for projectName " + projectName));
		    } else {
			resolve([proj.id, task.id]);
		    }
		}
	    }
	}
    });
}

function getDaily(response) {
    renderStatus('You are ' + response.user.email);
    return httpRequest('GET',
		       'https://badrabbit.harvestapp.com/daily/' +
		       new Date().getDOY() + '/' +
		       new Date().getFullYear(),
		       null);
}

function addEntry (parms, notes) {
    var proj_id=parms[0];
    var task_id=parms[1];
    console.log(proj_id + "::" + task_id);
    return httpRequest('POST',
		       'https://badrabbit.harvestapp.com/daily/add',
		       JSON.stringify({
			   "notes": notes,
			   "project_id": proj_id,
			   "task_id": task_id
		       }));
}

function logSuccess (response) {
    console.log("GOT RESPONSE: " + JSON.stringify(response));
    renderStatus('Added task ' + response.project +
		 "/" + response.task +
		 ": " + response.notes);
};

/*
  document.addEventListener('DOMContentLoaded', function(response) {
  getCurrentTabUrl(function(url) {
  renderStatus('Transmogrifying Harvest Data for ' + url);
  httpRequest('GET', 'https://badrabbit.harvestapp.com/account/who_am_i', null)
  .then(getDaily)
  .then(getHarvestProjects)
  .then(addEntry)
  .then(logSuccess, function(error) {
  renderStatus('Error: ' + error.message);
  })
  });
  });
*/

Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.getDOY = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

