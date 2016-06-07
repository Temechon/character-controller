class Viewer {

    private engine  : BABYLON.Engine;
    public assets   : Array<any>;
    public scene    : BABYLON.Scene;

    constructor(canvasId:string) {
        
        let canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById(canvasId);
        this.engine         = new BABYLON.Engine(canvas, true);
        
        this.assets         = [];
        this.scene          = null;
        
        // On resize le jeu en fonction de la taille de la fenetre
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        
        this.initScene(); 
            
        this.run();
    }

     private initScene() {

        this.scene = new BABYLON.Scene(this.engine);
        let camera = new BABYLON.ArcRotateCamera('', 0,0,10, new BABYLON.Vector3(0,0,0), this.scene);       
        camera.attachControl(this.engine.getRenderingCanvas()); 
        // let light  = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0,1,0), this.scene);
        // light.intensity = 0.5;
        
        // Directional light for shadows
        let dl = new BABYLON.DirectionalLight("shadow", new BABYLON.Vector3(-0.05, -1, 0), this.scene);
        dl.intensity = 0.5;

        // shadows
        let generator = new BABYLON.ShadowGenerator(512, dl);
        generator.useBlurVarianceShadowMap = true;
        generator.blurScale = 0.5;
         
    }

    private run() {
        
        // The loader
        let loader =  new BABYLON.AssetsManager(this.scene);

        let meshTask = loader.addMeshTask("bug", "", "./assets/bug/", "bug.babylon");
        meshTask.onSuccess = (t:any) => {
            // for (let m of t.loadedMeshes) {
            //     m.setEnabled (false);
            // }
            this.assets['bug'] = {meshes : t.loadedMeshes}
        };

        loader.onFinish = () => {

            this.scene.executeWhenReady(() => {
                this.engine.runRenderLoop(() => {
                    this.scene.render();
                });
            });

            // Load first level
            this._initGame();

        };

        loader.load();   
    }

     private _initGame() {     
        let ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, this.scene);
    }
}
