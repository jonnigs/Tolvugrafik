var canvas;
var gl;

var numVertices  = 6;

var program;

var pointsArray = [];
var texCoordsArray = [];

var texIsl;
var texPalau;
var texOman;
var texStong;

var isl = true;
var palau = false;
var oman = false;

var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = 5.0;

var proLoc;
var mvLoc;

var vertices = [
    // Fáni
    vec4( -1.0, -1.0, 0.0, 1.0 ),
    vec4(  1.0, -1.0, 0.0, 1.0 ),
    vec4(  1.0,  1.0, 0.0, 1.0 ),
    vec4(  1.0,  1.0, 0.0, 1.0 ),
    vec4( -1.0,  1.0, 0.0, 1.0 ),
    vec4( -1.0, -1.0, 0.0, 1.0 ),
    // Botn á stöng
    vec4( -1.0, -1.0,  1.0, 1.0 ),
    vec4(  1.0, -1.0,  1.0, 1.0 ),
    vec4(  1.0, -1.0, -1.0, 1.0 ),
    vec4(  1.0, -1.0, -1.0, 1.0 ),
    vec4( -1.0, -1.0, -1.0, 1.0 ),
    vec4( -1.0, -1.0,  1.0, 1.0 ),
    // Toppur á stöng
    vec4( -1.0, 1.0,  1.0, 1.0 ),
    vec4(  1.0, 1.0,  1.0, 1.0 ),
    vec4(  1.0, 1.0, -1.0, 1.0 ),
    vec4(  1.0, 1.0, -1.0, 1.0 ),
    vec4( -1.0, 1.0, -1.0, 1.0 ),
    vec4( -1.0, 1.0,  1.0, 1.0 ),
    // Framhlið á stöng
    vec4( -1.0, -1.0, 1.0, 1.0 ),
    vec4(  1.0, -1.0, 1.0, 1.0 ),
    vec4(  1.0,  1.0, 1.0, 1.0 ),
    vec4(  1.0,  1.0, 1.0, 1.0 ),
    vec4( -1.0,  1.0, 1.0, 1.0 ),
    vec4( -1.0, -1.0, 1.0, 1.0 ),
    // Bakhlið á stöng
    vec4( -1.0, -1.0, -1.0, 1.0 ),
    vec4(  1.0, -1.0, -1.0, 1.0 ),
    vec4(  1.0,  1.0, -1.0, 1.0 ),
    vec4(  1.0,  1.0, -1.0, 1.0 ),
    vec4( -1.0,  1.0, -1.0, 1.0 ),
    vec4( -1.0, -1.0, -1.0, 1.0 ),
    // Hægri hlið á stöng
    vec4(  1.0, -1.0, -1.0, 1.0 ),
    vec4(  1.0,  1.0, -1.0, 1.0 ),
    vec4(  1.0,  1.0,  1.0, 1.0 ),
    vec4(  1.0,  1.0,  1.0, 1.0 ),
    vec4(  1.0, -1.0,  1.0, 1.0 ),
    vec4(  1.0, -1.0, -1.0, 1.0 ),
    // Vinstri hlið á stöng
    vec4(  -1.0, -1.0, -1.0, 1.0 ),
    vec4(  -1.0,  1.0, -1.0, 1.0 ),
    vec4(  -1.0,  1.0,  1.0, 1.0 ),
    vec4(  -1.0,  1.0,  1.0, 1.0 ),
    vec4(  -1.0, -1.0,  1.0, 1.0 ),
    vec4(  -1.0, -1.0, -1.0, 1.0 ),
];

// Mynsturhnit fyrir spjaldið
var texCoords = [
    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),

    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),
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

    // Ná í mynstur úr html-skrá:
    // Lesa inn og skilgreina mynstur fyrir Íslenska fánann
    var islImage = document.getElementById("islImage");
    texIsl = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texIsl );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, islImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // Lesa inn og skilgreina mynstur fyrir fána Palau
    var palauImage = document.getElementById("palauImage");
    texPalau = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texPalau );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, palauImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // Lesa inn og skilgreina mynstur fyrir fána Oman
    var omanImage = document.getElementById("omanImage");
    texOman = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texOman );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, omanImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // Lesa inn og skilgreina mynstur fyrir stöng
    var stontImage = document.getElementById("stongImage");
    texStong = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texStong );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, stongImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 50.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));


    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.clientX;
        origY = e.clientY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	      spinY = ( spinY + (origX - e.clientX) ) % 360;
            spinX = ( spinX + (origY - e.clientY) ) % 360;
            origX = e.clientX;
            origY = e.clientY;
        }
    } );

    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:	// upp ör
                zDist += 0.1;
                break;
            case 40:	// niður ör
                zDist -= 0.1;
                break;
            case 73: // I
                isl = true;
                palau = false;
                oman = false;
                break;
            case 79: // O
                isl = false;
                palau = false;
                oman = true;
                break;
            case 80: // P
                isl = false;
                palau = true;
                oman = false;
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
    var mv = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );

    mv = mult( mv, rotateX( spinX ) );
    mv = mult( mv, rotateY( spinY ) );

    // Teikna fána
    mv1 = mult( mv, translate( 0.85, 1.5, 0.0 ) );
    mv1 = mult(mv1, scalem( 0.8, 0.5, 1.0 ) );
    if (isl){
      gl.bindTexture( gl.TEXTURE_2D, texIsl );
    } else if (palau) {
      gl.bindTexture( gl.TEXTURE_2D, texPalau );
    } else if (oman) {
      gl.bindTexture( gl.TEXTURE_2D, texOman );
    }
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // Teikna stöng
    mv1 = mult(mv, scalem( 0.06, 2.0, 0.06 ) );
    gl.bindTexture( gl.TEXTURE_2D, texStong );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, numVertices, 36 );

    // Teikna undirstöðu
    mv1 = mult( mv, translate( 0.0, -2.0, 0.0 ) );
    mv1 = mult(mv1, scalem( 1.0, 0.05, 1.0 ) );
    gl.bindTexture( gl.TEXTURE_2D, texStong );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, numVertices, 36 );

    requestAnimFrame(render);
}
