/* global VERBOSE */

class ThinkerBrain extends Brain { // eslint-disable-line no-unused-vars
  constructor () {
    super()
    this.instructions = 'You guess the number! The game will generate a random number between 0 and 99. Enter your guess in the box below and the game will tell you if your guess is too high or too low!'
    this.responseOptions = {tooHigh: 'Try lower!', tooLow: 'Try higher!'}
    this.buttons = ['Start Game', 'Submit Guess', 'Restart Game?']
    this.number = 0
  }

  get winResponse () {
    // generates a nicely formatted you won response based upon whether trial needs to be plural or not
    let output = `You got it in ${this.guessCount} trial`
    if (this.guessCount === 1) {
      output += `!`
    } else {
      output += `s!`
    }
    return output
  }

  get formattedHistory () {
    // formats the history in an array of nice strings to be passed through for Vue to handle. Only shows the latest 10 items.
    let output = []
    let count = 1
    if (this.guessHistory) {
      for (let item of this.guessHistory) {
        if (count > 10) {
          break
        }
        output.push(`You guessed ${item.guess} - ${item.message}`)
        count++
      }
    }
    return output
  }

  startGame () {
    // (re)set game variables and generate random number
    super.startGame()
    this.number = Math.round(Math.random() * 100)
    // this.number = 50
    if (VERBOSE) {
      // verbose logging for testing purposes
      console.log(`random number: ${this.number}`)
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

  computerGuess (userGuess) {
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

  turnHandler (userInput) {
    // function called by Vue, which passes the user input in it's raw form
    let userGuess = this.processInput(userInput)
    let response = ''
    if (this.validateInput(userGuess)) {
      // if input was valid, increment guess count and then call the correct guess comparing logic for the game type
      this.guessCount += 1
      if (VERBOSE) {
        console.log(`Guess Count: ${this.guessCount}`)
      }
      response = this.computerGuess(userGuess)
    } else {
      // else if input was not a valid guess
      response = 'Please Enter a number between 0-99'
    }
    // add the guess and response to the beginning of the history array (so it will display the most recent guess at the top of the history)
    this.guessHistory.unshift({guess: userGuess, message: response})
    return {message: response, gameState: this.gameState}
  }
}
