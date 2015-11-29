var BookIt = BookIt || {};

BookIt.LoginController = function () {

    this.$signUpPage = null;
    this.$btnSubmit = null;
    this.$ctnErr = null;
    this.$txtUserName = null;
    this.$txtPhoneNumber = null;
    this.$txtEmailAddress = null;
    this.$txtPassword = null;
    this.$txtPasswordConfirm = null;
	this.$fullName = null;
};
BookIt.LoginController.prototype.getUserDetails = function(){

	var currentUserDetails = localStorage.getItem("currentUser");
	return JSON.parse(currentUserDetails);
}

BookIt.LoginController.prototype.isUserLoggedIn = function(){

	var that = this;
	var userObj = that.getUserDetails();
	return userObj ? userObj.isUserLoggedIn : false;
}

BookIt.LoginController.prototype.init = function (page) {

    this.$signUpPage = $(page);
	if (page == "#forget-password-page") {
	    this.$btnSubmit = $("#request_password", this.$signUpPage);
	}else {
	    this.$btnSubmit = $("#btn-submit", this.$signUpPage);
	}

    this.$ctnErr = $("#ctn-err", this.$signUpPage);
    this.$txtUserName = $("#txt-user-name", this.$signUpPage);
    this.$txtPhoneNumber = $("#txt-phone-number", this.$signUpPage);
    this.$txtEmailAddress = $("#txt-email-address", this.$signUpPage);
    this.$txtPassword = $("#txt-password", this.$signUpPage);
    this.$txtPasswordConfirm = $("#txt-password-confirm", this.$signUpPage);
	this.$fullName = $("#txt-full-name", this.$signUpPage);
};

BookIt.LoginController.prototype.resetLoginForm = function () {

	var invisibleStyle = "bi-invisible",
	    invalidInputStyle = "bi-invalid-input";

	this.$ctnErr.html("");
	this.$ctnErr.removeClass().addClass(invisibleStyle);
	this.$txtUserName.removeClass(invalidInputStyle);
	this.$txtPhoneNumber.removeClass(invalidInputStyle);
	this.$txtEmailAddress.removeClass(invalidInputStyle);
	this.$txtPassword.removeClass(invalidInputStyle);
	this.$txtPasswordConfirm.removeClass(invalidInputStyle);
	this.$fullName.removeClass(invalidInputStyle);

	this.$txtUserName.val("");
	this.$txtPhoneNumber.val("");
	this.$txtEmailAddress.val("");
	this.$txtPassword.val("");
	this.$txtPasswordConfirm.val("");
};

BookIt.LoginController.prototype.passwordsMatch = function (password, passwordConfirm) {
    return password === passwordConfirm;
};

BookIt.LoginController.prototype.passwordIsComplex = function (password) {
    // TODO: implement complex password rules here.  There should be similar rule on the server side.
    return true;
};

BookIt.LoginController.prototype.emailAddressIsValid = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

BookIt.LoginController.prototype.showIndicator = function (text) {
    var $this = $( this ),
    msgText = text || "Loading.... ";
    $.mobile.loading( 'show', {
        text: msgText,
        textVisible: true,
        theme: "z",
        textonly: false,
        html: ""
    });
}

BookIt.LoginController.prototype.hideIndicator = function () {
	$.mobile.loading( 'hide');
}

BookIt.LoginController.prototype.makeAJAXCall = function(method, url, inputData, successCallBack) {
	$.ajax({
			type: method,
			url: url,
			data: inputData,
			dataType: "json",
			crossDomain: true,
			success: function(response) {
				successCallBack(response,null);
			},
			error: function(e) {
				console.log(e.message);
				successCallBack(null,e);
			}
	});
}

