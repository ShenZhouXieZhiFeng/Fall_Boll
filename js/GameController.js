﻿import DataBus from './databus'
import GameInfo from './runtime/gameinfo'
import Player from './player'
import * as THREE from 'libs/threejs/three.min'

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
        console.log("get gameinfo");
        this.gameinfo = new GameInfo(this.main.canvas_2d_ctx);
        console.log(this.gameinfo);
        this.dataBus = new DataBus();

        this.trigger_dir = new THREE.Vector3(0,-1,0);
        this.trigger_ray = new THREE.Raycaster();
        this.last_trigger_obj_name = "";

        this.main.canvas_2d.addEventListener("touchstart",(e)=>{
            this.gameinfo.showAddScoreText(100,e.touches[0].clientX,e.touches[0].clientY);
        });
    }

    game_start()
    {
        
    }

    game_end()
    {
        
    }

    //碰撞检测
    trigger_check()
    {
        this.trigger_ray.set(this.main.player.position,this.trigger_dir);
        var intersections = this.trigger_ray.intersectObjects(this.main.planes.children);
        if (intersections.length > 0) {
            var intersection = intersections[0];
            if (intersection.distance < this.dataBus.trigger_dis) {
                if (this.last_trigger_obj_name == intersection.object.name)
                    return;
                this.last_trigger_obj_name = intersection.object.name;
                if (intersection.object.name.indexOf(this.dataBus.plane_name) >= 0) {
                    this.dataBus.fall_able = false;
                    return;
                }
            }
        }
        this.dataBus.fall_able = true;
    }

    game_update()
    {
        //绘制ui
        this.dataBus.frame ++;
        if(this.dataBus.gameOver)
            return;
        this.gameinfo.update_ui();
        //this.gameinfo.renderGameScore(this.main.canvas_2d_ctx,this.dataBus.score);
        this.trigger_check();
        this.update_player_pars();
        //最后再刷新玩家
        this.player.update_self();
    }

    //刷新玩家参数,加速度，加选择速度等
    update_player_pars()
    {

    }
    
}
