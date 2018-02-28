var SEPARATION = 100;
var AMOUNTX = 50;
var AMOUNTY = 50;

var container, stats;
var cam, scene, renderer, particle, camera;
var mouseX = 0,
    mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var enable;
var isClicked;

function initial() {

    container = document.createElement('div');
    document.body.appendChild(container);

    cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    cam.position.z = 1000;

    scene = new THREE.Scene();

    var material = new THREE.SpriteMaterial();

    for (var ix = 0; ix < AMOUNTX; ix++) {

        for (var iy = 0; iy < AMOUNTY; iy++) {

            particle = new THREE.Sprite(material);
            particle.scale.y = 20;
            particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scene.add(particle);

        }

    }
    var geometry = new THREE.PlaneGeometry(300, 300, 1);
    geometry.rotateY(0);
    var fftSize = 128;
    var audioLoader = new THREE.AudioLoader();

    var listener = new THREE.AudioListener();

    var audio = new THREE.Audio(listener);

    audioLoader.load('audio.ogg', function (buffer) {

        audio.setBuffer(buffer);
        audio.setLoop(true);
        audio.play();

    });

    analyser = new THREE.AudioAnalyser(audio, fftSize);


    uniforms = {
        tAudioData: {
            value: new THREE.DataTexture(analyser.data, fftSize / 2, 1, THREE.LuminanceFormat)
        }

    };

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragment_shader1').textContent

    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 300;
    scene.add(mesh);


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    //

    window.addEventListener('resize', onWindowResize, false);



    //
    animate();

    function animate() {

        requestAnimationFrame(animate);

        render();
        stats.update();

    }

    function render() {
        // move speed
        cam.position.x += (mouseX - cam.position.x) * .05;
        cam.position.y += (-mouseY - cam.position.y) * .05;
        cam.lookAt(scene.position);
        analyser.getFrequencyData();
        uniforms.tAudioData.value.needsUpdate = true;
        renderer.render(scene, cam);

    }
}



//*****************************************************


