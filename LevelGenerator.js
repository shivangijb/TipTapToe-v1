class LevelGenerator {
  constructor(level, targetMap) {
      this.level = level;
      this.targetMap = targetMap;
  }

  get gridSize() {
      if(this.level <= 20) {
          return Math.floor((this.level+1)/2 + 3);
      } else {
          return 14;
      }
  }

  get timeForShow() { //returns in seconds
      if(this.level<=20) {
          return Math.floor((this.level - 1)/4 + 2);
      } else {
          return 6;
      }
  }

  get numberOfTarget() {
      if(this.level<=20) {
          return this.targetMap.get(level);
      } else {
          return 10;
      }
  }

  get targetLocations() {
      let targetArr = [];
      for(let i=0; i<this.numberOfTarget; i++) {
          targetArr.push(this._randomIntGenerator(this.gridSize*this.gridSize));
      }
      return targetArr.sort((a,b)=>a-b);
  }

  _randomIntGenerator(limit) {
      return Math.floor(Math.random()*limit);
  }
}

module.exports = LevelGenerator;