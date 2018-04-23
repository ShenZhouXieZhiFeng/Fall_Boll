import * as OrbitControls from 'libs/threejs/OrbitControls'
import * as THREE from 'libs/threejs/three.min'

const image_url = "res/images/indienova.png"
const scene_url = "http://192.168.1.62/res/scene.json"

let scene_config = {
    //scene
    width:0,
    height:0,
}
let camera_config = {
    viewAngle:75,
    newr:0.1,
    far:1000,

    camera_position_x: 0.043,
    camera_position_y: 32.94,
    camera_position_z: 15.12,

    camera_rotation_x: -1.01,
    camera_rotation_y: 0,
    camera_rotation_z: 0,
}

/**
 * 游戏主函数
 */
export default class Main {

    constructor() {
        scene_config.width = window.innerWidth;
        scene_config.height = window.innerHeight;
        
        this.init_objs();
        this.start()
    }
    init_objs()
    {
        this.scene = new THREE.Scene();

        // 同时指定canvas为小游戏暴露出来的canvas
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true 
        });
        this.renderer.shadowMapEnabled = true;  

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
        // 在场景中添加雾的效果；样式上使用和背景一样的颜色
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        var geometry = new THREE.CubeGeometry(1, 1, 1);
        // 加载纹理贴图
        var texture = new THREE.TextureLoader().load(image_url);
        var material = new THREE.MeshBasicMaterial({ map: texture });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        // 设置camera的高度，若是低于当前场景的高度则屁也看不到

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
            camera_config.viewAngle, 
            scene_config.width / scene_config.height, 
            camera_config.near, 
            camera_config.height);
        this.player.add(this.camera);
        this.camera.position.x = camera_config.camera_position_x;
        this.camera.position.y = camera_config.camera_position_y;
        this.camera.position.z = camera_config.camera_position_z;

        this.camera.rotation.x = camera_config.camera_rotation_x;
        this.camera.rotation.y = camera_config.camera_rotation_y;
        this.camera.rotation.z = camera_config.camera_rotation_z;

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
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.loop.bind(this), canvas);
    }

    //let scene;

    //constructor() {
    //    this.restart()
    //}
    //restart() {
    //    scene = new THREE.Scene();
    //    renderer = new THREE.WebGLRenderer({
    //        canvas: canvas,
    //        antialias: true 
    //    });
    //    renderer.shadowMapEnabled = true; 

    //    width = window.innerWidth;
    //    height = window.innerHeight;
    //    aspect = width / height;

    //    renderer.setSize(width, height)

    //    console.log("屏幕尺寸: " + width + " x " + height)

    //    // Load models
    //    var loader = new THREE.ObjectLoader();
    //    loader.load(scene_url,(obj)=>{
    //        sceneObject = obj;
    //        sceneObject.position.x = 0;
    //        sceneObject.position.y = 0;
    //        sceneObject.position.z = 0;
    //        scene.add(sceneObject);
    //        console.log(obj);
    //        this.create_scene();
    //    });
    //}
    //create_scene()
    //{
    //    camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    //    this.add_light();
    //    this.addCamera();
    //    this.initObjs();

    //    this.loop();
    //}
    //loop() {
    //    renderer.render(scene, camera);
    //    window.requestAnimationFrame(this.loop.bind(this), canvas);
    //}
    //add_light()
    //{
    //    var ambient = new THREE.AmbientLight(0x404040);
    //    scene.add(ambient);
    //}
    //addCamera() {
    //    // Camera
    //    camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
    //    scene.add(camera);
    //}
    //initObjs() {
    //    plane = scene.getObjectByName("plane");
    //    env_objs = scene.getObjectByName("env_objs");

    //    player.name = "player";
    //    sceneObject.add(player);
    //    player_sphere = scene.getObjectByName("player_sphere");
    //    player.add(player_sphere);
    //}
}
