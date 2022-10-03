/**
 * A polygon is a connection of points in the shape object. You
 * should probably try to make them coplanar.
 */
function Polygon(points, normal, backface, type, color) {
        this.points = points;

        this.origin = new Point(0, 0, 0);
        for(var i = 0; i < this.points.length; i++) {
                this.origin.x += this.points[i].x;
                this.origin.y += this.points[i].y;
                this.origin.z += this.points[i].z;
        }

        this.origin.x /= this.points.length;
        this.origin.y /= this.points.length;
        this.origin.z /= this.points.length;

        if (normal) {
                this.normal = new Point(this.origin.x + normal.x,
                                                                                                                this.origin.y + normal.y,
                                                                                                                this.origin.z + normal.z);
        } else {
                this.normal = null;
        }

        this.backface = backface;
        this.type = type;
        this.color = color;
}

Polygon.SOLID = 0;
Polygon.WIRE = 1;

/**
 * Draws the polygon. Assumes that the points have already been
 * flattened.
 */
Polygon.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.points[0].fx, this.points[0].fy);

        for(var i = 0; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].fx, this.points[i].fy);
        }

        ctx.closePath();

        var color = this.color;

        /*
        // Do lighting here
        lightvector = Math.abs(this.normal.x + this.normal.y);
        if(lightvector > 1) {
                lightvector = 1;
        }

        color[0] = (color[0] * lightvector).toString();
        color[1] = (color[1] * lightvector).toString();
        color[2] = (color[2] * lightvector).toString();
        */

        if (color.length > 3) {
                var style = ["rgba(",
                             color[0], ",",
                             color[1], ",",
                             color[2], ",",
                             color[3], ")"].join("");
        } else {
                var style = ["rgb(",
                             color[0], ",",
                             color[1], ",",
                             color[2], ")"].join("");
        }

        if (this.type == Polygon.SOLID) {
                ctx.fillStyle = style;
                ctx.fill();
        } else if (this.type == Polygon.WIRE) {
                ctx.strokeStyle = style;
                ctx.stroke();
        }
}
