$(document).ready(function(){
	
	$("#moviesList").on("click", function(){
		sessionStorage.setItem("currentPage","Movies");
		showIndexPage();
	});
	
	$("#tvSerials").on("click", function(){
		sessionStorage.setItem("currentPage","Serials");
		showIndexPage();
	});
	
	function showIndexPage(){
		$("#film-index-page").show();
		$(".slider").show();
		$("#film-details-page").hide();
	}
});