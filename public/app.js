// Importa Firebase y Firestore
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDx8kUbVWlFLeZKkzfI41aeALNvbWyl_6Y",
    authDomain: "hexacoders-18f6d.firebaseapp.com",
    projectId: "hexacoders-18f6d",
    storageBucket: "hexacoders-18f6d.appspot.com",
    messagingSenderId: "15648509471",
    appId: "1:15648509471:web:12272583fe0093d9c8cf2a"
};
let planets = {}

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// const db = getFirestore(app);

const productsRef = db.collection('Accuracy_Eq');

productsRef.get().then((querySnapshot) => {
  let listHTML = '<ul>';
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const docID = doc.id;

    listHTML += `<h2>${docID}</h2><li>`;
    
    for (const key in data) {
        listHTML += `<strong>${key}:</strong> `; 
         // Check if it's a nested object
        listHTML += '<ul>';
        let longitude = 0;
        let latitude = 0;
        let distance = 0;
        for (const nestedKey in data[key]) {
            listHTML += `<li>${nestedKey}: ${data[key][nestedKey]}</li>`;
            if (nestedKey === 'HeliocentricLongitude') {
                longitude = data[key][nestedKey];
            }
            if (nestedKey === 'Latitude') {
                latitude = data[key][nestedKey];
            }
            else{
                distance = data[key][nestedKey];
            }
        }
        // console.log(key)
        let cartesianCoords = heliocentricToCartesian(longitude, latitude, distance);
        listHTML += `<li>Cartesian Coordinates: <br> x: ${cartesianCoords.x}, y: ${cartesianCoords.y}, z: ${cartesianCoords.z}</li>`;
        listHTML += '</ul>';
        if (!planets[docID]) {
            planets[docID] = {}; // Initialize if it doesn't exist
        }
        

        planets[docID][`${key}`] = {
            x: cartesianCoords.x,
            y: cartesianCoords.y,
            z: cartesianCoords.z,
            a: distance
        };
        
    }
    listHTML += '</li>';

  });
  listHTML += '</ul>';
  console.log(planets)
  document.getElementById('product-list').innerHTML = listHTML;
});


function heliocentricToCartesian(longitude, latitude, distance) {
    const x = distance * Math.cos(latitude) * Math.cos(longitude);
    const y = distance * Math.cos(latitude) * Math.sin(longitude);
    const z = distance * Math.sin(latitude);
    return { x, y, z };
}

function getEllipsePoint(a, e, t) { // t is the parameter (angle)
    const r = a * (1 - e * e) / (1 + e * Math.cos(t));
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    return { x, y };
}


function arcsecondsToRadians(arcseconds) {
const radians = arcseconds * (Math.PI / 180 / 3600); 
return radians;
}

// // Referencia al formulario
// const form = document.getElementById('dataForm');

// // Manejar el evento de envío del formulario
// form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     // Obtener los valores del formulario
//     const collectionName = document.getElementById('collection').value;
//     const nombre = document.getElementById('nombre').value;
//     const longitud = document.getElementById('longitud').value;
//     const latitud = document.getElementById('latitud').value;

//     // Crear un nuevo documento en la colección seleccionada
//     try {
//         const docRef = await addDoc(collection(db, collectionName), {
//             nombre: nombre,
//             longitud: longitud,
//             latitud: latitud
//         });
//         alert("Documento agregado con ID: " + docRef.id);
//     } catch (e) {
//         console.error("Error al agregar documento: ", e);
//         alert("Error al agregar documento");
//     }

//     // Limpiar el formulario
//     form.reset();
// });
