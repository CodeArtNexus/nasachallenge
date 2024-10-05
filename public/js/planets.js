document.addEventListener("DOMContentLoaded", () => {
    // Tu código de addEventListener aquí
});

// Definir variables globales
let animationSpeed = 0.01; 
let isPaused = false;
let isPlanetSelected = false; 
let selectedPlanetVerify = null; 
let timeFactor = 1;

// Definir controles orbitales para mover la cámara
controls.enableDamping = true; // Suaviza el movimiento
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Planetas
const planets = [
    { name: "Sol", size: 1, radius: 0, modelPath: "modelos/sol.glb", rotationSpeed: 0.01 },
    { name: "Mercurio", size: 0.3, radius: 5.8, modelPath: "modelos/mercurio.glb", rotationSpeed: 0.02 },
    { name: "Venus", size: 0.4, radius: 10.8, modelPath: "modelos/venus.glb", rotationSpeed: 0.01 },
    { name: "Tierra", size: 0.5, radius: 15, modelPath: "modelos/tierra.glb", rotationSpeed: 0.02 },
    { name: "Marte", size: 0.4, radius: 22.8, modelPath: "modelos/marte.glb", rotationSpeed: 0.03 },
    { name: "Júpiter", size: 0.9, radius: 77.8, modelPath: "modelos/jupiter.glb", rotationSpeed: 0.01 },
    { name: "Saturno", size: 0.8, radius: 143, modelPath: "modelos/saturno.glb", rotationSpeed: 0.02 },
    { name: "Urano", size: 0.7, radius: 287, modelPath: "modelos/urano.glb", rotationSpeed: 0.01 },
    { name: "Neptuno", size: 0.7, radius: 450, modelPath: "modelos/neptuno.glb", rotationSpeed: 0.01 },
    { name: "Plutón", size: 0.2, radius: 590, modelPath: "modelos/pluton.glb", rotationSpeed: 0.02 }
];

const loader = new THREE.GLTFLoader();
let circleMeshes = []; // Mallas de los planetas
let colliders = []; // Esferas transparentes para colisiones

// Cargar modelos de planetas
planets.forEach((planet) => {
    loader.load(planet.modelPath, (gltf) => {
        const mesh = gltf.scene;
        mesh.scale.set(planet.size, planet.size, planet.size);
        mesh.userData = {
            name: planet.name,
            radius: planet.radius,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: planet.rotationSpeed
        };
        scene.add(mesh);
        circleMeshes.push(mesh); // Agregar la malla del planeta al array

        // Crear un collider para el planeta
        const colliderGeometry = new THREE.SphereGeometry(planet.size * 1.5); // Aumentar el tamaño del collider
        const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
        const collider = new THREE.Mesh(colliderGeometry, colliderMaterial);
        collider.position.copy(mesh.position); // Colocar el collider en la misma posición que el planeta

        // Agregar userData al collider
        collider.userData = { name: planet.name }; // Asignar el nombre del planeta al collider

        scene.add(collider); // Agregar el collider a la escena
        colliders.push(collider); // Agregar el collider al array
    });
});

// Rotación y órbitas de los planetas
function rotatePlanets() {
    if (!isPaused && !isPlanetSelected) {
        circleMeshes.forEach(mesh => {
            mesh.userData.angle += animationSpeed * timeFactor;
            mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;
            mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.radius;
            mesh.rotation.y += mesh.userData.rotationSpeed; 
        });

        // Actualizar la posición de los colliders para que sigan a los planetas
        colliders.forEach((collider, index) => {
            const planetMesh = circleMeshes[index];
            collider.position.copy(planetMesh.position); // Sincronizar la posición del collider con la del planeta
        });
    }

    if (selectedPlanetVerify) {
        selectedPlanetVerify.rotation.y += selectedPlanetVerify.userData.rotationSpeed;
    }
}

// Animación continua de los planetas
function animatePlanets() {
    requestAnimationFrame(animatePlanets);
    rotatePlanets();
    controls.update(); // Actualizamos los controles orbitales
    renderer.render(scene, camera);
}

