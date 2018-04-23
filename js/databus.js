
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
        this.frame      = 0;
        this.score      = 0;
        this.gameOver   = false;
        this.fall_able  = true; //是否可以下落，模拟碰撞到平板上
    }
}
