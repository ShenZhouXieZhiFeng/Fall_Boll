var main = ()=>{
    const app = new WHS.App([
        new WHS.ElementModule({
            container: document.getElementById("app")
        }),
        new WHS.SceneModule(),
        new WHS.DefineModule('camera', new WHS.PerspectiveCamera()),
        new WHS.RenderingModule({
            bgColor: 0x1E1E1E,
            renderer: {
                antialias: true,
                shadowmap: {
                    type: THREE.PCFSoftShadowMap
                }
            }
        }), { shadow: true },
        //new WHS.OrbitControlsModule(),
        new WHS.ResizeModule()
    ]);

    //create env_lights
    const env_lights = new WHS.Group();
    env_lights.addTo(app);
    new WHS.PointLight({
        light: {
            intensity: 0.5,
            distance: 100
        },
        shadow: {
            fov: 90
        },
        position: new THREE.Vector3(0, 10, 10)
    }).addTo(env_lights);

    //new WHS.AmbientLight({
    //    light: {
    //        intensity: 0.4
    //    }
    //}).addTo(env_lights);
    //log(env_lights);

    //create environment
    const env_objs = new WHS.Group();
    env_objs.addTo(app);
    //new WHS.Plane({
    //    geometry: {
    //        width: 100,
    //        height: 100
    //    },
    //    material: new THREE.MeshPhongMaterial({ color: 0x447F8B }),
    //    rotation: { x: -Math.PI / 2 }
    //}).addTo(env_objs);

    const box = new WHS.Box({
        geometry: [9, 9, 9],
        position: new THREE.Vector3(0, 10, 0),
        material: new THREE.MeshPhongMaterial({
            color: 0xF2F2F2
        })
    });
    box.addTo(env_objs);
    log(env_objs);

    //create player
    const player = new WHS.Group();
    var player_attribute = {
        speed: 1
    };
    const camera = app.manager.get("camera");
    player.addTo(app);
    player.add(camera);
    camera.quaternion.set(-0.15, 0, 0, 1);
    camera.position.set(0, 15, 40);
    new WHS.Sphere({
        geometry: {
            radius: 5,
            widthSegments: 32,
            heightSegments: 32
        },
        material: new THREE.MeshPhongMaterial({
            color: 0x3988D6
        }),
        position: new THREE.Vector3(0, 0, 0)
    }).addTo(player);
    log(player);

    //touch controller
    var prevTouchX = 0;

    let on_touch_start = function (event)
    {
    };

    let on_touch_end = function (event)
    {
        prevTouchX = 0;
    };

    let on_touch_move = function (event)
    {
        let touchs = event.touches;
        if (touchs.length == 0)
            return;
        let touch0 = touchs[0];
        let curX = touch0.clientX;
        if (curX == prevTouchX)
            return;
        if (prevTouchX != 0)
        {
            let moveX = (curX - prevTouchX) / 10 * player_attribute.speed;
            //log(moveX);
            player.position.x += moveX;
        }
        prevTouchX = curX;
    };

    function register()
    {
        document.addEventListener("touchstart",on_touch_start);
        document.addEventListener("touchmove", on_touch_move);
        document.addEventListener("touchend", on_touch_end);
    };
    register.call();

    //game loop
    const loop = new WHS.Loop(() =>
    {
        
    });
    app.addLoop(loop);
    loop.start();

    //begin
    app.start();
};
main.call();

