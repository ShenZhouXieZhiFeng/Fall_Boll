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
var planes = new THREE.Group();//平板组
var plane = new THREE.Object3D();//单个平板引用
var env_objs = new THREE.Object3D();//环境物品

var init_attribute =
{
    camera_position_x: 0.178,
    camera_position_y: 12.589,
    camera_position_z: 13.704,

    camera_rotation_x: -0.743,
    camera_rotation_y: 0,
    camera_rotation_z: 0,
    
    player_height:10,
}

$(function ()
{
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    container = document.createElement('div');
    document.body.appendChild(container);
    startScene(container);
});

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

    function initObjs()
    {
        plane = scene.getObjectByName("plane");
        env_objs = scene.getObjectByName("env_objs");

        player.name = "player";
        sceneObject.add(player);
        var player_sphere = scene.getObjectByName("player_sphere");
        player.add(player_sphere);

        //var controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls.maxPolarAngle = Math.PI * 0.5;
        //controls.minDistance = 1;
        //controls.maxDistance = 500;
    }

    function start_end()
    {
        $(on_load_scene_end);
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

function render_update() {
    requestAnimationFrame(render_update);
    stats.update();
    $(game_update());
    renderer.render(scene, camera);
}

//*********************************GAME LOGIC***********************************************//
function on_load_scene_end() {
    $(create_scene);
    $(register);
    $(set_item_init);
    log(scene);
    log(camera);
    log(player);
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
        n_plane.position.set(initX, initY - 10*i, initZ - 10*i);
        planes.add(n_plane);
    }
    sceneObject.add(planes);
}

//设置物体初始属性
function set_item_init()
{
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
    forward_speed: 0.1,//前进的速度
    cur_add_speed: 0,//当前加速度
    fall_speed: 1,   //掉落的速度
    drag_speed: 0.5  //拖动的参考速度
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
            $(game_begin);
            break;
        case button_type.game_end:
            $(game_end);
            break;
        default: break;
    }
}
function game_begin()
{
    game_state.begin = true;
}
function game_end()
{
    game_state.begin = false;
    $(set_item_init);
}

//trigger碰撞
var direction = new THREE.Vector3();
direction.x = 0;
direction.y = -1;
direction.z = 0;
direction.normalize();
var raycaster = new THREE.Raycaster();
function trigger_controller()
{
    raycaster.set(player.position, direction);
    var intersections = raycaster.intersectObjects(planes.children);
    if (intersections.length > 0) {
        var intersection = intersections[0];
        if (intersection.distance < 1) {
            if (intersection.object.name.indexOf("plane") >= 0) {
                game_state.fall_able = false;
            }
        }
        else {
            game_state.fall_able = true;
        }
    }
    else {
        game_state.fall_able = true;
    }
}

var move_speed = 0;
function game_update()
{
    if (!game_state.begin)
        return;
    move_speed = player_attribute.forward_speed + player_attribute.cur_add_speed;
    player.position.z -= move_speed;
    trigger_controller();
    if (game_state.fall_able) {
        player.position.y -= player_attribute.fall_speed;
    }
    if (game_state.touched) {
        touch_controller();
    }
}

