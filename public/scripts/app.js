const createTweetElement = (tweet) => {
  let $tweet = $("<article>").addClass("tweet");

  //header
  let tweetHeader = $("<header>").append(`
    <img class="avatar" src="${tweet.user.avatars.small}">
    <span class="author">${tweet.user.name}</span>
    <span class="username">${tweet.user.handle}</span>
  `);

  //body
  let tweetBody = $("<section>").append("<p>").text(tweet.content.text);

  //footer
  let tweetFooter = $("<footer>").append(`
    10 Days Ago
      <span class="icons">
          <i class="fa fa-flag fa-2x" aria-hidden="true"></i>
          <i class="fa fa-retweet fa-2x" aria-hidden="true"></i>
          <i class="fa fa-heart fa-2x" aria-hidden="true"></i>
      </span>
  `);


  //combine all
  $tweet.append(tweetHeader);
  $tweet.append(tweetBody);
  $tweet.append(tweetFooter);

  return $tweet
}

const renderTweets = (tweetData) => {
  for (let tweet of tweetData) {
    $("#tweets").append(createTweetElement(tweet));
  }
}

const formSubmitHandler = () => {

  const composeForm = $(".new-tweet").find("form");

  composeForm.on("submit", function (event) {
    event.preventDefault();

    let tweetText = $(this).find("textarea").val();
    if (tweetText === ""  || tweetText === null) {
      displayWarning("TWEET IS EMPTY!");
      return;
    } else if (tweetText.length > 140){
      displayWarning("TWEET IS TOO LONG!");
      return;
    }

    //ajax below
    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $(this).serialize(),
      success: (response) => {
        composeForm.find("textarea").val("");
        $(".new-tweet form .counter").text(140);
        appendLatest(response);
      }
    });
  });

}

const displayWarning = (warning) => {
   $(".new-tweet").find(".warning").text(warning).show();
   setTimeout(() => {
    $(".new-tweet").find(".warning").hide();
   }, 3000);
}

const appendLatest = (tweet) => {
  $("#tweets").prepend(createTweetElement(tweet));
}

const loadTweets = () => {
  $.ajax({
    url: "/tweets",
    method: "GET",
    success: function (data) {
      renderTweets(data);
    }
  })
}

$(document).ready(() => {
  loadTweets();
  formSubmitHandler();
});



