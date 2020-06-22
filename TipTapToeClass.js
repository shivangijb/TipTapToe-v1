export default class TipTapToeClass {
    toggleMusic() {
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
    sendHeart() {
    
    }
    
    //TODO: show menu with rules
    showMenu() {
    
    }
    
    showRules() {
        $('#intro').hide('slow');
        $('#rules').show("slow");
        $('#username').hide("slow");
    }
    
    pickUsername() {
        $('#rules').hide("slow");
        $('#username').show("slow");
    }
    
    letsPlay() {
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
    
    submitAndNext() {
        
    }
    
    _startGame() {
        _showNextLevel();
        document.getElementById("center-play").style.animation = "zoomin 1s 1";
        document.getElementById("center-play").style.visibility = "visible";
    }
    
    /**
     * TODO: Move all Level-vise grid generator to a mixin
     */
    _showNextLevel() {
        const levelObj = new LevelGenerator(CURRENT_LEVEL, COUNT_MAP);
        const grid = dohcument.createElement('checkbox-grid');
        grid.setAttribute('row', levelObj.gridSize);
        grid.setAttribute('column', levelObj.gridSize);
        document.getElementById('center-play').appendChild(grid);
    }
}