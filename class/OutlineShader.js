// https://omar-shehata.medium.com/better-outline-rendering-using-surface-ids-with-webgl-e13cdab1fd94
import * as THREE from 'three';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

import { CustomOutlinePass } from "~/class/CustomOutlinePass.js";

import FindSurfaces from "~/class/FindSurfaces.js";


export default class OutlineShader {
    constructor(parent, renderer, width, height, scene, camera){
        this.parent = parent;
        this.renderer = renderer;
        this.width = width;
        this.height = height;
        this.scene = scene;
        this.camera = camera;
        this.scene = scene;


        const interval = setInterval(() => {
            if(!Object.values(this.parent.ready).includes(false)){
                this.init();
                clearInterval(interval)
            }
        }, 100);
    }
    init(){
        // Set up post processing
        // Create a render target that holds a depthTexture so we can use it in the outline pass
        // See: https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderTarget.depthBuffer
        const depthTexture = new THREE.DepthTexture();
        const renderTarget = new THREE.WebGLRenderTarget(
            this.width,
            this.height,
            {
                depthTexture: depthTexture,
                depthBuffer: true,
            }
        );
        // Initial render pass.
        this.composer = new EffectComposer(this.renderer, renderTarget);
        const pass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(pass);
        
        // Outline pass.
        this.customOutline = new CustomOutlinePass(
            new THREE.Vector2(this.width, this.height),
            this.scene,
            this.camera
        );
        this.composer.addPass(this.customOutline);


        // Antialias pass.
        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
        );
        this.composer.addPass(effectFXAA);

        // this.surfaceFinder = new FindSurfaces(); //DISABILITATO NON VOGLIAMO OUTLINE INTERNO
        // this.addSurfaceIdAttributeToMesh(); //DISABILITATO NON VOGLIAMO OUTLINE INTERNO
        this.animate()
    }
    addSurfaceIdAttributeToMesh(){
        this.surfaceFinder.surfaceId = 0;

        this.scene.traverse((node) => {
            if (node.type == "Mesh" && node.geometry && node.geometry.index != null){
                const colorsTypedArray = this.surfaceFinder.getSurfaceIdAttribute(node);
                node.geometry.setAttribute("color", new THREE.BufferAttribute(colorsTypedArray, 4));
            }
        })
        this.customOutline.updateMaxSurfaceId(this.surfaceFinder.surfaceId + 1);
    }
    animate(){
        this.composer.render();
        requestAnimationFrame(() => this.animate());
    }

}