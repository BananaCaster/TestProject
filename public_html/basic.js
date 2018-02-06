/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var scene, camera, renderer;// for three.js
var videoTexture;
//var video, video_canvas;// for video
var gl, program; // for glsl


const video = document.getElementById('video');
const video_canvas = document.getElementById('video_canvas');
const canvas = document.querySelector('.photo');
const ctx = video_canvas.getContext('2d');

window.addEventListener("load", setupWebGL, false);// load the glsl at the begining. when linked to video, it may need to process later
initWebcam();
init();
render();

function initWebcam() {

  //  video = document.getElementById('video');
  //  video_canvas = document.getElementById('video_canvas');
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
	// load and play sound
	var myAudio1 = document.getElementById("audio1");
	myAudio1.volumn = 0.3;
	myAudio1.play();
}

function render() {

    requestAnimationFrame(render);
    //canvas_context = video_canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 320, 240);
    //videoTexture.needsUpdate = true;
    //renderer.render(scene, camera);

}


// compile GLSL and link the program
function setupWebGL (evt) {
    window.removeEventListener(evt.type, setupWebGL, false);
    if (!(gl = getRenderingContext()))
        return;

    var source = document.querySelector("#vertex-shader").innerHTML;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,source);
    gl.compileShader(vertexShader);
    source = document.querySelector("#fragment-shader").innerHTML
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,source);
    gl.compileShader(fragmentShader);
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var linkErrLog = gl.getProgramInfoLog(program);
        cleanup();
        document.querySelector("p").innerHTML =
            "Shader program did not link successfully. "
            + "Error log: " + linkErrLog;
        return;
    }
    initializeAttributes();
    gl.useProgram(program);
    gl.drawArrays(gl.POINTS, 0, 1);
    cleanup();
}

var buffer;
function initializeAttributes() {
    gl.enableVertexAttribArray(0);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}

function cleanup() {
    gl.useProgram(null);
    if (buffer)
        gl.deleteBuffer(buffer);
    if (program)
        gl.deleteProgram(program);
}

// render the shader into the document
function getRenderingContext() {
    var shader_canvas = document.querySelector("#shader_canvas");
    shader_canvas.width = shader_canvas.clientWidth;
    shader_canvas.height = shader_canvas.clientHeight;
    var gl = shader_canvas.getContext("webgl")
        || shader_canvas.getContext("experimental-webgl");
    if (!gl) {
        var paragraph = document.querySelector("p");
        paragraph.innerHTML = "Failed to get WebGL context."
            + "Your browser or device may not support WebGL.";
        return null;
    }
    gl.viewport(0, 0,
        gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
}

// canvas

function paintToCanvas(){
  const width = video.videoWidth;
  const height = video.videoHeight;

  video_canvas.width = width;
  video_canvas.height = height;

 //console.log(width, height);
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    //take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    //manipulate webcam for single color
     //pixels = redEffect(pixels);
    // manipulate webcam for mixed color
    // pixels = rgbSplit(pixels);
    //mixed
    pixels = greenScreen(pixels);
     //put them back
     ctx.putImageData(pixels, 0, 0);
  }, 16);

}


//HUE filter for single color
// function redEffect(pixels){
//   for(let i=0; i<pixels.data.length; i+=4 ){
//     pixels.data[i+0] = pixels.data[i+0] + 100;  //red
//     pixels.data[i+1] = pixels.data[i+1] - 50;  //green
//     pixels.data[i+2] = pixels.data[i+2] * 0.5;  //blue
//   }
//   return pixels;
// }
//
// // HUE filter for mixed color
// function rgbSplit(pixels){
//   for(let i=0; i<pixels.data.length; i+=4){
//     pixels.data[i-150] = pixels.data[i+0]; // red
//     pixels.data[i+100] = pixels.data[i+1]; //green
//     pixels.data[i-150] = pixels.data[i+2]; // blue
//   }
//   return pixels;
// }

//HUE shader and slider

function greenScreen(pixels){

  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) =>{
    levels[input.name] = input.value;
  });

  //console.log(levels);

  for(let i=0; i<pixels.data.length; i+=4 ){
    red = pixels.data[i+0];
    green = pixels.data[i+1];
    blue = pixels.data[i+2];
    alpha = pixels.data[i+3];
    // if the color is not between rgb
    if(red >=levels.rmin
      && green >=levels.gmin
      && blue >=levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <=levels.bmax){
        //take it out and transparent
        pixels.data[i+3] = 0;
      }
  }
  return pixels;
}
