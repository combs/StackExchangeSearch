
// Search results are populated into $data_questions, one array item per question.

var $data_questions = [];

// Each question contains a number of answers, which are populated into this keyed array, one array item per question.

var $data_question_answers = [];

// Each answer is cached in this keyed array.
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
	$data_questions.sort(function(first,second){return second.creation_date - first.creation_date;} );
	
	// 	TK: Bubble up answered questions to the top.
	
	$.each($data_questions, function(index) {
		$date_this = new Date;
		$date_this.setTime(parseInt($data_questions[index].creation_date)*1000);
		$("#table_questions").append("<tr data-question-id='" + $data_questions[index].question_id + "'><td>" + 
		($data_questions[index].is_answered ? "<strong class='icon-ok'> </strong>":"" ) + 
		"</td><td>" + $data_questions[index].title + 
		"</td><td>" + $date_this.toDateString() + "</td></tr>"); 

	} ) ;
	
	$("#table_questions tr").click(function(){displayAnswers($(this).data("question-id")) } ) ;
	
	// If they're about to click, let's prefetch this value.
	
	$("#table_questions tr").mouseover(function(){fetchAnswers($(this).data("question-id")) } ) ; 
	

}

function fetchAnswers($question) {
	if ($question) {
		var $url="http://api.stackexchange.com/2.2/questions/" + $question + "/answers";
		
		
	} else {
	}
	
}

function displayAnswers($question) {
	
	fetchAnswer($answer);
	
	// TK: Only fetch if needed.
	
}

function saveAnswers(data) {
	
	
	
	
}


function fetchAnswer($answer) {
	
	var $url="http://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow";
	
	
	
	
}

function displayAnswer($answer) {
	
	fetchAnswer($answer);
	
	// TK: Only fetch if needed.
	
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

