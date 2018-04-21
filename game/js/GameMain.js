var width, height;
var viewAngle = 50,
	near = 0.1,
	far = 10000;
var aspect;

var renderer, camera, scene, stats;
var sceneObject, intersected;

$(function () {

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var container = $("#container3d");
    startScene(container);
});

function startScene(container) {

    width = window.innerWidth;
    height = window.innerHeight;
    aspect = width / height;

    scene = new THREE.Scene();

    // Load models
    var loader = new THREE.ObjectLoader();

    loader.load("../res/scene.json", function (object) {
        log(object);
        sceneObject = object;
        sceneObject.scale.set(13, 13, 13);
        sceneObject.position.set(0, 0, 0);
        scene.add(sceneObject);

        var axes = new THREE.AxesHelper(700);
        scene.add(axes);

        addLights();
        addCamera();
        update();
    });

    function addLights() {
        // Lights
        var ambient = new THREE.AmbientLight(0x404040);
        scene.add(ambient);

        var light1 = new THREE.PointLight(0xffffff);
        light1.position.set(0, 2000, 750);
        light1.intensity = 0.45;
        scene.add(light1);

        var light2 = new THREE.PointLight(0xFFFFFF);
        light2.position.set(5, 100, -200);
        light2.intensity = 0.4;
        scene.add(light2);
    }

    function addCamera() {
        // Camera
        camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
        //camera.position = new THREE.Vector3(177, 352, 287);
        //camera.rotation = new THREE.Vector3(-50, 32, 24);
        camera.position.x = 0;
        camera.position.y = 5000;
        camera.position.z = 0;
        camera.rotation.x = -90;
        log(camera);
    }

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.append(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '10px';
    stats.domElement.style.top = '10px';
    $('body').append(stats.domElement);

    $(window).on("resize", onWindowResize);
}

function update() {
    requestAnimationFrame(update);
    stats.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
