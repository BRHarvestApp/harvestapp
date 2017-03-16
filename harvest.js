// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
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

function getHarvest(URL, params, successFn, errorFn) {
    
    // +
    //'?v=1.0&q=' + encodeURIComponent(searchTerm);

    var x = new XMLHttpRequest();
    
    x.open('GET', URL);

    x.setRequestHeader('Content-Type', 'application/json');
    x.setRequestHeader('Accept', 'application/json');
    
    x.responseType = 'json';

    x.onload = function() {
	var response = x.response;
	if (!response || response.length === 0) {
	    errorFn('No response from Harvest!');
	    return;
	} else {
	    successFn(response);
	}
    };
    x.onerror = function() {
	errorFn('Network error.');
    };
    x.send(params);
}

function postHarvest(URL, params, successFn, errorFn) {

    var x = new XMLHttpRequest();
    
    x.open('POST', URL);

    x.setRequestHeader('Content-Type', 'application/json');
    x.setRequestHeader('Accept', 'application/json');
    
    x.responseType = 'json';

    x.onload = function() {
	var response = x.response;
	if (!response || response.length === 0) {
	    errorFn('No response from Harvest!');
	    return;
	} else {
	    successFn(response);
	}
    };
    x.onerror = function() {
	errorFn('Network error.');
    };
    x.send(params);
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function(response) {
    getCurrentTabUrl(function(url) {
	renderStatus('Transmogrifying Harvest Data for ' + url);
	getHarvest(
	    'https://badrabbit.harvestapp.com/account/who_am_i',
	    null,
	    function(response) {
		console.log("GOT RESPONSE: " + response);
		renderStatus('You are ' + response.user.email);
	    },
	    function(errorMessage) {
		renderStatus('Error: ' + errorMessage);
	    }
	);

	var monday = new Date("03/15/2017");

	getHarvest(
	    'https://badrabbit.harvestapp.com/daily/' + monday.getDOY() +'/' + monday.getFullYear(),
	    null,
	    function(response) {
		console.log("GOT RESPONSE: " + JSON.stringify(response));
	    },
	    function(errorMessage) {
		renderStatus('Error: ' + errorMessage);
	    }
	);

	// "projects":[{"id":11193369,"name":"CHOP Agreements FY17","billable":true,"code":"",
	//               "tasks":[{"id":1550045,"name":"Development","billable":true},
	//               ...

	if(true) {
	    postHarvest(
		'https://badrabbit.harvestapp.com/daily/add',
		JSON.stringify({
		    "notes": "Test API support",
		    "project_id": "11193369",
		    "task_id": "1550045"
		}),
		function(response) {
		    console.log("GOT RESPONSE: " + JSON.stringify(response));
		},
		function(errorMessage) {
		    renderStatus('Error: ' + errorMessage);
		}
	    );
	}
    });
});


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
