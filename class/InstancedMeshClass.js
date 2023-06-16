
import * as THREE from 'three';

export default class InstancedMeshClass{
    constructor(parent, geometry, material, count, positions, rotations){
        this.parent = parent;
        this.geometry = geometry;
        this.material = material;
        this.count = count;
        this.positions = positions;
        this.rotations = rotations;
        this.dummy = new THREE.Object3D();

        this.mesh = null;

        this.init();
    }
    init(){
        this.mesh = new THREE.InstancedMesh( this.geometry, this.material, this.count );
        this.setInstancedMeshPositions()

        this.mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); //per animare
        this.parent.modelGroup.add(this.mesh);


        this.animate();
    }
    setInstancedMeshPositions(){
        for ( var i = 0; i < this.count; i ++ ) {
            const rotationY = THREE.MathUtils.degToRad(360 / this.count * i);
            this.dummy.rotation.y = rotationY;
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt( i, this.dummy.matrix );
        }
        this.mesh.instanceMatrix.needsUpdate = true;
    }

    randomizeMatrix(matrix) {
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        position.x = Math.random() * 40 - 20;
        position.y = Math.random() * 40 - 20;
        position.z = Math.random() * 40 - 20;

        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;

        quaternion.setFromEuler( rotation );
        scale.x = scale.y = scale.z = Math.random() * 1;
        matrix.compose( position, quaternion, scale );
    }

    animate(){


        requestAnimationFrame( () => this.animate() );
    }
}