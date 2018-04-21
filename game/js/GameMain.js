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
    new WHS.OrbitControlsModule(),
    new WHS.ResizeModule()
]);

new WHS.Plane({
    geometry: {
        width: 100,
        height:100
    },
    material: new THREE.MeshPhongMaterial({ color: 0x447F8B }),
    rotation: {x:-Math.PI/2}
}).addTo(app);

new WHS.PointLight({
    light: {
        intensity: 0.5,
        distance:100
    },
    shadow: {
        fov:90
    },
    position:new THREE.Vector3(0,10,10)
}).addTo(app);

new WHS.AmbientLight({
    light: {
        intensity: 0.4
    }
}).addTo(app);

const player = new WHS.Sphere({
    geometry: {
        radius: 5,
        widthSegments: 32,
        heightSegments: 32
    },
    material: new THREE.MeshPhongMaterial({
        color: 0xF2F2F2
    }),
    position: new THREE.Vector3(0, 15, 0)
});
//player.addTo(app);

const box = new WHS.Box({ // Create sphere comonent.
    geometry: [9, 9, 9],
    position:new THREE.Vector3(0,5,0),
    material: new THREE.MeshPhongMaterial({
        color: 0xF2F2F2
    })
});
//box.addTo(app);

const group = new WHS.Group();
group.add(player);
group.add(box);
group.addTo(app);

new WHS.Loop(() => {
    box.rotation.y += 0.02;
    //box.rotation.y += 0.02;
}).start(app);

app.start();