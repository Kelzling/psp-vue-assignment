/* global VERBOSE, GuesserBrain */

class HotColdGuesserBrain extends GuesserBrain { // eslint-disable-line no-unused-vars
  constructor () {
    super()
    this.instructions = "The game will guess your number! Think of a number between 0 and 99. The game will output it's guess and you need to tell it if it's COLD (more than 40 from the target number), COOL (within 20-39 of the target number), WARM (within 10-19 of the target number), HOT (within 9 of the target number), or correct. Don't lie though, or the game will call you out!"
    this.buttons = ['Start Game', 'Restart Game?', 'Hot', 'Warm', 'Cool', 'Cold', 'Correct']
  }

  detectLies (newUpperBound, newLowerBound) {
    let liesDetected = false
    if (this.guess === this.upperBound) {
      if (newUpperBound > this.upperBound || newUpperBound < this.lowerBound) {
        liesDetected = true
      }
    } else if (this.guess === this.lowerBound) {
      if (newLowerBound < this.lowerBound || newLowerBound > this.upperBound) {
        liesDetected = true
      }
    }
    return liesDetected
  }

  updateBounds (userResponse) {
    let success = true
    let newUpperBound = this.upperBound
    let newLowerBound = this.lowerBound
    if (this.guess === this.upperBound) {
      switch (userResponse) {
        case 'Hot':
          newUpperBound--
          newLowerBound = Math.max(newLowerBound, newUpperBound - 9)
          break
        case 'Warm':
          newUpperBound -= 10
          newLowerBound = Math.max(newLowerBound, newUpperBound - 9)
          break
        case 'Cool':
          newUpperBound -= 20
          newLowerBound = Math.max(newLowerBound, newUpperBound - 19)
          break
        case 'Cold':
          newUpperBound -= 40
          break
      }
    } else if (this.guess === this.lowerBound) {
      switch (userResponse) {
        case 'Hot':
          newLowerBound++
          newUpperBound = Math.min(newUpperBound, newLowerBound + 9)
          break
        case 'Warm':
          newLowerBound += 10
          newUpperBound = Math.min(newUpperBound, newLowerBound + 9)
          break
        case 'Cool':
          newLowerBound += 20
          newUpperBound = Math.min(newUpperBound, newLowerBound + 19)
          break
        case 'Cold':
          newLowerBound += 40
          break
      }
    }
    if (!this.detectLies(newUpperBound, newLowerBound)) {
      this.upperBound = newUpperBound
      this.lowerBound = newLowerBound
      if (VERBOSE) {
        console.log(`New upper: ${newUpperBound}, New lower: ${newLowerBound}`)
      }
    } else {
      success = false
    }
    return success
  }

  computerGuess () {
    this.guess = (this.guessCount % 2 === 0 ? this.lowerBound : this.upperBound)
    this.guessCount++
    console.log(`Guess #${this.guessCount}: ${this.guess}`)
    return true
  }
}
