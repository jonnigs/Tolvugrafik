var canvas;
var gl;

var numVertices  = 36;

var points = [];
var colors = [];

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var earthRotYear = 0.0;
var earthRotDay = 0.0;
var earthTilt = 0.0;

var moonRotYear = 0.0;
var moonRotDay = 0.0;
var moonTilt = 0.0;

var satelightRotYear = 0.0;
var satelightRotDay = 0.0;
var satelightTilt = 0.0;

var matrixLoc;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLoc = gl.getUniformLocation( program, "rotation" );

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );

    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[a]);

    }
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    earthRotDay += 0.9;
    earthRotYear += 0.1;

    moonRotDay += 0.0;          // Tunglið snýr alltaf sömu hlið að jörðinni
    moonRotYear += 0.1;

    satelightRotDay += 1.0;
    satelightRotYear += 10.0;

    var mv = mat4();
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) );

    // teikna "sólina"
    mv = mult( mv, scalem( 0.1, 0.1, 0.1 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // teikna "jörðina"
    mv = mult( mv, rotateY( earthRotYear ) );
    mv = mult( mv, translate( 5.0, 0.0, 0.0 ) );
    mv = mult( mv, rotateZ( earthTilt ) );
    mv = mult( mv, rotateY( earthRotDay ) );

    mv = mult( mv, scalem( 0.7, 0.7, 0.7 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // teikna "tunglið"
    mv = mult( mv, rotateY( moonRotYear ) );
    mv = mult( mv, translate( 4, 0.0, 0.0 ) );
    mv = mult( mv, rotateZ( moonTilt ) );
    mv = mult( mv, rotateY( moonRotDay ) );

    mv = mult( mv, scalem( 0.7, 0.7, 0.7 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // teikna "gervihnött"
    mv = mult( mv, rotateZ( satelightRotYear ) );
    mv = mult( mv, translate( 1.5, 0.0, 0.0 ) );
    mv = mult( mv, rotateZ( satelightTilt ) );
    mv = mult( mv, rotateY( satelightRotDay ) );

    mv = mult( mv, scalem( 0.6, 0.6, 0.6 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame( render );
}
