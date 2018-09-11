/* global VERBOSE */

class ThinkerBrain { // eslint-disable-line no-unused-vars
  constructor (newGameType, newResponseOptions) {
    this.gameType = newGameType
    this.responseOptions = newResponseOptions
    this.gameState = 'start-up'
    this.number = 0
    this.guessCount = 0
    this.guessHistory = []
  }

  get winResponse () {
    let output = `You got it in ${this.guessCount} trial`
    if (this.guessCount === 1) {
      output += `!`
    } else {
      output += `s!`
    }
    return output
  }

  get formattedHistory () {
    // formats the history in an average looking string. needs reworking
    let output = ''
    if (this.guessHistory) {
      this.guessHistory.forEach(function (num, index) { output += `${index + 1}: ${num}, ` })
    }
    return output
  }

  startGame () {
    // (re)set game variables and generate random number
    this.guessCount = 0
    this.guessHistory = []
    this.number = Math.round(Math.random() * 100)
    this.gameState = 'in-progress'
    if (VERBOSE) {
      // verbose logging for testing purposes
      console.log(`History: ${this.guessHistory}
      guessCount: ${this.guessCount}
      random number: ${this.number}
      game state: ${this.gameState}`)
    }
  }

  processInput (userInput) {
    // process user input from string into a whole number
    return Math.round(Number(userInput))
  }

  validateInput (userGuess) {
    // ensure user input is a number within the valid range of 0-99
    let isValid = false
    if (!isNaN(userGuess)) {
      // check if between 0 and 99 inclusive
      if (userGuess >= 0 && userGuess <= 99) {
        isValid = true
      } else {
        // input is invalid
      }
    }
    return isValid
  }
  
  highLowGuess (userGuess) {
    let response = ''
    if (userGuess > this.number) {
      // if guess is too high
      response = this.responseOptions.tooHigh
    } else if (userGuess < this.number) {
      // if guess is too low
      response = this.responseOptions.tooLow
    } else if (userGuess === this.number) {
      // if guess is correct
      response = this.winResponse
      this.gameState = 'finished'
    } else {
      // shouldn't be able to get here
      console.warn('Guess makes no sense')
    }
    return response
  }
  
  hotColdGuess (userGuess) {
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

  turnHandler (userInput) {
    // function called by Vue, which passes the user input in it's raw form
    let response = ''
    let userGuess = this.processInput(userInput)
    if (this.validateInput(userGuess)) {
      // if input was valid, add to guessCount and history then call guess comparing logic
      this.guessCount += 1
      if (VERBOSE) {
        console.log(`Guess Count: ${this.guessCount}`)
      }
      this.guessHistory.push(userGuess)
      if (this.gameType === 'HighLow') {
        response = this.highLowGuess(userGuess)
      } else if (this.gameType === 'HotCold') {
        response = this.hotColdGuess(userGuess)
      }
    } else {
      // else if input was not a valid guess
      response = 'Please Enter a number between 0-99'
    }
    return {message: response, gameState: this.gameState}
  }
}
