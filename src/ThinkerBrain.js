class ThinkerBrain {
  constructor(newGameType, newResponseOptions) {
    this.gameType = newGameType
    this.responseOptions = newResponseOptions
    this.gameState = 'start-up'
    this.number = 0
    this.guessCount = 0
    this.history = []
  }
  
  get formattedHistory() {
    let output = ''
    if (this.history) {
      this.history.forEach((num, index) => output += `${index}: ${num}, `)
    }
    return output
  }
  
  startGame() {
    // reset game variables and generate random number
    this.guessCount = 0
    this.history = []
    this.number = Math.round(Math.random() * 100)
    this.gameState = 'in-progress'
    if (VERBOSE) {
      // verbose logging for testing purposes
      console.log(`History: ${this.history}
      guessCount: ${this.guessCount}
      random number: ${this.number}`)
    }
  }
  
  processInput(userInput) {
    // process user input from string into a whole number
    return Math.round(Number(userInput))
  }
  
  validateInput(userGuess) {
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
  
  compareGuess(userGuess) {
    let response = ''
    if (gameType === 'HighLow') {
      if (userGuess > this.number) {
        // if guess is too high
        response = this.responseOptions.tooHigh
      } else if (userGuess < this.number) {
        // if guess is too low
        response = this.responseOptions.tooLow
      } else if (userGuess === this.number) {
        // if guess is correct
        response = this.responseOptions.justRight
        this.gameState = 'finished'
      } else {
        // shouldn't be able to get here
        console.warn('Guess makes no sense')
      }
    } else if (gameType === 'HotCold') {
      if (userGuess === this.number) {
        // if guess is correct
        response = this.responseOptions.justRight
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
    } else {
      console.warn('Invalid Game Type')
    }
  }
  
  turnHandler(userInput) {
    // function called by Vue, which passes the user input in it's raw form
    let response = ''
    let userGuess = processInput(userInput)
    if (validateInput(userGuess)) {
      // if input was valid, add to guessCount and history then call guess comparing logic
      this.guessCount += 1
      this.history = userGuess
      response = compareGuess(userGuess)
    } else {
      // else if input was not a valid guess
      response = 'Please Enter a number between 0-99'
    }
    return {message: response, gameState: this.gameState}
  }
}






