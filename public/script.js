HC_model = {
    normal: {
        name: 'Ella',
        src: './assets/normal.fbx',
        description: 'Good! Your energy consumption is on average, thus your Homo Colossus ' +
            'is in a standard shape. Keep on!'
    },
    big_head: {
        name: 'Lucas',
        src: './assets/big_head.fbx',
        description: 'Oops! You do not lay emphasis on sustainable development, thus your' +
            ' Homo Colossus\'s head size is above average size.'
    },
    slim_young: {
        name: 'Oscar',
        src: './assets/slim_young.fbx',
        description: 'Great! Your energy consumption is below average, thus your Homo Colossus ' +
            'is young and slim. Thank you for your contribution!'
    },
    big_arms: {
        name: 'John',
        src: './assets/big_arms.fbx',
        description: 'Oops! Your hands seem to consume too much energy, thus your Homo Colossus\'s' +
            'have big arms. Try to reuse more!'
    },
    big_belly: {
        name: 'Olivia',
        src: './assets/big_belly.fbx',
        description: 'Oops! You eat a little bit too much meat, thus your Homo Colossus\'s belly ' +
            'is above average size.'
    },
    long_legs: {
        name: 'Alma',
        src: './assets/long_legs.fbx',
        description: 'Oops! You seem to have too much transport consumption, thus your Homo ' +
            'Colossus\'s legs are big. Try more public transport!'
    },
};


let container = document.getElementById('container');
let navBar = document.getElementById("my-nav");
let titleLabel = document.getElementById("my-title");
let human_unknown_pic = document.getElementById("human_unknown_div");
let HC_name_span = document.getElementById("HC_name");
let contentLabel = document.getElementById("my-content");

let sideBar = document.getElementById("side_bar");
sideBar.style.height = window.innerHeight - navBar.clientHeight + 'px';

let mainDiv = document.getElementById("main");
mainDiv.style.height = window.innerHeight - navBar.clientHeight + 'px';

let scene = new THREE.Scene();

let renderWidth = container.clientWidth;
let renderHeight = window.innerHeight - navBar.clientHeight - contentLabel.clientHeight;

let camera = new THREE.PerspectiveCamera(75, renderWidth / renderHeight, 0.1, 1000);
camera.position.z = 200;
camera.position.y = 50;

let renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(renderWidth, renderHeight - titleLabel.clientHeight);

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
manager.onProgress = function (item, loaded, total) {
    console.log(item, loaded, total);
};

let onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};

let onError = function (xhr) {
    console.error(xhr);
};

// Animation
let animate = function () {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();
    if (mixers.length > 0) {
        for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(delta);
        }
    }
    controls.update();
    renderer.render(scene, camera);
};

let mixers = new Array();
let clock = new THREE.Clock();

function showModel(hc_model) {
    container.appendChild(renderer.domElement);
    HC_name_span.innerHTML = "Kitty";

    // let mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setTexturePath('/assets/unused');
    // mtlLoader.setPath('/assets/unused');
    // mtlLoader.load('r2-d2.mtl', function (materials) {
    //
    //     materials.preload();
    //
    //     let objLoader = new THREE.OBJLoader();
    //     objLoader.setMaterials(materials);
    //     objLoader.setPath('/assets/unused');
    //     objLoader.load('r2-d2.obj', function (object) {
    //
    //         scene.add(object);
    //         object.position.y -= 60;
    //
    //     });
    // });

    let fbxLoader = new THREE.FBXLoader(manager);
    fbxLoader.load(hc_model.src, function (object) {

        object.mixer = new THREE.AnimationMixer(object);
        mixers.push(object.mixer);
        let action = object.mixer.clipAction(object.animations[0]);
        action.play();

        object.position.y -= 60;
        // object.scale.multiplyScalar(0.8);
        scene.add(object);

    }, onProgress, onError);

    contentLabel.innerHTML = hc_model.description;
    HC_name_span.innerHTML = hc_model.name;

    animate();
}

/**
 * Submit button listener:
 *
 * submit the form
 *
 */
function submit() {
    // let selects = document.getElementsByClassName("form-control");
    // for (let i = 0; i < selects.length; i++) {
    //     if (selects[i].value === "none") {
    //         alert("Please select the answer for Question " + (i + 1) + "!");
    //         return
    //     }
    // }

    let select1 = document.getElementById("select1");
    let select2 = document.getElementById("select2");
    let select3 = document.getElementById("select3");
    let select4 = document.getElementById("select4");
    let select5 = document.getElementById("select5");
    let select6 = document.getElementById("select6");
    let select7 = document.getElementById("select7");
    let select8 = document.getElementById("select8");

    let points = {
        head: 0,
        arms: 0,
        belly: 0,
        legs: 0,
    };

    let calculate = function(select, bodyPart) {
        if (bodyPart === "head")
            points.head += select;
        else if (bodyPart === "arms")
            points.arms += select;
        else if (bodyPart === "belly")
            points.belly += select;
        else points.legs += select;
    };

    calculate(parseInt(select1.value), "head");
    calculate(parseInt(select2.value), "arms");
    calculate(parseInt(select3.value), "arms");
    calculate(parseInt(select4.value), "arms");
    calculate(parseInt(select5.value), "arms");
    calculate(parseInt(select6.value), "belly");
    calculate(parseInt(select7.value), "legs");
    calculate(parseInt(select8.value), "legs");

    human_unknown_pic.style.display = 'none';

    chooseModel(points);
}

/**
 * Logic for showing which pre-defined model
 *
 * @param points the points of the submitted answers
 */
function chooseModel(points) {
    let total_points = points.head + points.arms + points.legs + points.belly;

    if (points.head === 3) {
        showModel(HC_model.big_head);
    }
    else if (points.arms >= 8) {
        showModel(HC_model.big_arms);
    }
    else if (points.belly >= 2) {
        showModel(HC_model.big_belly);
    }
    else if (points.legs >= 4) {
        showModel(HC_model.long_legs);
    }
    else if (total_points <= 10) {
        showModel(HC_model.slim_young);
    }
    else {
        showModel(HC_model.normal);
    }
}

/**
 * Reset button listener:
 *
 * reset form values
 *
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

    HC_name_span.innerHTML = "";
    contentLabel.innerHTML = "";

}