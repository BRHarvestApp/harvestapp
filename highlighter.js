(function($){
	var nodes = [];
	var issueIds = document.body.innerHTML.match(/\w+_\d{8}/g);
	$(document.body).append("<input id='start_work' type='button' value='Start Work'>");
	$("#start_work").hide();
	
	var walkDOM = function(node, func) {
		func(node);
		node = node.firstChild;
		while(node){
			walkDOM(node, func);
			node = node.nextSibling;
		}
	};
	
	walkDOM(document.body, function(node){
		var text = node.nodeValue;
		if( text && text.match(/[e|T]\w+_\d{8}/g) ){
			var $parent = $(node.parentNode);
			if( !$parent.is(".issue") ){
				nodes.push($parent);
				$parent.html("<span class='issue' style='background-color: yellow'>" + text + "</span>");
			}
		}
	});
	
	$("#start_work").click(function(e){
		var id = $(this).attr("issueId");
		sendIssueDetailAndStartTimer(id);
	});
	
	$(".issue").contextmenu(function(e){
		displayStartWorkButton(e, $(this).text());
	});
	
	var displayStartWorkButton = function(e, issueId){
		e.preventDefault();
		$("#start_work").css({'top':e.pageY,'left':e.pageX, 'position':'absolute', 'border':'1px solid black', 'padding':'5px'});
		$("#start_work").attr("issueId", issueId);
		$("#start_work").show();
	}
	
	$(document).on("click contextmenu", function(e){
		var $target = $(e.target);
		if( e.type === 'click' || $("start_work").is(":visible") ){
			$("#start_work").removeAttr("issueId");
			$("#start_work").hide();
		} else if( e.type === "contextmenu" && !$target.is(".issue") ){
			var targetText = $target.html();
			var ids = targetText.match(/[e|T]\w+_\d{8}/g);
			if( ids && ids.length > 0 )
			{
				var id = ids[0];
				displayStartWorkButton(e, id);
			} else {
				$("#start_work").removeAttr("issueId");
				$("#start_work").hide();
			}
			
		}
	});
	
	function sendIssueDetailAndStartTimer(issueId) {
		// Show harvest functionality in eISSUES site
		var xhr = new XMLHttpRequest();
		//var issueId="eIRB_00001650";//TODO: Get from Elliot?
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
	}
})(jQuery);