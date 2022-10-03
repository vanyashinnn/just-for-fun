/**
 * A Shape is made up of polygons
 */
function Shape() {
        this.points = [];
        this.polygons = [];
}

/**
 * Draws the shape
 */
Shape.prototype.draw = function(drawlist) {
        for (var i = 0; i< this.points.length; i++) {
                space.flatten(this.points[i]);
        }

        for (var i = 0; i< this.polygons.length; i++) {
                var poly = this.polygons[i]; // convenience

                space.flatten(poly.origin);

                // lazy backface culling
                if (poly.normal && this.backface) {
                        space.flatten(poly.normal);

                        var originDist = Math.pow(poly.origin.tx, 2)
                                                                                 + Math.pow(poly.origin.ty, 2)
                                                                                 + Math.pow(poly.origin.tz, 2);

                        var normalDist = Math.pow(poly.normal.tx, 2)
                                                                                 + Math.pow(poly.normal.ty, 2)
                                                                                 + Math.pow(poly.normal.tz, 2);

                        if(originDist > normalDist) {
                                drawlist.push(poly);
                        }
                } else {
                        drawlist.push(poly);
                }
        }
}
