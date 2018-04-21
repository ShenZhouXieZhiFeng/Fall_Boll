const app = new WHS.App([
    new WHS.ElementModule({
        container:document.getElementById("app")
    }),
    new WHS.SceneModule(),
    new WHS.DefineModule('camera', new WHS.PerspectiveCamera({
        position: new THREE.Vector3(0, 10, 50)
    })),
    new WHS.RenderingModule({
        bgColor: 0xEEAD0E,
        renderer: {
            antialias: true,
            shadowmap: {
                type:THREE.PCFSoftShadowMap
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

new WHS.AmbientLight({
    light: {
        intensity: 0.4
    }
}).addTo(env_lights);
log(env_lights);

//create environment
const env_objs = new WHS.Group();
env_objs.addTo(app);
new WHS.Plane({
    geometry: {
        width: 100,
        height:100
    },
    material: new THREE.MeshPhongMaterial({ color: 0x447F8B }),
    rotation: {x:-Math.PI/2}
}).addTo(env_objs);

const box = new WHS.Box({ 
    geometry: [9, 9, 9],
    position:new THREE.Vector3(0,5,0),
    material: new THREE.MeshPhongMaterial({
        color: 0xF2F2F2
    })
});
box.addTo(env_objs);
log(env_objs);

//create player
const player = new WHS.Group();
player.addTo(app);
new WHS.Sphere({
    geometry: {
        radius: 5,
        widthSegments: 32,
        heightSegments: 32
    },
    material: new THREE.MeshPhongMaterial({
        color: 0xF2F2F2
    }),
    position: new THREE.Vector3(0, 0, 0)
}).addTo(player);
log(player);

let player_controller = function () {

};


//game loop
//new WHS.Loop(() => {
//    env_objs.rotation.y += 0.05;
//    player_controller();
//}).start(app);

//begin
app.start();

