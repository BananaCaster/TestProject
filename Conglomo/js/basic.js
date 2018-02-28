var camera, scene, renderer, controls;
var mesh;
var audioAnalyser000, audioUniforms000,audio000;
var audioUrl='audios/audioSample000.ogg';
var videoUrl='./videos/sintel.ogv';
var raycaster;// for clicking, the focus
var mouse;


main();

/*main is the start of the program*/
function main() {

    initCamera();
    initScene();
    addControls(camera)
    addListeners();// add ctrl key listeners

/*raycaster and mouse*/
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
/*load video & audio*/
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
    audio000=loadAudio(audioUrl);//ogg
    var video002=loadVedio(videoUrl);// ogv

/*geo plane*/
    var planeGeo = new THREE.PlaneGeometry( 16, 9, 32 );
    var octahedreonGeo = new THREE.OctahedronGeometry(1, 0);
    var boxGeo = new THREE.BoxGeometry( 1,1,1 );

/*texture*/
    var videoMaterial000 = ogvVideoMaterail(video);
    var videoMaterial001 = ogvVideoMaterail(video);
    var videoMaterial002= ogvVideoMaterail(video002);
    var audioMaterial000=audioVisual(audio000);
    var material_grey = new THREE.MeshBasicMaterial( {color: 0x555555, side: THREE.DoubleSide} );
    var material_red = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
    var material_blue = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide} );
    var material_yellow = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );

/*meshes*/
    var audioDisplay000 = new THREE.Mesh(planeGeo, audioMaterial000);//Audio
    var videoDisplay000 = new THREE.Mesh( planeGeo, videoMaterial000 );
    var videoDisplay001 = new THREE.Mesh( planeGeo, videoMaterial001 );
    var videoDisplay002 = new THREE.Mesh( planeGeo, videoMaterial002 );//OGV VIDEO
    var textDisplay000 = new THREE.Mesh( planeGeo, material_yellow );
    var audioStartButton000 = new THREE.Mesh( octahedreonGeo, material_blue);
    var audioStopButton000 = new THREE.Mesh( boxGeo, material_red);

    /*register clickable buttons to a list*/
    audioStartButton000.callback = function() { audio000.play();}
    audioStopButton000.callback = function() { audio000.stop();}
    audioStartButton000.name = 'callback';
    audioStopButton000.name = 'callback';

    /* object position and roatation should be modified here */
    setObectPosition(videoDisplay000,videoDisplay001,videoDisplay002,audioStartButton000,audioStopButton000,textDisplay000,audioDisplay000);

    /*just add the to-secne objects that you want at the end of this array*/
    sceneAddObject([videoDisplay000,videoDisplay001,videoDisplay002,audioStartButton000,audioStopButton000,textDisplay000,audioDisplay000]);


    /* renderer set*/
    initRenderer();
    document.body.appendChild( renderer.domElement );

    /* Add listener here for events if needed*/
    window.addEventListener( 'resize', onWindowResize, false );
    init();
    animate();

}




function initCamera() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(0, -20, 0);
}

function initScene(){
    scene = new THREE.Scene();
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function addControls(camera) {
    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );
    ctrl = false;
    click = false;
    controls.enabled = false;

}

/*load video*/
function loadVedio(url) {
    var video = document.getElementById('video2');
    video.src = url;
    video.load(); // must call after setting/changing source
    video.play();
    return video;

}

/*add static video such as .ogv as the texture*/
function ogvVideoMaterail(video) {
    var videoTexture = new THREE.VideoTexture( video );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    var videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        overdraw: true
    });
    return videoMaterial;

}



