var $data_questions = [];
var $data_answers = [];


function begin() {
	
	$("#form_search").submit(formSearchSubmit);
		
	
}

function fetchQuestions($query) {
	var $url="http://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow";
	
	//	TK: add API key for more queries/day

	$("#alert_search_blank").hide();
	 
	$.getJSON($url, { intitle: $query } ).done(saveQuestions).fail(errorQuestions);
	
}

function saveQuestions(data) {
	$data_questions=data.items;
	displayQuestions();
	
}

function displayQuestions() {
	$("#table_questions").show().empty().html("<tr><th>Answered?</th><th>Question</th><th>Date</th></tr>");
	$.each($data_questions, function(index) {
		$date_this = new Date(parseInt($data_questions[index].creation_date));
		$("#table_questions").append("<tr><td>" + 
		($data_questions[index].is_answered ? "<strong class='icon-ok'> </strong>":"" ) + 
		"</td><td>" + $data_questions[index].title + 
		"</td><td>" + $date_this.toDateString() + "</td></tr>"); 
	} ) ;
	
}

function errorQuestions(data) {
	
	// 	TK: display error message in #alert_search_error
	
}


function formSearchSubmit() {
	var $query=$("#input_search_query").val();
		
	if ($query=="") {	
		$("#alert_search_blank").show();
		return false;
	} else {
		
		
		fetchQuestions($query);	
		
		// TK: show status message
		
		return false;
		
	}
	
	
	return false;	
	
}




$(document).ready(begin);

