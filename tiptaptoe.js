// const LevelGenerator = require('./LevelGenerator.js');
const COUNT_MAP = (function(){ //Map because - might want to add other attributes to level later
    const countMap = new Map();
    for (let i=1; i<=8; i++) {
        let count = i - Math.floor((i-1)/2);
        countMap.set(i, count);
    }

    for (let i=9; i<=16; i++) {
        let count = i - Math.floor((i-1)/2) - 1;
        countMap.set(i, count);
    }

    for (let i=17; i<=20; i++) {
        countMap.set(i, 10);
    }
    
    return countMap;
})();

const CURRENT_LEVEL = 1; //TODO: Is there anyway to get rid of these global variables

const toggleMusic = function() {
    const bgm = $('audio')[0];
    const music_icon = document.getElementById('music');

    if(bgm.paused) {
        bgm.play();
        music_icon.classList.remove('mute');
        music_icon.classList.add('play');
    } else {
        bgm.pause();
        music_icon.classList.remove('play');
        music_icon.classList.add('mute');
    }
}

//TODO: Implement ajax call to the backend to submit like
const sendHeart = function() {

}

//TODO: show menu with rules
const showMenu = function() {

}

const showRules = function() {
    $('#intro').hide('slow');
    $('#rules').show("slow");
    $('#username').hide("slow");
}

const pickUsername = function() {
    $('#rules').hide("slow");
    $('#username').show("slow");
}

const letsPlay = function() {
    const nameField = document.getElementById('fname');
    if(!nameField.value) {
        nameField.style.animation = 'highlightcell 0.8s 2';
        return;
    }
    // document.getElementById('username-label').innerText = nameField.value;
    
    //TODO: storeName to backend for leaderboard
    //TODO: Change music

    $(".left").animate({
        width: "0%"
    }, "slow");
    $("#username").hide("slow");
    $(".right").animate({
        width: "100%"
    }, "slow");

    $(".control-panel").animate({
        left: "45%"
    }, "slow");
    $(".menu").show("slow");

    document.getElementsByClassName("fish-swimming")[0].classList.add("float");
    $(".float-up").hide();

    $('.right-list').show("slow"); //button in this game
    $('.left-list').show("slow"); //score in this game

    _startGame();
}

const _startGame = function() {
    _showNextLevel();
}

const submitAndNext = function() {
    const elem = document.querySelector('checkbox-grid');
    elem.parentNode.removeChild(elem);

    // _showNextLevel();
}

/**
 * TODO: Move all Level-vise grid generator to a mixin
 */
const  _showNextLevel = function() {
    // const levelObj = new LevelGenerator(CURRENT_LEVEL, COUNT_MAP);
    const grid = document.createElement('checkbox-grid');
    grid.setAttribute('row', 4); //TODO: Customize
    grid.setAttribute('column', 4); //TODO: Customize
    document.getElementById('center-play').appendChild(grid);

    document.getElementById("center-play").style.animation = "zoomin 1s 1";
    document.getElementById("center-play").style.visibility = "visible";
}

// const _cellClick = function() {
//     console.log('cell clicked');
// }
