import FullWindowCanvas from '~/class/XRExtras/fullWindowCanvas';
import ThreeClass from '~/class/ThreeClass'
export default class ArClass{
    constructor(){
        this.threeClass = null;
        this.ready =false
        this.scannable = false;
        this.found = false
        
    }
    init(){
        const fullWindowCanvas = new FullWindowCanvas();
        
        XR8.XrController.configure({ disableWorldTracking: true, enableLighting: true });
        XR8.addCameraPipelineModules([ 
            XR8.GlTextureRenderer.pipelineModule(),         // Draws the camera feed.
            XR8.Threejs.pipelineModule(),                   // Creates a ThreeJS AR Scene.
            XR8.XrController.pipelineModule(),              // Enables SLAM tracking.
            LandingPage.pipelineModule(),                   // Detects unsupported browsers and gives hints.
            // VpsCoachingOverlay.pipelineModule(),            // Shows the Lightship VPS coaching overlay.
            fullWindowCanvas.pipelineModule(),              // Modifies the canvas to fill the window.
            // XRExtras.Loading.pipelineModule(),              // Manages the loading screen on startup.
            XRExtras.RuntimeError.pipelineModule(),         // Shows an error image on runtime error.
            this.initScenePipelineModule(),                 // Sets up the threejs camera and scene content.
            this.initCameraLightPipelineModule(),
        ])

        
        const canvas = document.getElementById('camerafeed');
        XR8.run({canvas})
        
    }

  

    initCameraLightPipelineModule(){
        return {
            name: 'xr-light',
            onUpdate: ({processCpuResult}) => {
                if(processCpuResult?.reality?.lighting){
                    if(this.threeClass){
                        this.threeClass.upadeARLightIntensity(processCpuResult.reality.lighting.exposure ?? 0)
                    }
                }
            },
        } 
    }
    initScenePipelineModule(){
        return {
            name: 'threejsinitscene',
            onStart: e => { this.initScenePipelineModuleONStart(e) },
            listeners: [
                {event: 'reality.imagefound', process: e => { this.handleTargetFound(e) }},
                {event: 'reality.imageupdated', process: e => { this.handleTargetUpdate(e) }},
                {event: 'reality.imagelost', process: e => { this.handleTargetLost(e) }},
                {event: 'reality.imagescanning', process: e => {this.handleScanning(e)}}
            ],
        }
    }
    initScenePipelineModuleONStart({canvas}){
        const {scene, camera, renderer} = XR8.Threejs.xrScene();
        this.threeClass = new ThreeClass(true, canvas);
        this.threeClass.initAr(scene, camera, renderer)
        this.checkReady()
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault()
        })
        XR8.XrController.updateCameraProjectionMatrix(
            {origin: camera.position, facing: camera.quaternion}
        )
    }
    handleTargetFound(e){
        this.found = true;
        this.threeClass.handleTargetFound(e.detail)
    }
    handleTargetUpdate(e){
        this.threeClass.handleTargetUpdate(e.detail)
    }
    handleTargetLost(e){
        this.threeClass.handleTargetLost(e.detail)
    }
    handleScanning(e){
        this.scannable = true;
        // this.threeClass.handleTargetLost(e.detail)
    }
    async checkReady(){
        const readyArray = Object.values(this.threeClass.ready)
        if(!this.threeClass || !readyArray.length || readyArray.includes(false)){
            setTimeout(()=> {
                this.checkReady()
            }, 200)
        }else {
            this.ready = true;
        }
    }
}