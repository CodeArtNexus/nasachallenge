// Crear la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Fondo negro inicial

// Crear geometría de las estrellas
const starGeometry = new THREE.BufferGeometry();
const starCount = 2000; // Aumentar el número de estrellas
const starPositions = new Float32Array(starCount * 3); // Array para almacenar las posiciones

for (let i = 0; i < starCount * 3; i++) {
    // Generar posiciones aleatorias para las estrellas
    starPositions[i] = (Math.random() - 0.5) * 2000; // Distribución en un espacio grande
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

// Material para las estrellas
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff, // Color blanco para las estrellas
    size: 0.5, // Tamaño de cada estrella (más pequeño)
    transparent: true,
    opacity: 0.5 // Opacidad inicial
});

// Crear la nube de estrellas
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Variables para el suavizado
let targetOpacity = 0.5;
let currentOpacity = targetOpacity;
const fadeSpeed = 0.005; // Ajusta la velocidad del desvanecimiento

// Animación para el parpadeo
function animateStars() {
    const time = Date.now() * 0.001; // Reducir aún más la velocidad de oscilación

    // Cambiar la opacidad de forma suave
    targetOpacity = 0.4 + 0.3 * Math.sin(time * 0.5); // Oscilar entre 0.4 y 0.7
    currentOpacity += (targetOpacity - currentOpacity) * fadeSpeed; // Suavizado

    starMaterial.opacity = currentOpacity; // Actualizar la opacidad del material

    // Actualizar las posiciones de las estrellas con menor probabilidad
    for (let i = 0; i < starCount; i++) {
        if (Math.random() < 0.002) { // Cambiar posición aleatoria con menor probabilidad
            starPositions[i * 3] = (Math.random() - 0.5) * 2000; // Nueva posición X
            starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000; // Nueva posición Y
            starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // Nueva posición Z
        }
    }

    starGeometry.attributes.position.needsUpdate = true; // Marcar la geometría para actualización

    requestAnimationFrame(animateStars); // Loop de animación
}

animateStars(); // Iniciar el parpadeo


// Luz ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Luz puntual
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//-----------------------------------------------
// Controles de la cámara parte Antonio de la nave

// Crear la nave espacial
const spaceshipGeometry = new THREE.BoxGeometry(1, 0.5, 2);
const spaceshipMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
spaceship.position.set(0, 0, 0);
spaceship.visible = false; // Ocultar la nave 
scene.add(spaceship);

// Posicionar la cámara detrás de la nave para la vista en tercera persona
camera.position.set(0, 2, 5);
camera.lookAt(spaceship.position);

//-----------------------------------------------
const geometrySphere = new THREE.SphereGeometry(1, 32, 32);
const materialSphere = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0 
});
const centralSphere = new THREE.Mesh(geometrySphere, materialSphere);
scene.add(centralSphere); 

const materialRed = new THREE.LineBasicMaterial({ color: 0xff0000 });
const materialBlue = new THREE.LineBasicMaterial({ color: 0x0000ff });
const materialGreen = new THREE.LineBasicMaterial({ color: 0x00ff00 });

const pointsRed = [];
const pointsBlue = [];
const pointsGreen = [];

for (let i = 0; i <= 50; i++) {
    const angle = (i / 50) * Math.PI * 2;
    pointsRed.push(new THREE.Vector3(Math.cos(angle) * 2, 0, Math.sin(angle) * 2));
    pointsBlue.push(new THREE.Vector3(Math.cos(angle) * 3, 0, Math.sin(angle) * 3));
    pointsGreen.push(new THREE.Vector3(Math.cos(angle) * 4, 0, Math.sin(angle) * 4));
}

const geometryRed = new THREE.BufferGeometry().setFromPoints(pointsRed);
const geometryBlue = new THREE.BufferGeometry().setFromPoints(pointsBlue);
const geometryGreen = new THREE.BufferGeometry().setFromPoints(pointsGreen);

const lineRed = new THREE.Line(geometryRed, materialRed);
const lineBlue = new THREE.Line(geometryBlue, materialBlue);
const lineGreen = new THREE.Line(geometryGreen, materialGreen);

scene.add(lineRed);
scene.add(lineBlue);
scene.add(lineGreen);

const orbitLines = [lineRed, lineBlue, lineGreen];

// Inicializar controles
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enableRotate = true;
controls.target.set(0, 0, 0);
controls.update();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
