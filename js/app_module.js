import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';

let USE_COMPOSER = true; // 是否使用composer

let scene, camera, renderer, composer, glitchPass;
const loader = new GLTFLoader();
function init(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(80, document.body.clientWidth / document.body.clientHeight, 0.1, 100);
    camera.position.set(1, 1, 3);
    
    renderer = new THREE.WebGLRenderer({
        antialias:true
    });
    renderer.setSize(document.body.clientWidth, document.body.clientHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    if(USE_COMPOSER) {
        composer = new EffectComposer( renderer );
        composer.addPass( new RenderPass( scene, camera ) );
    
        glitchPass = new GlitchPass();
        composer.addPass( glitchPass );

        const luminosityPass = new ShaderPass( LuminosityShader );
        composer.addPass( luminosityPass );
    
        const outputPass = new OutputPass();
        composer.addPass( outputPass );
    }
    
    // 旋转缩放控制器辅助
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // 增加坐标系辅助
    // const axisHelper = new THREE.AxisHelper(250);
    // scene.add(axisHelper);

    createWall();
    createFloor();
    createSofa();
    createTable();
    createChaji();
    // threeDkanfang();
    addLight();

    loadTVModel(); // 加载电视
    loadPenzaiModel(); // 加载盆栽
    loadChairModel(); // 加载椅子
    loadChuguiModel(); // 加载椅子
    loadBridgeModel(); // 加载冰箱
    loadDengModel();
    loop();
}

function loadTVModel(){
    loader.load(
        'models/tv.gltf',
        function ( gltf ) {
            const mesh = gltf.scene;

            mesh.translateX(-3.35).translateY(1.3).translateZ(-0.5).rotateY(Math.PI * 1.5)
            scene.add( mesh );

            for(let i=0;i<gltf.scene.children[0].children.length;i++){
                let child = gltf.scene.children[0].children[i];
                if(child.name === "tv-onBtn"){
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.color = new THREE.Color( 0xaaaaaa )
                }
                else if(child.name === "tv-border"){
                    child.material = new THREE.MeshPhongMaterial();
                    child.material.transparent=true;
                    child.material.opacity=.8;
                    child.material.color = new THREE.Color( 0x000000 )
                }
                else if(child.name === "tv-content"){
                    child.material = new THREE.MeshStandardMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/tv-content.jpg')
                    child.material.envMap = new THREE.TextureLoader().load('images/textures/skymap2.jpg');
                }
            }
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function loadPenzaiModel(){
    loader.load(
        'models/tree.gltf',
        function ( gltf ) {
            for(let i=0;i<gltf.scene.children[0].children.length;i++){
                let child = gltf.scene.children[0].children[i];
                if(child.name === "Arch41_026_obj_1"){
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/shugan.jpg')
                }
                else if(child.name === "Arch41_026_obj_2" || child.name === "Arch41_026_obj_3" || child.name === "Arch41_026_obj_4"){
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/shuye.jpg')
                }
                else if(child.name === "Arch41_026_obj_6"){
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/turang.jpg')
                } else if(child.name === "Arch41_026_obj_5"){
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/huapen.jpg')
                }
            }

            const mesh = gltf.scene;
            mesh.scale.set(0.03, 0.03, 0.03)
            let mesh2 = mesh.clone();
            mesh.translateX(-2.5).translateY(0.02).translateZ(-2.5);
            mesh2.translateX(2.5).translateY(0.02).translateZ(-2.5);
            scene.add( mesh , mesh2);

        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function loadChairModel(){
    loader.load(
        'models/chair.gltf',
        function ( gltf ) {
            for(let i=0;i<gltf.scene.children[0].children.length;i++){
                let child = gltf.scene.children[0].children[i];
                child.material = new THREE.MeshLambertMaterial();
                child.material.map = new THREE.TextureLoader().load('images/textures/chair.jpg')
                child.material.side =  THREE.DoubleSide
            }

            const mesh = gltf.scene;
            // mesh.scale.set(0.1, 0.03, 0.03)
            let mesh2 = mesh.clone();
            mesh.translateX(-2).translateY(0.02).translateZ(-3).scale.set(1.4,1.4,1.4);
            mesh2.translateX(2).translateY(0.02).translateZ(-2).rotateY(Math.PI).scale.set(1.4,1.4,1.4);
            scene.add( mesh, mesh2 );
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function loadBridgeModel(){
    loader.load(
        'models/bridge.gltf',
        function ( gltf ) {
            for(let i=0;i<gltf.scene.children[0].children.length;i++) {
                let child = gltf.scene.children[0].children[i];
                if (child.name === "xiangti1" || child.name === "xiangti2") {
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/bridge1.jpg')
                    child.material.side = THREE.DoubleSide
                } else if (child.name === "door_left" || child.name === "door_right") {
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/bridge4.jpg')
                    child.material.side = THREE.DoubleSide
                } else if (child.name === "bashou-left" || child.name === "bashou-right") {
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/bridge2.jpg')
                    child.material.side = THREE.DoubleSide
                } else if (child.name === "pane") {
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/bridge3.jpg')
                    child.material.side = THREE.DoubleSide
                } else {
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.color = new THREE.Color(0x333333)
                }
            }
            const mesh = gltf.scene;
            mesh.translateX(3.35).translateY(0.06).translateZ(1.6).rotateY(Math.PI * 1.5);
            scene.add( mesh, );
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function loadChuguiModel(){
    loader.load(
        'models/chugui.gltf',
        function ( gltf ) {
            for(let i=0;i<gltf.scene.children[0].children.length;i++){
                let child = gltf.scene.children[0].children[i];
                if(child.name === "chugui-wai"){
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/chugui1.jpg')
                    child.material.side =  THREE.DoubleSide
                } else if(child.name === "chugui-wai"){
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/chugui1.jpg')
                    child.material.side =  THREE.DoubleSide
                } else {
                    child.material = new THREE.MeshLambertMaterial();
                    child.material.map = new THREE.TextureLoader().load('images/textures/chugui3.jpg')
                    child.material.side =  THREE.DoubleSide
                }

            }

            const mesh = gltf.scene;
            // mesh.position.set(new THREE.Vector3(0,0,0))
            mesh.translateX(-3.48).translateY(0.02).translateZ(3.3).rotateY(Math.PI * 0.5)
            scene.add( mesh );
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function loadTeapotModel(){
    loader.load(
        'models/teapot.gltf',
        function ( gltf ) {
            for(let i=0;i<gltf.scene.children[0].children.length;i++){
                let child = gltf.scene.children[0].children[i];
                child.material = new THREE.MeshLambertMaterial();
                child.material.map = new THREE.TextureLoader().load('images/textures/chugui1.jpg')
                child.material.side =  THREE.DoubleSide
            }

            const mesh = gltf.scene;
            mesh.scale.set(0.1,0.1,0.1)
            // mesh.position.set(new THREE.Vector3(0,0,0))
            mesh.translateY(1.05).translateZ(-2.5)
            scene.add( mesh );
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function loadDengModel(){
    loader.load(
        'models/deng.gltf',
        function ( gltf ) {
            for(let i=0;i<gltf.scene.children[0].children.length;i++){
                let child = gltf.scene.children[0].children[i];
                if(child.name.indexOf('a') > -1){
                    child.material=new THREE.MeshPhongMaterial();
                    child.material.color = new THREE.Color( 0xffffff );
                    child.material.transparent=true;
                    child.material.opacity=.6;
                } else {
                    child.material=new THREE.MeshPhongMaterial();
                    child.material.color = new THREE.Color( 0xaaaaaa );
                    child.material.transparent=true;
                    child.material.opacity=.4;
                }
            }

            const mesh = gltf.scene;
            mesh.position.set(-0.1,3.15,0)
            // mesh.position.set(new THREE.Vector3(0,0,0))
            // mesh.translateY(1.05).translateZ(-2.5)
            scene.add( mesh );
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function createSofa(){
    let group = new THREE.Group();
    const texture = new THREE.TextureLoader().load('images/textures/sofa.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
    texture.repeat.set(10, 10);
    let material = new THREE.MeshLambertMaterial({
        map: texture,
        side: THREE.DoubleSide
    });

    let shape = new THREE.Shape();
    shape.moveTo( 0.05,0 );
    shape.bezierCurveTo(0.05,0,0,0.05,0.05,0.1);
    shape.lineTo( 0.75, 0.15 );
    shape.lineTo( 0.85, 0.15 );
    shape.lineTo( 0.85, 0 );
    shape.lineTo( 0.05, 0 );

    let extrudeSettings = {
        curveSegments: 30,
        steps:20,
        amount:2,
        bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const mesh = new THREE.Mesh( geometry, material ) ;
    mesh.rotateY(Math.PI * 1.5).rotateZ(Math.PI * 1.5).translateX(-.85).translateZ(-2);

    let shape_side = [1,2].map(()=>{
        let shape2 = new THREE.Shape();
        shape2.moveTo( 0,0 );
        shape2.lineTo( 0, 0.5 );
        shape2.lineTo( 0.85, 0.5 );
        shape2.bezierCurveTo(0.85,0.5,0.9,0.5,0.9,0.45);
        shape2.lineTo( 0.9, 0 );
        shape2.lineTo( 0, 0 );

        let extrudeSettings2 = {
            curveSegments: 30,
            steps:20,
            amount:0.15,
            bevelEnabled: false,
        };

        const geometry2 = new THREE.ExtrudeGeometry( shape2, extrudeSettings2 );
        const mesh2 = new THREE.Mesh( geometry2, material ) ;
        return mesh2
    })

    shape_side[0].rotateY(Math.PI * 1.5).translateZ(-0.15);
    shape_side[1].rotateY(Math.PI * 1.5).translateZ(-2);

    let shape3 = new THREE.Shape();
    shape3.moveTo( 0,0 );
    shape3.lineTo( 0, 0.3 );
    shape3.lineTo( 0.85, 0.3 );
    shape3.bezierCurveTo(0.85,0.3,0.9,0.2,0.9,0.25);
    shape3.lineTo( 0.9, 0 );
    shape3.lineTo( 0, 0 );

    const texture2 = new THREE.TextureLoader().load('images/textures/sofa2.jpg');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
    texture2.repeat.set(10, 10);
    let material2 = new THREE.MeshLambertMaterial({
        map: texture2,
        side: THREE.DoubleSide
    });

    const geometry2 = new THREE.ExtrudeGeometry( shape3, {
        curveSegments: 30,
        steps:20,
        amount:1.7,
        bevelEnabled: false,
    } );
    const mesh3 = new THREE.Mesh( geometry2, material2 ) ;
    mesh3.rotateY(Math.PI * 1.5).translateZ(-1.85).translateY(0.0)

    group.add(mesh,mesh3,  ...shape_side);

    group.position.set(3.48,0.02, -1.5)
    group.rotateY(Math.PI * 1.5)
    scene.add(group);

    material.dispose();
    geometry.dispose();
    material2.dispose();
    geometry2.dispose();
}

function createWall(){
    const texture = new THREE.TextureLoader().load('images/textures/wall.jpg');
// uv两个方向纹理重复数量

    let material = new THREE.MeshLambertMaterial({
        map: texture,//设置颜色贴图属性值
        side: THREE.DoubleSide
    }); //材质对象Material
    const geometry = new THREE.PlaneGeometry(7, 3.67);
    const wall = new THREE.Mesh( geometry, material );
    wall.position.set(0, 1.8, -3.5)
    scene.add( wall );

    const texture2 = new THREE.TextureLoader().load('images/textures/wall2.jpg');
    let material2 = new THREE.MeshLambertMaterial({
        map: texture2,//设置颜色贴图属性值
        side: THREE.DoubleSide
    });
    const geometry2 = new THREE.PlaneGeometry(7, 3.67);
    const wall2 = new THREE.Mesh( geometry2, material2 );
    wall2.position.set(-3.5, 1.8, 0)
    wall2.rotateY(Math.PI * 0.5)
    scene.add( wall2 );

    let material3 = new THREE.MeshLambertMaterial({
        map: texture2,//设置颜色贴图属性值
        side: THREE.DoubleSide
    });
    const geometry3 = new THREE.PlaneGeometry(7, 3.67);
    const wall3 = new THREE.Mesh( geometry3, material3 );
    wall3.position.set(3.5, 1.8, 0)
    wall3.rotateY(Math.PI * 0.5)
    scene.add( wall3 );

    material.dispose();
    geometry.dispose();
    material2.dispose();
    geometry2.dispose();
}

function createFloor(){
    const texture = new THREE.TextureLoader().load('images/textures/floor.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
    texture.repeat.set(10, 10);

    let floor_material = new THREE.MeshLambertMaterial({
        map: texture,//设置颜色贴图属性值
        side: THREE.DoubleSide,
    }); //材质对象Material
    const floor_geometry = new THREE.PlaneGeometry(7, 7,7, 10);
    const plane = new THREE.Mesh( floor_geometry, floor_material );
    plane.rotateX(-Math.PI * 0.5)
    scene.add( plane );

    const texture2 = new THREE.TextureLoader().load('images/textures/wall.jpg');
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量
    texture2.repeat.set(10, 10);

    let ceil_material = new THREE.MeshLambertMaterial({
        map: texture2,//设置颜色贴图属性值
        side: THREE.DoubleSide,
    }); //材质对象Material
    const ceil_geometry = new THREE.PlaneGeometry(7, 7,7, 10);
    const ceil = new THREE.Mesh( ceil_geometry, ceil_material );
    ceil.rotateX(-Math.PI * 0.5);
    ceil.translateZ(3.6)
    scene.add( ceil );

    floor_geometry.dispose();
    floor_material.dispose();
    ceil_geometry.dispose();
    ceil_material.dispose();
}

function threeDkanfang(){
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load('images/textures/skymap2.jpg', function(texture) {
        let material = new THREE.MeshLambertMaterial({
            // color: 0x0000ff,
            // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
            map: texture,//设置颜色贴图属性值
        }); //材质对象Material
        let geometry = new THREE.SphereGeometry( 5, 32, 32 );
        geometry.scale(-1, 1, 1);
        let sphere = new THREE.Mesh( geometry, material );

        // group.add(sphere)
        scene.add( sphere );
    })
}

function createTable(){
    let group = new THREE.Group();
    let leg = new THREE.CylinderGeometry(0.05,0.06, 1, 100);
    let mesh;

    let textureLoader = new THREE.TextureLoader();
    [[-0.75,0.4, 1, -0.1], [0.75, -0.4, 1, 0.1], [0.75, 0.4, -1, 0.1], [-0.75, -0.4, -1, -0.1]].map(item => {
        const [a,b,c,d] = item;
        textureLoader.load('images/textures/wood1.jpg', function(texture) {
            let material = new THREE.MeshLambertMaterial({
                map: texture,
            });
            mesh = new THREE.Mesh(leg, material); //网格模型对象Mesh
            mesh.translateX(a).translateZ(b).rotateY(c).rotateZ(d)
            group.add(mesh)
        })
    })

    textureLoader.load('images/textures/wood.jpg', function(texture) {
        let material = new THREE.MeshLambertMaterial({
            // color: 0x0000ff,
            map: texture,
        });

        let shape = new THREE.Shape();
        shape.moveTo( 0.05,0 );
        shape.bezierCurveTo(0.05,0,0,0,0,0.05);
        shape.lineTo( 0, 0.95 );
        shape.bezierCurveTo(0,0.95, 0,1,0.05,1,);
        shape.lineTo( 1.75, 1 );
        shape.bezierCurveTo(1.75,1,1.8,1,1.8,0.95,);
        shape.lineTo( 1.8, 0.05 );
        shape.bezierCurveTo(1.8,0.05,1.8,0,1.75,0, );
        shape.lineTo( 0.05, 0 );

        let extrudeSettings = {
            steps: 2,
            amount: 0.1,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSegments: 1
        };

        const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        const mesh = new THREE.Mesh( geometry, material ) ;
        mesh.rotateX(Math.PI * 0.5).translateX(-0.9).translateY(-0.5).translateZ(-0.55)
        group.add(mesh)
    })

    group.position.set(0, 0.5,-2.5)
    scene.add(group)

    loadTeapotModel();
}

function createChaji(){
    let group = new THREE.Group();
    let leg = new THREE.CylinderGeometry(0.02,0.03, 0.4, 100);
    let mesh;
    let textureLoader = new THREE.TextureLoader();
    [[-0.35,0.2, 1, -0.1], [0.35, -0.2, 1, 0.1], [0.35, 0.2, -1, 0.1], [-0.35, -0.2, -1, -0.1]].map(item => {
        const [a,b,c,d] = item;
        textureLoader.load('images/textures/wood1.jpg', function(texture) {
            let material = new THREE.MeshLambertMaterial({
                map: texture,
            });
            mesh = new THREE.Mesh(leg, material); //网格模型对象Mesh
            mesh.translateX(a).translateZ(b).rotateY(c).rotateZ(d)
            group.add(mesh)
        })
    })

    let shape = new THREE.Shape();
    shape.moveTo( 0.1,0 );
    shape.bezierCurveTo(0.1,0,-0.2,0.3,0.1, 0.6);
    shape.lineTo( 0.9, 0.6 );
    shape.bezierCurveTo(0.9,0.6, 1.2,0.3,0.9,0);
    shape.lineTo( 0.1, 0 );

    const geometry = new THREE.ExtrudeGeometry( shape, {
        steps: 2,
        amount: 0.015,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSegments: 1
    } );

    const material=new THREE.MeshPhongMaterial();
    material.color = new THREE.Color( 0x000000 );
    material.transparent=true;
    material.opacity=.3;
    const mesh2 = new THREE.Mesh( geometry, material );
    mesh2.translateX(-0.5).translateY(0.21).translateZ(-0.3).rotateX(Math.PI*0.5);
    group.add(mesh2);
    group.rotateY(Math.PI*0.5).position.set(1.8, 0.22, -0.5);

    scene.add(group);
    material.dispose();
    geometry.dispose();
}

function addLight(){
    var ambientLight = new THREE.AmbientLight( 0xd5d5d5 );
    ambientLight.intensity = 0.4;
    scene.add( ambientLight );

    var bottomRightDirLight = new THREE.DirectionalLight();
    bottomRightDirLight.position.x=5;
    bottomRightDirLight.position.y=3;
    bottomRightDirLight.position.z=-5;
    bottomRightDirLight.intensity=.8;
    bottomRightDirLight.castShadow=true;

    // var helper=new THREE.DirectionalLightHelper(bottomRightDirLight,1);
    // scene.add( helper );
    scene.add( bottomRightDirLight );

    var frontDirLight = new THREE.DirectionalLight(0xffffff);

    frontDirLight.position.x=-5;
    frontDirLight.position.y=3;
    frontDirLight.position.z=5;
    frontDirLight.intensity=.8;
    frontDirLight.castShadow=true;

    // var helper=new THREE.DirectionalLightHelper(frontDirLight,1);
    // scene.add( helper );
    scene.add( frontDirLight );

    var topDirLight = new THREE.DirectionalLight(0xffffff);

    topDirLight.position.x=0;
    topDirLight.position.y=-1;
    topDirLight.position.z=0;
    topDirLight.intensity=.5;
    topDirLight.castShadow=true;

    // var helper2=new THREE.DirectionalLightHelper(topDirLight,1);
    // scene.add( helper2 );
    scene.add( topDirLight );

}

function loop() {
    requestAnimationFrame(loop);
    if(USE_COMPOSER) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
    controls.update();
}

window.onload = init;