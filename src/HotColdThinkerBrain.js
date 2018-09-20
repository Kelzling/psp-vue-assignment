class HotColdThinkerBrain extends ThinkerBrain {
  constructor () {
    super()
    this.instructions = 'You guess the number! The game will generate a random number between 0 and 99. Enter your guess in the box below and the game will tell you if you are COLD (more than 40 from the target number), COOL (within 20-39 of the target number), WARM (within 10-19 of the target number), or HOT (within 9 of the target number).'
    this.responseOptions = {hot: 'HOT', warm: 'WARM', cool: 'COOL', cold: 'COLD'}
  }
  
  computerGuess (userGuess) {
    let response = ''
    if (userGuess === this.number) {
      // if guess is correct
      response = this.winResponse
      this.gameState = 'finished'
    } else if (userGuess <= this.number + 9 && userGuess >= this.number - 9) {
      response = this.responseOptions.hot
    } else if (userGuess <= this.number + 19 && userGuess >= this.number - 19) {
      response = this.responseOptions.warm
    } else if (userGuess <= this.number + 39 && userGuess >= this.number - 39) {
      response = this.responseOptions.cool
    } else {
      response = this.responseOptions.cold
    }
    return response
  }
}