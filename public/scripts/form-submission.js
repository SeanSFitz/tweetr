$(document).ready(() => {
  var composeForm = $(".new-tweet").find("form");
  composeForm.on("submit", function (event) {
    event.preventDefault();
    console.log($(this).serialize());


    //ajax below

  });
});