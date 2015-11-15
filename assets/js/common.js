$(document).ready(function() {
	var country = 'IN';
	var currentPage = '';
	$.fn.stars = function() {
	    return $(this).each(function() {
	        // Get the value
	        var val = parseFloat($(this).html());
	        // Make sure that the value is in 0 - 5 range, multiply to get width
	        var size = Math.max(0, (Math.min(5, val))) * 16;
	        // Create stars holder
	        var $span = $('<span />').width(size);
	        // Replace the numerical value with stars
	        $(this).html($span);
	    });
	}
	
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1);
	var hash = hashes.split('=');
	if(hash[1] !== undefined){
		if(hash[1] === 'h'){
			currentPage = '';
		}else if(hash[1] === 'm'){
			currentPage = 'Movies';
		}else if(hash[1] === 't'){
			currentPage = 'Serials';
		}else if (hash[1] === 'language-telugu') {
			currentPage = "telugu"
		}else if (hash[1] === 'language-tamil'){
			currentPage = "tamil";
		}
	}
	
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
	
	$(document).on("click", "#home", function(){
		currentPage = '';
		getListFromServer(country);
	});
	
	$(document).on("click", "#moviesList", function(){
		currentPage = 'Movies';
		getMoviesDataFromServer(country);
	});

	$(document).on("click", "#tvSerials", function(){
		currentPage = 'Serials';
		getTvDataFromServer(country);
	});
	
	$(document).on("click", "#telugu", function(){
		currentPage = 'telugu';
		getLanguageFromServer("telugu",country);
	});
	
	$(document).on("click", "#tamil", function(){
		currentPage = 'tamil';
		getLanguageFromServer("tamil",country);	
			
	});
	
	$(document).on("click", "#logout", function(){
		sessionStorage.clear();
		location.href = "login.html";
	});
	
	$(document).on("click", ".menu-panel li a", function(){
		$(".menu-panel li a").removeClass('ui-btn-active');
		$(this).addClass('ui-btn-active');
	});

	getcurrentLocatation();
	$("#dropDownFilterList").hide();
	function populateGridView(response, fromService){
		if(fromService == "FROM_SERVICE"){
			appendSelectOptions(response);
			
			$(".ui-navbar ul li a").removeClass("ui-btn-active");
			
			if(currentPage == "Serials"){
				$(".typeLabel").text("TV Show Type");
				//$("#tvSerials a").addClass("ui-btn-active");
			} else if(currentPage == "Movies") {
				$(".typeLabel").text("Movie Type");
				//$("#moviesList a").addClass("ui-btn-active");
			}else if (!currentPage || currentPage === ''){
				$("#home a").addClass("ui-btn-active");
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
			
		var country = "IN";
		if (currentPage === "Movies") {
			getMoviesDataFromServer(country);
		}else if (currentPage === "Serials"){
			getTvDataFromServer (country);
		}else if (currentPage === "telugu" || currentPage === "tamil")
		{
			getLanguageFromServer(currentPage,country)
		}
		else {
			getListFromServer(country);
		}
		

		// $.getJSON("http://www.telize.com/geoip?callback=?",
		// 		function(json) {
		// 			alert("test");
		// 			var country = json.country_code;
		// 			var currentPage = getcurrentSelectedPageFromSession();
		// 			if (currentPage === "Movies") {
		// 				getMoviesDataFromServer(country);
		// 			}else if (currentPage === "Serials"){
		// 				getTvDataFromServer (country);
		// 			}else {
		// 				getListFromServer(country);
		// 			}
		// 		}
		// 	);
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
	
	// get telegu list from Jyostar server
	
	function getLanguageFromServer(language,country) {

		var languageurl ;
		if (language === "telugu") {
			languageurl = language+".php";
		}else {
			languageurl = language+".php";
		}
		var moviesURL = "http://jyostar.com/star/"+languageurl;
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
	var currentPage1 = sessionStorage.setItem('currentPage','');
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
$( document ).on( "pageinit", "#demo-page", function() {
    $( document ).on( "swipeleft swiperight", "#demo-page", function( e ) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft"  ) {
                $( "#right-panel" ).panel( "open" );
            } else if ( e.type === "swiperight" ) {
                $( "#left-panel" ).panel( "open" );
            }
        }
    });
});
function renderDetailsPage(responseObj){
	
	var selectedMovieObject = responseObj[0];
	console.log(responseObj[0]);

	$("#film-index-page").hide();
	$(".slider").hide();
	$("#film-details-page").show();
	$("#img_poster").attr('src','');
	$("#movieName span.moviname").html(selectedMovieObject.title);
	$("#movieName span.stars").html(selectedMovieObject.rated)
	$("#movieName span.stars").stars();
	$(".filmcasting-detail #cast").html(selectedMovieObject.cast_crew);
	$(".filmcasting-language .context-value").html(selectedMovieObject.language);
	$(".filmcasting-duration .context-value").html(selectedMovieObject.duration);
	$(".filmcasting-release .context-value").html(selectedMovieObject.releaseon);
	$(".filmcasting-status .context-value").html(selectedMovieObject.status);
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
