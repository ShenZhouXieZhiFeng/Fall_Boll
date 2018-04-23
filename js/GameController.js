import DataBus from './databus'
import GameInfo from './runtime/gameinfo'

let instance
//let ctx = canvas.getContext('2d')

export default class GameController {
    constructor(main,ctx) {
        if (instance)
            return instance
        instance = this
        //this.ctx = ctx;
        this.canvas_3d_ctx = ctx;
        this.ui_canvas = wx.createCanvas()
        this.canvas_2d_ctx = this.ui_canvas.getContext('2d');
        console.log(this.canvas_3d_ctx.drawImage);
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
        //this.gameinfo = new GameInfo(this.canvas_2d_ctx)
        this.dataBus = new DataBus();
    }
    game_update()
    {
        //if(!this.dataBus.gameOver)
        //    return;
        //绘制ui
        //this.canvas_2d_ctx.clearRect(0, 0, this.ui_canvas.width, this.ui_canvas.height)
        //this.gameinfo.renderGameScore(this.canvas_2d_ctx,this.dataBus.score);
        //this.canvas_3d_ctx.drawImage(this.ui_canvas,0,0);
        //console.log(this.canvas_2d_ctx);
    }
}
