import DataBus from './databus'

let instance

export default class Player
{
    constructor(main) {
        if (instance)
            return instance;
        instance = this;

        this.init_pars();
        this.dataBus = new DataBus();
        this.main = main;
        this.player = this.main.player;
        this.reset();
    }
    init_pars()
    {
        this.cur_speed = 0.1;//当前速度
        this.cur_add_speed = 0;//当前加速度

        this.rotate_speed = 0.1;//当前旋转速度
        this.cur_add_rotate = 0;//当前旋转加速度

        this.speed_reduce_par = 0.1;//速度衰减幅度

        this.move_speed = 0.5;//拖动的参考速度

        this.fall_speed = 0;//下落速度，模拟重力

        this.high_score = 0;//最高分
        this.last_score = 0;//上一次分数
    }

    reset() {

    }

    //刷新自身的参数
    update_pars()
    {
    
    }

    //根据自身的状态去刷新自身的位置情况
    update_self()
    {
        this.update_pars();
        this.player.position.z -= this.cur_speed;
        this.main.player_sphere.rotation.x -= this.rotate_speed;
        if(this.dataBus.fall_able)
        {
            this.player.position.y -= this.fall_speed;
        }
    }
}