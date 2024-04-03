const express = require('express');
const cors = require('cors');
const users = express.Router()


users.use(cors());

const fs = require('fs');

users.post('/user/saveOrUpdate', (req, res) => {
    let {id, nombre, apellido, email, telefono, fechaNacimiento} = req.body;

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
    } else {
        datos.push({id, nombre, apellido, email, telefono, fechaNacimiento});
    }
    fs.writeFileSync('usersData.json', JSON.stringify(datos, null, 4));
    res.send(`Datos guardados en el archivo JSON`);
});


users.get('/user/getAll', (req, res) => {
    if (fs.existsSync('usersData.json')) {
        const datosJSON = fs.readFileSync('usersData.json', 'utf-8');
        const datos = JSON.parse(datosJSON);
        res.json({message: 'Datos obtenido con exito', datos});
    } else {
        res.status(404).json({message: 'El archivo usersData.json no existe'});
    }
});


users.get('/user/getbyId', (req, res) => {
    const id = parseInt(req.query.id);
    if (fs.existsSync('usersData.json')) {

        const datosJSON = fs.readFileSync('usersData.json', 'utf-8');

        const datos = JSON.parse(datosJSON);
        const usuarioEncontrado = datos.find(usuario => usuario.id === id);

        if (usuarioEncontrado) {
            res.json(usuarioEncontrado);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } else {
        res.status(404).json({message: 'El archivo usersData.json no existe'});
    }
});

users.delete('/user/delete/:id', (req, res) => {
    const {id} = req.params;
    if (fs.existsSync('usersData.json')) {
        const datosJSON = fs.readFileSync('usersData.json', 'utf-8');
        let datos = JSON.parse(datosJSON);
        const indice = datos.findIndex(item => item.id === id);

        if (indice !== -1) {
            datos.splice(indice, 1);
            fs.writeFileSync('usersData.json', JSON.stringify(datos));
            res.send({message: `Usuario con clave ${clave} eliminado exitosamente.`});
        } else {
            res.status(404).send({message: 'Usuario no encontrado.'});
        }
    } else {
        res.status(404).send({message: 'No hay usuarios para eliminar.'});
    }
});


module.exports = users
