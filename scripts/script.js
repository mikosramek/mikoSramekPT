const horrorGame = {};



horrorGame.init = () => {
  horrorGame.bindEvents();
  horrorGame.findDomReferences();
  horrorGame.start();
}

// Bind events here
horrorGame.bindEvents = () => {
  //Buttons
  $('#tutorialClose').on('click', function() {
    $('#tutorial').fadeOut();
  });
  $('#characterOne button').on('click', function(){
    horrorGame.eyeLevel = 1;
    horrorGame.showDialogue(borisNpc);
    horrorGame.changeFrame(1);
  });
  $('#skull button').on('click', function(){
    horrorGame.eyeLevel = 2;
    horrorGame.showDialogue(skullNpc);
    horrorGame.changeFrame(1);
  });
  $('#retryButton').on('click', function () {
    horrorGame.start();
  });
  $('#leaveConversationButton').on('click', function() {
    horrorGame.changeFrame(horrorGame.previousFrame);
  });
  $('#doorFive button').on('click', function() {
    horrorGame.setEndScreen('(you died)', './assets/deathIcon.svg');
    horrorGame.changeFrame(-1);
  });
  

  $('#doorEightButton button').on('click', function() {
    $('#buttonTop').addClass('buttonAnimation');
    $('#buttonTop').on('animationend webkitTransitionEnd oTransitionEnd', function(){ 
      //show button for left door
      horrorGame.showObject('#doorNineB button');
      horrorGame.changeFrame(8);
    });
  });
  $('#doorSevenButton button').on('click', function() {
    $('#lever').addClass('leverAnimation');
    $('#lever').on('animationend webkitTransitionEnd oTransitionEnd', function(){ 
      //show button for right door
      horrorGame.showObject('#doorNineA button');
      horrorGame.changeFrame(8);
    });
  });

  $('#doorNineA button').on('click', function() {
    horrorGame.changeFrame(3);
  });
  $('#doorNineB button').on('click', function() {
    horrorGame.changeFrame(2);
  });

  $('#menuButton').on('click', function(){
    $('#mainNav').toggleClass('hiddenNav');
  });
  //Animations
    //thing that triggers the animation, thing that gets the animation, the animation class name
  horrorGame.bindAnimation($('#shrooms'), $('#shrooms').siblings('img'), 'smallSideWaysWiggle');
}

//When the triggerElement is clicked, give the targetElement the animationClass
//Then bind it to have on animationend remove the passed animation class
horrorGame.bindAnimation = (triggerElement, targetElement, animationClass) =>{
  $(triggerElement).on('click', function(){
    $(targetElement).addClass(animationClass);
  });
  $(targetElement).on('animationend webkitTransitionEnd oTransitionEnd', function(){
    $(this).removeClass(animationClass);
  });
}

horrorGame.findDomReferences = () => {
  horrorGame.frames = $('#frameHolder').children();

  horrorGame.npcName = $('#npcName');
  horrorGame.npcText = $('#npcText');
  horrorGame.npcPortrait = $('#npcPortrait');

  horrorGame.responseList = $('#responseList');

  horrorGame.endingDiv = $('#endingDiv');

  horrorGame.nav = $('#navUl');
}




horrorGame.start = () => {
  //Make sure the npc text is back to 0
  borisNpc.reset();
  skullNpc.reset();
  //Populate the first dialogue of the first character
  horrorGame.showDialogue(borisNpc);
  //Reset the inventory
  horrorGame.inventory = [];

  //Hide objects (ie bone)
  horrorGame.hideObject($('#doorNineA button'));
  horrorGame.hideObject($('#doorNineB button'));

  //Hide all appropriate frames
  $(horrorGame.frames)
    .find('.window').addClass('hideFrame')
    .find('.closedEye').removeClass('hideFrame');
  //Update the eye to it's closed image
  horrorGame.changeEye(0);
  //Make the frame tracking information back to default
  horrorGame.currentFrame = 0;
  horrorGame.previousFrame = -1;

  horrorGame.generateNav();

  //Move the player to the first frame
  horrorGame.changeFrame(horrorGame.currentFrame);  
  
}

