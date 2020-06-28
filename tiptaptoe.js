const _manageCountMap = function() {
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

        incrementCaughtScore: (count) => {
            SCORE_BOARD.caught+=count;
        },

        incrementMissedScore: (count) => {
            SCORE_BOARD.missed+=count;
        },

        resetScore: () => {
            SCORE_BOARD.missed = 0;
            SCORE_BOARD.caught = 0;
        }
    };
}

const _manageLevel = function() {
    let CURRENT_LEVEL = 0; 
    let _targetSet = new Set();
    let _selectedSet = new Set();

    return {
        incrementLevel: () => {
            return ++CURRENT_LEVEL;
        },

        resetLevel: () => {
            CURRENT_LEVEL = 1;
            return CURRENT_LEVEL;
        },

        getLevel: () => {
            return CURRENT_LEVEL;
        },

        setTargetSet: (set)=> {
            _targetSet.clear();
            _targetSet = set;
        },

        updateSelectedSet: (cell) => {
            if (_selectedSet.has(cell))
                _selectedSet.delete(cell);
            else 
                _selectedSet.add(cell);
        },

        clearSelectedSet: () => {
            _selectedSet.clear();
        },

        validateSelection: () => {
            const targetMissed = [];
            const targetWrong = [];
            const targetCorrect = [];
            for (let key of _targetSet) {
                if (!_selectedSet.has(key))
                    targetMissed.push(key);
            }
            for (let key of _selectedSet) {
                if (!_targetSet.has(key))
                    targetWrong.push(key);
                else 
                    targetCorrect.push(key);
            }
            return {
                targetMissed: targetMissed,
                targetWrong: targetWrong,
                targetCorrect: targetCorrect
            };
        }
    };
}

const _LevelGenerator = function(level, targetMapFn) {
    this.level = level;

    const _getDisplayTime = () => {
        if(this.level<=6) {
            return Math.floor((this.level - 1)/4 + 1)*800;
        } else if (this.level < 14) {
            return Math.floor((this.level - 1)/4 + 1)*500;
        } else {
            return 4000;
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
        const targetSet = new Set();
        this.numberOfTarget = _getNumberOfTarget();
        while(targetSet.size!==this.numberOfTarget) {
            targetSet.add(_randomIntGenerator(this.gridSize*this.gridSize));
        }
        return targetSet;
    }

    this.gridSize = _getGridSize();
    this.targetLocations = _getTargetLocations();
    this.displayTime = _getDisplayTime();
}

const _randomIntGenerator = function(limit) {
    return Math.floor(Math.random()*limit);
}

const _cellStyleCount = function() {
    let count = 0;
    return () => {
        count = count%7+1;
        return count;
    }
}

const getTargetCount = _manageCountMap();
const cellStyleFactory = _cellStyleCount();
const scoreBoardFactory = _manageScoreBoard();
const manageLevelFactory = _manageLevel();
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

//TODO: show window with leaderboard scores
const showLeaderboard = function() {

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
    // Show user name: document.getElementById('username-label').innerText = nameField.value;
    
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

    $('.left-list').show("slow"); 

    _startGame();
}

const _startGame = function() {
    _showNextLevel(manageLevelFactory.incrementLevel());
}

const submitAndNext = function() {
    const validationStat = manageLevelFactory.validateSelection();
    scoreBoardFactory.incrementMissedScore(validationStat.targetMissed.length);
    scoreBoardFactory.incrementCaughtScore(validationStat.targetCorrect.length);
    _displayValidationStat(validationStat);
    _displayUpdatedScores();
    setTimeout(()=>{
        _showNextLevel(manageLevelFactory.incrementLevel());
    },1500);
}

const _displayValidationStat = function(validationStat) {
    const shadowRoot = document.querySelector('checkbox-grid').shadowRoot;
    for (let key of validationStat.targetMissed) {
        shadowRoot.getElementById('gridid_'+key).classList.add('cell-missed');
    }
    
    for (let key of validationStat.targetCorrect) {
        shadowRoot.getElementById('gridid_'+key).classList.add('cell-correct');
    }

    for (let key of validationStat.targetWrong) {
        shadowRoot.getElementById('gridid_'+key).classList.add('cell-wrong');
    }
}

const restartGame = function() {
    _showNextLevel(manageLevelFactory.resetLevel());
    scoreBoardFactory.resetScore();
    _displayUpdatedScores();
}
/**
 * TODO: Move all Level-vise grid generator to a mixin
 */
const  _showNextLevel = function(level) {
    //TODO: swoop in level indicator animation for the change of level
    
    //TODO: DISABLE CLICKING ON THE GRID
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

    document.getElementById("center-play").style.animation = "zoomin 0.8s 1";
    document.getElementById("center-play").style.visibility = "visible";
    
    _showTargetElements(levelObj);
}

const _showTargetElements = function(levelObj) {
    const targetSet = levelObj.targetLocations;
    manageLevelFactory.setTargetSet(targetSet);
    manageLevelFactory.clearSelectedSet();

    const shadowRoot = document.querySelector('checkbox-grid').shadowRoot;
    const cellStyle = cellStyleFactory();
    for(let key of targetSet) {
        shadowRoot.getElementById('gridid_'+key).classList.add('cell-fish-'+cellStyle);
    }
    setTimeout(function(set, root, style){
        for(let key of set) {
            root.getElementById('gridid_'+key).classList.remove('cell-fish-'+style);
        }

        {
            document.getElementById('go-btn').disabled = false;
            document.getElementById('go-btn').style.opacity = 1;
        }
        //TODO: ENABLE CLICKING ON THE GRID
    }, levelObj.displayTime, targetSet, shadowRoot, cellStyle);
}

const cellClick = function(ele) {
    const grid_num = ele.id.split('_')[1];
    manageLevelFactory.updateSelectedSet(+grid_num);

    const shadowRoot = document.querySelector('checkbox-grid').shadowRoot;
    shadowRoot.getElementById(ele.id).classList.toggle('cell-catch');
}

const _displayUpdatedScores = function() {
    const score = scoreBoardFactory.getScore();
    document.getElementById('caught-score').innerText=score.caught;
    document.getElementById('missed-score').innerText=score.missed;
}