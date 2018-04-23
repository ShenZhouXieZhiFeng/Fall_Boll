import * as OrbitControls from 'libs/threejs/OrbitControls'
import * as THREE from 'libs/threejs/three.min'
import GameController from './GameController'

const scene_url = "http://192.168.1.62/res/scene.json"

let width,height;
let viewAngle = 75,
    near = 0.1,
    far = 1000;
let camera_position_x = 0.043
let camera_position_y = 32.94
let camera_position_z = 15.12

let camera_rotation_x = -1.01
let camera_rotation_y = 0
let camera_rotation_z = 0

/**
 * 游戏主函数
 */
export default class Main {

    constructor() {

        width = window.innerWidth;
        height = window.innerHeight;
        
        this.init_objs();
        this.start()
    }
    init_objs()
    {
        this.scene = new THREE.Scene();

        //获取2d canvas
        this.canvas_2d = canvas;
        this.canvas_2d_ctx = canvas.getContext('2d')

        //获取3d canvas
        this.canvas_3d = wx.createCanvas();
        this.canvas_3d_ctx = this.canvas_3d.getContext('webgl')
        console.log(this.canvas_3d_ctx)

        // 同时指定canvas为小游戏暴露出来的canvas
        this.renderer  = new THREE.WebGLRenderer({ context: this.canvas_3d_ctx })

        //this.camera = new THREE.PerspectiveCamera(
        //    camera_config.viewAngle, 
        //    scene_config.width / scene_config.height, 
        //    camera_config.near, 
        //    camera_config.height);
        //this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        //this.light = new THREE.AmbientLight(0xffffff);
        //this.scene.add(this.light);  

        this.player = new THREE.Group();//玩家
        this.player_sphere = new THREE.Object3D();//玩家圆球
        this.planes = new THREE.Group();//平板组
        this.plane = new THREE.Object3D();//单个平板引用
        this.env_objs = new THREE.Object3D();//环境物品
    }
    start() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.loader_scene();
    }
    loader_scene()
    {
        this.loader = new THREE.ObjectLoader();
        this.loader.load(scene_url,(obj)=>{
            this.sceneObject = obj;
            this.sceneObject.position.set(0,0,0);
            this.scene.add(this.sceneObject);
            
            this.on_load_over();
        });
    }
    on_load_over()
    {
        this.get_objs();
        this.create_game_scene();
        this.init_camera();
        this.init_lights();
        this.game_controller = new GameController(this);
        window.requestAnimationFrame(this.loop.bind(this), canvas);
    }
    //获取物体引用
    get_objs()
    {
        this.plane = this.scene.getObjectByName("plane");
        this.env_objs = this.scene.getObjectByName("env_objs");

        this.player.name = "player";
        this.sceneObject.add(this.player);
        this.player_sphere = this.scene.getObjectByName("player_sphere");
        this.player.add(this.player_sphere);
    }
    //通过复制创建初始游戏场景
    create_game_scene()
    {
        let initX = this.plane.position.x;
        let initY = this.plane.position.y;
        let initZ = this.plane.position.z;
        this.planes.add(this.plane);
        this.planes.name = "planes";
        for (let i = 0; i < 10; i++)
        {
            var n_plane = this.plane.clone();
            n_plane.name = "plane" + i;
            n_plane.position.set(initX, initY - 50*i, initZ - 50*i);
            this.planes.add(n_plane);
        }
        this.sceneObject.add(this.planes);
    }
    init_camera()
    {
        // 透视摄像头
        this.camera = new THREE.PerspectiveCamera(
            viewAngle, 
            width / height, 
            near, 
            height);
        this.player.add(this.camera);
        this.camera.position.x = camera_position_x;
        this.camera.position.y = camera_position_y;
        this.camera.position.z = camera_position_z;

        this.camera.rotation.x = camera_rotation_x;
        this.camera.rotation.y = camera_rotation_y;
        this.camera.rotation.z = camera_rotation_z;

        //this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        //this.controls.maxPolarAngle = Math.PI * 0.5;
        //this.controls.minDistance = 1;
        //this.controls.maxDistance = 500;
    }
    init_lights()
    {
        this.light = new THREE.AmbientLight(0xffffff);
        this.scene.add(this.light);  
    }
    loop() {
        
        //清除2d界面
        this.canvas_2d_ctx.clearRect(0, 0, this.canvas_2d.width, this.canvas_2d.height);

        //游戏逻辑刷新
        this.game_controller.game_update();
        //渲染3d场景
        this.renderer.render(this.scene, this.camera);
        //将3d场景绘制到2d上
        this.canvas_2d_ctx.drawImage(this.canvas_3d,0,0);

        window.requestAnimationFrame(this.loop.bind(this), this.canvas_2d);
    }
}
