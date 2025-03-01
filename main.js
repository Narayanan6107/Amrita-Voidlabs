// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 200);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('textures/2k_sun.jpg');
const earthTexture = textureLoader.load('textures/2k_earth_daymap.jpg');

// Create Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture, emissive: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.name = "sun";
scene.add(sun);

// Function to create planets
function createPlanet(size, texture, distance, speed, name) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);
    planet.name = name;
    planet.position.set(distance, 0, 0);
    return { planet, distance, angle: Math.random() * Math.PI * 2, speed };
}

// Create Planets
const planets = [
    createPlanet(3, earthTexture, 50, 0.01, "earth")
];

// Add Planets to Scene
planets.forEach(p => scene.add(p.planet));

// Click Detection for Teleportation
document.addEventListener("mousedown", (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        const planetName = clickedPlanet.name;
        teleportToPlanet(planetName);
    }
});

// Function to teleport into the planet's environment
function teleportToPlanet(planetName) {
    if (planetName === "earth") {
        gsap.to(camera.position, { x: 0, y: 10, z: 5, duration: 2, onComplete: () => {
            loadPlanetEnvironment(planetName);
        }});
    } else if (planetName === "sun") {
        gsap.to(camera.position, { x: 0, y: 20, z: 5, duration: 2, onComplete: () => {
            loadPlanetEnvironment(planetName);
        }});
    }
}

// Function to load planet-specific environment
function loadPlanetEnvironment(planetName) {
    // Remove all objects (except camera & light)
    scene.children.forEach(obj => {
        if (obj !== camera && obj !== ambientLight && obj !== pointLight) {
            scene.remove(obj);
        }
    });

    // Show "Go Back" button
    document.getElementById("backButton").style.display = "block";

    if (planetName === "earth") {
        createEarthEnvironment();
    } else if (planetName === "sun") {
        createSunEnvironment();
    }
}

// Earth Environment
function createEarthEnvironment() {
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const treeGeo = new THREE.CylinderGeometry(1, 1, 10, 12);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const tree = new THREE.Mesh(treeGeo, treeMat);
    tree.position.set(0, 5, 0);
    scene.add(tree);
}

// Sun Environment
function createSunEnvironment() {
    const fireGeo = new THREE.SphereGeometry(10, 32, 32);
    const fireMat = new THREE.MeshBasicMaterial({ map: sunTexture, emissive: 0xffff00 });
    const sunFire = new THREE.Mesh(fireGeo, fireMat);
    scene.add(sunFire);
}

// Go Back to Solar System
function goBack() {
    document.getElementById("backButton").style.display = "none";

    // Remove current environment
    scene.children.forEach(obj => {
        if (obj !== camera && obj !== ambientLight && obj !== pointLight) {
            scene.remove(obj);
        }
    });

    // Restore Solar System
    scene.add(sun);
    planets.forEach(p => scene.add(p.planet));

    // Move Camera Back
    gsap.to(camera.position, { x: 0, y: 50, z: 200, duration: 2 });
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    sun.rotation.y += 0.001;
    planets.forEach(p => {
        p.angle += p.speed;
        p.planet.position.set(Math.cos(p.angle) * p.distance, 0, Math.sin(p.angle) * p.distance);
    });
    renderer.render(scene, camera);
}
animate();
