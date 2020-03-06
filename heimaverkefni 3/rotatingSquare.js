/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Hagkvæm aðferð til að snúa ferningi.  Hækka snúningsgráðu
//     í JS forriti og senda hana yfir í GPU í hverri ítrun og
//     láta litara reikna ný hnit (sendum bara eina breytu)
//
//    Hjálmtýr Hafsteinsson, janúar 2019
/////////////////////////////////////////////////////////////////
"use strict";
var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var scaleLoc;
var skali = 1.0;
var posY = 0.0;
var down = false;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
        vec2(  0,  1 ),
        vec2(  -1,  0 ),
        vec2( 1,  0 ),
        vec2(  0, -1 )
    ];


    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );
    scaleLoc = gl.getUniformLocation( program, "scale" );

    canvas.addEventListener("mousedown", function(e){
        down = true;
    } );

    canvas.addEventListener("mouseup", function(e){
      down = false;
    } );

    canvas.addEventListener("mousemove", function(e){
      if (down == true) {
        skali *= 1.0 + (e.offsetY - posY)/100.0;
        posY = e.offsetY;
      }
    } );


    render();
};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += 0.1;
    var ctm = scalem( skali, skali, skali )

    // Send the new angle and scale over to GPU
    gl.uniform1f( thetaLoc, theta );
    gl.uniformMatrix4fv(scaleLoc, false, flatten(ctm));

    // Draw!
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    window.requestAnimFrame(render);
}
