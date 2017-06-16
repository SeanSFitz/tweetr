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
        navLogin(response);
        $("#registration .text-inputs").val("");
        $("#registration").toggle( {duration: 500} );
      }
    });

  })
}

const loginFormHandler = () => {
  //when a user clicks the register button on the nav, call displayRegisterForm
  $(".login-controls .logged-out form").on("submit", function (event) {
    event.preventDefault();
    //validate inputs
    let username = $("#loginUsername").val();
    let password = $("#loginPassword").val();
    if (username === null || username === "") {
      return;
    } else if (password === null || password === "") {
      return;
    }
    //send POST request to server to validate login information
    $.ajax({
      url: "/users/login",
      method: "POST",
      data: $(this).serialize(),
      success: (response) => {
        navLogin(response);
        localStorage.setItem("userInfo", JSON.stringify(response));
        $("#loginUsername").val("");
        $("#loginPassword").val("");
        $("#registration").is(":hidden") ? '' : $("#registration").toggle( {duration: 500} );
      }
    });
  });
}

const navLogin = (userInfo) => {
  //update nav logged-in section with user info and toggle it on
  $(".logged-in span").text(`@${userInfo.handle}`);
  $(".logged-in .avatar").attr("src", userInfo.avatars.small);
  $(".logged-in, .logged-out").toggle();
}

const navLogout = () => {
  //wipe nav logged-in section and toggle back to logged-out
  $(".logged-in span").text("");
  $(".logged-in .avatar").attr("");
  $(".logged-in, .logged-out").toggle();
}

const logoutButton = () => {
  $("#logout-nav").on("click", () => {
    //when logout button is clicked, send post request to server to logout
    $.ajax({
      url: "/users/logout",
      method: "POST",
      success: () => {
        navLogout();
      }
    })
  })
}

$(document).ready(() => {
  registerButtonHandler();
  registerFormHandler();
  loginFormHandler();
  logoutButton();
});
