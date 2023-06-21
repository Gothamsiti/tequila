import FullWindowCanvas from '~/class/XRExtras/fullWindowCanvas';
export default class ArClass{
    constructor(){

    }
    init(){
        const fullWindowCanvas = new FullWindowCanvas();
        XR8.addCameraPipelineModules([ 
            XR8.GlTextureRenderer.pipelineModule(),         // Draws the camera feed.
            XR8.Threejs.pipelineModule(),                   // Creates a ThreeJS AR Scene.
            XR8.XrController.pipelineModule(),              // Enables SLAM tracking.
            LandingPage.pipelineModule(),                   // Detects unsupported browsers and gives hints.
            // VpsCoachingOverlay.pipelineModule(),            // Shows the Lightship VPS coaching overlay.
            fullWindowCanvas.pipelineModule(),              // Modifies the canvas to fill the window.
            XRExtras.Loading.pipelineModule(),              // Manages the loading screen on startup.
            XRExtras.RuntimeError.pipelineModule(),         // Shows an error image on runtime error.
            this.initScenePipelineModule(),                 // Sets up the threejs camera and scene content.
        ])
        const canvas = document.getElementById('camerafeed');
        XR8.run({canvas})
    }

    initScenePipelineModule(){
        return {
            name: 'threejsinitscene',
            onStart: e => { this.initScenePipelineModuleONStart(e) },
            listeners: [
                {event: 'reality.imagefound', process: e => { this.handleTargetFound(e) }},
                {event: 'reality.imageupdated', process: e => { this.handleTargetUpdate(e) }},
                {event: 'reality.imagelost', process: e => { this.handleTargetLost(e) }},
            ],
        }
    }
    initScenePipelineModuleONStart({canvas}){
        const {scene, camera, renderer} = XR8.Threejs.xrScene();
        
        console.log('QUI INIZIALIZZO LA SCENA')
        // this.initGame(scene, camera, renderer);

        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault()
        })
        XR8.XrController.updateCameraProjectionMatrix(
            {origin: camera.position, facing: camera.quaternion}
        )
    }
    handleTargetFound(e){
        console.log('handleTargetFound')
    }
    handleTargetUpdate(e){
        console.log('handleTargetUpdate')
    }
    handleTargetLost(e){
        console.log('handleTargetLost')
    }
}