const horrorGame = {};

horrorGame.init = () => {
  horrorGame.findDomReferences();
  horrorGame.bindEvents();
  horrorGame.start();
}

//If a dom element is used more than once, it should be defined as a variable in here
horrorGame.findDomReferences = () => {
  horrorGame.frames = $('#frameHolder').children();

  horrorGame.npcName = $('#npcName');
  horrorGame.npcText = $('#npcText');
  horrorGame.npcPortrait = $('#npcPortrait');

  horrorGame.responseList = $('#responseList');

  horrorGame.endingDiv = $('#endingDiv');

  horrorGame.nav = $('#navUl');
  horrorGame.navHolder = $('#mainNav');

  horrorGame.bone = $('#bone');

  horrorGame.buttonTop = $('#buttonTop');
  horrorGame.lever = $('#lever');
  horrorGame.doorNineAImg = $('#doorNineA img');
  horrorGame.doorNineBImg = $('#doorNineB img');

  horrorGame.eyeParent = $('#eyes');
}

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
  horrorGame.bone.children('button').on('click', function() {
    horrorGame.addToInventory('bone');
    horrorGame.hideObject(horrorGame.bone);
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
  $('#doorFour button').on('click', function() {
    horrorGame.setEndScreen('(you died)', horrorGame.badEnd);
    horrorGame.changeFrame(-1);
  });
  $('#doorFive button').on('click', function() {
    horrorGame.setEndScreen('(you died)', horrorGame.badEnd);
    horrorGame.changeFrame(-1);
  });
  $('#doorSix button').on('click', function() {
    horrorGame.setEndScreen('(you escaped)', undefined);
    horrorGame.changeFrame(-1);
  });

  $('#doorEightButton button').on('click', function() {
    horrorGame.buttonTop.addClass('buttonAnimation');
    horrorGame.buttonTop.on('animationend webkitTransitionEnd oTransitionEnd', function(){ 
      //show button for the left door
      horrorGame.showObject('#doorNineB button');
      horrorGame.doorNineBImg.attr('src', './assets/doorOpen.png');
      horrorGame.changeFrame(8);
    });
  });
  $('#doorSevenButton button').on('click', function() {
    horrorGame.lever.addClass('leverAnimation');
    horrorGame.lever.on('animationend webkitTransitionEnd oTransitionEnd', function(){ 
      //show button for the right door
      horrorGame.showObject('#doorNineA button');
      horrorGame.doorNineAImg.attr('src', './assets/doorOpen.png');
      horrorGame.changeFrame(8);     
    });
  });

  $('#doorNineA button').on('click', function() {
    horrorGame.changeFrame(3);
  });
  $('#doorNineB button').on('click', function() {
    horrorGame.showObject(horrorGame.bone);
    horrorGame.changeFrame(2);
  });

  $('#menuButton').on('click', function(){
    horrorGame.navHolder.toggleClass('hiddenNav');
    $('#menuButton i').toggleClass('fa-bars fa-times');
  });
  $('#resetButton').on('click', function(){
    horrorGame.toggleMenu();
    horrorGame.start();
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
  horrorGame.hideObject(horrorGame.bone);
  horrorGame.eyeParent.empty();
  //Hide all appropriate frames
  $(horrorGame.frames)
    .find('.window').addClass('hideFrame')
    .find('.closedEye').removeClass('hideFrame');
  //Show things
  $('#placardText').text("Key for sale.");
  horrorGame.showObject($('#key'));

  //Make sure animations are off
  horrorGame.buttonTop.removeClass('buttonAnimation');
  horrorGame.lever.removeClass('leverAnimation');

  //reset images
  horrorGame.doorNineAImg.attr('src', './assets/doorClosed.png');
  horrorGame.doorNineBImg.attr('src', './assets/doorClosed.png');

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
  //Make sure the ul is empty
  $(horrorGame.nav).empty();
  //For each frame that exists, create a button that will change to it
  //Also hide / update the menu button when you click
  for(let i = 0; i < horrorGame.frames.length; i++){
    const navButton = $(`<li><button disabled class="conversationButton"><span>${i+1}</span></button></li>`);
    $(horrorGame.nav).append(navButton);
    navButton.find('button').on('click', function(){
      horrorGame.toggleMenu();
      horrorGame.changeFrame(i);
    });
  }
}

horrorGame.toggleMenu = () => {
  horrorGame.navHolder.toggleClass('hiddenNav');
  $('#menuButton i').toggleClass('fa-bars fa-times');
}

horrorGame.setEndScreen = (text, callback) => {
  horrorGame.endingDiv
    .find('h3').text(text).fadeOut(500, function(){
      $(this).fadeIn(3500);
      if(callback !== undefined){
        callback();
      }
    });
  
}
horrorGame.badEnd = () => {
  const eyeCount = Math.floor(Math.random() * 10) + 10;
  const width = $(window).width() * 0.8;
  const height = $(window).height() * 0.8;
  
  horrorGame.eyeParent.empty();
  for(let i = 0; i < eyeCount; i++){
    const eye = $(`<img class="endingEye" src="./assets/eye/eye0.png" alt="">`);
    const newEye = eye.appendTo(horrorGame.eyeParent);
    
    const x = Math.floor(Math.random() * width);
    
    const y = Math.floor(Math.random() * height);

    newEye.css({left: `${x}px`, top: `${y}px`});


    setTimeout(function() {
      horrorGame.animateEye(newEye, 1, 300);
    }, (Math.floor(Math.random() * 2000) + 1500));
  }
}

horrorGame.animateEye = (eye, index) => {
  eye.attr('src', `./assets/eye/eye${index}.png`)
  if(index < 4){
    setTimeout(function(){
      horrorGame.animateEye(eye, ++index);
    }, 100);
  }
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
    const newButton = $('<li><button class="conversationButton"></button></li>');
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
  
  $(horrorGame.nav.children()[n]).find('button').removeAttr('disabled');
  //Scroll the html/body to the top of the next frame
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

horrorGame.tradeWithSkull = () => {
  horrorGame.removeFromInventory('bone');
  horrorGame.addToInventory('doorKey');
  $('#placardText').text('Key sold.');
  horrorGame.hideObject($('#key'));
  skullNpc.currentIndex = 2;
  horrorGame.showDialogue(skullNpc);
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
      text: 'Welcome to the house of <span class="wiggly">Qhinos, God of Eyes.</span> Are you willing to help us in our endeavour?',
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
          callback: function () { horrorGame.showObject(horrorGame.bone); horrorGame.changeEye(0); horrorGame.changeFrame(2); }
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
skullNpc = {
  name: 'Skull',
  portraitURL: './assets/skullPortrait.png',
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
              horrorGame.tradeWithSkull();
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
              horrorGame.tradeWithSkull();
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
          callback: function () { horrorGame.changeEye(1); horrorGame.changeFrame(5); }
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
              horrorGame.tradeWithSkull();
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
