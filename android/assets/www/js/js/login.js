// Begin boilerplate code generated with Cordova project.

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

app.initialize();

// End boilerplate code.

$(document).on("mobileinit", function (event, ui) {
    $.mobile.defaultPageTransition = "slide";
    $('body').append("<div class='ui-loader-background'> </div>");
});

app.loginController = new BookIt.LoginController();

$(document).on("pagebeforeshow","#login-page",function() {
	
    app.loginController.init("#login-page");
	app.loginController.resetLoginForm();
	var userLoggedIn = app.loginController.isUserLoggedIn();
	var userData = app.loginController.getUserDetails();

	if(userLoggedIn){
		$("#txt-email-address").val(userData.userName);
		$("#txt-password").val(userData.password);
		 var msgText = "Logging In.... ";
         $.mobile.loading( 'show', {
        	    text: msgText,
        	    textVisible: true,
        	    theme: "z",
        	    textonly: false,
        	    html: ""
         });
         location.replace("index.html");
		return;
	}	
    app.loginController.$btnSubmit.off("tap").on("tap", function () {
		app.loginController.onLoginCommand();
   });
});

$(document).on("pagebeforeshow","#forget-password-page",function() {
    app.loginController.init("#forget-password-page");
	app.loginController.resetLoginForm();
    app.loginController.$btnSubmit.off("tap").on("tap", function () {
        app.loginController.onForgetCommand();
   });
});

$(document).on("pagebeforeshow","#page-signup",function() {
    app.loginController.init("#page-signup");
	app.loginController.resetLoginForm();
    app.loginController.$btnSubmit.off("tap").on("tap", function () {
        app.loginController.onSignupCommand();
   });
   
});
