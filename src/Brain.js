/* global VERBOSE */

class Brain { // eslint-disable-line no-unused-vars
  constructor () {
    this.guessCount = 0
    this.gameState = 'start-up'
    this.guessHistory = []
    this.instructions = ''
    this.buttons = []
  }

  get formattedHistory () {
    // basic version for consistent interface purposes
    let output = ''
    for (let item in this.guessHistory) {
      output += this.guessHistory[item]
    }
    return output
  }

  startGame () {
    // (re) initialise variables that need clearing for each game.
    this.guessCount = 0
    this.gameState = 'in-progress'
    this.guessHistory = []
    if (VERBOSE) {
      console.log(`guess count: ${this.guessCount}, game state: ${this.gameState}, guess history: ${this.guessHistory}`)
    }
  }
}
