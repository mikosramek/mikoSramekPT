const horrorGame = {};



horrorGame.reset = () => {
  //horrorGame.changeFrame(0);
  horrorGame.advanceDialogue(conversationOne);
  for(let i = 0; i < horrorGame.frames.length; i++){
    $(horrorGame.frames[i]).find('.window').addClass('hideFrame');
    $(horrorGame.frames[i]).find('.closedEye').removeClass('hideFrame');
  }
  horrorGame.changeFrame(0);
}

horrorGame.changeFrame = (n) => {
  $(horrorGame.frames[horrorGame.currentFrame]).find('.window').addClass('hideFrame');
  $(horrorGame.frames[horrorGame.currentFrame]).find('.closedEye').removeClass('hideFrame');
  $(horrorGame.frames[n]).find('.closedEye').addClass('hideFrame');
  $(horrorGame.frames[n]).find('.window').removeClass('hideFrame');
  
  $('HTML, body').animate({scrollTop: $(horrorGame.frames[n]).offset().top - 30}, 1000);
  horrorGame.currentFrame = n;
}


// Bind events here
horrorGame.bindEvents = () => {
  $('#characterOne button').on('click', function(){
    horrorGame.changeFrame(1);
  });
  $('#retryButton').on('click', function () {
    horrorGame.reset();
  });
}
horrorGame.findDomReferences = () => {
  horrorGame.frames = $('#frameHolder').children();

  horrorGame.npcName = $('#npcName');
  horrorGame.npcText = $('#npcText');

  horrorGame.responseList = $('#responseList');
  // horrorGame.responseOne = $('#responseOne');
  // horrorGame.responseTwo = $('#responseTwo');
  // horrorGame.responseThree = $('#responseThree');
}

horrorGame.advanceDialogue = (conversationObject) => {
  horrorGame.npcName.text(conversationObject.name);
  const dialogue = conversationObject.dialogue[conversationObject.currentIndex]
  horrorGame.npcText.text(dialogue.text);

  horrorGame.responseList.empty();
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

  horrorGame.reset();
}



conversationOne = {
  name: "Boris",
  portraitURL: "./assets/priestPortrait.png",
  currentIndex: 0,
  dialogue: [
    {
      text: "The door on the left leads to safety. Which door will you choose?",
      responses: [
        {
          text: "Right.",
          callback: function () { horrorGame.changeFrame(2); }
        },
        {
          text: "Left.",
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

// $(function() {
$(document).ready(function(){
  horrorGame.init();
});