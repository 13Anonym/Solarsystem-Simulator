import * as THREE from "three";
import { CelestialBody } from "./CelestialBody";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from 'dat.gui';


// Erstellen eines Arrays für die Punkte der Bahn
var pointsmercury: THREE.Vector3[] = [];
var pointsvenus: THREE.Vector3[] = [];
var pointsearth: THREE.Vector3[] = [];
var pointsmars: THREE.Vector3[] = [];
var pointsjupiter: THREE.Vector3[] = [];
var pointssaturn: THREE.Vector3[] = [];
var pointsuranus: THREE.Vector3[] = [];
var pointsneptune: THREE.Vector3[] = [];
// Erstellen einer geometrische Form für die Linie (eine BufferGeometry)
const lineGeometrymercury = new THREE.BufferGeometry();
const lineGeometryvenus = new THREE.BufferGeometry();
const lineGeometryearth = new THREE.BufferGeometry();
const lineGeometrymars = new THREE.BufferGeometry();
const lineGeometryjupiter = new THREE.BufferGeometry();
const lineGeometrysaturn = new THREE.BufferGeometry();
const lineGeometryuranus = new THREE.BufferGeometry();
const lineGeometryneptun = new THREE.BufferGeometry();
// Erstellen eines Materials für die Linie mit einer bestimmten Farbe
let lineMaterialmercury = new THREE.LineBasicMaterial({ color: (0xffff00) });
let lineMaterialvenus = new THREE.LineBasicMaterial({ color: (0xffff00) });
let lineMaterialearth = new THREE.LineBasicMaterial({ color: (0xffff00) });
let lineMaterialmars = new THREE.LineBasicMaterial({ color: (0xffff00) });
let lineMaterialjupiter = new THREE.LineBasicMaterial({ color: (0xffff00) });
let lineMaterialsaturn = new THREE.LineBasicMaterial({ color: (0xffff00) });
let lineMaterialuranus = new THREE.LineBasicMaterial({ color: (0xffff00) });
let lineMaterialneptune = new THREE.LineBasicMaterial({ color: (0xffff00) });
// Erstellen einer Linie aus der Geometrie und dem Material
let linemercury = new THREE.Line(lineGeometrymercury, lineMaterialmercury);
let linevenus = new THREE.Line(lineGeometryvenus, lineMaterialvenus);
let lineearth = new THREE.Line(lineGeometryearth, lineMaterialearth);
let linemars = new THREE.Line(lineGeometrymars, lineMaterialmars);
let linejupiter = new THREE.Line(lineGeometryjupiter, lineMaterialjupiter);
let linesaturn = new THREE.Line(lineGeometrysaturn, lineMaterialsaturn);
let lineuranus = new THREE.Line(lineGeometryuranus, lineMaterialuranus);
let lineneptune = new THREE.Line(lineGeometryneptun, lineMaterialneptune);


export class Main {

    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;

    celestialBodies: CelestialBody[] = [];

    stats: Stats;

    epsilon: number = 1;                 // in s;
    isFirstStep: boolean;
    G: number = 6.67430e-11;                    // in m³/(kg*s²)

    static size = 1000;

    static flextime = 1;

    //GUI
    static timefactor = 1;
    isClickedY: Boolean;
    static YorDtimefactor = 0;   // debug: day / year und wie viele
    static timePrefactor = 1;
    static timePostfactor = 1;

    //1 year  = = = one minute

    static time = this.flextime * (1 / 60) * (1 / 60); // --> in sekunden        --> Rotation

    rotationOwnAxes = 1;

    static factor = 1e5;
    static forceFactor = this.factor;
    static velocityFactor = this.factor;

    static radiusfactor = 1;
    static changedradiusfactor = 1;

    static factorRadius = 1000;

