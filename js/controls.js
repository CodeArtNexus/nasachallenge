// Agregar controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enableRotate = true; // Habilitar rotación en la vista inicial
controls.target.set(centralSphere.position.x, centralSphere.position.y, centralSphere.position.z);
controls.update();

let currentTarget = centralSphere; // El objetivo actual es la esfera central

// Raycaster y mouse para detectar clics en los planetas
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Función para seleccionar un planeta y aislarlo
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(circleMeshes.filter(mesh => mesh.visible));

    if (intersects.length > 0) {
        const intersected = intersects[0].object;

        // Detener el movimiento de los otros planetas y ocultarlos
        isPlanetSelected = true;
        selectedPlanet = intersected; // Guardar el planeta seleccionado

        // Ocultar todos los demás planetas y órbitas, así como la esfera central
        circleMeshes.forEach(mesh => {
            if (mesh !== selectedPlanet) {
                mesh.visible = false;
            }
        });
        orbitLines.forEach(line => {
            line.visible = false; // Ocultar órbitas
        });
        centralSphere.visible = false; // Ocultar la esfera central

        // Mover el planeta a la izquierda y hacer zoom sobre él
        gsap.to(camera.position, {
            duration: 1,
            x: intersected.position.x - 3,  // Moverlo a la izquierda
            y: intersected.position.y,
            z: intersected.position.z,
            onUpdate: () => {
                camera.lookAt(intersected.position);
            }
        });

        // Cambiar el centro a este objeto para que el usuario pueda rotarlo
        controls.target.set(intersected.position.x, intersected.position.y, intersected.position.z);
        controls.enableRotate = true;  // Habilitar la rotación manual del planeta
        controls.update();
        currentTarget = intersected;

        // Mostrar el canvas con información adicional
        const infoBox = document.getElementById("infoBox");
        const infoCanvas = document.getElementById("infoCanvas");
        infoBox.style.display = 'block'; // Mostrar el recuadro

        // Escribir un texto de prueba en el canvas
        const ctx = infoCanvas.getContext('2d');
        ctx.clearRect(0, 0, infoCanvas.width, infoCanvas.height); // Limpiar el canvas
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Información del planeta seleccionado', 20, 50); // Texto de prueba

        // Ocultar todos los botones excepto el de "Home"
        toggleButtonsForPlanetView();
    }
});

// Función para alternar entre pausa y play
document.getElementById("pausePlay").addEventListener("click", function() {
    isPaused = !isPaused;
    const icon = this.querySelector('i');
    icon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
});

// Función para cambiar la velocidad
document.getElementById("speedControl").addEventListener("click", () => {
    animationSpeed = animationSpeed === 0.01 ? 0.02 : 0.01;
    document.getElementById("speedControl").innerText = animationSpeed === 0.01 ? "x2 Velocidad" : "Velocidad Normal";
});

// Mostrar/Ocultar órbitas
document.getElementById("toggleOrbits").addEventListener("click", () => {
    orbitLines.forEach(line => {
        line.visible = !line.visible;
    });
});

// Mostrar/Ocultar planetas y desactivar/activar su interactividad
document.getElementById("togglePlanets").addEventListener("click", () => {
    circleMeshes.forEach(planet => {
        if (planet !== selectedPlanet) {
            planet.visible = !planet.visible;
        }
    });
    raycaster.setFromCamera(mouse, camera);  // Actualizar el raycaster para evitar la interacción con planetas ocultos
});

// Zoom in y Zoom out
document.getElementById("zoomIn").addEventListener("click", () => {
    camera.fov -= 5;
    camera.updateProjectionMatrix();
});

document.getElementById("zoomOut").addEventListener("click", () => {
    camera.fov += 5;
    camera.updateProjectionMatrix();
});

// Resetear el centro y restaurar todos los planetas visibles
document.getElementById("resetCenter").addEventListener("click", () => {
    gsap.to(camera.position, {
        duration: 1,
        x: centralSphere.position.x + 5,
        y: centralSphere.position.y + 5,
        z: centralSphere.position.z + 5,
        onUpdate: () => {
            camera.lookAt(centralSphere.position);
        }
    });

    controls.target.set(centralSphere.position.x, centralSphere.position.y, centralSphere.position.z);
    controls.update();
    currentTarget = centralSphere;

    // Restaurar la visibilidad de todos los planetas y órbitas
    circleMeshes.forEach(mesh => {
        mesh.visible = true;
    });
    orbitLines.forEach(line => {
        line.visible = true; // Mostrar órbitas nuevamente
    });
    centralSphere.visible = true; // Mostrar la esfera central nuevamente

    // Ocultar el canvas y restablecer el estado de los planetas
    const infoBox = document.getElementById("infoBox");
    infoBox.style.display = 'none';  // Ocultar el recuadro y el canvas

    // Restaurar la barra de controles a su estado original
    toggleButtonsForCentralView();

    // Reiniciar las variables
    isPlanetSelected = false;
    selectedPlanet = null;
    controls.enableRotate = true; // Mantener habilitada la rotación manual de la escena inicial
});

// Función para mostrar/ocultar botones en la vista de planeta
function toggleButtonsForPlanetView() {
    document.getElementById("toggleOrbits").style.display = 'none';
    document.getElementById("togglePlanets").style.display = 'none';
    document.getElementById("zoomIn").style.display = 'none';
    document.getElementById("zoomOut").style.display = 'none';
    document.getElementById("speedControl").style.display = 'none';
    document.getElementById("pausePlay").style.display = 'none';
}

// Función para restaurar los botones en la vista central
function toggleButtonsForCentralView() {
    document.getElementById("toggleOrbits").style.display = 'inline-block';
    document.getElementById("togglePlanets").style.display = 'inline-block';
    document.getElementById("zoomIn").style.display = 'inline-block';
    document.getElementById("zoomOut").style.display = 'inline-block';
    document.getElementById("speedControl").style.display = 'inline-block';
    document.getElementById("pausePlay").style.display = 'inline-block';
}
