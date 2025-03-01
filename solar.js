// Initialize Scene
const scene = new THREE.Scene();

// Initialize Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 150);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('/textures/8k_sun.jpg');
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('/textures/2k_mars.jpg');
const jupiterTexture = textureLoader.load('/textures/2k_jupiter.jpg');
const saturnTexture = textureLoader.load('/textures/2k_saturn.jpg');
const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg');
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg');
const uranusTexture = textureLoader.load('/textures/2k_uranus.jpg');
const neptuneTexture = textureLoader.load('/textures/2k_neptune.jpg');

// Milky Way Background
const milkyWayTexture = textureLoader.load('/textures/2k_stars_milky_way.jpg'); // Add your own texture
scene.background = milkyWayTexture;

// Create Sun
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function to create planets
function createPlanet(name, size, texture, distance, speed) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = { name }; // Store planet name for labeling
    return { planet, distance, angle: Math.random() * Math.PI * 2, speed };
}

// Create Planets
const planets = [
    createPlanet("Mercury", 1.5, mercuryTexture, 15, 0.02),
    createPlanet("Venus", 2, venusTexture, 25, 0.015),
    createPlanet("Earth", 2.5, earthTexture, 35, 0.01),
    createPlanet("Mars", 2, marsTexture, 45, 0.008),
    createPlanet("Jupiter", 5, jupiterTexture, 65, 0.005),
    createPlanet("Saturn", 4.5, saturnTexture, 85, 0.004),
    createPlanet("Uranus", 3.5, uranusTexture, 105, 0.003),
    createPlanet("Neptune", 3, neptuneTexture, 125, 0.002),
];

// Add Planets to Scene
planets.forEach(p => scene.add(p.planet));


// Raycasting for hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const label = document.getElementById('planetLabel');

window.addEventListener('mousemove', (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update label position near the cursor
    label.style.left = `${event.clientX + 10}px`;
    label.style.top = `${event.clientY + 10}px`;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the Sun
    sun.rotation.y += 0.001;

    // Move Planets
    planets.forEach(p => {
        p.angle += p.speed;
        p.planet.position.set(Math.cos(p.angle) * p.distance, 0, Math.sin(p.angle) * p.distance);
    });

    // Raycasting to detect hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets.map(p => p.planet));

    if (intersects.length > 0) {
        const planet = intersects[0].object;
        label.innerText = planet.userData.name;
        label.style.display = 'block';
    } else {
        label.style.display = 'none';
    }

    renderer.render(scene, camera);
}

// Start Animation
animate();
