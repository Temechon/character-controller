var CharacterController = (function () {
    function CharacterController(scene) {
        // All meshes attached to this controller
        this._meshes = [];
        // The character skeleton (if any). Can be null
        this.skeleton = null;
        // Display the character skeleton
        this._skeletonViewer = null;
        this._scene = scene;
        // Create the base mesh
        this._parent = new BABYLON.Mesh('__characterController__', this._scene);
        this._parent.isPickable = false;
    }
    Object.defineProperty(CharacterController.prototype, "offsetRotation", {
        /**
         * Set an offset rotation to the parent mesh
         */
        set: function (value) {
            this._parent.rotation.copyFrom(value);
        },
        enumerable: true,
        configurable: true
    });
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
            // this._scene.stopAnimation(m);
            // Find skeleton if possible
            if (m.skeleton && !skeletonFound) {
                this.skeleton = m.skeleton;
                skeletonFound = true;
                this.debugSkeleton(true);
            }
        }
    };
    /**
     * Display the mesh skeleton
     */
    CharacterController.prototype.debugSkeleton = function (display) {
        if (!display && this._skeletonViewer) {
            this._skeletonViewer.dispose();
        }
        if (display && !this._skeletonViewer) {
            this._skeletonViewer = new BABYLON.Debug.SkeletonViewer(this.skeleton, this._parent, this._scene);
            this._skeletonViewer.isEnabled = true;
        }
    };
    return CharacterController;
}());
//# sourceMappingURL=CharacterController.js.map