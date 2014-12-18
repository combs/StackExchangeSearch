var data_search = [];
var data_answers = [];


function begin() {
	
	$("#form_search").submit(formSearchSubmit);
		
	
}

function fetchSearch($query) {
	var $url="http://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow";
	$("#alert_search_blank").hide();

	//  TK: do this in the background
	 
	$.getJSON($url, { intitle: $query } ).done(saveSearch);
	
}

function saveSearch($data) {
	$data_search=$data;
	alert("Got results");
}


function formSearchSubmit() {
	var $query=$("#input_search_query").val();
		
	if ($query=="") {	
		$("#alert_search_blank").show();
		return false;
	} else {
		
		
		fetchSearch($query);	
		
		// TK: show status message
		
		return false;
		
	}
	
	
	return false;	
	
}




$(document).ready(begin);

