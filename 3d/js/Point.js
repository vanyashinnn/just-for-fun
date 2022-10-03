function Point(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        // Relative to camera coordinates
        this.tx;
        this.ty;
        this.tz;

        // Flattened coordinates
        this.fx;
        this.fy;
}
