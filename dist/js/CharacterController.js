var CharacterController = (function () {
    function CharacterController(scene) {
        var _this = this;
        // All meshes attached to this controller
        this._meshes = [];
        // The character skeleton (if any). Can be null
        this.skeleton = null;
        // Display the character skeleton
        this._skeletonViewer = null;
        // The offset rotation of the base mesh.
        this._offsetRotation = new BABYLON.Vector3(0, 0, 0);
        // The offset scaling of the base mesh
        this._offsetScaling = new BABYLON.Vector3(0, 0, 0);
        // The direction this character is heading to
        this._direction = new BABYLON.Vector3(0, 0, 0);
        // The destination this character is heading to
        this._destination = new BABYLON.Vector3(0, 0, 0);
        // Set to true when a destination is set, and reset to false when the destination is reached
        this._canMove = false;
        // True if the character should stop, false if the character should be moving
        this.stop = false;
        // The character speed
        this.speed = 1;
        this._scene = scene;
        // Create the base mesh
        this._parent = new BABYLON.Mesh('__characterController__', this._scene);
        this._parent.isPickable = false;
        // Add move function to the character
        this._scene.registerBeforeRender(function () {
            _this._move();
        });
    }
    Object.defineProperty(CharacterController.prototype, "destination", {
        // Set the character destination
        set: function (value) {
            this._destination.copyFrom(value);
            // Destination set : the character can move
            this._canMove = true;
            // Compute direction
            this._direction = this._destination.subtract(this._parent.position);
            this._direction.normalize();
            // Rotate
            this.lookAt(value);
            // Animate the character
            this.playAnimation('walk', true, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterController.prototype, "offsetRotation", {
        /**
         * Set an offset rotation to the parent mesh
         */
        set: function (value) {
            this._offsetRotation.copyFrom(value);
            this._parent.rotation.copyFrom(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CharacterController.prototype, "offsetScaling", {
        /**
         * Set an offset scaling to the parent mesh
         */
        set: function (value) {
            this._offsetScaling.copyFrom(value);
            this._parent.scaling.copyFrom(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The character looks at the given position, but rotates only along Y-axis
     * */
    CharacterController.prototype.lookAt = function (value) {
        var dv = value.subtract(this._parent.position);
        var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
        this._parent.rotation.y = yaw + this._offsetRotation.y;
    };
    /**
     * Attach the given mesh to this controller, and found the character skeleton.
     * The skeleton used for the mesh animation (and the debug viewer) is the first found one.
     */
    CharacterController.prototype.attachTo = function (meshes) {
        var skeletonFound = false;
        for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
            var m = meshes_1[_i];
            // Attach this mesh as children
            m.parent = this._parent;
            this._meshes.push(m);
            // Stop mesh animations
            this._scene.stopAnimation(m);
            // Find skeleton if possible
            if (m.skeleton && !skeletonFound) {
                this.skeleton = m.skeleton;
                skeletonFound = true;
                // Activate animation blending    
                this.skeleton.enableBlending(0.08);
            }
        }
    };
    /**
     * Move the character to its destination.
     * The character y position is set according to the ground position (or 0 if no ground).
     * The attribute _canMove is reset to false when the destination is reached.
     */
    CharacterController.prototype._move = function () {
        // If a destination has been set and the character has not been stopped
        if (this._canMove && !this.stop) {
            // Compute distance to destination
            var distance = BABYLON.Vector3.Distance(this._parent.position, this._destination);
            if (distance < CharacterController.Epsilon) {
                // Destination has been reached
                this._canMove = false;
                // Animate the character
                this.playAnimation('idle', true, 1);
            }
            else {
                // Add direction to the position
                var delta = this._direction.scale(this._scene.getAnimationRatio() * this.speed);
                this._parent.position.addInPlace(delta);
            }
        }
    };
    /**
     * Display or hide the mesh skeleton.
     */
    CharacterController.prototype.debugSkeleton = function (display) {
        if (!display && this._skeletonViewer) {
            this._skeletonViewer.dispose();
        }
        if (display && !this._skeletonViewer) {
            this._skeletonViewer = new BABYLON.Debug.SkeletonViewer(this.skeleton, this._parent, this._scene);
            this._skeletonViewer.isEnabled = true;
        }
        console.log(this.skeleton.toString(true));
    };
    /**
     * Add an animation to this character
     */
    CharacterController.prototype.addAnimation = function (name, from, to) {
        this.skeleton.createAnimationRange(name, from, to);
    };
    /**
     * Play the given animation.
     */
    CharacterController.prototype.playAnimation = function (name, loop, speed) {
        this.skeleton.beginAnimation(name, loop, speed);
    };
    CharacterController.Epsilon = 0.1;
    return CharacterController;
}());
//# sourceMappingURL=CharacterController.js.map