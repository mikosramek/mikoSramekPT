const horrorGame = {};

horrorGame.start = () => {
  borisNpc.reset();
  horrorGame.showDialogue(borisNpc);
  

  $(horrorGame.frames)
    .find('.window').addClass('hideFrame')
    .find('.closedEye').removeClass('hideFrame');
  horrorGame.changeFrame(0);
}
// $element.on('transitionend webkitTransitionEnd oTransitionEnd', function () { // your event handler });
horrorGame.changeFrame = (n) => {
  //Hide current frame and show eyeball cover
  $(horrorGame.frames[horrorGame.currentFrame])
    .find('.window').addClass('hideFrame')
    .find('.closedEye').removeClass('hideFrame');

    if(n === -1){
      n = horrorGame.frames.length - 1;
    }
  //Show next frame and hide next eyeball cover
  $(horrorGame.frames[n])
    .find('.window').removeClass('hideFrame')
    .find('.closedEye').addClass('hideFrame');
  
  //Scroll the html/body to the top of the next frame
  $('HTML, body').animate({scrollTop: $(horrorGame.frames[n]).offset().top - 30}, 1000);
  //Set the current frame to the next frame
  horrorGame.currentFrame = n;
}


// Bind events here
horrorGame.bindEvents = () => {
  $('#characterOne button').on('click', function(){
    horrorGame.changeFrame(1);
  });
  $('#retryButton').on('click', function () {
    horrorGame.start();
  });
}
horrorGame.findDomReferences = () => {
  horrorGame.frames = $('#frameHolder').children();

  horrorGame.npcName = $('#npcName');
  horrorGame.npcText = $('#npcText');
  horrorGame.npcPortrait = $('#npcPortrait');

  horrorGame.responseList = $('#responseList');

  horrorGame.endingDiv = $('#endingDiv');
}

horrorGame.setEndScreen = (text, imgUrl) => {
  horrorGame.endingDiv
    .find('h3').text(text);
  horrorGame.endingDiv
    .find('img').attr('src', imgUrl);
}

horrorGame.showDialogue = (conversationObject) => {
  //Set the overall npc settings
  //Set the text of the name
  horrorGame.npcName.text(conversationObject.name);
  //Set the npc portrait
  horrorGame.npcPortrait.attr('src', conversationObject.portraitURL);
  //Store the dialogue object in a shorter name
  const dialogue = conversationObject.dialogue[conversationObject.currentIndex];
  //Set the current text
  horrorGame.npcText.text(dialogue.text);

  //Make sure the ul doesn't have any buttons in it
  horrorGame.responseList.empty();
  //Append the ul with buttons
  //Set the html to have the response text
  //Bind the click event to the response's callback
  for(let i = 0; i < dialogue.responses.length; i++){
    const newButton = $(`<li><button></button></li>`);
    $(newButton).appendTo(horrorGame.responseList)
      .find('button')
      .html(`<p>${dialogue.responses[i].text}</p>`)
      .on('click', dialogue.responses[i].callback);
  }
}

horrorGame.init = () => {
  horrorGame.bindEvents();
  horrorGame.findDomReferences();

  horrorGame.start();
}


$(document).ready(function(){
  horrorGame.init();
});





borisNpc = {
  name: "Boris",
  portraitURL: "./assets/priestPortrait.png",
  currentIndex: 0,
  reset: function() { borisNpc.currentIndex = 0; },
  dialogue: [
    { // 0
      text: "Here is some text. This is the best text and will be important to the story.",
      responses: [
        {
          text: "Yes.",
          callback: function () { borisNpc.currentIndex = 1; horrorGame.showDialogue(borisNpc); }
        },
        {
          text: "No.",
          callback: function () { horrorGame.changeFrame(-1); horrorGame.setEndScreen('(you died)', './assets/deathIcon.svg');}
        },
        {
          text: "(leave)",
          callback: function () { horrorGame.changeFrame(0); }
        }
      ]
    },
    { // 1
      text: "I see, that is your answer? Well here is my response. How about that?",
      responses: [
        {
          text: "Hm. That seems very reasonable. I'm glad you brought this issue up with me.",
          callback: function () { borisNpc.currentIndex = 2; horrorGame.showDialogue(borisNpc); }
        },
        {
          text: "Eh.",
          callback: function () { horrorGame.changeFrame(-1); horrorGame.setEndScreen('(you died)', './assets/deathIcon.svg'); }
        },
        {
          text: "(leave)",
          callback: function () { horrorGame.changeFrame(0); }
        }
      ]
    },
    { // 2
      text: "Sensical. Just talk to that skull over there.",
      responses: [
        {
          text: "Thanks.",
          callback: function () { horrorGame.changeFrame(2); }
        },
        {
          text: "Okay.",
          callback: function () { horrorGame.changeFrame(2); }
        },
        {
          text: "(leave)",
          callback: function () { horrorGame.changeFrame(0); }
        }
      ]
    }
  ]
}
skullNpc = {
  name: "Skull",
  portraitURL: "./assets/skull.png",
  currentIndex: 0,
  reset: function() { skullNpc.currentIndex = 0; },
  dialogue: [
    {
      text: "hhhhhhh",
      responses: [
        {
          text: "Dog.",
          callback: function () { horrorGame.changeFrame(2); horrorGame.setEndScreen("(you died)", "./assets/deathIcon.svg"); }
        },
        {
          text: "Cat.",
          callback: function () { horrorGame.changeFrame(2); horrorGame.setEndScreen("(you escaped)", "./assets/heartIcon.svg"); }
        },
        {
          text: "(leave)",
          callback: function () { horrorGame.changeFrame(0); }
        }
      ]
    }
  ]
}
