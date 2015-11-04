$(document).ready(function() {
	
       var iframeEle = $("iframe");
       iframeEle.attr("width", $(document).width());
      
		var movieObj = sessionStorage.getItem("selectedMovie");
		selectedMovieObject = JSON.parse(movieObj);
		console.log(JSON.stringify(selectedMovieObject));
		$("#movieName").text(selectedMovieObject.title);
		$("#cast").text(selectedMovieObject.cast_crew);
		$("#filmDetails").text(selectedMovieObject.body);

		var movieSRC = $(selectedMovieObject.video).attr("src");
		console.log(movieSRC);
		iframeEle.attr("src", movieSRC);
      
    });