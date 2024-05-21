const express = require('express');
const cors = require('cors');
const users = express.Router()


users.use(cors());

const fs = require('fs');

users.post('/saveOrUpdate', (req, res) => {
    let {id, nombre, apellido, email, telefono, fechaNacimiento, pais, provincia} = req.body;

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) { // Agrega el signo de exclamación para negar la condición
        return res.status(400).send({message: 'El formato del correo electrónico es inválido.'});
    }

    const birthDate = new Date(fechaNacimiento);
    const year = birthDate.getFullYear();
    if (isNaN(year) || year <= 1900) {
        return res.status(400).send({message: 'La fecha de nacimiento debe ser mayor a 1900.'});
    }

    let datos = [];
    if (fs.existsSync('usersData.json')) {
        const datosJSON = fs.readFileSync('usersData.json', 'utf-8');
        datos = JSON.parse(datosJSON);
    }
    if (id == null) {
        const clavesExistentes = datos.map(item => parseInt(item.id)).filter(id => !isNaN(id));
        const maxClave = clavesExistentes.length > 0 ? Math.max(...clavesExistentes) : 0;
        id = (maxClave + 1).toString();
    }
    const indice = datos.findIndex(item => item.id === id);
    if (indice !== -1) {
        datos[indice].nombre = nombre;
        datos[indice].apellido = apellido;
        datos[indice].email = email;
        datos[indice].telefono = telefono;
        datos[indice].fechaNacimiento = fechaNacimiento;
        datos[indice].pais = pais;
        datos[indice].provincia = provincia;

    } else {
        datos.push({id, nombre, apellido, email, telefono, fechaNacimiento, pais, provincia});
    }
    fs.writeFileSync('usersData.json', JSON.stringify(datos, null, 4));
    res.send(`Datos guardados en el archivo JSON`);
});


users.get('/getAll', (req, res) => {
    if (fs.existsSync('usersData.json')) {
        const datosJSON = fs.readFileSync('usersData.json', 'utf-8');
        const datos = JSON.parse(datosJSON);
        res.json({message: 'Datos obtenido con exito', datos});
    } else {
        res.status(404).json({message: 'El archivo usersData.json no existe'});
    }
});


users.get('/getbyId', (req, res) => {
    const id = parseInt(req.query.id);
    if (fs.existsSync('usersData.json')) {

        const datosJSON = fs.readFileSync('usersData.json', 'utf-8');

        const datos = JSON.parse(datosJSON);
        const usuarioEncontrado = datos.find(usuario => usuario.id === id.toString());

        if (usuarioEncontrado) {
            res.json(usuarioEncontrado);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } else {
        res.status(404).json({message: 'El archivo usersData.json no existe'});
    }
});

users.delete('/delete', (req, res) => {
    const id = req.query.id; // No es necesario parseInt aquí
    if (fs.existsSync('usersData.json')) {
        const datosJSON = fs.readFileSync('usersData.json', 'utf-8');
        let datos = JSON.parse(datosJSON);
        const indice = datos.find(usuario => usuario.id === id);
        console.log(indice)
        if (indice !== -1) {
            datos.splice(indice, 1);
            fs.writeFileSync('usersData.json', JSON.stringify(datos));
            res.json({message: `Usuario con id ${id} eliminado exitosamente.`});
        } else {
            res.status(404).json({message: 'Usuario no encontrado'});
        }
    } else {
        res.status(404).json({message: 'El archivo usersData.json no existe'});
    }
});


module.exports = users
