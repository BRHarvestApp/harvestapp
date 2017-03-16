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
		if( !$target.is("#start_work") && !$target.is(".issue") && !$target.is(".message_body") )
		{
			$("#start_work").removeAttr("issueId");
			$("#start_work").hide();
		} else if( $target.is(".message_body") && e.type === "contextmenu" ){
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
	
})(jQuery);