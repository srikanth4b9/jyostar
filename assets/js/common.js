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
		
		$("#dropDownFilterList").show();
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
	
	$(".slider").append('<div class="cycle-prev"></div><div class="cycle-next"></div>');
	
	$(document).on("click", "#moviesList", function(){
		getcurrentLocatation();
	});

	$(document).on("click", "#tvSerials", function(){
		getcurrentLocatation();
	});
	
	$(document).on("click", "#logout", function(){
		sessionStorage.clear();
		location.href = "login.html";
	});

	getcurrentLocatation();
	$("#dropDownFilterList").hide();
	function populateGridView(response, fromService){
		var currentPage = getcurrentSelectedPageFromSession();
		if(fromService == "FROM_SERVICE"){
			appendSelectOptions(response);
			
			$(".ui-navbar ul li a").removeClass("ui-btn-active");
			
			if(currentPage == "Serials"){
				$(".typeLabel").text("TV Show Type");
				$("#tvSerials a").addClass("ui-btn-active");
			} else {
				$(".typeLabel").text("Movie Type");
				$("#moviesList a").addClass("ui-btn-active");
			}
			moviesArray = response;
		}

		var html = "";
		if(currentPage == "Serials"){
			$.each(response, function(i, item) {
				html += '<li id="updateVersionItem-' + (i) + '" class = "ui-li-has-thumb" onclick="onClickTVProgram(\'' + item.sid + '\')"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><img src="http://jyostar.com'+item.webthumb+'" class="ui-li-thumb"><p>' + item.title + '</p></a></li>';
			});
		} else {
			$.each(response, function(i, item) {
				html += '<li id="updateVersionItem-' + (i) + '" class = "ui-li-has-thumb" onclick="onClickMovie(\'' + item.mid + '\')"><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r"><img src="http://jyostar.com'+item.webthumb+'" class="ui-li-thumb"><p>' + item.title + '</p></a></li>';
			});	
		}

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
					$.mobile.loading( 'hide');
					successCallBack.call(successCallBack, response.info, "FROM_SERVICE");
				},
				error: function(e) {
					$.mobile.loading( 'hide');
					alert("error" + e.message);
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
					}else if (currentPage === "Serials"){
						getTvDataFromServer (country);
					}else {
						getListFromServer(country);
					}
				}
			);
	}
	
	// Get Movies data from Jyostar server

	function getMoviesDataFromServer(country) {
	    $.mobile.loading( 'show', {
		      text: "Loading Movies...",
		      textVisible: true,
		      theme: "z",
		      textonly: false,
		      html: ""
	    });
		var moviesURL = "http://jyostar.com/star/movieslist.php";
		var inputData = { "cuid": country };
		makeAJAXCall(moviesURL, inputData, populateGridView);
		
	}

	//Get TV Shows data from Jyostar server

	function getTvDataFromServer(country) {
	    $.mobile.loading( 'show', {
		      text: "Loading TV Details...",
		      textVisible: true,
		      theme: "z",
		      textonly: false,
		      html: ""
	    });
		var serialsURL = "http://jyostar.com/star/showlist.php";
		// var serialsURL = "http://jyostar.com/star/videoadmin/Apprestserial.php";
		var inputData = { "cuid": country};
		makeAJAXCall(serialsURL, inputData, populateGridView);
	}
	
	// get all list from Jyostar server
	
	function getListFromServer(country) {
	    $.mobile.loading( 'show', {
		      text: "Loading Movies...",
		      textVisible: true,
		      theme: "z",
		      textonly: false,
		      html: ""
	    });
		var moviesURL = "http://jyostar.com/star/list.php";
		var inputData = { "cuid": country };
		makeAJAXCall(moviesURL, inputData, populateGridView);
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
	// if (!currentPage1) {
	// 	currentPage1 = "Movies";
	// 	savedatainsessionWithKey(currentPage1,"currentPage");
	// }
	return currentPage1;
	 
}


function onClickMovie(mid) {
    $.mobile.loading( 'show', {
	      text: "Loading Movie Details...",
	      textVisible: true,
	      theme: "z",
	      textonly: false,
	      html: ""
      });
	var movieDetailsURL = "http://jyostar.com/star/movieview.php";
	var inputData = { "movie": mid};
	makeAJAXCall(movieDetailsURL, inputData, renderDetailsPage);
}

function onClickTVProgram(sid) {
    $.mobile.loading( 'show', {
	      text: "Loading Serails Details...",
	      textVisible: true,
	      theme: "z",
	      textonly: false,
	      html: ""
    });
	var tvProgramDetailsURL = "http://jyostar.com/star/tvview.php"
	var inputData = { "tv": sid};
	makeAJAXCall(tvProgramDetailsURL, inputData, renderDetailsPage);
}

$(document).on("click", ".cycle-prev", function(){
	$(".slider").slick("slickPrev");
});
$(document).on("click", ".cycle-next", function(){
	$(".slider").slick("slickNext");
});

function renderDetailsPage(responseObj){
	
	var selectedMovieObject = responseObj[0];

	$("#film-index-page").hide();
	$(".slider").hide();
	$("#film-details-page").show();
	
	$("#movieName").html(selectedMovieObject.title);
	$("#cast").html(selectedMovieObject.cast_crew);
	$("#filmDetails").html(selectedMovieObject.body);
	if(selectedMovieObject.paidmovie && selectedMovieObject.paidmovie == "1"){
		$(".paidmovie_1 a").attr("onclick", "window.open('"+selectedMovieObject.paidmovieurl+"', '_system')").show();
		$(".promoContainer").show();
		$(".promoContainer #promoCode").text(selectedMovieObject.promocode).show();
		$(".promoContainer #promoText").text(selectedMovieObject.promotext).show();
	} else {
		$(".paidmovie_1 a").hide();
		$(".promoContainer").hide();
	}

	$(".movie-video").empty().append(selectedMovieObject.video);
    var iframeEle = $(document).find("iframe");
    iframeEle.attr("width", $(document).width());
	
	$("#img_poster").attr("src", "http://jyostar.com"+selectedMovieObject.poster).attr("height", "175");
	
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
				$.mobile.loading( 'hide');
				successCallBack.call(successCallBack, response.info, "FROM_SERVICE");
			},
			error: function(e) {
				$.mobile.loading( 'hide');
				alert("Error:" + e.message);
				console.log(e.message);
			}
	});
}
