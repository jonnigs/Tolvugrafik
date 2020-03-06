/////////////////////////////////////////////////////////////////
//    Heimadæmi 7 í Tölvugrafík - Dæmi 2
//    Forrit með tveimur mynstrum.  Sýnir gras með
//    nokkrum trjám.  Það er hægt að ganga um líkanið,
//    en það er engin árekstarvörn. Unnið eftir fyrirmyndinni
//    VeggurGolf.js eftir Hjálmtý Hafsteinsson.
//
//    Jónas G. Sigurðsson, apríl 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numVertices  = 6;
var numTrees = 20;
var treeX = [];
var treeY = [];
for(i=0; i<numTrees; i++) {
  treeX.push(15*Math.random()-7.5);
  treeY.push(15*Math.random()-7.5);
}

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;
var texTree;
var texGrass;

// Breytur fyrir hreyfingu áhorfanda
var userXPos = 0.0;
var userZPos = 2.0;
var userIncr = 0.1;                // Size of forward/backward step
var userAngle = 270.0;             // Direction of the user in degrees
var userXDir = 0.0;                // X-coordinate of heading
var userZDir = -1.0;               // Z-coordinate of heading


var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -5.0;

var proLoc;
var mvLoc;

// Hnútar trésins
var vertices = [
    vec4( -1.0, -1.0, 0.0, 1.0 ),
    vec4(  1.0, -1.0, 0.0, 1.0 ),
    vec4(  1.0,  1.0, 0.0, 1.0 ),
    vec4(  1.0,  1.0, 0.0, 1.0 ),
    vec4( -1.0,  1.0, 0.0, 1.0 ),
    vec4( -1.0, -1.0, 0.0, 1.0 ),
// Hnútar gólfsins (strax á eftir)
    vec4( -5.0,  0.0, 10.0, 1.0 ),
    vec4(  5.0,  0.0, 10.0, 1.0 ),
    vec4(  5.0,  0.0,  0.0, 1.0 ),
    vec4(  5.0,  0.0,  0.0, 1.0 ),
    vec4( -5.0,  0.0,  0.0, 1.0 ),
    vec4( -5.0,  0.0, 10.0, 1.0 )
];

// Mynsturhnit fyrir tré
var texCoords = [
    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),
// Mynsturhnit fyrir gras
    vec2(  0.1,  0.1 ),
    vec2( 5.0,  0.1 ),
    vec2( 5.0, 5.0 ),
    vec2( 5.0, 5.0 ),
    vec2(  0.1, 10.0 ),
    vec2(  0.1,  0.1 )
];


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    // Lesa inn og skilgreina mynstur fyrir vegg
    var grassImage = document.getElementById("GrassImage");
    texGrass = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texGrass );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, grassImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // Lesa inn og skilgreina mynstur fyrir gólf
    var treeImage = document.getElementById("TreeImage");
    texTree = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texTree );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, treeImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);


    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 50.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));

    gl.enable( gl.BLEND );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.clientX;
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            userAngle += 0.4*(origX - e.clientX);
            userAngle %= 360.0;
            userXDir = Math.cos( radians(userAngle) );
            userZDir = Math.sin( radians(userAngle) );
            origX = e.clientX;
        }
    } );

    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 87:	// w
                userXPos += userIncr * userXDir;
                userZPos += userIncr * userZDir;;
                break;
            case 83:	// s
                userXPos -= userIncr * userXDir;
                userZPos -= userIncr * userZDir;;
                break;
            case 65:	// a
                userXPos += userIncr * userZDir;
                userZPos -= userIncr * userXDir;;
                break;
            case 68:	// d
                userXPos -= userIncr * userZDir;
                userZPos += userIncr * userXDir;;
                break;
         }
     }  );

    // Event listener for mousewheel
     window.addEventListener("wheel", function(e){
         if( e.deltaY > 0.0 ) {
             zDist += 0.2;
         } else {
             zDist -= 0.2;
         }
     }  );


    render();

}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // staðsetja áhorfanda og meðhöndla músarhreyfingu
    var mv = lookAt( vec3(userXPos, 0.5, userZPos), vec3(userXPos+userXDir, 0.5, userZPos+userZDir), vec3(0.0, 1.0, 0.0 ) );


    // Teikna tré
    for(i=0; i<numTrees; i++) {
      mv1 = mult( mv, scalem(0.5, 0.5, 0.5) );
      mv1 = mult( mv1, translate( 0.0 + treeX[i], 1.0, 10.0 + treeY[i]) );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.bindTexture( gl.TEXTURE_2D, texTree );
      gl.drawArrays( gl.TRIANGLES, 0, numVertices );

      mv1 = mult( mv, scalem(0.5, 0.5, 0.5) );
      mv1 = mult( mv1, translate( 0.06 + treeX[i], 1.0, 9.96 + treeY[i]) );
      mv1 = mult( mv1, rotate( -90.0, [0, 1, 0] ) );
      gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
      gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    }

    // Teikna gólf með mynstri

    gl.bindTexture( gl.TEXTURE_2D, texGrass );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, numVertices, numVertices );

    requestAnimFrame(render);
}
