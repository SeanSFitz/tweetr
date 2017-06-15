const displayRegisterForm = () => {
  //either open or close the registration form, and hide the compose form if it is open
  $("#registration").toggle( {duration: 500} );
  $(".new-tweet").is(":hidden") ? '' : $(".new-tweet").toggle() ;

}

const registerButtonHandler = () => {
  //when a user clicks the register button on the nav, call displayRegisterForm
  $("#register-nav").on("click", () => {
    displayRegisterForm();
  });
}

const registerFormHandler = () => {
  $("#registration form").on("submit", (event) => {
    event.preventDefault();

    $.ajax({
      url: "/users",
      method: "POST",
      data: $(this).serialize(),
      success: (response) => {

      }
    });

  })
}


$(document).ready(() => {
  registerButtonHandler();
  registerFormHandler();
});
