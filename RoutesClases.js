const express = require('express');
const cors = require('cors');
const clases = express.Router()

clases.use(cors());

const fs = require('fs');


clases.post('/saveOrUpdate', (req, res) => {
    let {id, name, description, time,  instructor, nivel } = req.body;

    let datos = [];
    if (fs.existsSync('clasesData.json')) {
        const datosJSON = fs.readFileSync('clasesData.json', 'utf-8');
        datos = JSON.parse(datosJSON);
    }
    if (id == null) {
        const clavesExistentes = datos.map(item => parseInt(item.id)).filter(id => !isNaN(id));
        const maxClave = clavesExistentes.length > 0 ? Math.max(...clavesExistentes) : 0;
        id = (maxClave + 1).toString();
    }
    const indice = datos.findIndex(item => item.clave === id);
    if (indice !== -1) {
        datos[indice].name = name;
        datos[indice].description = description;
        datos[indice].time = time;
        datos[indice].instructor = instructor;
        datos[indice].nivel = nivel;
    } else {
        datos.push({id, name, description, time,  instructor, nivel});
    }
    fs.writeFileSync('clasesData.json', JSON.stringify(datos, null, 4));
    res.send(`Datos guardados en el archivo JSON`);
});


clases.get('/getAll', (req, res) => {
    if (fs.existsSync('clasesData.json')) {
        const datosJSON = fs.readFileSync('clasesData.json', 'utf-8');
        const datos = JSON.parse(datosJSON);
        res.json(datos);
    } else {
        res.status(404).send('El archivo clasesData.json no existe');
    }
});


clases.get('/getbyClave', (req, res) => {
    const clave = parseInt(req.query.clave);
    if (fs.existsSync('clasesData.json')) {

        const datosJSON = fs.readFileSync('clasesData.json', 'utf-8');

        const datos = JSON.parse(datosJSON);
        const usuarioEncontrado = datos.find(usuario => usuario.clave === clave);

        if (usuarioEncontrado) {
            res.json(usuarioEncontrado);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } else {
        res.status(404).send('El archivo clasesData.json no existe');
    }
});

clases.delete('/delete/:clave', (req, res) => {
    const { clave } = req.params;
    if (fs.existsSync('clasesData.json')) {
        const datosJSON = fs.readFileSync('clasesData.json', 'utf-8');
        let datos = JSON.parse(datosJSON);
        const indice = datos.findIndex(item => item.clave === clave);

        if (indice !== -1) {
            datos.splice(indice, 1);
            fs.writeFileSync('clasesData.json', JSON.stringify(datos));
            res.send({message: `Usuario con clave ${clave} eliminado exitosamente.`});
        } else {
            res.status(404).send({message: 'Usuario no encontrado.'});
        }
    } else {
        res.status(404).send({message: 'No hay usuarios para eliminar.'});
    }
});



module.exports = clases