function init() {
    initial();
    var canvas = document.getElementById('mainCanvas');
    var video;

    var loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
    var video2 = document.getElementById('video2');
    video2.src = "sintel.ogv";
    video2.load(); // must call after setting/changing source
    video2.play();

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });

    renderer.setClearColor(0x000000);
    var tmpScene = new THREE.Scene();
    var tmpScene2 = new THREE.Scene();


    //setting the audio
    //  var myAudio1 = document.getElementById("audio1");
    //  myAudio1.volumn = 0.3;
    // myAudio1.play();
    //**********************************************


    //********************************************************
    // camera
    // canvas size is 400x300
    var camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
    camera.position.set(0, 0, 5);
    tmpScene.add(camera);

    var camera2 = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
    camera2.position.set(0, 0, 5);
    tmpScene2.add(camera2);

    // video texture
    var videoImage = document.createElement('canvas');
    videoImage.width = 300;
    videoImage.height = 300;
    initWebcam();


    var videoImageContext = videoImage.getContext('2d');
    // background color if no video present
    videoImageContext.fillStyle = '#ff0000';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    var hue = new THREE.ShaderPass(THREE.HueSaturationShader);

    var videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        overdraw: true
    });
    // var videoGeometry = new THREE.PlaneGeometry(5,5);
    // var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
    // videoMesh.position.set(1, 1, -1);
    // tmpScene.add(videoMesh);

    var videoGeometry = new THREE.PlaneGeometry(300, 300, 1);
    var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
    videoMesh.position.x = -300;
    //var plane = new THREE.Mesh( videoGeometry, videoMesh );
    scene.add(videoMesh);


    var videoImage2 = document.createElement('canvas');
    videoImage2.width = 300;
    videoImage2.height = 300;


    var videoImageContext2 = videoImage2.getContext('2d');
    // background color if no video present
    videoImageContext2.fillStyle = '#fa02';
    videoImageContext2.fillRect(0, 0, videoImage.width, videoImage.height);

    videoTexture2 = new THREE.Texture(videoImage2);
    videoTexture2.minFilter = THREE.LinearFilter;
    videoTexture2.imagFilter = THREE.LinearFilter;

    var videoMaterial2 = new THREE.MeshBasicMaterial({
        map: videoTexture2,
        overdraw: true
    });
    var videoGeometry2 = new THREE.PlaneGeometry(5, 5);
    var videoMesh2 = new THREE.Mesh(videoGeometry2, videoMaterial2);
    videoMesh2.position.set(-1, -1, 2);
    tmpScene2.add(videoMesh2);

    var videoImage3 = document.createElement('canvas');
    videoImage3.width = 100;
    videoImage3.height = 100;


    var videoImageContext3 = videoImage3.getContext('2d');
    // background color if no video present
    videoImageContext3.fillStyle = '#7af442';
    videoImageContext3.fillRect(0, 0, videoImage3.width, videoImage3.height);

    var videoTexture3 = new THREE.Texture(videoImage3);
    videoTexture3.minFilter = THREE.LinearFilter;
    videoTexture3.magFilter = THREE.LinearFilter;
    //  videoTexture3.format = THREE.RGBFormat;
    var videoMaterial3 = new THREE.MeshBasicMaterial({
        map: videoTexture3,
        overdraw: true
    });
    var videoGeometry3 = new THREE.PlaneGeometry(300, 300,2);
    var videoMesh3 = new THREE.Mesh(videoGeometry3, videoMaterial3);
    videoMesh3.position.x=-900;
    scene.add(videoMesh3);


    var hue = new THREE.ShaderPass(THREE.HueSaturationShader);


    var renderPass = new THREE.RenderPass(tmpScene, camera);
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    var composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(hue);
    composer.addPass(effectCopy);

    function initWebcam() {

        video = document.getElementById('video');
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
                .then(function (stream) {
                    video.srcObject = stream;
                    video.play();
                })
                .catch(function (err) {
                    console.log("An error occured! " + err);
                });

    }


    renderFrame();

    function renderFrame() {
        videoImageContext.drawImage(video, 0, 0, 300, 300);
        videoImageContext2.drawImage(video, 0, 0, 300, 300);
        videoTexture.needsUpdate = true;
        videoTexture2.needsUpdate = true;
        if (video2.readyState === video2.HAVE_ENOUGH_DATA)
        {
            console.log("Here");
            videoImageContext3.drawImage(video2, 0, 0, 100, 100);
        }

        videoTexture3.needsUpdate = true;
        //composer.render(tmpScene,camera);
        // first, render scene normally:
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        renderer.setViewport(10, 50, 300, 300);
        renderer.setScissorTest(false);
        //             renderer.render(tmpScene, camera);
        composer.render();
        //renderer.render( scene1, camera1 );
        // then, render the overlay
        renderer.setViewport(300, 100, 300, 300);
        renderer.setScissor(300, 100, 300, 300);
        renderer.setScissorTest(true);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
        renderer.render(tmpScene2, camera);
        //composer.render(tmpScene2,camera);
        // composer2.render();
        requestAnimationFrame(renderFrame);
    }

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");

    slider.oninput = function () {
        output.innerHTML = "Set Hue Value : " + this.value / 100;
        hue.uniforms.hue.value = this.value / 100;

    }
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function onKeyDown(event) {
    switch (event.keyCode) {
        case 17:
            enable = true;
            break;
    }
};

function onKeyUp(event) {
    switch (event.keyCode) {
        case 17:
            enable = false;
            break;
    }
};

function onMouseDown ( event ) {
    isClicked = true;
}

function onMouseUp ( event ) {
    isClicked = false;
}


function onDocumentMouseMove(event) {
    if (enable && isClicked) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }
}

function onDocumentTouchStart(event) {
    if (enable && isClicked) {
        if (event.touches.length > 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }
}

function onDocumentTouchMove(event) {
    if (enable && isClicked) {
        if (event.touches.length == 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }

    }
}
