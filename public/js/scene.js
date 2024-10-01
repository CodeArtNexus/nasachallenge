
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometrySphere = new THREE.SphereGeometry(1, 32, 32);
const materialSphere = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
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
