
import * as THREE from 'three';
import gsap from 'gsap'
export default class InstancedMeshClass {
    constructor(parent, geometry, material, count, from, to) {
        this.parent = parent;
        this.geometry = geometry;
        this.material = material;
        this.count = count;
        // this.positions = positions;
        // this.rotations = rotations;
        this.matrixes = [];
        this.from = from;
        this.to = to;
        this.mesh = null;

        this.init();
    }
    init() {
        this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
        this.setInstancedMeshPositions()

        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); //per animare
        if(this.parent.debug){
            const axesHelper = new THREE.AxesHelper(5)
            this.mesh.add(axesHelper);
        }
        this.parent.modelGroup.add(this.mesh);

        // this.gsapAnimations()
        this.animate();
    }
    setInstancedMeshPositions() {
        const distnce = 3;
        for (var i = 0; i < this.count; i++) {
            const dummy = new THREE.Object3D();
            const deg = 360 / this.count * i
            const radian = THREE.MathUtils.degToRad(deg)
            const rotationY = radian;
            dummy.rotation.y = rotationY;
            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
            this.matrixes.push(dummy);
        }

        this.mesh.instanceMatrix.needsUpdate = true;

    }

    gsapAnimations() {
        const deltaDegrees = 360/this.count;
        const offsetDegrees = 110 + 360 - deltaDegrees/2; //aggiungo 110° per compensare il fatto che il primo indice non parte da 0°
        const duration = 2;
        var position = {};
        if(this.from && this.from.position){
            position = JSON.parse(JSON.stringify(this.from.position))
        }else{
            position = {x: 0, y: 0, z: 0}
        }

        var rotation = {};
        if(this.from && this.from.rotation){
            rotation = JSON.parse(JSON.stringify(this.from.rotation))
        }else{
            rotation = {x: 0, y: 0, z: 0}
        }

        const prevRotation = JSON.parse(JSON.stringify(rotation));
        var deltaRotation = {x: 0, y: 0, z: 0}

        var sumX = 0;

        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 1,
            onUpdate : () => {
                deltaRotation = {
                    x: rotation.x - prevRotation.x,
                    y: rotation.y - prevRotation.y,
                    z: rotation.z - prevRotation.z
                }
                

                for(var i = 0 ; i < this.count; i++){
                    var deg =  offsetDegrees - i * deltaDegrees;
                    deg = THREE.MathUtils.degToRad(deg);

                    this.matrixes[i].position.x = -position.x * Math.cos(deg);
                    this.matrixes[i].position.y = position.y;
                    this.matrixes[i].position.z = -position.z * Math.sin(deg);

                    this.matrixes[i].rotateX(THREE.MathUtils.degToRad(deltaRotation.x))
                    this.matrixes[i].rotateY(THREE.MathUtils.degToRad(deltaRotation.y))
                    this.matrixes[i].rotateZ(THREE.MathUtils.degToRad(deltaRotation.z))

                    this.matrixes[i].updateMatrix();
                    this.mesh.setMatrixAt(i, this.matrixes[i].matrix);
                }

                if(prevRotation.x != rotation.x) prevRotation.x = rotation.x;
                if(prevRotation.y != rotation.y) prevRotation.y = rotation.y;
                if(prevRotation.z != rotation.z) prevRotation.z = rotation.z;
                

                this.mesh.instanceMatrix.needsUpdate = true;
            },
            onComplete: () => {
                for(var i = 0 ; i < this.count; i++){
                    this.matrixes[i].rotateX(THREE.MathUtils.degToRad(-this.to.rotation.x))
                    this.matrixes[i].rotateY(THREE.MathUtils.degToRad(-this.to.rotation.y))
                    this.matrixes[i].rotateZ(THREE.MathUtils.degToRad(-this.to.rotation.z))
                    this.mesh.instanceMatrix.needsUpdate = true;
                }
            }
        })

        tl.to(
            position,
            {
                x: this.to.position.x,
                z: this.to.position.z,
                duration 
            }
        )
        tl.to(
            position,
            {
                y: this.to.position.y,
                duration ,
                ease: 'back.in(4)'
            },
            `-=${duration}`
        )
        tl.to(
            rotation,
            {
                x:this.to.rotation.x,
                y:this.to.rotation.y,
                z:this.to.rotation.z,
                duration,
                ease: 'power4.in'
            },
            `-=${duration}`
        )
                
    }
    


    animate() {
        requestAnimationFrame(() => this.animate());
    }
}