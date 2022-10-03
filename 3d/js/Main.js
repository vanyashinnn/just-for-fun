var canvas, ctx;
var canvasWidth, halfCanvasWidth;
var canvasHeight, halfCanvasHeight;

var space;  // 3D Engine
var scene;  // 3D Scene

/* -------------------------------------------------------------------- */

var count = 0;

function loop() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        scene.camera.x = 70*Math.sin(count);
        scene.camera.y = 70;
        scene.camera.z = 70*Math.cos(count);
        scene.cameraRotation = count / 10;

        count += 0.01;
        scene.draw();
}

function load() {
        // Init drawing system
        canvas = document.getElementById("cv");
        ctx = canvas.getContext("2d");

        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        halfCanvasWidth = canvasWidth * 0.5;
        halfCanvasHeight = canvasHeight * 0.5;

        // Init 3D components
        space = new Space();
        scene = new Scene();

        // Create a box shape and add it to the scene
        scene.shapes['box'] = new Shape();
        var p = scene.shapes['box'].points; // for convenience

        p[0] = new Point(-10, -10, -10); // left  bottom front
        p[1] = new Point(10, -10, -10);  // right bottom front
        p[2] = new Point(10, 10, -10);   // right top    front
        p[3] = new Point(-10, 10, -10);  // left  top    front

        p[4] = new Point(-10, -10, 10);  // left  bottom back
        p[5] = new Point(10, -10, 10);   // right bottom back
        p[6] = new Point(10, 10, 10);    // right top    back
        p[7] = new Point(-10, 10, 10);   // left  top    back

        // Back
        scene.shapes['box'].polygons.push(new Polygon(
                [ p[0], p[1], p[2], p[3] ],
                new Point(0, 0, -1),
                true /* double-sided */,
                Polygon.SOLID,
                [255, 0, 0]
        ));

        // Front
        scene.shapes['box'].polygons.push(new Polygon(
                [ p[4], p[5], p[6], p[7] ],
                new Point(0, 0, 1),
                true /* double-sided */,
                Polygon.SOLID,
                [0, 0, 255]
        ));

        // Top
        scene.shapes['box'].polygons.push(new Polygon(
                [ p[2], p[3], p[7], p[6] ],
                new Point(0, 1, 0),
                false /* single-sided */,
                Polygon.WIRE,
                [0, 255, 0]
        ));

        // Transparent Top
        scene.shapes['box'].polygons.push(new Polygon(
                [ p[2], p[3], p[7], p[6] ],
                new Point(0, 1, 0),
                false /* single-sided */,
                Polygon.SOLID,
                [0, 255, 0, 0.4]
        ));

        // Left
        scene.shapes['box'].polygons.push(new Polygon(
                [ p[0], p[4], p[7], p[3] ],
                new Point(-1, 0, 0),
                true /* double-sided */,
                Polygon.SOLID,
                [255, 255, 0]
        ));

        // Right
        scene.shapes['box'].polygons.push(new Polygon(
                [ p[1], p[5], p[6], p[2] ],
                new Point(1, 0, 0),
                true /* double-sided */,
                Polygon.SOLID,
                [0, 255, 255]
        ));

        // Create a floor shape and add it to the scene
        scene.shapes['floor'] = new Shape();
        var p = scene.shapes['floor'].points; // for convenience

        p[0]  = new Point(-40, -10, -40);
        p[1]  = new Point(-40, -10,  40);
        p[2] = new Point( 40, -10,  40);
        p[3] = new Point( 40, -10, -40);

        // Floor
        scene.shapes['floor'].polygons.push(new Polygon(
                [ p[0], p[1], p[2], p[3] ],
                new Point(0, 1, 0),
                false /* single-sided */,
                Polygon.SOLID,
                [45, 45, 45]
        ));

        setInterval('loop()', 20);
}
