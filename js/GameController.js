import DataBus from './databus'
import GameInfo from './runtime/gameinfo'
import Player from './player'

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
        this.init_pars();
        this.game_start();
    }

    init_pars()
    {
        //console.log(this.canvas_3d_ctx);
        this.player = new Player(this.main);
        this.gameinfo = new GameInfo(this.canvas_2d_ctx)
        this.dataBus = new DataBus();
    }

    trigger_check()
    {
        
    }

    game_update()
    {
        //绘制ui
        this.dataBus.frame ++;
        if(this.dataBus.gameOver)
            return;
        this.gameinfo.renderGameScore(this.main.canvas_2d_ctx,this.dataBus.score);
        this.move_and_rotate();
        this.player.update_self();
    }

    game_start()
    {
        
    }

    game_end()
    {
        
    }

    move_and_rotate()
    {

    }
}
