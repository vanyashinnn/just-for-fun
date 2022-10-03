/* -------------------------------------------------------------------- */

/**
 * Space is a simple 3D system.
 *
 * Y+ = up
 * Z+ = into screen
 * X+ = right
 */
function Space() {
        this.m = this.createMatrixIdentity();
        this.mStack = [];
}

Space.prototype.createMatrixIdentity = function() {
        return [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
        ];
}

/**
 * Multiplies two 4x4 matricies together.
 */
Space.prototype.matrixMultiply = function(m1, m2) {
        var result = this.createMatrixIdentity();

        var width = m1[0].length;
        var height = m1.length;

        if (width != m2.length) {
                // error
        }

        for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                        var sum = 0;

                        for (var z = 0; z < width; z++) {
                                sum += m1[y][z] * m2[z][x];
                        }

                        result[y][x] = sum;
                }
        }

        return result;
}

/**
 * Transforms a coordinate using the current transformation
 * matrix, then flattens it using the projection matrix.
 */
Space.prototype.flatten = function(point) {
        var p = [[point.x, point.y, point.z, 1]];
        var pm = this.matrixMultiply(p, this.m);

        point.tx = pm[0][0];
        point.ty = pm[0][1];
        point.tz = pm[0][2];

        // lazy projection
        point.fx = halfCanvasWidth + (canvasWidth * point.tx / point.tz);
        point.fy = halfCanvasHeight -(canvasWidth * point.ty / point.tz);
}

/**
 * Translate (move) the current transformation matrix
 */
Space.prototype.translate = function(x, y, z) {
        var m = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [x, y, z, 1]
        ];

        this.m = this.matrixMultiply(m, this.m);
}

/**
 * Rotate the current transformation matrix. Rotations are
 * world-oriented, and occur in y,x,z order.
 */
Space.prototype.rotate = function(x, y, z) {
        if (y) {
                var cosY = Math.cos(y);
                var sinY = Math.sin(y);
                var rotY = [
                        [cosY, 0, sinY, 0],
                        [0, 1, 0, 0],
                        [-sinY, 0, cosY, 0],
                        [0, 0, 0, 1]
                ];

                this.m = this.matrixMultiply(this.m, rotY);
        }

        if (x) {
                var cosX = Math.cos(x);
                var sinX = Math.sin(x);
                var rotX = [
                        [1, 0, 0, 0],
                        [0, cosX, -sinX, 0],
                        [0, sinX, cosX,0],
                        [0, 0, 0, 1]
                ];
                this.m = this.matrixMultiply(this.m, rotX);
        }

        if (z) {
                var cosZ = Math.cos(z);
                var sinZ = Math.sin(z);
                var rotZ = [
                        [cosZ, -sinZ, 0, 0],
                        [sinZ, cosZ, 0, 0],
                        [0, 0, 1, 0],
                        [0, 0, 0, 1]
                ];

                this.m = this.matrixMultiply(this.m, rotZ);
        }
}

/**
 * Pushes the current transformation onto the stack
 */
Space.prototype.push = function() {
        this.mStack.push(this.m);
        this.m = [
                [this.m[0][0], this.m[0][1], this.m[0][2], this.m[0][3]],
                [this.m[1][0], this.m[1][1], this.m[1][2], this.m[1][3]],
                [this.m[2][0], this.m[2][1], this.m[2][2], this.m[2][3]],
                [this.m[3][0], this.m[3][1], this.m[3][2], this.m[3][3]]
        ];
}

/**
 * Pops the end off the transformation stack
 */
Space.prototype.pop = function() {
        this.m = this.mStack.pop();
}
