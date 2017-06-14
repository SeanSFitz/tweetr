const createTweetElement = (tweet) => {
  //create new tweet article element, create the header, body and footer and append all to article
  console.log(tweet);
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
  let dateCreated = new Date(tweet.created_at);
  let tweetFooter = $("<footer>").append(`
      <span class="timestamp">
        <span class="time-since">${moment(dateCreated).fromNow()}</span>
        <span class="time-date">${moment(dateCreated)}</span>
      </span>
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
  //loops through tweets and appends to the tweets container
  for (let tweet of tweetData) {
    $("#tweets").append(createTweetElement(tweet));
  }
}

const formSubmitHandler = () => {
  const composeForm = $(".new-tweet").find("form");
  //event listener for form submission
  composeForm.on("submit", function (event) {
    event.preventDefault();
    //check textarea to see if the input is valid, if not call the displayWarning function and stop execution
    let tweetText = $(this).find("textarea").val();
    if (tweetText === ""  || tweetText === null) {
      displayWarning("TWEET IS EMPTY!");
      return;
    } else if (tweetText.length > 140){
      displayWarning("TWEET IS TOO LONG!");
      return;
    }
    //ajax post request sends tweet to server and upon success, calls appendLatest to display the tweet on the page
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
  //display custom warning text next to the tweet button and then have it dissapear after a set time
   $(".new-tweet").find(".warning").text(warning).show();
   setTimeout(() => {
    $(".new-tweet").find(".warning").hide();
   }, 3000);
}

const appendLatest = (tweet) => {
  //append the just created tweet to the top of the tweets container
  $("#tweets").prepend(createTweetElement(tweet));
}

const loadTweets = () => {
  //fetch all tweets from server and call render tweets function upon success
  $.ajax({
    url: "/tweets",
    method: "GET",
    success: function (data) {
      renderTweets(data);
    }
  })
}

const composeToggle = () => {
  //toggle the new tweet form when the user hits the "compose" button
  $("#compose").on("click", function () {
    $(".new-tweet").toggle({
      duration: 500,
      done: () => {
        $(".new-tweet").is(":hidden") ? '' : $(".new-tweet textarea").focus() ;
      }
    });
  });
}

const timestampToggle = () => {
  //display full date if user hovers over timestamp
  $("#tweets").on("mouseenter", ".timestamp", function () {
    $(this).find(".time-date, .time-since").toggle({duration: 200});
  });
  //reverts timestamp to time-since format
  $("#tweets").on("mouseleave", ".timestamp", function () {
    $(this).find(".time-date, .time-since").toggle({duration: 200});
  });
}

$(document).ready(() => {
  loadTweets();
  formSubmitHandler();
  composeToggle();
  timestampToggle();
});



