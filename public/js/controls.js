// Agregar controles de órbita
controls.enableZoom = true;
controls.enableRotate = true; // Habilitar rotación en la vista inicial
controls.target.set(0, 0, 0);
controls.update();
// Definir controles orbitales para mover la cámara
controls.enableDamping = true; // Suaviza el movimiento
controls.dampingFactor = 0.25;
controls.enableZoom = true;
let spaceshipControlsActive = false;  // Variable para activar/desactivar controles de la nave

// Manejador para el botón de la nave espacial
document.getElementById("toggleSpaceship").addEventListener("click", () => {
    spaceshipControlsActive = !spaceshipControlsActive;
    spaceship.visible = spaceshipControlsActive; // Mostrar/ocultar la nave

    if (spaceshipControlsActive) {
        document.addEventListener('keydown', handleSpaceshipMovement);
        document.addEventListener('keyup', stopSpaceshipMovement);
    } else {
        document.removeEventListener('keydown', handleSpaceshipMovement);
        document.removeEventListener('keyup', stopSpaceshipMovement);
    }
});
let currentTarget = centralSphere; // El objetivo actual es la esfera central



// const raycaster = new THREE.Raycaster(); // Para proyectar el rayo
// const mouse = new THREE.Vector2(); // Posición del mouse
// let isMouseMoving = false; // Bandera para detectar si la cámara se está moviendo
// let selectedPlanet = null; // Planeta actualmente seleccionado

// // Evento de clic para seleccionar planetas
// document.addEventListener('mousedown', () => {
//     isMouseMoving = false; // Reseteamos la bandera
// });


// // Evento para detectar movimiento del mouse
// window.addEventListener('mousemove', (event) => {
//     // Convertir las coordenadas del mouse a normalizadas
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     // Proyectar el rayo desde la cámara a través del mouse
//     raycaster.setFromCamera(mouse, camera);

//     // Verificar las intersecciones con los planetas
//     const intersects = raycaster.intersectObjects(circleMeshes.filter(mesh => mesh.visible), true);

//     if (intersects.length > 0) {
//         const intersectedObject = intersects[0].object;
//         console.log('Planeta bajo el mouse:', intersectedObject.userData.name);
//     }
// });
// document.addEventListener('mouseup', (event) => {
//     if (!isMouseMoving) {
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//         raycaster.setFromCamera(mouse, camera);
//         const intersects = raycaster.intersectObjects(circleMeshes.filter(mesh => mesh.visible), true);

//         if (intersects.length > 0) {
//             const intersectedObject = intersects[0].object;
//             console.log('Planeta intersectado:', intersectedObject.userData.name); // Debug

//             if (selectedPlanet !== intersectedObject) {
//                 if (selectedPlanet) {
//                     selectedPlanet.visible = true; 
//                 }
//                 selectedPlanet = intersectedObject;
//                 isolatePlanet(selectedPlanet);
//             } else {
//                 selectedPlanet.visible = true; 
//                 selectedPlanet = null;
//                 hideInfoBox();
//             }
//         } else {
//             if (selectedPlanet) {
//                 selectedPlanet.visible = true; 
//                 selectedPlanet = null;
//                 hideInfoBox();
//             }
//         }
//     }
// });
// // Función para aislar un planeta y mostrar información
// function isolatePlanet(planet) {
//     isPlanetSelected = true;

//     // Ocultar todos los demás planetas y órbitas, así como la esfera central
//     circleMeshes.forEach(mesh => {
//         if (mesh !== planet) {
//             mesh.visible = false;
//         }
//     });
//     orbitLines.forEach(line => {
//         line.visible = false; // Ocultar órbitas
//     });
//     centralSphere.visible = false; // Ocultar la esfera central

//     // Mover el planeta y hacer zoom sobre él
//     gsap.to(camera.position, {
//         duration: 1,
//         x: planet.position.x - 3,  // Moverlo a la izquierda
//         y: planet.position.y,
//         z: planet.position.z,
//         onUpdate: () => {
//             camera.lookAt(planet.position);
//         }
//     });

//     // Cambiar el centro a este objeto para que el usuario pueda rotarlo
//     controls.target.set(planet.position.x, planet.position.y, planet.position.z);
//     controls.enableRotate = true;  // Habilitar la rotación manual del planeta
//     controls.update();

//     // Mostrar el canvas con información adicional
//     const infoBox = document.getElementById("infoBox");
//     const infoCanvas = document.getElementById("infoCanvas");
//     infoBox.style.display = 'block'; // Mostrar el recuadro