/*all positions are set here*/
function setObectPosition(videoDisplay000,videoDisplay001,videoDisplay002,audioStartButton000,audioStopButton000,textDisplay000,audioDisplay000) {

    videoDisplay000.position.set(0,0,-40);

    videoDisplay001.position.set(-20,0,-40);
    videoDisplay001.rotation.y = 1;

    videoDisplay002.position.set(20,0,-40);
    videoDisplay002.rotation.y = -1;

    audioStartButton000.position.set(-18,-17,-40);
    audioStartButton000.rotation.y = 1;

    audioStopButton000.position.set(-22,-18,-40);
    audioStopButton000.rotation.y = 1;

    textDisplay000.position.set(20,-10,-40);
    textDisplay000.rotation.y = -1;

    audioDisplay000.position.set(-20,-10,-40);
    audioDisplay000.rotation.y = 1;
}




/*load and play*/
function loadAudio(url) {

    var audioLoader000 = new THREE.AudioLoader();
    var listener000 = new THREE.AudioListener();
    audio000 = new THREE.Audio(listener000);

    audioLoader000.load(url, function (buffer) {
        audio000.setBuffer(buffer);
        audio000.setLoop(true);
        audio000.play();
    });
    return audio000;// for visual

}

/* visualize audio*/
function audioVisual(audio000) {
    var fftSize000 = 128;
    audioAnalyser000 = new THREE.AudioAnalyser(audio000, fftSize000);
    audioUniforms000 = {
        tAudioData: {
            value: new THREE.DataTexture(audioAnalyser000.data, fftSize000 / 2, 1, THREE.LuminanceFormat)
        }
    };

    var audioMaterial000 = new THREE.ShaderMaterial({
        uniforms: audioUniforms000,
        vertexShader: document.getElementById('audiovVertexShader000').textContent,
        fragmentShader: document.getElementById('audiov_fragment_shader000').textContent
    });
    return audioMaterial000;


}

/*refresh dynamic data such as audio */
function refresh() {
    audioAnalyser000.getFrequencyData();
    audioUniforms000.tAudioData.value.needsUpdate = true;

}

/*add objects to the scene*/
function sceneAddObject(args) {

    var i=0;
    for(i;i<args.length;i++){

        scene.add(args[i]);
    }

}

/*key listerners*/
function addListeners() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    refresh();
    renderer.render( scene, camera );

}


/*event of clicking buttons in the scene*/
function buttonClick( event ) {

    event.preventDefault();
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
    mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
		// console.log(intersects[0].object.name);
        if(intersects[0].object.name == 'callback'){

            intersects[0].object.callback();
        }
    }

}
function onKeyDown(event) {
    switch (event.keyCode) {
        case 17:
            ctrl = true;
    }
    setControl();
}

function onKeyUp(event) {
    switch (event.keyCode) {
        case 17:
            ctrl = false;
    }
    setControl();
}

function onMouseDown ( event ) {
    click = true;
    setControl();
}

function onMouseUp ( event ) {
    click = false;
    buttonClick(event)
    setControl();
}

function setControl () {
    if (ctrl && click) {
        controls.enabled = true;
    } else {
        controls.enabled = false;
    }
}

//create web camera
function webCam(){
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

function init(){
    webCam();

    // video texture
    var videoImage = document.createElement('canvas');
    videoImage.width = 300;
    videoImage.height = 300;

    var videoImageContext = videoImage.getContext('2d');
    // background color if no video present
    videoImageContext.fillStyle = '#ff0000';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    //console.log("err here 1");
    //create hue shader
    var hue = new THREE.ShaderPass(THREE.HueSaturationShader);
    //console.log("err here 2");
    var renderPass = new THREE.RenderPass(scene, camera);
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    //create composer
    var composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(hue);
    composer.addPass(effectCopy);

    //create slider
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");

    //link slider
    slider.oninput = function () {
        output.innerHTML = "Set Hue Value : " + this.value / 100;
        hue.uniforms.hue.value = this.value / 100;

    }

    //manipulate hue
    renderFrame();
    function renderFrame() {
        videoTexture.needsUpdate = true;
        camera.updateProjectionMatrix();
        renderer.setScissorTest(false);
        composer.render();
        renderer.setScissorTest(true);
        requestAnimationFrame(renderFrame);
    }
}
