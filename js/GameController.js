
let instance

export default class GameController
{
    constructor() {
        if ( instance )
            return instance
        instance = this
    }
}