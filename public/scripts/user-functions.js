const displayRegisterForm = () => {
  //either open or close the registration form, and hide the compose form if it is open
  $("#registration").toggle( {duration: 500} );
  $(".new-tweet").is(":hidden") ? '' : $(".new-tweet").toggle() ;

}

const registerButtonHandler = () => {
  //when a user clicks the register button on the nav, call displayRegisterForm
  $("#register-nav").on("click", (event) => {
    event.preventDefault();
    displayRegisterForm();
  });
}

const registerFormHandler = () => {
  //upon submission of registration form, validate data and then send the new user info to server
  $("#registration form").on("submit", function (event) {
    event.preventDefault();
    //validate inputs

    //POST request to server with new user info
    $.ajax({
      url: "/users/register",
      method: "POST",
      data: $(this).serialize(),
      success: (response) => {

      }
    });

  })
}

const loginFormHandler = () => {
  //when a user clicks the register button on the nav, call displayRegisterForm
  $(".login-controls .logged-out form").on("submit", function (event) {
    event.preventDefault();

    //send POST request to server to validate login information
    $.ajax({
      url: "/users/login",
      method: "POST",
      data: $(this).serialize(),
      success: (response) => {
        console.log(response);
      }
    });
  });
}


$(document).ready(() => {
  registerButtonHandler();
  registerFormHandler();
  loginFormHandler();
});
