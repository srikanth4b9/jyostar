$(document).ready(function() {

    setTimeout(function(){
		$('.slider').slick({
		        dots: false,
		        infinite: true,
		        speed: 500,
		        fade: true,
		        arrows: false,
		        autoplay: true,
		        autoplaySpeed: 2000,
		        cssEase: 'linear'
		    });
	
    }, 300)
	getcurrentLocatation();

	function populateMoviesData(response){
		moviesArray = response.info;
		var html = "";
		$.each(moviesArray, function(i, item) {
			html += '<li id="updateVersionItem-' + (i) + '" class = "listitem" onclick="onClickMovie(' + i + ')">\
												<a href="#"><img src="http://jyostar.com/star/videoadmin/kcfinder/upload/files/aagam-poster.jpg"><h2>' + item.title + '</h2>\
												<p class="dscrp">' + item.body + '</p><div class="other-dtls"><p><span>Duration: </span>\
												<span>' + item.duration + '</span></p><p><span>Language: </span><span>' + item.language + '</span>\
												</p><p><span>Gener: </span><span>' + item.gener + '</span></p>\
												</div><i class="fa fa-chevron-right"></i></a></li>'

		});
		$('.film-list').empty().append(html).listview('refresh');		   
		
	}
	
	function populateGridView(response){
		moviesArray = response.info;
		var html = "";
		$.each(moviesArray, function(i, item) {
			html += '<li id="updateVersionItem-' + (i) + '" class = "ui-li-has-thumb" onclick="onClickMovie(' + i + ')"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><img src="http://jyostar.com'+item.mobilethumb+'" class="ui-li-thumb"><p>' + item.title + '</p></a></li>';

		});

		$('.film-list').empty();
		$("#gridView").empty().append(html).listview('refresh');
	}
	
	//Common function to call "GET" service with url, input data and successcallback
	function makeAJAXCall(url, inputData, successCallBack){
		$.ajax({
				type: "GET",
				url: url,
				data: inputData,
				dataType: "json",
				crossDomain: true,
				success: function(response) {
					successCallBack.call(successCallBack, response);
				},
				error: function(e) {
					alert("error" + e);
					console.log(e.message);
				}
    	});
	}

	function populateSerialsData(response){
		serialsArray = response.info;
		var html = "";
		$.each(serialsArray, function(i, item) {
			html += '<li id="updateVersionItem-' + (i) + '" class = "listitem" onclick="onClickSerial(' + i + ')">\
												<a href="#"><img src="images/film-1.jpg"><h2>' + item.title + '</h2>\
												<p class="dscrp">' + item.body + '</p><div class="other-dtls"><p><span>Duration: </span>\
												<span>' + item.duration + '</span></p><p><span>Language: </span><span>' + item.language + '</span>\
												</p><p><span>Gener: </span><span>' + item.gener + '</span></p>\
												</div><i class="fa fa-chevron-right"></i></a></li>'

		});
		$('.film-list').empty().append(html).listview('refresh');
	
		
	}
	
	function getcurrentLocatation() {
		
		$.getJSON("http://www.telize.com/geoip?callback=?",
				function(json) {
					var country = json.country_code;
					var currentPage = getcurrentSelectedPageFromSession();	
					if (currentPage === "Movies") {
						getMoviesDataFromServer(country);
					}else {
						getTvDataFromServer (country);
					}
				}
			);
	}
	
	// Get Movies data from Jyostar server

	function getMoviesDataFromServer(country) {
		var moviesURL = "http://jyostar.com/star/videoadmin/Apprest.php";
		var inputData = { "cuid": country };
		makeAJAXCall(moviesURL, inputData, populateGridView);
		
	}

	//Get TV Shows data from Jyostar server

	function getTvDataFromServer(country) {
		var serialsURL = "http://jyostar.com/star/videoadmin/Apprestserial.php";
		var inputData = { "cuid": country};
		makeAJAXCall(serialsURL, inputData, populateSerialsData);
	}
});



function savedatainsessionWithKey(data,key) {
	sessionStorage.setItem(key,data);
}

function getdatafromsessionForKey(key) {
	var currentPage2 = sessionStorage.getItem(key);
	return currentPage2;
}

function getcurrentSelectedPageFromSession() {
	var currentPage1 = getdatafromsessionForKey("currentPage");
	if (!currentPage1) {
		currentPage1 = "Movies";
		savedatainsessionWithKey(currentPage1,"currentPage");
	}
	return currentPage1;
	 
}


function onClickMovie(id) {
	//console.log('Do something with ' + id);
	//console.log(JSON.stringify(moviesArray[id]));
	//sessionStorage.setItem("selectedMovie", JSON.stringify(moviesArray[id]));
	savedatainsessionWithKey(JSON.stringify(moviesArray[id]),"selectedMovie");
	window.location.href = "filmdetails.html";
}

function onClickSerial(id) {
	//console.log('Do something with ' + id);
	//console.log(JSON.stringify(serialsArray[id]));
	//sessionStorage.setItem("selectedSerial", JSON.stringify(serialsArray[id]));
	savedatainsessionWithKey(JSON.stringify(serialsArray[id]),"selectedMovie");
	window.location.href = "filmdetails.html";
}


