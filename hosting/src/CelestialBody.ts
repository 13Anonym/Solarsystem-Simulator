import * as THREE from "three";
import { Main } from "./main";

export class CelestialBody {

  mesh: THREE.Mesh;
  acceleration: THREE.Vector3;

  accelerationArrowHelper: THREE.ArrowHelper;
  velocityArrowHelper: THREE.ArrowHelper;


  castShadow = true;
  receiveShadow = true;

  constructor(public name: string | number | null, scene: THREE.Scene, public radius: number, public massKg: number, public rotation: number, private textureFilenameOrColor: string | number,
    public sunOrPlanet: string, x: number, y: number, z: number, public v: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(this.radius / Main.factor, 64 * 4, 32 * 4);

    let material: THREE.MeshBasicMaterial;

    this.castShadow = true;
    this.receiveShadow = true;

    material = new THREE.MeshBasicMaterial;

    if (typeof textureFilenameOrColor == 'string') {
      const texture = new THREE.TextureLoader().load(<string>this.textureFilenameOrColor);

      if (sunOrPlanet == "star") {
        material = new THREE.MeshBasicMaterial({
          map: texture
        });
      }
      if (sunOrPlanet == "planet") {
        material = new THREE.MeshLambertMaterial({
          map: texture,
          emissive: 0x000000 // Setzt die Eigenleuchtfarbe auf Schwarz, d.h., es wird kein Licht emittiert
        });
      }

    } else {

      if (sunOrPlanet == "star") {
        material = new THREE.MeshBasicMaterial({ color: <number>textureFilenameOrColor })
      }
      if (sunOrPlanet == "planet") {
        material = new THREE.MeshLambertMaterial({ color: <number>textureFilenameOrColor })
      }

    }

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    this.setPosition(x, y, z);

    this.acceleration = new THREE.Vector3(0, 0, 0);
    // Erstellen eines Pfeilhelfers für die Beschleunigung
    this.accelerationArrowHelper = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.mesh.position, 1, 0xff0000);
    // Erstellen eines Pfeilhelfers für die Geschwindigkeit
    this.velocityArrowHelper = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), this.mesh.position, 1, 0xff00ff);
    if (sunOrPlanet == "planet") {
      // Pfeilhelfer zur Szene hinzufügen
      scene.add(this.accelerationArrowHelper, this.velocityArrowHelper);
    }
  }


  getX(): number {
    return this.mesh.position.x * Main.factor;
  }

  getY(): number {
    return this.mesh.position.y * Main.factor;
  }

  getZ(): number {
    return this.mesh.position.z * Main.factor;
  }


  setPosition(x: number, y: number, z: number) {
    this.mesh.position.setX(x / Main.factor);
    this.mesh.position.setY(y / Main.factor);
    this.mesh.position.setZ(z / Main.factor);
  }


  updateArrows() {

    // Aktualisieren Sie die Position und Richtung des Geschwindigkeitspfeils
    this.velocityArrowHelper.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
    // Aktualisieren Sie die Position und Richtung des Beschleunigungspfeils
    this.accelerationArrowHelper.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);

    this.accelerationArrowHelper.setDirection(this.acceleration);
    this.accelerationArrowHelper.scale.set(500, 500, 500);

    this.velocityArrowHelper.setDirection(this.v);
    this.velocityArrowHelper.scale.set(500, 500, 500);
  }


  getUnitVectorTo(body: CelestialBody) {

    let v = new THREE.Vector3();
    v.copy(body.mesh.position);
    v.sub(this.mesh.position);
    v.normalize();
    return v;
  }

}