horrorGame.generateNav = () => {
  $(horrorGame.nav).empty();
  for(let i = 0; i < horrorGame.frames.length; i++){
    const navButton = $(`<li><button><span>${i}</span></button></li>`);
    $(horrorGame.nav).append(navButton);
    navButton.find('button').on('click', function(){
      console.log('a');
    });
  }
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
    horrorGame.npcText.html(dialogue.text);
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


//Get all eye overlay images and change their source to the pass level
horrorGame.changeEye = (n) => {
  $('.closedEye').find('img').attr('src', `./assets/eye/eye${n}.png`);
}

//Inventory Functions
//Inventory array is initialized in start()
horrorGame.checkInventory = (item) => {
  return horrorGame.inventory.includes(item);
}
horrorGame.addToInventory = (item) => {
  horrorGame.inventory.push(item);
}
horrorGame.removeFromInventory = (item) => {
  horrorGame.inventory.splice(horrorGame.inventory.indexOf(item),1);
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
  // $('HTML, body').animate({scrollTop: $(horrorGame.frames[n]).offset().top - 30}, 1000);
  $('#frameHolder').css({transform: `translateY(calc(${n*-90}vh))`});
  //Update the current frame
  horrorGame.currentFrame = n;
}
horrorGame.hideObject = (object) => {
  $(object).hide();
}
horrorGame.showObject = (object) => {
  $(object).show();
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
      text: 'Welcome to the house of <span class="wiggly">Qhinos, God of Tricks.</span> Are you willing to help us in our endeavour?',
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
      text: 'Alright. Let us get to work. You will need to talk to that <span class="bold">skull</span> over there to help.',
      responses: [
        {
          text: 'Hm. Strange but okay. Where can I find it?',
          callback: function () { horrorGame.changeEye(1); borisNpc.currentIndex = 2; horrorGame.showDialogue(borisNpc); }
        },
        {
          text: 'Eh. Skulls freak me out - so no thanks.',
          callback: function () { horrorGame.changeEye(3); borisNpc.currentIndex = 3 ; horrorGame.showDialogue(borisNpc); }
        }
      ]
    },
    { // 2
      text:'Just turn around.',
      responses: [
        {
          text: 'Okay.',
          callback: function () { horrorGame.changeEye(0); horrorGame.changeFrame(2); }
        }
      ]
    },
    { // 3
      text:'It cannot be helped then. The <span class="bold">door</span> out is over there.',
      responses: [
        {
          text: 'If you say so.',
          callback: function () { horrorGame.changeEye(4); horrorGame.changeFrame(4); }
        }
      ]
    },
    { // 4
      text:'It is an <span class="italic uppercase">honour</span> to help us. You are making a mistake in refusing.',
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
      text:'Good. Press that <span class="bold">button</span> over there. It will open up your path.',
      responses: [
        {
          text: 'Sure man. Whatever you say.',
          callback: function () { horrorGame.changeEye(1); horrorGame.changeFrame(7); }
        }
      ]
    },
    { // 6
      text:'Oh well. It cannot be helped then. Use that <span class="bold">lever</span> to open the path out.',
      responses: [
        {
          text: 'Okay...',
          callback: function () { horrorGame.changeEye(4); horrorGame.changeFrame(6); }
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
    { // 0
      text: 'Hey, d\'ya wanna leave? I\'ll give ya this here <span class="bold">key</span> if ya fetch me a <span class="bold">bone</span>.',
      responses: [
        {
          text: 'I have <span class="italic">this</span> bone. Does that work?',
          callback: function () { 
            if(horrorGame.checkInventory('bone')){
              //you currently have the bone
              horrorGame.removeFromInventory('bone');
              horrorGame.addToInventory('doorKey');
              skullNpc.currentIndex = 2;
              horrorGame.showDialogue(skullNpc);
            }else {
              //no bone
              skullNpc.currentIndex = 3;
              horrorGame.showDialogue(skullNpc);
            }
           }
        },
        {
          text: 'I don\'t have a bone. Where can I find one?',
          callback: function () { skullNpc.currentIndex = 1; horrorGame.showDialogue(skullNpc); }
        }
      ]
    },
    { // 1
      text: 'It\'s \'round here somewhere. Get lookin\'.',
      responses: [
        {
          text: 'Is this the bone you\'re looking for?',
          callback: function () { 
            if(horrorGame.checkInventory('bone')){
              //you currently have the bone
              horrorGame.removeFromInventory('bone');
              horrorGame.addToInventory('doorKey');
              skullNpc.currentIndex = 2;
              horrorGame.showDialogue(skullNpc);
            }else {
              //no bone
              skullNpc.currentIndex = 3;
              horrorGame.showDialogue(skullNpc);
            }
           }
        },
        {
          text: 'I <span class="italic">still</span> can\'t find it.',
          callback: function () { skullNpc.currentIndex = 1; horrorGame.showDialogue(skullNpc); }
        }
      ]
    },
    { // 2
      text: 'Thank ya much. Door is ove\' there.',
      responses: [
        {
          text: 'Sure thing <span class="italic">bone</span>.',
          callback: function () { horrorGame.changeEye(1); horrorGame.changeFrame(6); }
        }
      ]
    },
    { // 3
      text: '<span class="italic">Clearly</span> ya don\'t got no bone there. Git fetchin\'',
      responses: [
        {
          text: 'Is this the bone you\'re looking for?',
          callback: function () { 
            if(horrorGame.checkInventory('bone')){
              //you currently have the bone
              horrorGame.removeFromInventory('bone');
              horrorGame.addToInventory('doorKey');
              skullNpc.currentIndex = 2;
              horrorGame.showDialogue(skullNpc);
            }else {
              //no bone
              skullNpc.currentIndex = 3;
              horrorGame.showDialogue(skullNpc);
            }
           }
        },
        {
          text: 'I <span class="bold uppercase">really</span> don\'t have a bone.',
          callback: function () { skullNpc.currentIndex = 3; horrorGame.showDialogue(skullNpc); }
        }
      ]
    }
  ]
}
