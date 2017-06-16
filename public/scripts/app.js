const createTweetElement = (tweet) => {
  //create new tweet article element, create the header, body and footer and append all to article
  let $tweet = $(`<article>`).addClass("tweet");
    //add data to tweets
    $tweet.data("tweetID", tweet._id);
    $tweet.data("userID", tweet.user._id);
    $tweet.data("likes", tweet.likes);

  //header
  let tweetHeader = $("<header>").append(`
    <img class="avatar" src="${tweet.user.avatars.small}">
    <span class="author">${tweet.user.name}</span>
    <span class="username">@${tweet.user.handle}</span>
  `);

  //body
  let tweetBody = $("<section>").append("<p>").text(tweet.content.text);

  //footer
  let dateCreated = new Date(tweet.created_at);
  let likes = tweet.likes ? tweet.likes.length : 0;
  let tweetFooter = $("<footer>").append(`
      <span class="timestamp">
        <span class="time-since">${moment(dateCreated).fromNow()}</span>
        <span class="time-date">${moment(dateCreated)}</span>
      </span>
      <div class="icons">
          <span class="other-icons">
            <i class="fa fa-flag fa-2x" aria-hidden="true"></i>
            <i class="fa fa-retweet fa-2x" aria-hidden="true"></i>
          </span>
          <span class="likes">
            <i class="fa fa-heart fa-2x" aria-hidden="true"></i>
            <span class="like-count">${likes}</span>
          </span>
      </div>
  `);

  //add delete button if it is this users tweet
  let userID = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo"))._id : '';
  if (userID === tweet.user._id) {
    tweetFooter.find(".icons .other-icons").prepend(`<i class="fa fa-trash fa-2x" aria-hidden="true"></i>`);
  }

  //check to see if user likes this tweet and colors it red
  if (doesUserLikeTweet($tweet)) {
      tweetFooter.find(".likes").addClass("red");
  }

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

const clearTweets = () => {
  //removes all tweets aka all children of the #tweets div
  $("#tweets").empty();
}

const formSubmitHandler = () => {
  const composeForm = $(".new-tweet").find("form");
  //event listener for form submission
  composeForm.on("submit", function (event) {
    event.preventDefault();
    //check textarea to see if the input is valid, if not call the displayWarning function and stop execution
    let tweetText = $(this).find("textarea").val();
    if (!checkLogin()) {
      displayWarning("ONLY REGISTERED USERS CAN TWEET!");
      return;
    } else if (tweetText === ""  || tweetText === null) {
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
        loadTweets();
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
      clearTweets();
      renderTweets(data);
    }
  });
}

const composeToggle = () => {
  //toggle the new tweet form when the user hits the "compose" button
  $("#compose").on("click", function () {
    $(".new-tweet").toggle({
      duration: 500,
      start: () => {
        $("#registration").is(":hidden") ? '' : $("#registration").toggle() ;
        closeMenuIfOpen();
      },
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

const deleteButtonHandler = () => {
  //when trash can icon is clicked, find that tweet and associated tweetID
  $("#tweets").on("click", ".fa-trash", function () {
    const tweet = $(this).closest(".tweet");
    const tweetID = tweet.data("tweetID");
    //DELETE request to /tweets/tweetID, on success remove the tweet from the page
    $.ajax({
      url: `/tweets/${tweetID}`,
      method: "DELETE",
      success: function () {
        tweet.remove();
      }
    });
  });
}

const likeButtonHandler = () => {
  //when heart can icon is clicked, find that tweet and associated tweetID
  $("#tweets").on("click", ".fa-heart", function () {
    const tweet = $(this).closest(".tweet");
    //is user logged in
    if (!checkLogin()) {
      return;
    }
    //get current user info, if this tweet belongs to current user, exit function without liking tweet
    const tweetUserID = tweet.data("userID");
    let userID = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo"))._id : '';
    if (tweetUserID === userID) {
      return;
    }
    //check to see if user has already liked this tweet, to determine whether to call like or unlike function
    if (doesUserLikeTweet(tweet)) {
      unlikeTweet(tweet);
    } else {
      likeTweet(tweet);
    }
  });
}

const likeTweet = (tweet) => {
  const tweetID = tweet.data("tweetID");
  //PUT request to /tweets/like/tweetID, on success update like counter
  $.ajax({
    url: `/tweets/like/${tweetID}`,
    method: "PUT",
    success: function (response) {
      //update likes data with the response and then update the display to reflect the change
      tweet.data("likes", response.value.likes);
      tweet.find(".like-count").text(tweet.data("likes").length);
      tweet.find(".likes").toggleClass("red");
    }
  });
}

const unlikeTweet = (tweet) => {
  const tweetID = tweet.data("tweetID");
  //PUT request to /tweets/unlike/tweetID, on success update like counter
  $.ajax({
    url: `/tweets/unlike/${tweetID}`,
    method: "PUT",
    success: function (response) {
      //update likes data with the response and then update the display to reflect the change
      tweet.data("likes", response.value.likes);
      tweet.find(".like-count").text(tweet.data("likes").length);
      tweet.find(".likes").toggleClass("red");
    }
  });
}

const doesUserLikeTweet = (tweet) => {
  let userID = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo"))._id : '';
  let likes = tweet.data("likes") ? tweet.data("likes") : []
  if (likes.indexOf(userID) >= 0) {
    return true;
  }
  return false;
}


$(document).ready(() => {
  loadTweets();
  formSubmitHandler();
  composeToggle();
  timestampToggle();
  deleteButtonHandler();
  likeButtonHandler();
});



