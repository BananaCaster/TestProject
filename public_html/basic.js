/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var scene, camera, renderer;
var videoTexture;
var video, video_canvas;

initWebcam();
init();
render();

function initWebcam() {

    video = document.getElementById('video');
    canvas = document.getElementById('video_canvas');
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.log("An error occured! " + err);
            });

}

function init() {
    //scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function render() {
    requestAnimationFrame(render);
    canvas_context = canvas.getContext('2d');
    canvas_context.drawImage(video, 0, 0, 320, 240);
    videoTexture.needsUpdate = true;
    renderer.render(scene, camera);

}

