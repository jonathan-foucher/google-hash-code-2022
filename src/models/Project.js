module.exports = class Project {
  constructor(name, duration, score, bestBefore, roles) {
    this.name = name;
    this.duration = duration;
    this.score = score;
    this.bestBefore = bestBefore;
    this.roles = roles;
    this.contributors = [];
    this.progression = 0;
    this.orderId = 0;
    this.isInProgress = false;
  }

  isFinished() {
    return this.progression === this.duration;
  }

  calculateActualScore(actualDay) {
    const scorePenality = actualDay + this.duration - this.bestBefore;
    const actualScore = scorePenality > 0 ? this.score - scorePenality : this.score;
    return actualScore > 0 ? actualScore : 0;
  }

  getCompletedScore(actualDay) {
    const scorePenality = actualDay - this.bestBefore;
    const actualScore = scorePenality > 0 ? this.score - scorePenality : this.score;
    return actualScore > 0 ? actualScore : 0;
  }
};
  