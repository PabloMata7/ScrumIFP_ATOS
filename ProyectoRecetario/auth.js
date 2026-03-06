const AuthService = {
    init: function() {
        if (!localStorage.getItem('db_usuarios')) {
            localStorage.setItem('db_usuarios', JSON.stringify([]));
        }
    },

    registrar: function(nombre, correo, password) {
        const usuarios = JSON.parse(localStorage.getItem('db_usuarios'));

        if (usuarios.some(u => u.correo === correo)) {
            return { exito: false, mensaje: "El correo ya está registrado." };
        }

        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.idUsuario)) + 1 : 1;
        
        const nuevoUsuario = {
            idUsuario: nuevoId,
            nombre: nombre,
            correo: correo,
            password: password 
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('db_usuarios', JSON.stringify(usuarios));

        return { exito: true, mensaje: "Usuario registrado correctamente." };
    },

    login: function(correo, password) {
        const usuarios = JSON.parse(localStorage.getItem('db_usuarios'));
        
        const usuario = usuarios.find(u => u.correo === correo && u.password === password);

        if (usuario) {
            localStorage.setItem('sesion_actual', usuario.idUsuario);
            return { exito: true, usuario: usuario };
        } else {
            return { exito: false, mensaje: "Correo o contraseña incorrectos." };
        }
    },

    logout: function() {
        localStorage.removeItem('sesion_actual');
    },

    obtenerUsuarioActual: function() {
        const idSesion = localStorage.getItem('sesion_actual');
        if (!idSesion) return null;

        const usuarios = JSON.parse(localStorage.getItem('db_usuarios'));
        return usuarios.find(u => u.idUsuario === parseInt(idSesion)) || null;
    }
};

AuthService.init();