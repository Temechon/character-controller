var Viewer = (function () {
    function Viewer(canvasId) {
        var _this = this;
        var canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(canvas, true);
        this.assets = [];
        this.scene = null;
        // On resize le jeu en fonction de la taille de la fenetre
        window.addEventListener("resize", function () {
            _this.engine.resize();
        });
        this.initScene();
        this.run();
    }
    Viewer.prototype.initScene = function () {
        this.scene = new BABYLON.Scene(this.engine);
        var camera = new BABYLON.ArcRotateCamera('', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this.scene);
        camera.attachControl(this.engine.getRenderingCanvas());
        // let light  = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0,1,0), this.scene);
        // light.intensity = 0.5;
        // Directional light for shadows
        var dl = new BABYLON.DirectionalLight("shadow", new BABYLON.Vector3(-0.05, -1, 0), this.scene);
        dl.intensity = 0.5;
        // shadows
        var generator = new BABYLON.ShadowGenerator(512, dl);
        generator.useBlurVarianceShadowMap = true;
        generator.blurScale = 0.5;
    };
    Viewer.prototype.run = function () {
        var _this = this;
        // The loader
        var loader = new BABYLON.AssetsManager(this.scene);
        var meshTask = loader.addMeshTask("bug", "", "./assets/bug/", "bug.babylon");
        meshTask.onSuccess = function (t) {
            // for (let m of t.loadedMeshes) {
            //     m.setEnabled (false);
            // }
            _this.assets['bug'] = { meshes: t.loadedMeshes };
        };
        loader.onFinish = function () {
            _this.scene.executeWhenReady(function () {
                _this.engine.runRenderLoop(function () {
                    _this.scene.render();
                });
            });
            // Load first level
            _this._initGame();
        };
        loader.load();
    };
    Viewer.prototype._initGame = function () {
        var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, this.scene);
    };
    return Viewer;
}());
//# sourceMappingURL=Viewer.js.map