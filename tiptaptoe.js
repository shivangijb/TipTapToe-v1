const _manageCountMap = function() {
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

    //getTargetCountFunction
    return (level) => {
        return COUNT_MAP.get(level);
    }
}

const _manageScoreBoard = function() {
    let SCORE_BOARD = {
        missed: 0,
        caught: 0
    };

    return {
        getScore: () => {
            return SCORE_BOARD;
        },

        incrementCaughtScore: () => {
            ++SCORE_BOARD.caught;
        },

        incrementMissedScore: () => {
            ++SCORE_BOARD.missed;
        }
    };
}

const _manageLevelCount = function() {
    let CURRENT_LEVEL = 0; //TODO: Is there anyway to get rid of these global variables
    return {
        incrementLevel: () => {
            return ++CURRENT_LEVEL;
        },

        resetLevel: () => {
            CURRENT_LEVEL = 1;
            return CURRENT_LEVEL;
        }
    };
}

const getTargetCount = _manageCountMap();
const scoreBoardFactory = _manageScoreBoard();
const updateLevelFactory = _manageLevelCount();

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
        nameField.style.animation = 'highlightcell 0.6s 2';
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

    $('.right-list').show({
        start: function() {
            $(this).css('display', 'flex');
        }
    }, "slow");
    // $('.right-list').show("slow");
    $('.left-list').show("slow"); 

    _startGame();
}

const _startGame = function() {
    _showNextLevel(updateLevelFactory.incrementLevel());
}

const submitAndNext = function() {
    _showNextLevel(updateLevelFactory.incrementLevel());
    //TODO: reset timer - if applicable
}

const restartGame = function() {
    _showNextLevel(updateLevelFactory.resetLevel());
    //TODO: reset scores 
    //reset time - if applicable
}
/**
 * TODO: Move all Level-vise grid generator to a mixin
 */
const  _showNextLevel = function(level) {
    //TODO: swoop in level indicator animation for the change of level
    
    //TODO: while disabling GO btn - mildly change the styling
    {
        document.getElementById('go-btn').disabled = true;
        document.getElementById('go-btn').style.opacity = 0.5;
    }

    const elem = document.querySelector('checkbox-grid');
    elem?.parentNode.removeChild(elem);

    const levelObj = new _LevelGenerator(level, getTargetCount);   

    const grid = document.createElement('checkbox-grid');
    grid.setAttribute('row', levelObj.gridSize); //TODO: Customize
    grid.setAttribute('column', levelObj.gridSize); //TODO: Customize
    document.getElementById('center-play').appendChild(grid);

    //TODO:
    //add targetlocations display
    //start timer
    //hide after timer resolved
    //store the current level locations

    document.getElementById("center-play").style.animation = "zoomin 0.8s 1";
    document.getElementById("center-play").style.visibility = "visible";
    
    _showTargetElements(levelObj);
}

const _showTargetElements = function(levelObj) {
    const arr = levelObj.targetLocations;
    const shadowRoot =document.querySelector('checkbox-grid').shadowRoot;
    for(let i=0; i<arr.length; i++) {
        //TODO:Change to image
        shadowRoot.getElementById('gridid_'+arr[i]).style.backgroundColor = '#000';
        // shadowRoot.getElementById('gridid_'+arr[i]).classList.add('cell-fish');
    }
    setTimeout(function(arr, root){
        for(let i=0; i<arr.length; i++) {
            //TODO:Change to image
            root.getElementById('gridid_'+arr[i]).style.backgroundColor = '#4974c4';
            // shadowRoot.getElementById('gridid_'+arr[i]).classList.remove('cell-fish');
        }

        //TODO: if styling change applied then revert the styling
        {
            document.getElementById('go-btn').disabled = false;
            document.getElementById('go-btn').style.opacity = 1;
        }
    }, levelObj.displayTime, arr, shadowRoot);
}

// const _cellClick = function() {
//     console.log('cell clicked');
// }

const _LevelGenerator = function(level, targetMapFn) {
    this.level = level;

    const _getDisplayTime = () => {
        if(this.level<=20) {
            return Math.floor((this.level - 1)/4 + 1)*1000;
        } else {
            return 5000;
        }
    }

    const _getGridSize = () => {
        if(this.level <= 20) {
            return Math.floor((this.level+1)/2 + 3);
        } else {
            return 14;
        }
    }

    const _getNumberOfTarget = () => {
        if(this.level<=20) {
            return targetMapFn(this.level);
        } else {
            return 10;
        }
    }

    const _getTargetLocations = () => {
        let targetArr = [];
        this.numberOfTarget = _getNumberOfTarget();
        for(let i=0; i<this.numberOfTarget; i++) {
            targetArr.push(_randomIntGenerator(this.gridSize*this.gridSize));
        }
        return targetArr.sort((a,b)=>a-b);
    }
    //Do i need to do this here, or can i just call the function with the then objscope
    //what is the best practice
    this.gridSize = _getGridSize();
    this.targetLocations = _getTargetLocations();
    this.displayTime = _getDisplayTime();
}

const _randomIntGenerator = function(limit) {
    return Math.floor(Math.random()*limit);
}