// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDx8kUbVWlFLeZKkzfI41aeALNvbWyl_6Y",
    authDomain: "hexacoders-18f6d.firebaseapp.com",
    projectId: "hexacoders-18f6d",
    storageBucket: "hexacoders-18f6d.appspot.com",
    messagingSenderId: "15648509471",
    appId: "1:15648509471:web:12272583fe0093d9c8cf2a"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para cargar datos de la colección seleccionada
function loadCollectionData(collectionName) {
    const collectionRef = db.collection(collectionName);

    collectionRef.get().then((querySnapshot) => {
        let listHTML = `<h3>Datos de la colección: ${collectionName}</h3><ul>`;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docID = doc.id;

            listHTML += `<h2>${docID}</h2><li>`;

            // Mostrar datos según la estructura
            if (typeof data === 'object' && !Array.isArray(data)) {
                for (const key in data) {
                    if (typeof data[key] === 'object') {
                        listHTML += `<strong>${key}:</strong> <ul>`;
                        let longitude = 0, latitude = 0, distance = 0;

                        for (const nestedKey in data[key]) {
                            listHTML += `<li>${nestedKey}: ${data[key][nestedKey]}</li>`;
                            if (nestedKey === 'HeliocentricLongitude') longitude = data[key][nestedKey];
                            if (nestedKey === 'Latitude') latitude = data[key][nestedKey];
                            if (nestedKey === 'Distance') distance = data[key][nestedKey];
                        }

                        let cartesianCoords = heliocentricToCartesian(longitude, latitude, distance);
                        listHTML += `<li>Cartesian Coordinates: <br> x: ${cartesianCoords.x}, y: ${cartesianCoords.y}, z: ${cartesianCoords.z}</li>`;
                        listHTML += `</ul>`;
                    } else {
                        listHTML += `<strong>${key}:</strong> ${data[key]}<br>`;
                    }
                }
            } else {
                listHTML += `<strong>Datos:</strong> ${JSON.stringify(data)}<br>`;
            }

            listHTML += '</li>';
        });
        listHTML += '</ul>';

        // Agregar los datos a la lista existente
        document.getElementById('product-list').innerHTML += listHTML; // Cambiar innerHTML a +=
    }).catch((error) => {
        console.error("Error al cargar los datos: ", error);
    });
}

// Evento para manejar el cambio en el selector de colección
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('collection-select').addEventListener('change', function() {
        const selectedCollection = this.value;

        // Limpiar la lista de productos antes de cargar la nueva colección
        document.getElementById('product-list').innerHTML = '';

        // Cargar la colección seleccionada o todas las colecciones
        if (selectedCollection === 'all') {
            loadCollectionData('Accuracy_Eq');
            loadCollectionData('Planetas');
            loadCollectionData('Asteroides');
            loadCollectionData('Estrellas');
        } else {
            loadCollectionData(selectedCollection);
        }
    });
});


// Cargar datos iniciales
loadCollectionData('Accuracy_Eq'); // Carga inicial

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

document.addEventListener('DOMContentLoaded', () => {
    // Aquí va tu código
    const dataForm = document.getElementById('dataForm');
    dataForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar el envío normal del formulario

        // Capturar los datos del formulario
        const collection = document.getElementById('collection').value;
        const nombre = document.getElementById('nombre').value;
        const longitud = document.getElementById('longitud').value;
        const latitud = document.getElementById('latitud').value;

        // Crear un objeto con los datos
        const data = {
            nombre: nombre,
            HeliocentricLongitude: parseFloat(longitud),
            Latitude: parseFloat(latitud)
        };

        try {
            // Guardar los datos en la colección seleccionada
            await db.collection(collection).add(data);
            console.log("Datos agregados con éxito!");

            // Limpiar el formulario
            dataForm.reset();

            // Actualizar la lista de productos
            alert('Datos enviados correctamente');
        } catch (error) {
            console.error("Error al agregar los datos: ", error);
        }
    });
});