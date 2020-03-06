var canvas;
var gl;


var vertices = [vec2(-0.4,0.4),
                vec2(0.0,0.9),
                vec2(0.4,0.4),

                vec2(-0.4,0.4),
                vec2(0.4,0.4),
                vec2(-0.4,-0.4),

                vec2(0.4,0.4),
                vec2(-0.4,-0.4),
                vec2(0.4,-0.4)]

var points = [];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	  // Create
    create( vertices );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
}


// Create the points of the circle
function create(k)
{
    for(i=0; i<k.length; i++) {
      points.push(k[i]);
    }
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    // Draw circle using Triangle Fan
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    window.requestAnimFrame(render);
}
