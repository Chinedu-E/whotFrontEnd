



export function isValid(faceCard: any, toPlay: any, hasPlayed: boolean){
    // Special case: Whot card (represented by shape 20) can be played on any card
    if (toPlay.shape === 20) {
        return true;
    }

    if (hasPlayed) {
        if (toPlay.num === faceCard.num) {
          return true;
        }
        return false;
      }

    // Match by shape
    if (toPlay.shape === faceCard.shape) {
        return true;
    }

    // Match by number
    if (toPlay.num === faceCard.num) {
        return true;
    }

    // Special cards logic
    switch (faceCard.num) {
        case 1: // Pick One
            return toPlay.num === 1
        case 2: // Pick Two
            return toPlay.num === 2
        case 5: // Pick Three
            return  toPlay.num === 5;
        case 8: // Suspension
            return toPlay.num === 8;
        case 14: // General Market
            return toPlay.num === 14;
    }

    // If none of the above conditions are met, the card is not valid
    return false;
}


export function getStackValue(stack: any, market: number){
    var value = 0
    var turnsToSkip = 1
    var failed_defense = false
    const card = stack[0]
    if (card){
        if (card.num === 2){
            value = 2 * stack.length
        }
        if (card.num === 5){
            value = 3 * stack.length
        }
        if (card.num === 14){
            value = stack.length === 1 ? 0 : (1 * stack.length)
        }
        if (card.num === 8){
            turnsToSkip = (1 * stack.length) 
        }
    }

    if (stack.length === 0 && market > 0){
        failed_defense = true
    }
    return {
        market: market + value,
        turns_to_skip: turnsToSkip === 1 ? 2: turnsToSkip + 1,
        failed_defense: failed_defense
    }
}