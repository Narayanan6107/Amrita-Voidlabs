function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const planetName = getQueryParam("planet");

// Initialize Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 100);

// Renderer
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
const earthTexture = textureLoader.load('textures/2k_earth_daymap.jpg');
const sunTexture = textureLoader.load('textures/2k_sun.jpg');

// Load the Selected Planet
let planet;
if (planetName === "earth") {
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: earthTexture });
    planet = new THREE.Mesh(geometry, material);
} else if (planetName === "sun") {
    const geometry = new THREE.SphereGeometry(15, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: sunTexture, emissive: 0xffff00 });
    planet = new THREE.Mesh(geometry, material);
} else {
    console.error("Unknown planet:", planetName);
}

if (planet) {
    scene.add(planet);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    if (planet) planet.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();

// Go Back Button
function goBack() {
    window.location.href = "index.html";
}
