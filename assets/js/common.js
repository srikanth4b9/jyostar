$(document).ready(function() {
	
	function appendSelectOptions(response){
		var uniqueMovieTypes = _.uniq(_.pluck(_.flatten(response), "type"));
		var uniqueMovieGener = _.uniq(_.pluck(_.flatten(response), "gener"));
		var uniqueMovieLanguages = _.uniq(_.pluck(_.flatten(response), "language"));
		
		uniqueMovieTypes.unshift("All");
		uniqueMovieGener.unshift("All");
		uniqueMovieLanguages.unshift("All");
		
		var typeOptionsTemplate = "";
		var languageOptionsTemplate = "";
		var generOptionsTemplate = "";
		_.each(uniqueMovieTypes, function(item){
			typeOptionsTemplate += "<option value='"+item+"'>"+item+"</option>";
		});
		_.each(uniqueMovieLanguages, function(item){
			languageOptionsTemplate += "<option value='"+item+"'>"+item+"</option>";
		});
		_.each(uniqueMovieGener, function(item){
			generOptionsTemplate += "<option value='"+item+"'>"+item+"</option>";
		});
		
		$("#mtype").empty().append(typeOptionsTemplate);//.find("option:eq(0)").attr("selected", "selected");
		$("#language").empty().append(languageOptionsTemplate);
		$("#gener").empty().append(generOptionsTemplate);
		
		var myselect = $("select#mtype")
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
		
		var myselect = $("select#language")
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
		
		var myselect = $("select#gener")
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
	}

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
	
	getcurrentLocatation();

	function renderGridData(arrObj){
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
	
	function populateGridView(response, fromService){
		if(fromService == "FROM_SERVICE"){
			appendSelectOptions(response);
			moviesArray = response;
		}

		var html = "";
		$.each(response, function(i, item) {
			html += '<li id="updateVersionItem-' + (i) + '" class = "ui-li-has-thumb" onclick="onClickMovie(' + i + ')"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><img src="http://jyostar.com'+item.mobilethumb+'" class="ui-li-thumb"><p>' + item.title + '</p></a></li>';
		});

		$('.film-list').empty();
		$("#gridView").empty().append(html).listview('refresh');
	}
	
	function filterMovies(){
		var selectedMovieType = $("#mtype option:selected").val();
		var selectedLanguage = $("#language option:selected").val();
		var selectedGener = $("#gener option:selected").val();
		
		var filteredMovietype = (selectedMovieType == "All" ? moviesArray : _.filter(moviesArray, function(item){ return item.type == selectedMovieType;}));
		var filteredMovieTypeAndLanguage = (selectedLanguage == "All" ? filteredMovietype : _.filter(filteredMovietype, function(item){ return item.language == selectedLanguage;}));
		var filteredMovieWithAll = (selectedGener == "All" ? filteredMovieTypeAndLanguage : _.filter(filteredMovieTypeAndLanguage, function(item){ return item.gener == selectedGener;}));
		return filteredMovieWithAll;
	}
	
	$(document).on("change", "#mtype", function(){
		var moviesArr = filterMovies();
		populateGridView(moviesArr);
	});
	
	$(document).on("change", "#language", function(){
		var moviesArr = filterMovies();
		populateGridView(moviesArr);
	});
	
	$(document).on("change", "#gener", function(){
		var moviesArr = filterMovies();
		populateGridView(moviesArr);
	});
	
	//Common function to call "GET" service with url, input data and successcallback
	function makeAJAXCall(url, inputData, successCallBack){
		$.ajax({
				type: "GET",
				url: url,
				data: inputData,
				dataType: "json",
				crossDomain: true,
				success: function(response) {
					successCallBack.call(successCallBack, response.info, "FROM_SERVICE");
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
		makeAJAXCall(serialsURL, inputData, populateGridView);
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
	renderDetailsPage(moviesArray[id]);
	
}

function onClickSerial(id) {
	renderDetailsPage(serialsArray[id]);
}

function renderDetailsPage(selectedMovieObject){
	
	$("#film-index-page").hide();
	$(".slider").hide();
	$("#film-details-page").show();
	
    var iframeEle = $("iframe");
    iframeEle.attr("width", $(document).width());
   
	$("#movieName").html(selectedMovieObject.title);
	$("#cast").html(selectedMovieObject.cast_crew);
	$("#filmDetails").html(selectedMovieObject.body);

	var movieSRC = $(selectedMovieObject.video).attr("src");
	iframeEle.attr("src", movieSRC);
}

