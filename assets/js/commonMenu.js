$(document).ready(function(){
	
	$("#moviesList").on("click", function(){
		sessionStorage.setItem("currentPage","Movies");
		window.location.href = "index.html";
	});
	
	$("#tvSerials").on("click", function(){
		sessionStorage.setItem("currentPage","Serials");
		window.location.href = "index.html";
		
	});
});