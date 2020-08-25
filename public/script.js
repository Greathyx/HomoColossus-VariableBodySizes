let container = document.getElementById('container');
let navBar = document.getElementById("my-nav");
let titleLabel = document.getElementById("my-title");
let human_unknown_pic = document.getElementById("human_unknown_div");

let sideBar = document.getElementById("side_bar");
sideBar.style.height = window.innerHeight - navBar.clientHeight + 'px';

let mainDiv = document.getElementById("main");
mainDiv.style.height = window.innerHeight - navBar.clientHeight + 'px';

let scene = new THREE.Scene();

let renderWidth = container.clientWidth;
let renderHeight = window.innerHeight - navBar.clientHeight;

let camera = new THREE.PerspectiveCamera(75, renderWidth / renderHeight, 0.1, 1000);
camera.position.z = 200;
camera.position.y = 60;

let renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(renderWidth, renderHeight - titleLabel.clientHeight);
// document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;

// let keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
// keyLight.position.set(-100, 0, 100);
//
// let fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
// fillLight.position.set(100, 0, 100);
//
// let backLight = new THREE.DirectionalLight(0xffffff, 0.5);
// backLight.position.set(100, 0, -100).normalize();
//
// scene.add(keyLight);
// scene.add(fillLight);
// scene.add(backLight);

// Add lights
let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
// Add hemisphere light to scene
scene.add(hemiLight);

let d = 8.25;
let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 1500;
dirLight.shadow.camera.left = d * -1;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = d * -1;
// Add directional Light to scene
scene.add(dirLight);

// 加载提示
let manager = new THREE.LoadingManager();
manager.onProgress = function(item, loaded, total){
    console.log(item, loaded, total);
};

let onProgress = function(xhr){
    if(xhr.lengthComputable){
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

let onError = function(xhr){
    console.error(xhr);
};

// Animation
let animate = function () {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();
    if (mixers.length > 0) {
        for (var i = 0; i < mixers.length; i ++) {
            mixers[i].update(delta);
        }
    }
    controls.update();
    renderer.render(scene, camera);
};

let mixers = new Array();
let clock = new THREE.Clock();

function showResult() {
    container.appendChild(renderer.domElement);

    // let mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setTexturePath('/assets/');
    // mtlLoader.setPath('/assets/');
    // mtlLoader.load('r2-d2.mtl', function (materials) {
    //
    //     materials.preload();
    //
    //     let objLoader = new THREE.OBJLoader();
    //     objLoader.setMaterials(materials);
    //     objLoader.setPath('/assets/');
    //     objLoader.load('r2-d2.obj', function (object) {
    //
    //         scene.add(object);
    //         object.position.y -= 60;
    //
    //     });
    // });

    let fbxLoader = new THREE.FBXLoader(manager);
    fbxLoader.load('./assets/macarena_dance.fbx', function(object){

        object.mixer = new THREE.AnimationMixer(object);
        mixers.push(object.mixer);
        let action = object.mixer.clipAction(object.animations[0]);
        action.play();

        object.position.y -= 100;
        object.scale.multiplyScalar(1.2);
        scene.add(object);

    }, onProgress, onError);

    animate();
}

/**
 * submit the form
 */
function submit() {
    let select1 = document.getElementById("select1");
    console.log(select1.value);
    human_unknown_pic.style.display = 'none';
    showResult();
}

/**
 * reset form values
 */
function reset() {
    let selects = document.getElementsByClassName("form-control");
    for (let k = 0; k < selects.length; k++) {
        let selectors = '#select' + (k + 1) + ' option';
        let options = document.querySelectorAll(selectors);
        for (let i = 0, l = options.length; i < l; i++) {
            options[i].selected = options[i].defaultSelected;
        }
    }

    container.removeChild(renderer.domElement);

    if (human_unknown_pic.style.display === 'none') {
        human_unknown_pic.style.display = 'block';
        human_unknown_pic.setAttribute("display", 'flex');
        human_unknown_pic.setAttribute("align-items", 'center');
    }
}