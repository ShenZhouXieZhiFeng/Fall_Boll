const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'res/images/Common.png'

let instance

export default class GameInfo {

    constructor(ctx) {
        if (instance)
            return instance
        instance = this
        this.ctx = ctx;
        this.reset()
    }

    update_ui()
    {
        if(this.show_add_score)
        {
            this.showAddScoreText(this._score,this._posX,this._posY,true);
        }
    }

    reset(){
        //flag
        this.show_add_score = false;
        this.showAddScoreText_showTime = 2000;
        this.showAddScoreText_timeOut = null;

    }

    showSpeed(speed,rotation)
    {
        this.ctx.fillStyle = "#C60000"
        this.ctx.font      = "20px Arial"

        this.ctx.fillText(
            "speed:" + speed,
            10,
           30
        )

        this.ctx.fillText(
            "rotate:" + rotation,
            10,
            50
        )
    }

    renderGameScore(ctx, score) {
        ctx.fillStyle = "#666666"
        ctx.font      = "20px Arial"

        ctx.fillText(
            score,
            10,
            30
        )
    }

    showAddScoreText(score,posX,posY,selfCall = false)
    {
        this._score = score;
        this._posX = posX;
        this._posY = posY;

        this.ctx.fillStyle = "#C60000"
        this.ctx.font      = "20px Arial"

        this.ctx.fillText(
            "+" + score,
            posX,
            posY
        )

        this.show_add_score = true;

        if(this.showAddScoreText_timeOut != null && selfCall)
        {
            //window.clearTimeout(this.showAddScoreText_timeOut);
            return;
        }
        this.showAddScoreText_timeOut = window.setTimeout(()=>{
            this.show_add_score = false;
            this.showAddScoreText_timeOut = null;
        },this.showAddScoreText_showTime);
    }

    renderGameOver(ctx, score) {
        ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)
    
        ctx.fillStyle = "#ffffff"
        ctx.font    = "20px Arial"

        ctx.fillText(
            '游戏结束',
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 50
        )

        ctx.fillText(
            '得分: ' + score,
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 130
        )

        ctx.drawImage(
            atlas,
            120, 6, 39, 24,
            screenWidth / 2 - 60,
            screenHeight / 2 - 100 + 180,
            120, 40
        )

        ctx.fillText(
            '重新开始',
            screenWidth / 2 - 40,
            screenHeight / 2 - 100 + 205
        )


        /**
            * 重新开始按钮区域
            * 方便简易判断按钮点击
            */
        this.btnArea = {
            startX: screenWidth / 2 - 40,
            startY: screenHeight / 2 - 100 + 180,
            endX  : screenWidth / 2  + 50,
            endY  : screenHeight / 2 - 100 + 255
        }
    }
}

