
let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
    constructor() {
        if (instance)
            return instance
        instance = this
        this.reset()
    }

    reset() {
        this.plane_name = "plane";    //平板名称，用来射线判断模拟刚体碰撞
        this.trigger_dis = 0.5;       //平板碰撞检测距离
        this.game_over_check_dis = 20;//玩家速度为0时死亡检测距离

        this.frame      = 0;
        this.score      = 0;
        this.gameOver   = false;
        this.fall_able  = true; //是否可以下落，模拟碰撞到平板上
    }
}
