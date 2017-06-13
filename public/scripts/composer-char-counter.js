const MAX_LENGTH = 140;

$(document).ready(() => {
  const inputBox = $(".new-tweet").find("form textarea");
  inputBox.on("keyup keypress input", function () {
    const counter = $(this).parents("form").children(".counter");
    let value = MAX_LENGTH - $(this).val().length;
    counter.text(value);
    if (value < 0) {
      counter.addClass("too-long");
    } else {
      counter.removeClass("too-long");
    }
  });
});