    //GUI - graphical user interface
    //Axeshelper
    axesHelperV: boolean;
    static axesHelperPreScale = 1;
    static axesHelperPostScale = 1;
    //Gridhelper
    gridHelperV: boolean;
    static gridHelperPreSize = this.size;
    static gridHelperPostSize = 1;
    //Play
    public planetanimation: boolean;
    //Performance-Settings
    static renderdistance = 10000000;
    static starsizePre = 100000000;
    static starsizePost = 100000000;
    //Orbit
    orbits: Boolean = false
    orbitmercury: Boolean = false;
    orbitvenus: Boolean = false;
    orbitearth: Boolean = false;
    orbitmars: Boolean = false;
    orbitjupiter: Boolean = false;
    orbitsaturn: Boolean = false;
    orbituranus: Boolean = false;
    orbitneptune: Boolean = false;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, Main.renderdistance);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
        //x = red; y = green; z = blue;
        let axesHelper = new THREE.AxesHelper(100);
        this.scene.add(axesHelper);
        axesHelper.visible = false;
        let gridHelper = new THREE.GridHelper(Main.size, 100);
        this.scene.add(gridHelper);
        gridHelper.visible = false;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        const gui = new GUI({ width: window.innerWidth / 5 });
        gui.domElement.style.position = 'absolute';
        gui.domElement.style.right = '0px';
        gui.domElement.style.top = '0px';
        gui.domElement.style.opacity = '0.95';

        this.planetanimation = true;

        let folderAxeshelper = gui.addFolder('Axeshelper'); // Erstellen eines neuen Ordner mit dem Namen "Axeshelper"

        this.axesHelperV = axesHelper.visible;
        folderAxeshelper.add({ Axeshelper: this.axesHelperV }, 'Axeshelper').onChange((value) => {
            this.axesHelperV = value;
            if (this.axesHelperV == true) {
                axesHelper.visible = true;
            }
            if (this.axesHelperV == false) {
                axesHelper.visible = false;
            }
        });
        folderAxeshelper.add(Main, 'axesHelperPostScale', 1, 25).name('Scale').step(1).onChange((value) => {
            Main.axesHelperPostScale = value;

            axesHelper.scale.set(axesHelper.scale.x / Main.axesHelperPreScale * value, axesHelper.scale.y / Main.axesHelperPreScale * value,
                axesHelper.scale.z / Main.axesHelperPreScale * value);  // Scalierung / Vor Letzter Scalierung -> Grundgröße -> Grundgröße * value (Wert Schieberegler) -> Skallierung um den wert

            Main.axesHelperPreScale = Main.axesHelperPostScale;
        });

        let folderGridhelper = gui.addFolder('Gridhelper');

        this.gridHelperV = gridHelper.visible;
        folderGridhelper.add({ Gridhelper: this.gridHelperV }, 'Gridhelper').onChange((value) => {
            this.gridHelperV = value;
            if (this.gridHelperV == true) {
                gridHelper.visible = true;
            }
            if (this.gridHelperV == false) {
                gridHelper.visible = false;
            }
        });

        folderGridhelper.add(Main, 'size', 10, 10000).name('Size').step(10).onChange((value) => {
            Main.gridHelperPostSize = value;

            gridHelper.scale.set(gridHelper.scale.x / Main.gridHelperPreSize * value, gridHelper.scale.y / Main.gridHelperPreSize * value,
                gridHelper.scale.z / Main.gridHelperPreSize * value);  // Scalierung / Vor Letzter Scalierung -> Grundgröße -> Grundgröße * value (Wert Schieberegler) -> Skallierung um den wert

            Main.gridHelperPreSize = Main.gridHelperPostSize;
        });

        gui.add({ Play: this.planetanimation }, 'Play').onChange((value) => {
            this.planetanimation = value;
        });

        // Laden eines Fotos des Sternenhimmels als Texture 
        var foto = 'assets/8k_stars_milky_way.jpg';
        var texture = new THREE.TextureLoader().load(foto);
        // Erstellen einer Skybox-Geometrie 
        var geometry = new THREE.SphereGeometry(Main.starsizePost, 64, 64);
        // Erstellen Sie ein Skybox-Material mit der CubeTexture 
        var material = new THREE.MeshBasicMaterial({
            map: texture, side: THREE.BackSide
            // Die Innenseite der Skybox anzeigen 
        });
        // Erstellen eines Skybox-Mesh mit der Geometrie und dem Material 
        var skybox = new THREE.Mesh(geometry, material);
        this.scene.add(skybox);

        let folderPerformance = gui.addFolder('Performance-Settings');

        folderPerformance.add(Main, 'renderdistance', 100000, 10000000).name('Renderdistance').step(100000).onChange((value) => {
            Main.renderdistance = value;

            this.camera.far = Main.renderdistance; // Ändert die maximale Renderdistanz (z. B. auf 10000 Einheiten)

            this.camera.updateProjectionMatrix(); // Aktualisiert die Projektionsmatrix
        });


        folderPerformance.add(Main, 'starsizePost', 100000, 100000000).name('Stars-Distance').step(100000).onChange((value) => {
            Main.starsizePost = value;

            skybox.scale.set(skybox.scale.x / Main.starsizePre * Main.starsizePost, skybox.scale.y / Main.starsizePre * Main.starsizePost,
                skybox.scale.z / Main.starsizePre * Main.starsizePost)

            Main.starsizePre = Main.starsizePost;
        });

        folderPerformance.open();



        let rotationTimefactor = gui.addFolder('Timefactor Rotation');

        this.isClickedY = false;  // da start mit einstellungen auf day nicht year

        rotationTimefactor.add(Main, 'YorDtimefactor', 0, 1).name('0 = Days / 1 = Years').step(1).onChange((value) => {
            Main.YorDtimefactor = value;

            if (Main.YorDtimefactor == 0 && this.isClickedY == true) {
                Main.timefactor /= 365;
                this.isClickedY = false;
                Main.flextime = Main.timefactor;
            }
            if (Main.YorDtimefactor == 1 && this.isClickedY == false) {
                Main.timefactor *= 365;
                this.isClickedY = true;
                Main.flextime = Main.timefactor;
            }

        });

        rotationTimefactor.add(Main, 'timePostfactor', 1, 1000).name('x * Days / Years').step(1).onChange((value) => {
            Main.timePostfactor = value;

            Main.timefactor = Main.timefactor * Main.timePostfactor / Main.timePrefactor;  // wieder durch vorherigen wert teilen dass wieder Grundwert und dann multiplizieren dass gewünschten

            Main.timePrefactor = Main.timePostfactor;


            Main.flextime = Main.timefactor;
        });

        rotationTimefactor.open(); // Öffne den Ordner


        let orbit = gui.addFolder('Orbit - - - ! Performance can go down !');

        // Erstellen eines Objekts, das den Schiebereglerwert enthält
        const slider = {
            "Color-orbit": 50, // Schiebereglerwert
        };
        // Erstellen einer Funktion, die die Farbe des Objekts basierend auf dem Schiebereglerwert berechnet
        function calculateColor(value: any) {
            // Definieren der Farbkomponenten
            let r = 0, g = 0, b = 0;
            // Definieren der Farbabschnitte
            const sections = 6;
            // Berechnen der Abschnitt, in dem sich der Wert befindet
            const section = Math.floor(value / (256 / sections));
            // Berechnen des Restwerts innerhalb des Abschnitts
            const remainder = value % (256 / sections);
            // Berechnen des Faktors, mit dem die Farbkomponenten multipliziert werden
            const factor = remainder / (256 / sections);
            // Zuweisen der Farbkomponenten basierend auf dem Abschnitt
            switch (section) {
                case 0:
                    // Rot nach Gelb
                    r = 255;
                    g = factor * 255;
                    b = 0;
                    break;
                case 1:
                    // Gelb nach Grün
                    r = 255 - factor * 255;
                    g = 255;
                    b = 0;
                    break;
                case 2:
                    // Grün nach Cyan
                    r = 0;
                    g = 255;
                    b = factor * 255;
                    break;
                case 3:
                    // Cyan nach Blau
                    r = 0;
                    g = 255 - factor * 255;
                    b = 255;
                    break;
                case 4:
                    // Blau nach Magenta
                    r = factor * 255;
                    g = 0;
                    b = 255;
                    break;
                case 5:
                    // Magenta nach Rot
                    r = 255;
                    g = 0;
                    b = 255 - factor * 255;
                    break;
            }
            // Rückgabe der Farbkomponenten als Array
            return [r, g, b];
        }

        // Erstellen eines Schiebereglers, der den Wert zwischen 0 und 255 ändert, und ihn an die Eigenschaften des Objekts einbinden
        orbit.add(slider, 'Color-orbit', 0, 255).onChange((value) => {
            // Aufufen der calculateColor-Funktion auf, um die Farbe des Objekts zu berechnen
            const [r, g, b] = calculateColor(value);
            // Ändern der Farbe des Objekts, durch anpassen Farbkomponenten
            linemercury.material.color.setRGB(r / 255, g / 255, b / 255);
        });

        orbit.add({ Mercury: this.orbitmercury }, 'Mercury').onChange((value) => {

            this.orbitmercury = value;
            if (this.orbitmercury == false) {
                pointsmercury.length = 0;
                linemercury.clear;
            }
        });
        orbit.add({ Venus: this.orbitvenus }, 'Venus').onChange((value) => {
            this.orbitvenus = value;
            if (this.orbitvenus == false) {
                pointsvenus.length = 0;
                linevenus.clear;
                console.log(pointsvenus);
            }
        });
        orbit.add(slider, 'Color-orbit', 0, 255).onChange((value) => {
            const [r, g, b] = calculateColor(value);
            linevenus.material.color.setRGB(r / 255, g / 255, b / 255);
        });

        orbit.add({ Earth: this.orbitearth }, 'Earth').onChange((value) => {
            this.orbitearth = value;
            if (this.orbitearth == false) {
                pointsearth.length = 0;
                lineearth.clear;
            }
        });
        orbit.add(slider, 'Color-orbit', 0, 255).onChange((value) => {
            const [r, g, b] = calculateColor(value);
            lineearth.material.color.setRGB(r / 255, g / 255, b / 255);
        });

        orbit.add({ Mars: this.orbitmars }, 'Mars').onChange((value) => {
            this.orbitmars = value;
            if (this.orbitmars == false) {
                pointsmars.length = 0;
                linemars.clear;
            }
        });
        orbit.add(slider, 'Color-orbit', 0, 255).onChange((value) => {
            const [r, g, b] = calculateColor(value);
            linemars.material.color.setRGB(r / 255, g / 255, b / 255);
        });

        orbit.add({ Jupiter: this.orbitjupiter }, 'Jupiter').onChange((value) => {
            this.orbitjupiter = value;
            if (this.orbitjupiter == false) {
                pointsjupiter.length = 0;
                linejupiter.clear;
            }
        });
        orbit.add(slider, 'Color-orbit', 0, 255).onChange((value) => {
            const [r, g, b] = calculateColor(value);
            linejupiter.material.color.setRGB(r / 255, g / 255, b / 255);
        });

        orbit.add({ Saturn: this.orbitsaturn }, 'Saturn').onChange((value) => {
            this.orbitsaturn = value;
            if (this.orbitsaturn == false) {
                pointssaturn.length = 0;
                linesaturn.clear;
            }
        });
        orbit.add(slider, 'Color-orbit', 0, 255).onChange((value) => {
            const [r, g, b] = calculateColor(value);
            linesaturn.material.color.setRGB(r / 255, g / 255, b / 255);
        });

        orbit.add({ Uranus: this.orbituranus }, 'Uranus').onChange((value) => {
            this.orbituranus = value;
            if (this.orbituranus == false) {
                pointsuranus.length = 0;
                lineuranus.clear;
            }
        });
        orbit.add(slider, 'Color-orbit', 0, 255).onChange((value) => {
            const [r, g, b] = calculateColor(value);
            lineuranus.material.color.setRGB(r / 255, g / 255, b / 255);
        });

        orbit.add({ Neptune: this.orbitneptune }, 'Neptune').onChange((value) => {
            this.orbitneptune = value;
            if (this.orbitneptune == false) {
                pointsneptune.length = 0;
                lineneptune.clear;
            }
        });
        orbit.add(slider, 'Color-orbit', 0, 255).onChange((value) => {
            const [r, g, b] = calculateColor(value);
            lineneptune.material.color.setRGB(r / 255, g / 255, b / 255);
        });

        orbit.open();

        // für die Bahn farbig verfolgen
        this.scene.add(linemercury);
        this.scene.add(linevenus);
        this.scene.add(lineearth);
        this.scene.add(linemars);
        this.scene.add(linejupiter);
        this.scene.add(linesaturn);
        this.scene.add(lineuranus);
        this.scene.add(lineneptune);

        // Erstellen eines PointLights und seine Position auf den Ursprung setzen
        var sunLight = new THREE.PointLight(0xffffff, 1, 0, 0);
        // Durch Setzen des vierten Parameters der PointLight auf 0 wird das Licht unendlich weit ausgestrahlt
        sunLight.position.set(0, 0, 0);
        // Schatten setzen
        sunLight.castShadow = true;
        sunLight.receiveShadow = true;
        this.scene.add(sunLight);

        this.initCelestialBodies();

        this.setCameraPosition(0, 10*25e5, 10*150e5);

        this.controls.update();

        this.isFirstStep = true;

        this.startAnimation();


    }

    setCameraPosition(x: number, y: number, z: number) {
        this.camera.position.set(x / Main.factor, y / Main.factor, z / Main.factor);
    }

    initCelestialBodies() {

        let sun = new CelestialBody("sun", this.scene, 6.7957e5 * 1e1 * 5 /*nur *1e1*5 stat * Main.factor = 1e5 da sonst zu groß*/, 1.989e30, 25.38/*Tage*/, '/assets/Solarsystemscope_texture_8k_sun.jpg', 'star',
            0, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(sun);

        //kleinstes bekanntes schwarzes Loch - größerer Radius um es sichtbar zu machen 
        //let lightestblackhole = new CelestialBody("lightestblackhole", this.scene, 3e6, 3*1.989e30, 100000, '0x000000', 'star', 0, 0, 0, new THREE.Vector3(0, 0, 0));
        //this.celestialBodies.push(lightestblackhole);  //https://www.space.com/dark-black-hole-wandering-milky-way-smallest-yet
        
        //let blackhole = new CelestialBody("blackhole", this.scene, 3e6, 10*1.989e30, 100000, 0x000000, 'star', 0, 0, 0, new THREE.Vector3(0, 0, 0));
        //this.celestialBodies.push(blackhole);   //impact: Planeten Merkur, Venus, Erde und Mars aus Bahn Katapultiert wenn Sonne plötzlich ersetzt würde durch dieses 

        //Wie aus Sonne möglicherweise werden
        //let redgiant = new CelestialBody("redgiant", this.scene, 140e6, 1/2*1.989e30, 100000, 0xff9933, 'star', 0, 0, 0, new THREE.Vector3(0, 0, 0));
        //this.celestialBodies.push(redgiant);

        //Wie aus Sonne möglicherweise werden
        //let whitedwarf = new CelestialBody("whitedwarf", this.scene, 3e6, 1.4*1e30, 100000, 0xffeeaa, 'star', 0, 0, 0, new THREE.Vector3(0, 0, 0));
        //this.celestialBodies.push(whitedwarf);

        //let blackhole = new CelestialBody("blackhole", this.scene, 7.052e5, 4.868e24/**1e7*/, 100, '/assets/Solarsystemscope_texture_8k_sun.jpg', 'planet',
        //    0, 0, 0, new THREE.Vector3(0, 0, 0));
        //this.celestialBodies.push(blackhole);
        //blackhole.v.set(/*3.388605920074e+01*3.6*/0, /*-2.317952519386e+01*3.6*/0, /*-1.264507241726e+01*3.6*100*/-35.02 * 1e3 * 3.6 / 1e4);
        //blackhole.acceleration.set(-0.0063 * 3.6, 0, 0);

        //Multi star system
        //let sun1 = new CelestialBody("sun1", this.scene, 0.5*6.7957e5 * 1e1, 1*1.989e30, 25.38/*Tage*/, '/assets/Solarsystemscope_texture_8k_sun.jpg', 'planet',
        //    1e10/1e3, 0, 0, new THREE.Vector3(0, 0, 0));
        //this.celestialBodies.push(sun1);
        //sun1.v.set(0, 0, -23.4        * 1e3 * 3.6 / 1e4);
        //sun1.acceleration.set(0, 0, 4.3*3.6);
        //let sun2 = new CelestialBody("sun2", this.scene, 0.3*6.7957e5 * 1e1, 0.5*1.989e30, 25.38/*Tage*/, '/assets/Solarsystemscope_texture_8k_sun.jpg', 'planet',
        //    -1.99e10/1e3, 0, 0, new THREE.Vector3(0, 0, 0));
        //this.celestialBodies.push(sun2);
        //sun2.v.set(0, 0, 46.8               * 1e3 * 3.6 / 1e4);
        //sun2.acceleration.set(0, 0, -8.65*3.6);



        let mercury = new CelestialBody("mercury", this.scene, 2.44e3 * Main.factorRadius, 3.285e23/**1e7*/, 58.6/*Tage*/ /*Main.time*/ /*rotation eigene Achse*/, '/assets/8k_mercury.jpg', 'planet',
            46 * 1e6, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(mercury);
        mercury.v.set(0, 0, -58.98 * 1e3 * 3.6 / 1e4);
        mercury.acceleration.set(-0.0058 * 3.6, 0, 0);

        let venus = new CelestialBody("venus", this.scene, 6.052e3 * Main.factorRadius, 4.868e24/**1e7*/, 243 /*Tage*/ /*rotation eigene Achse*/, '/assets/4k_venus_atmosphere.jpg', 'planet',
            107.6 * 1e6, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(venus);
        venus.v.set(0, 0, -35.02 * 1e3 * 3.6 / 1e4);
        venus.acceleration.set(-0.0063 * 3.6, 0, 0);
     
        let earth = new CelestialBody("earth", this.scene, 6.371e3 * Main.factorRadius, 5.97e24/**1e7*/, 1/*Tage*/ /*rotation eigene Achse*/, 'assets/8k_earth_daymap.jpg', 'planet',
            147.1 * 1e6, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(earth);
        earth.v.set(0, 0, -30.29 * 1e3 * 3.6 / 1e4);
        earth.acceleration.set(-0.0059 * 3.6, 0, 0);

        let mars = new CelestialBody("mars", this.scene, 3.397e3 * Main.factorRadius, 6.4185e23/**1e7*/, 1.03/*Tage*/ /*rotation eigene Achse*/, '/assets/8k_mars.jpg', 'planet',
            206.6 * 1e6, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(mars);
        mars.v.set(0, 0, -26.5 * 1e3 * 3.6 / 1e4);
        mars.acceleration.set(-0.0043 * 3.6, 0, 0);

        //Jupiter ist der massereichste Planet im Sonnensystem. Er ist etwa 2,5-mal so massereich wie alle anderen sieben Planeten zusammen. Er ist der einzige Planet des Sonnensystems, dessen gemeinsamer Schwerpunkt mit der Sonne mit etwa 1,068 Sonnenradien leicht außerhalb der Sonne liegt.
        let jupiter = new CelestialBody("jupiter", this.scene, 69.911e3 * Main.factorRadius, 1.9e27/**1e7*/, 0.41/*Tage*/ /*rotation eigene Achse*/, '/assets/8k_jupiter.jpg', 'planet',
            740.52 * 1e6, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(jupiter);
        jupiter.v.set(0, 0, -13.72 * 1e3 * 3.6 / 1e4);
        jupiter.acceleration.set(-0.0024 * 3.6, 0, 0);

        let saturn = new CelestialBody("saturn", this.scene, 58.232e3 * Main.factorRadius, 5.685e26/**1e7*/, 0.44/*Tage*/ /*rotation eigene Achse*/, '/assets/8k_saturn.jpg', 'planet',
            1352.6 * 1e6, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(saturn);
        saturn.v.set(0, 0, -9.69 * 1e3 * 3.6 / 1e4);
        saturn.acceleration.set(-0.0021 * 3.6, 0, 0);

        let uranus = new CelestialBody("uranus", this.scene, 25.362e3 * Main.factorRadius, 8.683e25/**1e7*/, 0.72/*Tage*//*rotation eigene Achse*/, '/assets/2k_uranus.jpg', 'planet',
            2734.8 * 1e6, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(uranus);
        uranus.v.set(0, 0, -6.81 * 1e3 * 3.6 / 1e4);
        uranus.acceleration.set(-0.0019 * 3.6, 0, 0);

        let neptune = new CelestialBody("neptune", this.scene, 24.622e3 * 1e3, 1.02e26/**1e7*/, 0.67/*Tage*//*rotation eigene Achse*/, '/assets/2k_uranus.jpg', 'planet',
            4452.9 * 1e6, 0, 0, new THREE.Vector3(0, 0, 0));
        this.celestialBodies.push(neptune);
        neptune.v.set(0, 0, -5.43 * 1e3 * 3.6 / 1e4);
        neptune.acceleration.set(-0.0011 * 3.6, 0, 0);
    }
     

    //animation in 60 pro sekunde -> 3600 pro minute
    startAnimation() {
        let that = this;
        let f = () => {
            requestAnimationFrame(f);

            if (that.planetanimation == true) {  // damit pausieren über UI
                that.step(that.isFirstStep);
                that.isFirstStep = false;

                that.celestialBodies.forEach(cb => cb.updateArrows());

                that.rotateCelestialBodies();
            }

            this.updateorbit(); // Bahn farbig

            // Aktualisiere das OrbitControl-Objekt
            that.controls.update();

            that.stats.update();
            that.renderer.render(that.scene, that.camera);

        }

        f();
    }


    updateorbit() {
        for (let body of this.celestialBodies) {

            if (body.name == "mercury" && this.orbitmercury) {
                pointsmercury.push(body.mesh.position.clone());
                // Die Attribute der Liniengeometrie auf das Array von Punkten setzen
                linemercury.geometry.setFromPoints(pointsmercury);
            }
            if (body.name == "venus" && this.orbitvenus) {
                pointsvenus.push(body.mesh.position.clone());
                linevenus.geometry.setFromPoints(pointsvenus);
            }
            if (body.name == "earth" && this.orbitearth) {
                pointsearth.push(body.mesh.position.clone());
                lineearth.geometry.setFromPoints(pointsearth);
            }
            if (body.name == "mars" && this.orbitmars) {
                pointsmars.push(body.mesh.position.clone());
                linemars.geometry.setFromPoints(pointsmars);
            }
            if (body.name == "jupiter" && this.orbitjupiter) {
                pointsjupiter.push(body.mesh.position.clone());
                linejupiter.geometry.setFromPoints(pointsjupiter);
            }
            if (body.name == "saturn" && this.orbitsaturn) {
                pointssaturn.push(body.mesh.position.clone());
                linesaturn.geometry.setFromPoints(pointssaturn);
            }
            if (body.name == "uranus" && this.orbituranus) {
                pointsuranus.push(body.mesh.position.clone());
                lineuranus.geometry.setFromPoints(pointsuranus);
            }
            if (body.name == "neptune" && this.orbitneptune) {
                pointsneptune.push(body.mesh.position.clone());
                lineneptune.geometry.setFromPoints(pointsneptune);
            }
        }
    }

    rotateCelestialBodies() {
        for (let body of this.celestialBodies) {
            if (body && body.mesh) {
                body.mesh.rotation.y += 360 / (body.rotation * 24) * Math.PI / 180 / 60 * Main.timefactor; // letztes /60 wegen 60 mal pro sekunde aufgerufen
            }
        }
    }


    step(isFirstStep: boolean) {

        for (let body1 of this.celestialBodies) {

            // step1: calculate force acting on body1
            let fx: number = 0;
            let fy: number = 0;
            let fz: number = 0;

            for (let body2 of this.celestialBodies) {

                if (body2 == body1) continue;

                let d = this.distance(body1, body2);
                let f = this.G * body1.massKg * body2.massKg / (d * d);   // Absolute value of f  -> in Newton   kg*m / s²

                let unitVectorF = body1.getUnitVectorTo(body2);

                fx += f * unitVectorF.x;
                fy += f * unitVectorF.y;
                fz += f * unitVectorF.z;

            }

            // step2: calculate acceleration of body1
            body1.acceleration.setX(fx / body1.massKg);
            body1.acceleration.setY(fy / body1.massKg);
            body1.acceleration.setZ(fz / body1.massKg);

        }

        // step3: calculate new velocity
        let dt = this.epsilon;
        if (isFirstStep) dt /= 2;

        for (let body of this.celestialBodies) {
            body.v.setX(body.v.x + body.acceleration.x * dt * Main.flextime);
            body.v.setY(body.v.y + body.acceleration.y * dt * Main.flextime);
            body.v.setZ(body.v.z + body.acceleration.z * dt * Main.flextime);
        }


        //step 4: calculate new position

        for (let body of this.celestialBodies) {


            if (body.sunOrPlanet == "planet") {   // wenn man sonne bewegung vernachlässigt

                body.setPosition(
                    (body.getX() + body.v.x * this.epsilon * Main.flextime),
                    (body.getY() + body.v.y * this.epsilon * Main.flextime),
                    (body.getZ() + body.v.z * this.epsilon * Main.flextime)
                )

            }
        }

    }

    distance(body1: CelestialBody, body2: CelestialBody): number {
        let dx = body1.getX() - body2.getX();
        let dy = body1.getY() - body2.getY();
        let dz = body1.getZ() - body2.getZ();
        return Math.sqrt(dx * dx + dy * dy + dz * dz) * Main.factor;
    }

}

new Main();
