import DataBus from './databus'

let instance

export default class Player
{
    constructor(main,game_controller) {
        if (instance)
            return instance;
        instance = this;

        this.dataBus = new DataBus();
        this.main = main;
        this.game_controller = game_controller;
        this.player = this.main.player;

        this.high_score = 0;//最高分
        this.last_score = 0;//上一次分数
        this.player_init_height = 10;

        this.reset();
    }
    reset() 
    {
        this.player.position.x = 0;
        this.player.position.y = this.player_init_height;
        this.player.position.z = 0;
        this.init_pars();
    }
    init_pars()
    {
        this.max_speed = 10;
        this.max_rotate = 10;

        this.cur_speed = 0.2;//当前速度
        this.cur_add_speed = 0;//当前加速度

        this.cur_rotate = 0;//当前旋转速度

        this.speed_reduce_par = 0.0001;//速度衰减幅度,模拟阻力

        this.move_speed = 0.5;//拖动的参考速度

        this.fall_speed = 0.3;//下落速度，模拟重力

    }
    drag_controller(moveX)
    {
        this.player.position.x += moveX * this.move_speed;
    }
    //刷新自身的参数
    update_pars()
    {
        //速度 = 速度 + 加速度 - 阻力
        if(this.cur_speed <= 0 && this.cur_add_speed <= 0)
        {
            this.game_controller.check_end();
            this.cur_speed = 0;
            this.cur_add_speed = 0;
            this.cur_rotate = 0;
            return;
        }
        if(this.cur_speed < this.max_speed)
        {
            this.cur_speed = this.cur_speed + this.cur_add_speed;
            this.cur_speed -= this.speed_reduce_par;
        }
        //插值计算旋转
        this.cur_rotate = (this.cur_speed / this.max_speed) * this.max_rotate;
    }
    //根据自身的参数状态去刷新自身的位置情况
    update_self()
    {
        if(this.dataBus.gameOver)
            return;
        this.update_pars();
        this.player.position.z -= this.cur_speed;
        this.main.player_sphere.rotation.x -= this.cur_rotate;
        if(this.dataBus.fall_able)
        {
            //console.log(this.dataBus.fall_able);
            this.player.position.y -= this.fall_speed;
        }
    }
}