
// Search results are populated into $data_questions, one array item per question.

var $data_questions = [];

// In retrospect (I.R.L., I'd bring this up in the first sprint's retro) this could be done a little better. 
// With this data model, it's fiddly to fetch a question's object by ID.

// Each question contains a number of answers, which are populated into this array, one item per question.
// $data_question_answers[question_id] = "100100;140129;121313;";



var $data_question_answers = [];

// Each answer is cached in this array.

var $data_answers = [];


function begin() {
	
	$("#form_search").submit(formSearchSubmit);
	$("#button_close_modal_results").click(function() {$("#modal_results").hide();});
	
	
}

function fetchQuestions($query) {
	var $url="http://api.stackexchange.com/2.2/search?order=desc&sort=activity&site=stackoverflow&filter=withbody";
	
	//	TK: add API key for more queries/day

	$("#alert_search").hide();
	 
	$.getJSON($url, { intitle: $query } ).done(saveQuestions).fail(function(){errorSearch("Couldn't fetch questions for " + $query ); });
	
}

function saveQuestions(data) {
	$data_questions=data.items;
	displayQuestions();
	
}

function displayQuestions() {
	$("#table_questions").show().empty().html("<tr><th>Answered?</th><th>Question</th><th>Date</th></tr>");

	// 	TK: Bubble up answered questions to the top.
	
	$.each($data_questions, function(index) {
		$date_this = new Date;
		$date_this.setTime(parseInt($data_questions[index].creation_date)*1000);
		$("#table_questions").append("<tr data-questionid='" + $data_questions[index].question_id + "'><td>" + 
		($data_questions[index].is_answered ? "<strong class='icon-ok'> </strong>":"" ) + 
		"</td><td>" + $data_questions[index].title + 
		"</td><td>" + $date_this.toDateString() + "</td></tr>"); 

	} ) ;
	
	$("#table_questions tr").click(function(){displayQuestionAnswersModal($(this).data("questionid")) } ) ;
	
	// If they're about to click, we could prefetch this value.
	
	// $("#table_questions tr").mouseover(function(){fetchQuestionAnswers($(this).data("questionid")) } ) ; 
	

}

function fetchQuestionAnswers($question) {
	if ($question) {
		var $url="http://api.stackexchange.com/2.2/questions/" + $question + "/answers?site=stackoverflow";
		
		if ( $data_question_answers[ $question] === undefined) {
			
			$data_question_answers[ $question] = "";
			
			// TK: If a request times out or is dropped, this could leave it impossible to retrieve answers.

			$.getJSON($url, {  } ).done(saveQuestionAnswers).fail(function(){errorSearch("Couldn't fetch answers for " + $question ); });
		}
		
	} else {
	//	errorSearch("<strong>Sorry!</strong> No question provided for fetchQuestionAnswers.");
	}	
	
}

function displayQuestionAnswersModal($question) {
	console.log($question);
	
	fetchQuestionAnswers($question);
	
	// fetchQuestionAnswers should prevent duplicate API hits.
	try{ 
	
	for(var a=0;a<$data_questions.length;a++) {
		if ($data_questions[a].question_id==$question){	
			$("#header_question_title").html( $data_questions[a].title);
			$("#header_question_body").html( $data_questions[a].body);

		}
	}
	
	$("#modal_results").show();
	$("#table_answers").data("question",$question);
	} catch(err){
		console.log(err);
	}
	$("#table_answers").show().empty().html("<tr><th>No answers yet.</th></tr>");


	
}


function displayAnswers($question) {
	console.log("got " + $question);
	
	$("#table_answers").show().empty().html("<tr><th>Accepted?</th><th>Answer</th><th>Date</th></tr>");


	$the_answers=$data_question_answers[$question].split(";");
	
	$.each($the_answers, function(index) {
		try {
			
				
			$date_this = new Date;
			$date_this.setTime(parseInt($data_answers[$the_answers[index]].creation_date)*1000);
			$("#table_answers").append("<tr data-questionid='" + $data_answers[$the_answers[index]].question_id + "'><td>" + 
			($data_answers[$the_answers[index]].is_accepted ? "<strong class='icon-ok'> </strong>":"" ) + 
			"</td><td>" + $data_answers[$the_answers[index]].body + 
			"</td><td>" + $date_this.toDateString() + "</td></tr>"); 
		} catch(err) {
		};
		
	} ) ;
	
	
	



	
}



function saveQuestionAnswers(data) {

	var $touched_items = [];
	
	var $this_response = data.items;
 	if ($this_response.length > 0){ 


		try {
			$.each($this_response, function(index) {
			
				if ($this_response[index].answer_id) {
						
					// append each answer, semicolon-delimited, to $data_question_answers["question"+id].
		
					// TK Bugfix: this is still accepting empty answer_id
					
					$data_question_answers[ parseInt( $this_response[index].question_id)] = 
						$data_question_answers[ parseInt( $this_response[index].question_id)] + ";" +
						$this_response[index].answer_id;						
					$touched_items[($this_response[index].question_id)]=($this_response[index].question_id);
					
				}
					
			} ) ;
		} catch(err) {
			
		};
		
	} else {
			 
		// No answers to this question.
					
	}
	var $this;
	while( $this=$touched_items.pop()) {
		fetchAnswers($data_question_answers[$this]);
	}
	
	
}


function fetchAnswers($answers) {
	
	$answers.replace(/^\;/,"");
 	
	if ($answers) {
		var $url="http://api.stackexchange.com/2.2/answers/" + $answers + "/?site=stackoverflow&filter=withbody";
			 
		$url=$url.replace("/;","/"); // remove superfluous semicolon
			 
			 
				$.getJSON($url ).done(saveAnswers).fail(function(){errorSearch("Couldn't fetch answers for "
				 + $answers ); });
				 
				 
	} else {
		
	}
	
	
	

	

}
 
 
 
function saveAnswers(data) {

	
	var $this_response = data.items;
 	if ($this_response.length > 0){ 


		try {
			$.each($this_response, function(index) {
			
				if ($this_response[index].answer_id) {
						
					// append each answer object
					
					$data_answers[$this_response[index].answer_id] = $this_response[index];
					
					
						
				}
					
			} ) ;
		} catch(err) {
			
		};
		
	} else {
			 
		// No answers returned.
		
		// TK: Handle this somehow
		
		
	}	
	
	displayAnswers($("#table_answers").data("question"));

	
	
}





function errorSearch($message) {

$("#alert_search").html($message).show();

}


function formSearchSubmit() {
	var $query=$("#input_search_query").val();
		
	if ($query=="") {	

		errorSearch("<strong>Sorry!</strong> Could you please enter a word or two? Then I can fetch answers for you.");

	} else {
		fetchQuestions($query);	

		// TK: show status message

	}
	
	
	return false;	
	
}




$(document).ready(begin);