//     // Escribir un texto de prueba en el canvas
//     const ctx = infoCanvas.getContext('2d');
//     ctx.clearRect(0, 0, infoCanvas.width, infoCanvas.height); // Limpiar el canvas
//     ctx.fillStyle = 'black';
//     ctx.font = '20px Arial';
//     ctx.fillText('Información del planeta seleccionado: ' + planet.userData.name, 20, 50); // Texto de prueba

//     // Ocultar todos los botones excepto el de "Home"
//     toggleButtonsForPlanetView();
// }

// // Función para ocultar la información
// function hideInfoBox() {
//     const infoBox = document.getElementById("infoBox");
//     infoBox.style.display = 'none'; // Ocultar el recuadro y el canvas
//     isPlanetSelected = false;
// }


// Función para alternar entre pausa y play
document.getElementById("pausePlay").addEventListener("click", function() {
    isPaused = !isPaused;
    const icon = this.querySelector('i');
    icon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
});

document.getElementById("speedControl").addEventListener("click", () => {
    animationSpeed = animationSpeed === 0.01 ? 0.02 : 0.01;

    const speedIcon = document.getElementById("speedIcon");
    if (animationSpeed === 0.01) {
        speedIcon.classList.remove("fa-forward");  // Dos triángulos (velocidad x2)
        speedIcon.classList.add("fa-play");        // Un triángulo (velocidad normal)
    } else {
        speedIcon.classList.remove("fa-play");
        speedIcon.classList.add("fa-forward");
    }
});

// Mostrar/Ocultar órbitas
document.getElementById("toggleOrbits").addEventListener("click", () => {
    orbitLines.forEach(line => {
        line.visible = !line.visible;
    });
});
selectedPlanet = 0
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
    selectedPlanet2 = null;
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
//-----------------------------------------------
// Funcionamiento de la nave espacial parte Antonio

//Función de movimiento de la nave espacial
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const speed = 0.1; // Velocidad de la nave



// Detectar teclas
window.addEventListener('keydown', function (event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;
        case 'KeyA':
            moveLeft = true;
            break;
        case 'KeyD':
            moveRight = true;
            break;
    }
});

window.addEventListener('keyup', function (event) {
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyA':
            moveLeft = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;
    }
});

// Actualizar la posición de la nave espacial
function updateSpaceshipPosition() {
    if (moveForward) spaceship.position.z -= speed;
    if (moveBackward) spaceship.position.z += speed;
    if (moveLeft) spaceship.position.x -= speed;
    if (moveRight) spaceship.position.x += speed;

    // Actualizar la cámara (tercera persona)
    camera.position.set(spaceship.position.x, spaceship.position.y + 2, spaceship.position.z + 5);
    camera.lookAt(spaceship.position);
}
// Alternación entre la primera y tercera persona con la tecla "C"
let isFirstPerson = false;

document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyC') {  // Cambiar la cámara con la tecla "C"
        isFirstPerson = !isFirstPerson;
        if (isFirstPerson) {
            controls.enabled = false;  // Deshabilitar los controles de órbita
            spaceship.visible = false;  // Ocultar la nave espacial
            camera.fov =35 ;  // Campo de visión más reducido para primera persona
            camera.updateProjectionMatrix();  // Actualizar la proyección
            camera.position.set(spaceship.position.x, spaceship.position.y + 0.5, spaceship.position.z + 0.1);  // Posición cercana en primera persona
            camera.lookAt(spaceship.position.x, spaceship.position.y, spaceship.position.z + 5);  // Mirar hacia adelante
        } else {
            controls.enabled = true;  // Habilitar los controles de órbita
            spaceship.visible = true;  // Mostrar la nave espacial
            camera.fov = 75;  // Campo de visión más amplio para tercera persona
            camera.updateProjectionMatrix();  // Actualizar la proyección
            camera.position.set(spaceship.position.x, spaceship.position.y + 2, spaceship.position.z + 5);  // Posición en tercera persona
            camera.lookAt(spaceship.position);  // Asegurar que la cámara mire a la nave
        }
    }
});
// Función para alternar entre la vista de primera y tercera persona
function animate() {
    requestAnimationFrame(animate);
    updateSpaceshipPosition();  // Actualizar la posición de la nave en cada frame

    if (!isFirstPerson) {
        controls.target.set(spaceship.position.x, spaceship.position.y, spaceship.position.z);  // Actualiza el objetivo de la cámara para que siga a la nave
        controls.update();  // Actualizar controles de órbita
    }

    renderer.render(scene, camera);
}

animate();
//Fin de la función de la nave espacial parte Antonio