BookIt.LoginController.prototype.onLoginCommand = function () {
	
	
	 var me = this,
	 password = me.$txtPassword.val().trim(),
     emailAddress = me.$txtEmailAddress.val().trim(),
    invalidInput = false,
    invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";
	
    // Reset styles.
	me.$ctnErr.html("<p></p>");
    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$txtEmailAddress.removeClass(invalidInputStyle);
    me.$txtPassword.removeClass(invalidInputStyle);
	
	 // Flag each invalid field.
    if (emailAddress.length === 0) {
        me.$txtEmailAddress.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (password.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
    }
	
    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$ctnErr.html("<p>Please enter all the required fields.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        return;
    }
	
    if (!me.emailAddressIsValid(emailAddress)) {
        me.$ctnErr.html("<p>Please enter a valid email address.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        me.$txtEmailAddress.addClass(invalidInputStyle);
        return;
    }
	
	// show Activity indicator 
	me.showIndicator("Logging In...");
	me.makeAJAXCall("POST",BookIt.Settings.jyostarUrl,"username=" + emailAddress + "&action=login" +"&password=" + password,function(response,error) {
		// hide activity indicator
		me.hideIndicator();
		if (error) {
            console.log(error.message);
            // TODO: Use a friendlier error message below.
            me.$ctnErr.html("<p>Oops! JoyStar had a problem and could not login you.  Please try again in a few minutes.</p>");
            me.$ctnErr.addClass("bi-ctn-err").slideDown();
		}else {
			if (response.status == 1) {
	            // $.mobile.changePage("index.html");
				var currentUser = {
					userName: emailAddress,
					password: password,
					isUserLoggedIn: true
				}
				localStorage.setItem("currentUser", JSON.stringify(currentUser));
				window.location.replace("index.html");
			}else {
	            me.$ctnErr.html("<p>"+ "Oops!  " +  response.msg +"</p>");
	            me.$ctnErr.addClass("bi-ctn-err").slideDown();
			}
		}
		
	});
}

BookIt.LoginController.prototype.onForgetCommand = function () {

	 var me = this,
    emailAddress = me.$txtEmailAddress.val().trim(),
    invalidInput = false,
    invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";
	
    // Reset styles.
    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$txtEmailAddress.removeClass(invalidInputStyle);
	
	 // Flag each invalid field.
    if (emailAddress.length === 0) {
        me.$txtEmailAddress.addClass(invalidInputStyle);
        invalidInput = true;
    }

	
    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$ctnErr.html("<p>Please enter all the required fields.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        return;
    }
	
    if (!me.emailAddressIsValid(emailAddress)) {
        me.$ctnErr.html("<p>Please enter a valid email address.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        me.$txtEmailAddress.addClass(invalidInputStyle);
        return;
    }
	
	// show Activity indicator 
	me.showIndicator("Loading...");

	me.makeAJAXCall("POST",BookIt.Settings.jyostarUrl,"username=" + emailAddress + "&action=forgotpassword",
					function (response,error) {
						// hide activity indicato
						me.hideIndicator();
						if (error) {
				            console.log(error.message);
				            // TODO: Use a friendlier error message below.
				            me.$ctnErr.html("<p>Oops! JoyStar had a problem and could not login you.  Please try again in a few minutes.</p>");
				            me.$ctnErr.addClass("bi-ctn-err").slideDown();
						}else {
							if (response.status == 1) {
								alert("An Email has been sent to your e-mail address");
					            $.mobile.navigate("#login-page");
							}else {
					            me.$ctnErr.html("<p>"+ "invalid E-Mail" +"</p>");
					            me.$ctnErr.addClass("bi-ctn-err").slideDown();
							}s
						}
	});
}

BookIt.LoginController.prototype.onSignupCommand = function () {
	
    var me = this,
    userName = me.$fullName.val().trim(),
    phoneNumber = me.$txtPhoneNumber.val().trim(),
    emailAddress = me.$txtEmailAddress.val().trim(),
    password = me.$txtPassword.val().trim(),
    passwordConfirm = me.$txtPasswordConfirm.val().trim(),
    invalidInput = false,
    invisibleStyle = "bi-invisible",
    invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$txtUserName.removeClass(invalidInputStyle);
    me.$txtPhoneNumber.removeClass(invalidInputStyle);
    me.$txtEmailAddress.removeClass(invalidInputStyle);
    me.$txtPassword.removeClass(invalidInputStyle);
    me.$txtPasswordConfirm.removeClass(invalidInputStyle);

    // Flag each invalid field.
    if (userName.length === 0) {
        me.$txtUserName.addClass(invalidInputStyle);
		me.$fullName.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (phoneNumber.length === 0) {
        me.$txtPhoneNumber.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (emailAddress.length === 0) {
        me.$txtEmailAddress.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (password.length === 0) {
        me.$txtPassword.addClass(invalidInputStyle);
        invalidInput = true;
    }
    if (passwordConfirm.length === 0) {
        me.$txtPasswordConfirm.addClass(invalidInputStyle);
        invalidInput = true;
    }
	
    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$ctnErr.html("<p>Please enter all the required fields.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        return;
    }

    if (!me.emailAddressIsValid(emailAddress)) {
        me.$ctnErr.html("<p>Please enter a valid email address.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        me.$txtEmailAddress.addClass(invalidInputStyle);
        return;
    }

    if (!me.passwordsMatch(password, passwordConfirm)) {
        me.$ctnErr.html("<p>Your passwords don't match.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        me.$txtPassword.addClass(invalidInputStyle);
        me.$txtPasswordConfirm.addClass(invalidInputStyle);
        return;
    }

    if (!me.passwordIsComplex(password)) {
        // TODO: Use error message to explain password rules.
        me.$ctnErr.html("<p>Your password is very easy to guess.  Please try a more complex password.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        me.$txtPassword.addClass(invalidInputStyle);
        me.$txtPasswordConfirm.addClass(invalidInputStyle);
        return;
    }
	// show Activity indicator 
	me.showIndicator("Registering..");
	me.makeAJAXCall("POST",BookIt.Settings.jyostarUrl,
					"username=" + emailAddress + "&action=signup" + "&mobile=" + phoneNumber + "&password=" + password + "&title=Mr"+"&fullname="+userName,
					function (response,error) {
						// show Activity indicator 
						me.hideIndicator();
						if(error) {
							console.log(error.message);
				            me.$ctnErr.html("<p>Oops! joystar had a problem and could not register you.  Please try again in a few minutes.</p>");
				            me.$ctnErr.addClass("bi-ctn-err").slideDown();
						}else {
							if (response.status == 1) {
								window.location.replace("index.html");
							}else {
					            me.$ctnErr.html("<p>Oops! " +response.msg+" </p>");
					            me.$ctnErr.addClass("bi-ctn-err").slideDown();
							}
							
						}
					} 
  );
};
