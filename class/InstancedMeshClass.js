
import * as THREE from 'three';

export default class InstancedMeshClass {
  constructor(parent, geometry, material, layer, i) {
    this.layer = layer;
    this.parent = parent;
    this.geometry = geometry;
    this.material = material;
    this.count = layer.quantity;
    // this.positions = positions;
    // this.rotations = rotations;

    this.matrixes = [];
    this.from = layer.from;
    this.to = layer.to;
    this.mesh = null;
    this.index = i;
    this.initialRoatationsY = [];

    this.init();
  }
  init() {
    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
    this.setInstancedMeshPositions()
    this.mesh.renderOrder=3
    
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); //per animare
    if (this.parent.debug) {
      const axesHelper = new THREE.AxesHelper(5)
      this.mesh.add(axesHelper);
    }
    this.parent.modelGroup.add(this.mesh);

    this.animate();
  }
  setInstancedMeshPositions() {
    

    const deltaDegrees = 360 / this.count;
    const offsetDegrees = this.layer.rotationOffset + 360 - deltaDegrees / 2;
    for (var i = 0; i < this.count; i++) {
      const dummy = new THREE.Object3D();
      const deg = 360 / this.count * i
      const radian = THREE.MathUtils.degToRad(deg)
      const rotationY = radian;
      this.initialRoatationsY.push(rotationY);
      dummy.rotation.y = rotationY;
      dummy.updateMatrix();
      dummy.parentMesh = this.mesh;
      dummy.dummyIndex = i;
      dummy.deltaDegrees = deltaDegrees;
      dummy.offsetDegrees = offsetDegrees;
      dummy.layerIndex = this.index
      dummy.layer = this.layer
      this.parent.leafDummies.push(dummy);
      this.mesh.setMatrixAt(i, dummy.matrix);
      this.matrixes.push(dummy);

      // this.dummy.translateX(Math.cos(radian) * distnce);

      // this.dummy.position.z = deg>= 10 ?  Math.cos(radian) * distnce :
      // this.dummy.position.z = Math.sin(radian) * distnce
    }

    this.mesh.instanceMatrix.needsUpdate = true;

  }




  animate() {
    requestAnimationFrame(() => this.animate());
  }
}