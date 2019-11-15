const horrorGame = {};

horrorGame.start = () => {
  borisNpc.reset();
  horrorGame.showDialogue(borisNpc);

  $(horrorGame.frames)
    .find('.window').addClass('hideFrame')
    .find('.closedEye').removeClass('hideFrame');

  horrorGame.currentFrame = 0;
  horrorGame.previousFrame = -1;
  horrorGame.changeFrame(horrorGame.currentFrame);
  horrorGame.changeEye(0);
}

horrorGame.changeFrame = (n) => {
  //Store the current frame as the previous frame
  horrorGame.previousFrame = horrorGame.currentFrame;
  //Hide the current frame and show eyeball cover
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
  //Update the current frame
  horrorGame.currentFrame = n;
}


// Bind events here
horrorGame.bindEvents = () => {
  //Buttons
  $('#tutorialClose').on('click', function() {
    $('#tutorial').fadeOut();
  });
  $('#characterOne button').on('click', function(){
    horrorGame.eyeLevel = 1;
    horrorGame.changeFrame(1);
  });
  $('#retryButton').on('click', function () {
    horrorGame.start();
  });
  $('#leaveConversationOneButton').on('click', function() {
    horrorGame.changeFrame(horrorGame.previousFrame);
  });
  //Animations
    //thing that triggers the animation, thing that gets the animation, the animation class name
  horrorGame.bindAnimation($('#shrooms'), $('#shrooms').siblings('img'), 'smallSideWaysWiggle');
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
  //Set the text of the name
  horrorGame.npcName.text(conversationObject.name);
  //Set the npc portrait
  horrorGame.npcPortrait.attr('src', conversationObject.portraitURL);
  //Store the dialogue object in a shorter name
  const dialogue = conversationObject.dialogue[conversationObject.currentIndex];
  //Set the current text

  //Fade out / change / fade in NPC text
  horrorGame.npcText.fadeOut(function(){
    horrorGame.npcText.text(dialogue.text);
    horrorGame.npcText.fadeIn();
  });
  //Fade out / change / fade in response buttons
  horrorGame.responseList.fadeOut(function(){
     //Make sure the ul doesn't have any buttons in it
    horrorGame.responseList.empty();
    horrorGame.generateResponseButtons(dialogue.responses);
    horrorGame.responseList.fadeIn();
  });
}


//Append the ul with buttons
//Set the html to have the response text
//Bind the click event to the response's callback
horrorGame.generateResponseButtons = (responses) => {
  for(let i = 0; i < responses.length; i++){
    const newButton = $('<li><button></button></li>');
    $(newButton).appendTo(horrorGame.responseList)
      .find('button')
      .html(`<p>${responses[i].text}</p>`)
      .on('click', responses[i].callback);
  }
}

//Give the passed dom element the passed animation class
//Then bind it to have animationend remove the passed animation class
horrorGame.bindAnimation = (triggerElement, element, animationClass) =>{
  $(triggerElement).on('click', function(){
    $(element).addClass(animationClass);
  });
  $(element).on('animationend webkitTransitionEnd oTransitionEnd', function(){
    $(this).removeClass(animationClass);
  });
}

//Get all eye overlay images and change their source to the pass level
horrorGame.changeEye = (n) => {
  $('.closedEye').find('img').attr('src', `./assets/eye/eye${n}.png`);
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
  name: 'Heisj',
  portraitURL: './assets/priestPortrait.png',
  currentIndex: 0,
  reset: function() { borisNpc.currentIndex = 0; },
  dialogue: [
    { // 0
      text: 'Welcome to the house of Qhinos, God of Tricks. Are you willing to help us in our endeavour?',
      responses: [
        {
          text: 'Well, it seems that I have no choice. What do you need to get done?',
          callback: function () { horrorGame.changeEye(0); borisNpc.currentIndex = 1; horrorGame.showDialogue(borisNpc); }
        },
        {
          text: 'Why should I help you?',
          callback: function () { horrorGame.changeEye(2); borisNpc.currentIndex = 4; horrorGame.showDialogue(borisNpc); }
        }
      ]
    },
    { // 1
      text: 'Alright. Let us get to work. You will need to talk to that skull over there to help.',
      responses: [
        {
          text: 'Hm. Strange but okay.',
          callback: function () { horrorGame.changeEye(1); borisNpc.currentIndex = 2; horrorGame.showDialogue(borisNpc); }
        },
        {
          text: 'Eh. Skulls freak me out - so no thanks.',
          callback: function () { horrorGame.changeEye(3); borisNpc.currentIndex = 3 ; horrorGame.showDialogue(borisNpc); }
        }
      ]
    },
    { // 2
      text:'Yep, just turn around.',
      responses: [
        {
          text: 'Okay.',
          callback: function () { horrorGame.changeEye(0); horrorGame.changeFrame(3); }
        }
      ]
    },
    { // 3
      text:'It cannot be helped then. The door out is over there.',
      responses: [
        {
          text: 'If you say so.',
          callback: function () { horrorGame.changeEye(4); horrorGame.changeFrame(5); }
        }
      ]
    },
    { // 4
      text:'It is an honour to help us. You are making a mistake in refusing.',
      responses: [
        {
          text: 'Alright alright I\'ll help you out.',
          callback: function () { horrorGame.changeEye(2); borisNpc.currentIndex = 5; horrorGame.showDialogue(borisNpc); }
        },
        {
          text: 'It\'s still a no.',
          callback: function () { horrorGame.changeEye(4); borisNpc.currentIndex = 6; horrorGame.showDialogue(borisNpc); }
        }
      ]
    },
    { // 5
      text:'Good. Press that button over there. It will open up your path.',
      responses: [
        {
          text: 'Sure man. Whatever you say.',
          callback: function () { horrorGame.changeEye(1); horrorGame.changeFrame(5); }
        }
      ]
    },
    { // 6
      text:'Oh well. It cannot be helped then. Use that lever to open the path out.',
      responses: [
        {
          text: 'Okay...',
          callback: function () { horrorGame.changeEye(4); horrorGame.changeFrame(7); }
        }
      ]
    }
  ]
}
//horrorGame.changeFrame(-1); horrorGame.setEndScreen('(you died)', './assets/deathIcon.svg');
skullNpc = {
  name: 'Skull',
  portraitURL: './assets/skull.png',
  currentIndex: 0,
  reset: function() { skullNpc.currentIndex = 0; },
  dialogue: [
    {
      text: 'hhhhhhh',
      responses: [
        {
          text: 'Dog.',
          callback: function () { horrorGame.changeFrame(2); horrorGame.setEndScreen('(you died)', './assets/deathIcon.svg'); }
        },
        {
          text: 'Cat.',
          callback: function () { horrorGame.changeFrame(2); horrorGame.setEndScreen('(you escaped)', './assets/heartIcon.svg'); }
        },
        {
          text: '(leave)',
          callback: function () { horrorGame.changeFrame(0); }
        }
      ]
    }
  ]
}
