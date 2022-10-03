/* -------------------------------------------------------------------- */

/**
 * Scene describes the 3D environment
 */
function Scene() {
        this.shapes = {};
        this.camera = new Point(0, 0, 0);
        this.cameraTarget = new Point(0, 0, 0);
        this.cameraRotation = 0;

        this.drawlist = [];
}

/**
 * Draw the world
 */
Scene.prototype.draw = function() {
        space.push();

        // Camera transformation
        space.translate(
                -this.camera.x,
                -this.camera.y,
                -this.camera.z
        );

        // Camera rotation
        var xdiff = this.cameraTarget.x - this.camera.x;
        var ydiff = this.cameraTarget.y - this.camera.y;
        var zdiff = this.cameraTarget.z - this.camera.z;

        var xzdist = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(zdiff, 2));

        var xrot = -Math.atan2(ydiff, xzdist); // up/down rotation
        var yrot =  Math.atan2(xdiff, zdiff);  // left/right rotation

        space.rotate(xrot, yrot, this.cameraRotation);

        // Drawing
        this.drawlist = [];

        for(var i in this.shapes) {
                this.shapes[i].draw(this.drawlist);
        }

        // Depth sorting (warning: this is only enough to drive this demo - feel
        // free to contribute a better system).
        this.drawlist.sort(function (poly1, poly2) {
                return poly2.origin.tz - poly1.origin.tz;
        });

        for (var i = 0; i < this.drawlist.length; i++) {
                this.drawlist[i].draw();
        }

        space.pop();
}