animatePlanets();

// Control del tiempo con el slider
const timeSlider = document.getElementById('time-slider');
timeSlider.addEventListener('input', (event) => {
    const sliderValue = event.target.value;
    timeFactor = sliderValue / 50;
});

// Raycasting y selección de planetas
const raycaster = new THREE.Raycaster(); // Para proyectar el rayo
const mouse = new THREE.Vector2(); // Posición del mouse

// Evento de mousemove para mostrar planeta bajo el cursor
document.addEventListener('mousemove', (event) => {
    // Convertimos las coordenadas del mouse a normalizadas
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Proyectamos el rayo desde la cámara a través del mouse
    raycaster.setFromCamera(mouse, camera);

    // Verificamos las intersecciones con los coliders (esferas transparentes)
    const intersects = raycaster.intersectObjects(colliders, true);

    // Mostrar en consola si hay intersecciones
    if (intersects.length > 0) {
        const intersectedCollider = intersects[0].object;
        console.log(`El mouse está sobre el planeta: ${intersectedCollider.userData.name}`);
    } else {
        console.log("No hay intersección con ningún planeta.");
    }
});

// Evento de mouseup para seleccionar planetas
document.addEventListener('mouseup', (event) => {
    // Comprobar si se hizo clic con el botón izquierdo del ratón
    if (event.button === 0) {
        console.log("Se hizo clic"); // Añadir log para verificar el clic
        // Convertimos las coordenadas del mouse a normalizadas
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Proyectamos el rayo desde la cámara a través del mouse
        raycaster.setFromCamera(mouse, camera);

        // Verificamos las intersecciones con los coliders (esferas transparentes)
        const intersects = raycaster.intersectObjects(colliders, true);

        if (intersects.length > 0) {
            const intersectedCollider = intersects[0].object;
            
            // Buscar el planeta correspondiente
            const intersectedPlanet = circleMeshes.find(mesh => mesh.userData.name === intersectedCollider.userData.name);
            if (intersectedPlanet) {
                console.log('Planeta seleccionado:', intersectedPlanet.userData.name);
                isPlanetSelected = true;
                selectedPlanetVerify = intersectedPlanet; // Guardamos el objeto intersectado

                // Ocultar otros botones y mantener solo los especificados
                hideOtherButtons();

                // Aquí puedes añadir la lógica para centrar la cámara en el planeta seleccionado
                gsap.to(camera.position, {
                    duration: 1,
                    x: intersectedPlanet.position.x - 3,  // Moverlo a la izquierda
                    y: intersectedPlanet.position.y + 1,  // Ajustar la altura
                    z: intersectedPlanet.position.z + 5,  // Ajustar la distancia
                    onUpdate: () => {
                        camera.lookAt(intersectedPlanet.position);
                    }
                });

                // Cambiar el centro a este objeto para que el usuario pueda rotarlo
                controls.target.set(intersectedPlanet.position.x, intersectedPlanet.position.y, intersectedPlanet.position.z);
                controls.enableRotate = true;  // Habilitar la rotación manual del planeta
                controls.update();
            }
        }
    }
});

// Función para ocultar los botones no deseados
function hideOtherButtons() {
    // Obtener todos los botones
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        // Verificar si el botón no es uno de los que se deben mantener
        if (!['pausePlay', 'speedControl', 'toggleOrbits', 'togglePlanets', 'zoomIn', 'zoomOut', 'resetCenter'].includes(button.id)) {
            button.style.display = 'none'; // Ocultar el botón
        }
    });
}

// Función para restablecer la vista y mostrar todos los botones
function resetView() {
    isPlanetSelected = false;
    selectedPlanetVerify = null;

    // Mostrar todos los botones nuevamente
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.display = 'inline-block'; // Mostrar todos los botones
    });
}

// Event listener para el botón "Restablecer Vista"
document.getElementById('resetCenter').addEventListener('click', resetView);
