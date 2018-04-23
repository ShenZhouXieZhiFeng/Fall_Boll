var width, height;
var viewAngle = 50,
	near = 0.1,
	far = 10000;
var aspect;

var renderer = new THREE.WebGLRenderer();//初始化只是为了有代码提示
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
var container;
var stats;
var sceneObject;

var player = new THREE.Group();//玩家
var player_sphere = new THREE.Object3D();
var planes = new THREE.Group();//平板组
var plane = new THREE.Object3D();//单个平板引用
var env_objs = new THREE.Object3D();//环境物品

//*********************************GAME LOGIC***********************************************//
//虚拟重力情况，以下配置皆为相对值
var config_attribute =
{
    init_add_speed_strenth: 1,  //初始加速度强度
    init_add_speed_time: 2000,   //初始加速度持续时间
    speed_reduce_strenth:0.1,
    fall_speed: 1,   //掉落的速度
    game_end_timeout: 5000 //多久没有落到板上则视为游戏结束
}

var init_attribute =
{
    camera_position_x: 0.043,
    camera_position_y: 32.94,
    camera_position_z: 15.12,

    camera_rotation_x: -1.01,
    camera_rotation_y: 0,
    camera_rotation_z: 0,

    player_height: 10,
}

var button_panel;
var current_score;
var last_score;
var high_score;

function on_load_scene_end() {
    get_ui_panel();
    create_scene();
    set_item_init();
    register();
    log(scene);
    log(camera);
    log(player);
}

function get_ui_panel()
{
    //button_panel = document.getElementById("button_panel");
    //current_score = document.getElementById("current_score");
    //last_score = document.getElementById("last_score");
    //high_score = document.getElementById("high_score");
    button_panel = document.createElement("button_panel");

}

//通过clone制作场景
function create_scene()
{
    let initX = plane.position.x;
    let initY = plane.position.y;
    let initZ = plane.position.z;
    planes.add(plane);
    planes.name = "planes";
    for (let i = 0; i < 10; i++)
    {
        var n_plane = plane.clone();
        n_plane.name = "plane" + i;
        n_plane.position.set(initX, initY - 50*i, initZ - 50*i);
        planes.add(n_plane);
    }
    sceneObject.add(planes);
}

//设置物体初始属性
function set_item_init()
{
    set_obj_pars();

    button_panel.hidden = false;
    player_attribute.last_socre = player_attribute.score;
    set_score();
    last_score.innerHTML = "LAST SCORE:" + player_attribute.last_socre;
    player_attribute.high_score = Math.max(player_attribute.high_score, player_attribute.last_socre);
    high_score.innerHTML = "HIGH SCORE:" + player_attribute.high_score;
}

function set_obj_pars()
{
    //调整相机位置时打开
    //var controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.maxPolarAngle = Math.PI * 0.5;
    //controls.minDistance = 1;
    //controls.maxDistance = 500;

    camera.position.x = init_attribute.camera_position_x;
    camera.position.y = init_attribute.camera_position_y;
    camera.position.z = init_attribute.camera_position_z;

    camera.rotation.x = init_attribute.camera_rotation_x;
    camera.rotation.y = init_attribute.camera_rotation_y;
    camera.rotation.z = init_attribute.camera_rotation_z;

    player.position.x = 0;
    player.position.y = init_attribute.player_height;
    player.position.z = 0;
}

var player_attribute =
{
    forward_speed: 0.5,//前进的速度
    cur_add_speed: 0,//当前加速度
    rotate_speed: 1,//旋转速度
    cur_add_rotate:0,//当前提升的转速
    drag_speed: 0.5,  //拖动的参考速度
    high_score: 0,  //最高分数
    last_socre: 0,  //上次分数
    score: 0 //分数
}

var game_state =
{
    begin: false,
    fall_able: true,
    touched: false
}

const button_type =
{
    game_begin: 1,
    game_end: 2
}

var cur_touch;
var prev_touch_x = 0;
//touch controller
var on_touch_start = function (e)
{
    //log("on_touch_start");
    game_state.touched = true;
    cur_touch = e.touches[0];
}
var on_touch_move = function (e)
{
    cur_touch = e.touches[0];
    //log("on_touch_move");
}
var on_touch_end = function (e)
{
    //log("on_touch_end");
    game_state.touched = false;
    //cur_touch = null;
    prev_touch_x = 0;
}
var touch_controller = function ()
{
    if (cur_touch != null)
    {
        var curX = cur_touch.clientX;
        if (prev_touch_x == 0) {
            prev_touch_x = curX;
        }
        if (prev_touch_x != 0 && prev_touch_x != curX)
        {
            var moveX = (curX - prev_touch_x) / 10 * player_attribute.drag_speed;
            player.position.x += moveX;
            prev_touch_x = curX;
        }
    }
}

function debug(e) {
    //log(camera.rotation);
    //log(camera.position);
}

function register() {
    document.addEventListener("touchstart", on_touch_start, false);
    document.addEventListener("touchmove", on_touch_move, false);
    document.addEventListener("touchend", on_touch_end, false);

    document.addEventListener("touchstart", debug, false);
}

