const circles = [
    { name: "Planeta A", size: 0.3, color: 0xff5733, radius: 2 },
    { name: "Planeta B", size: 0.5, color: 0x33ff57, radius: 3 },
    { name: "Planeta C", size: 0.3, color: 0x3357ff, radius: 4 }
];

const circleMeshes = [];
let selectedPlanet = null; 
let isPlanetSelected = false; 

circles.forEach(circle => {
    const geometry = new THREE.SphereGeometry(circle.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: circle.color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = Math.cos(0) * circle.radius;
    mesh.position.z = Math.sin(0) * circle.radius;

    mesh.userData.radius = circle.radius;
    mesh.userData.angle = 0; 
    mesh.userData.rotationSpeed = 0.005; 
    mesh.name = circle.name;
    
    scene.add(mesh);
    circleMeshes.push(mesh);
});

let animationSpeed = 0.01; 
let isPaused = false;

function rotatePlanets() {
    if (!isPaused && !isPlanetSelected) {
        circleMeshes.forEach(mesh => {
            mesh.userData.angle += animationSpeed;
            mesh.position.x = Math.cos(mesh.userData.angle) * mesh.userData.radius;
            mesh.position.z = Math.sin(mesh.userData.angle) * mesh.userData.radius;
        });
    }

    if (selectedPlanet) {
        selectedPlanet.rotation.y += selectedPlanet.userData.rotationSpeed;
    }
}

function animatePlanets() {
    requestAnimationFrame(animatePlanets);
    rotatePlanets();
}

animatePlanets();
