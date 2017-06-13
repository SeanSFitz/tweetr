$(document).ready(() => {
  var composeForm = $(".new-tweet").find("form");
  composeForm.on("submit", function (event) {
    event.preventDefault();

    //ajax below
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $(this).serialize(),
      success: (response) => {
        $("#tweets").prepend(createTweetElement(response));
      }
    });
  });
});

