class CharacterController {

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
    private _offsetRotation : BABYLON.Vector3;
    
    
    constructor(scene : BABYLON.Scene) {
        this._scene = scene;

        // Create the base mesh
        this._parent = new BABYLON.Mesh('__characterController__', this._scene);
        this._parent.isPickable = false;
    }
    
    /**
     * Set an offset rotation to the parent mesh
     */
    set offsetRotation(value:BABYLON.Vector3) {
        this._parent.rotation.copyFrom(value);
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
            // this._scene.stopAnimation(m);
            
            // Find skeleton if possible
            if (m.skeleton && !skeletonFound) { 
                this.skeleton = m.skeleton;
                skeletonFound = true;
                this.debugSkeleton(true);
            }
        }
    }
    
    /**
     * Display the mesh skeleton
     */
    public debugSkeleton(display:boolean) {
        if (!display && this._skeletonViewer) {
            this._skeletonViewer.dispose();
        }
        if (display && !this._skeletonViewer) {
            this._skeletonViewer = new BABYLON.Debug.SkeletonViewer(this.skeleton, this._parent, this._scene);
            this._skeletonViewer.isEnabled = true;
        }        
    }   
    
}