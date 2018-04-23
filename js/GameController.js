import DataBus from './databus'
import GameInfo from './runtime/gameinfo'

let instance
//let ctx = canvas.getContext('2d')

export default class GameController {
    constructor(main) {
        if (instance)
            return instance
        instance = this
        this.main = main;
        this.game_ready();
    }
    game_ready()
    {
        console.log("game_ready")
        //console.log(this.main.scene);
        this.init_pars();
    }
    init_pars()
    {
        //console.log(this.canvas_3d_ctx);
        this.gameinfo = new GameInfo(this.canvas_2d_ctx)
        this.dataBus = new DataBus();
    }
    game_update()
    {
        //if(!this.dataBus.gameOver)
        //    return;
        //绘制ui
        this.gameinfo.renderGameScore(this.main.canvas_2d_ctx,this.dataBus.score);
    }
}
