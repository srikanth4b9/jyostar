

$(document).ready(function(){
	//Initially loading Movies data
	$(document).on("change", "#mtype", function(){
		var selectedMovieType = $("#mtype option:selected").val();
		alert(selectedMovieType);
		
	});

	$(document).on("change", "#language", function(){
		var selectedLanguage = $("#language option:selected").val();
				alert(selectedLanguage);
	});
});
 