//button event
var on_button_click = function (type)
{
    log(type + " button click");
    switch (type)
    {
        case button_type.game_begin:
            game_begin();
            break;
        case button_type.game_end:
            game_end();
            break;
        default: break;
    }
}
function game_begin()
{
    log("game begin");
    game_state.begin = true;
    button_panel.hidden = true;
}
function game_end()
{
    log("game end");
    game_state.begin = false;
    set_item_init();
}

//游戏结束检查
var check_end_handler = null;
function check_end() {
    check_end_handler = window.setTimeout(() => {
        game_end()
    }, config_attribute.game_end_timeout);
}

//trigger碰撞
var direction = new THREE.Vector3(0,-1,0);
var raycaster = new THREE.Raycaster();
var last_trigger_obj_name = null;
function trigger_controller()
{
    raycaster.set(player.position, direction);
    var intersections = raycaster.intersectObjects(planes.children);
    if (intersections.length > 0) {
        var intersection = intersections[0];
        if (intersection.distance < 0.5) {
            if (last_trigger_obj_name == intersection.object.name)
                return;
            last_trigger_obj_name = intersection.object.name;
            if (intersection.object.name.indexOf("plane") >= 0) {
                game_state.fall_able = false;
                speed_up(0.5, 200);
                window.clearTimeout(check_end_handler);
                check_end_handler = null;
                return;
            }
        }
    }
    game_state.fall_able = true;
    if (check_end_handler == null) {
        check_end();
    }
}

function set_score()
{
    player_attribute.score = init_attribute.player_height - player.position.y;
    current_score.innerHTML = "SCORE:" + player_attribute.score;
}

function move_rotate()
{
    move_speed = player_attribute.forward_speed + player_attribute.cur_add_speed;
    player.position.z -= move_speed;
    player_sphere.rotation.x -= (player_attribute.rotate_speed + player_attribute.cur_add_rotate) / 10;
}

var speed_up_handler = null;
//加速，(加速度，时间)
function speed_up(val, time)
{
    if(speed_up_handler != null)
    {
        window.clearTimeout(speed_up_handler);
        speed_up_handler = null;
    }
    //向前加速度
    player_attribute.cur_add_speed += val;
    //转速提升
    player_attribute.cur_add_rotate += val / 10;
    speed_up_handler = window.setTimeout(() => { 
        //在500豪秒内加速度减到0
        var init = {
            speed: player_attribute.cur_add_speed,
            rotate:player_attribute.cur_add_rotate
        };
        var target = {
            speed: 0,
            rotate:0
        };
        var speed_up_end_tween = new TWEEN.Tween(init).to(target, 500);
        speed_up_end_tween.onUpdate(() => { player_attribute.cur_add_speed = init.speed });
        speed_up_end_tween.start();
    }, time)
}

var move_speed = 0;
function game_update()
{
    if (!game_state.begin)
        return;
    move_rotate();
    trigger_controller();
    if (game_state.fall_able) {
        player.position.y -= config_attribute.fall_speed;
        set_score();
    }
    if (game_state.touched) {
        touch_controller();
    }
}

//*********************************LOAD SCENE***********************************************//
function start_loader() {
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    container = document.createElement('div');
    document.body.appendChild(container);
    startScene(container);
}

function startScene(container) {

    width = 1080;
    height = 1920;
    aspect = width / height;

    scene = new THREE.Scene();
    //scene.background = new THREE.Color(1, 1, 1);

    // Load models
    var loader = new THREE.ObjectLoader();
    loader.load("../res/scene.json", function (object) {
        sceneObject = object;
        sceneObject.position.x = 0;
        sceneObject.position.y = 0;
        sceneObject.position.z = 0;
        scene.add(sceneObject);

        //var axes = new THREE.AxesHelper(700);
        //scene.add(axes);

        addLights();
        addCamera();
        render_update();
        initObjs();
        start_end();
    });

    function addLights() {
        // Lights
        var ambient = new THREE.AmbientLight(0x404040);
        scene.add(ambient);

        //var light1 = new THREE.PointLight(0xffffff);
        //light1.position.set(0, 2000, 750);
        //light1.intensity = 0.45;
        //scene.add(light1);

        //var light2 = new THREE.PointLight(0xFFFFFF);
        //light2.position.set(5, 100, -200);
        //light2.intensity = 0.4;
        //scene.add(light2);
    }

    function addCamera() {
        // Camera
        camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
        player.add(camera);
    }

    function initObjs() {
        plane = scene.getObjectByName("plane");
        env_objs = scene.getObjectByName("env_objs");

        player.name = "player";
        sceneObject.add(player);
        player_sphere = scene.getObjectByName("player_sphere");
        player.add(player_sphere);
    }

    function start_end() {
        on_load_scene_end();
    }

    renderer.setSize(width, height);
    container.append(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '10px';
    stats.domElement.style.top = '10px';
    container.append(stats.domElement);

    //$(window).on("resize", onWindowResize);
}

function render_update(time) {
    requestAnimationFrame(render_update);
    stats.update();
    TWEEN.update(time);
    if (!game_state.begin)
        return;
    game_update();
    renderer.render(scene, camera);
}

start_loader();

