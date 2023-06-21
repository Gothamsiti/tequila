export default class FullWindowCanvas{
    constructor() {
        this.canvas_ = null
        this.vsize_ = {}
        this.orientation_ = 0
        this.originalBodyStyleSubset_ = {}
        this.originalHtmlStyleSubset_ = {}
        this.canvasStyle_ = {
          width: '100%',
          height: '100%',
          margin: '0px',
          padding: '0px',
          border: '0px',
          display: 'block',
        }
        this.bodyStyle_ = {
          width: '100%',
          height: '100%',
          margin: '0px',
          padding: '0px',
          border: '0px',
        }
      
        // Update the size of the camera feed canvas to fill the screen.
    }  
    onWindowResize(){
        if (this.isCompatibleMobile()) return;
        this.fillScreenWithCanvas()
    }
    onVideoSizeChange({videoWidth, videoHeight}){
        this.updateVideoSize({videoWidth, videoHeight})
        this.fillScreenWithCanvas()
    }
    onCameraStatusChange = ({status, video}) => {
        if (status !== 'hasVideo') {
            return
        }
        this.updateVideoSize(video)
    }
    onCanvasSizeChange(){
        this.fillScreenWithCanvas()
    }
    onUpdate(){
        if (this.canvas_.style.width === this.canvasStyle_.width && this.canvas_.style.height === this.canvasStyle_.height) { return }
        this.fillScreenWithCanvas()
    }
    onAttach({canvas, orientation, videoWidth, videoHeight}){
        this.canvas_ = canvas
        this.orientation_ = orientation;
        window.addEventListener('resize', this.onWindowResize)
        this.updateVideoSize({videoWidth, videoHeight})
        this.fillScreenWithCanvas()
    }
    onDetach = () => {
    // Reset styles that we cached in `onAttach()`.
        this.canvas_ = null
        this.orientation_ = 0
        delete this.vsize_.w
        delete this.vsize_.h
        window.removeEventListener('resize', this.onWindowResize)
    }
    updateVideoSize({videoWidth, videoHeight}){
        this.vsize_.w = videoWidth
        this.vsize_.h = videoHeight
    }
    fillScreenWithCanvas(){
        if (!this.canvas_) { return }
    
        // Get the pixels of the browser window.
        const uww = window.innerWidth
        const uwh = window.innerHeight
        const ww = uww * window.devicePixelRatio
        const wh = uwh * window.devicePixelRatio
    
        // Wait for orientation change to take effect before handling resize on mobile phones only.
        const displayOrientationMismatch = ((this.orientation_ == 0 || this.orientation_ == 180) && ww > wh) || ((this.orientation_ == 90 || this.orientation_ == -90) && wh > ww)
        if (displayOrientationMismatch && this.isCompatibleMobile()) {
          window.requestAnimationFrame(this.fillScreenWithCanvas)
          return
        }
    
        // Compute the portrait-orientation aspect ratio of the browser window.
        const ph = Math.max(ww, wh)
        const pw = Math.min(ww, wh)
        const pa = ph / pw
    
        // Compute the portrait-orientation dimensions of the video.
        const pvh = Math.max(this.vsize_.w, this.vsize_.h)
        const pvw = Math.min(this.vsize_.w, this.vsize_.h)
    
        // Compute the cropped dimensions of a video that fills the screen, assuming that width is
        // cropped.
        let ch = pvh
        let cw = Math.round(pvh / pa)
    
        // Figure out if we should have cropped from the top, and if so, compute a new cropped video
        // dimension.
        if (cw > pvw) {
          cw = pvw
          ch = Math.round(pvw * pa)
        }
    
        // If the video has more pixels than the screen, set the canvas size to the screen pixel
        // resolution.
        if (cw > pw || ch > ph) {
          cw = pw
          ch = ph
        }
    
        // Switch back to a landscape aspect ratio if required.
        if (ww > wh) {
          const tmp = cw
          cw = ch
          ch = tmp
        }
    
        // Set the canvas geometry to the new window size.
        Object.assign(this.canvas_.style, this.canvasStyle_)
        this.canvas_.width = cw
        this.canvas_.height = ch
    
        // on iOS, rotating from portrait to landscape back to portrait can lead to a situation where
        // address bar is hidden and the content doesn't fill the screen. Scroll back up to the top in
        // this case. In chrome this has no effect. We need to scroll to something that's not our
        // scroll position, so scroll to 0 or 1 depending on the current position.
        setTimeout(() => window.scrollTo(0, (window.scrollY + 1) % 2), 300)
    }
    isCompatibleMobile(){
        return XR8.XrDevice.isDeviceBrowserCompatible({allowedDevices: XR8.XrConfig.device().MOBILE}) && !XR8.XrDevice.deviceEstimate().model.toLowerCase().includes('ipad')
    }
    onDeviceOrientationChange({orientation}){
      this.orientation_ = orientation;
      this.fillScreenWithCanvas();
    }
    pipelineModule(){
        return {
            name: 'fullwindowcanvas',
            onAttach : e => { this.onAttach(e) },
            onDetach : e => { this.onDetach(e) },
            onCameraStatusChange : e => { this.onCameraStatusChange(e) },
            onDeviceOrientationChange : e => { this.onDeviceOrientationChange(e) },
            onVideoSizeChange : e => { this.onVideoSizeChange(e) },
            onCanvasSizeChange : e => { this.onCanvasSizeChange(e) },
            onUpdate : e => { this.onUpdate(e) },
        }
    }
}