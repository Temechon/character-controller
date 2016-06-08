class CharacterController {

    static Epsilon : number = 0.1;

    // The game scene
    private _scene : BABYLON.Scene;

    // The parent mesh of the character
    private _parent : BABYLON.Mesh;
    
    // All meshes attached to this controller
    private _meshes : Array<BABYLON.Mesh> = []; 
    
    // The character skeleton (if any). Can be null
    public skeleton : BABYLON.Skeleton = null;
    
    // Display the character skeleton
    private _skeletonViewer : BABYLON.Debug.SkeletonViewer = null;
    
    // The offset rotation of the base mesh.
    private _offsetRotation : BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

    // The offset scaling of the base mesh
    private _offsetScaling : BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

    // The direction this character is heading to
    private _direction : BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

    // The destination this character is heading to
    private _destination : BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

    // Set to true when a destination is set, and reset to false when the destination is reached
    private _canMove : boolean = false;

    // True if the character should stop, false if the character should be moving
    public stop : boolean = false;

    // The character speed
    public speed : number = 1;
    
    
    constructor(scene : BABYLON.Scene) {
        this._scene = scene;

        // Create the base mesh
        this._parent = new BABYLON.Mesh('__characterController__', this._scene);
        this._parent.isPickable = false;

        // Add move function to the character
        this._scene.registerBeforeRender(() => {
            this._move();
        });
    }

    // Set the character destination
    set destination(value:BABYLON.Vector3) {
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
    }
    
    /**
     * Set an offset rotation to the parent mesh
     */
    set offsetRotation(value:BABYLON.Vector3) {
        this._offsetRotation.copyFrom(value);
        this._parent.rotation.copyFrom(value);
    }

    /**
     * Set an offset scaling to the parent mesh
     */
    set offsetScaling(value:BABYLON.Vector3) {
        this._offsetScaling.copyFrom(value);
        this._parent.scaling.copyFrom(value);
    }
    
    /**
     * The character looks at the given position, but rotates only along Y-axis 
     * */
    private lookAt(value:BABYLON.Vector3){
        var dv = value.subtract(this._parent.position);
        var yaw = -Math.atan2(dv.z, dv.x) - Math.PI / 2;
        this._parent.rotation.y = yaw + this._offsetRotation.y;
    }

    /** 
     * Attach the given mesh to this controller, and found the character skeleton.
     * The skeleton used for the mesh animation (and the debug viewer) is the first found one.
     */    
    public attachTo(meshes: Array<BABYLON.Mesh>) {
        let skeletonFound = false;
        
        for (let m of meshes) {
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
    }

    /**
     * Move the character to its destination.
     * The character y position is set according to the ground position (or 0 if no ground).
     * The attribute _canMove is reset to false when the destination is reached.
     */
    private _move() {
        // If a destination has been set and the character has not been stopped
        if (this._canMove && !this.stop) {
            // Compute distance to destination
            let distance = BABYLON.Vector3.Distance(this._parent.position, this._destination);
            if (distance < CharacterController.Epsilon) {
                // Destination has been reached
                this._canMove = false;
                // Animate the character
                this.playAnimation('idle', true, 1);

            } else {

                // Add direction to the position
                let delta = this._direction.scale(this._scene.getAnimationRatio()*this.speed);
                this._parent.position.addInPlace(delta);
            }
        }
    }
    
    /**
     * Display or hide the mesh skeleton.
     */
    public debugSkeleton(display:boolean) {
        if (!display && this._skeletonViewer) {
            this._skeletonViewer.dispose();
        }
        if (display && !this._skeletonViewer) {
            this._skeletonViewer = new BABYLON.Debug.SkeletonViewer(this.skeleton, this._parent, this._scene);
            this._skeletonViewer.isEnabled = true;
        }     
        
        console.log(this.skeleton.toString(true));  
    }       

    /**
     * Add an animation to this character 
     */
    public addAnimation(name:string, from:number, to:number) {
        this.skeleton.createAnimationRange(name, from, to);
    }

    /**
     * Play the given animation.
     */
    public playAnimation(name:string, loop:boolean, speed:number) {
        this.skeleton.beginAnimation(name, loop, speed);
    }
}