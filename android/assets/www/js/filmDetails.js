$(document).ready(function() {

	
       var iframeEle = $("iframe");
       iframeEle.attr("width", $(document).width());
      
		var movieObj = sessionStorage.getItem("selectedMovie");
		selectedMovieObject = JSON.parse(movieObj);
		console.log(JSON.stringify(selectedMovieObject));
		$("#movieName").html(selectedMovieObject.title);
		$("#cast").html(selectedMovieObject.cast_crew);
		$("#filmDetails").html(selectedMovieObject.body);

		var movieSRC = $(selectedMovieObject.video).attr("src");
		console.log(movieSRC);
		iframeEle.attr("src", movieSRC);

	 	//$('#img_poster').attr('src', "http://jyostar.com"+selectedMovieObject.webthumb);
		
      
	  
    });