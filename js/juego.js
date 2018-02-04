/**Cuando se termine de cargar el DOM, se asigna a cada botón su función y muestra la pantalla de login. */
$(document).ready(function () {
    $('#botonJugar').click(salirOpciones)
    $('#botonPausar').click(pausaJuega)
    $('#botonBomba').click(bombardea)
    $('#botonOpciones').click(opciones)
    $('#nivel').click(comienzaJuego)
    $('#reiniciar').click(reininiciarJuego)

    $('#selAvatar').click(function (e) {
        e.preventDefault()
        $('#avatar').fadeIn()
        $('#bloqueo').css('z-index', '60')
        return false
    })

    $('#verPuntuaciones').click(function (e) {
        e.preventDefault()
        var listaUsuarios = JSON.parse(localStorage.getItem("tilerunner"))
        var lista = []
        for (let i = 0; i < listaUsuarios.length; i++) {
            lista.push([listaUsuarios[i].puntuacion, listaUsuarios[i].nombre])
        }
        lista.sort(ordenarPrimeraColumna)
        $('#registroPuntuaciones p').remove()
        for (let i = 0; i < lista.length; i++) {
            $('#registroPuntuaciones').append('<p>' + lista[i][1] + ': ' + lista[i][0] + '</p>')
        }
        $('#registroPuntuaciones').fadeIn()
        $('#bloqueo').css('z-index', '60')
        return false
    })
    $('#cerrarRegistroPuntuaciones').click(function () {
        $('#registroPuntuaciones').fadeOut()
        $('#bloqueo').css('z-index', '20')
    })

    $('#avatar img').click(function () {
        var src = $(this).attr('src')
        $('#imagenSeleccionada').attr('src', src)
        $('#avatar').fadeOut()
        $('#bloqueo').css('z-index', '20')
    })

    $('#bloqueo').fadeIn()
    $('#login').fadeIn()
})


/**
 * Representa a un usuario, con toda la información que debe proporcionar al ser creado.
 * @param {*} nombre 
 * @param {*} password 
 * @param {*} telefono 
 * @param {*} email 
 * @param {*} avatar 
 * @param {*} puntuacion 
 * @class
 */
function Usuario(nombre, password, telefono, email, avatar, puntuacion) {
    this.nombre = nombre
    this.password = password
    this.telefono = telefono
    this.email = email
    this.avatar = avatar
    this.puntuacion = puntuacion
}


/**Se ordena un array bidimensional por el valor de la primera columna. */
function ordenarPrimeraColumna(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}


/**Se pausan los dos juegos. */
function pausaJuega() {
    if ($('#botonPausar').hasClass('pausa')) {
        gameRunner.game.paused = false
        gameTile.game.paused = false
        $('#cover').css('display', 'none')
        $('#miniBloqueo').css('display', 'none')
        $('#botonPausar').html('&#10074;&#10074;')
    }
    if ($('#botonPausar').hasClass('juega')) {
        gameRunner.game.paused = true
        gameTile.game.paused = true
        $('#cover').css('display', 'inline')
        $('#miniBloqueo').css('display', 'inline')
        $('#botonPausar').html('&#9658;')
    }
    $('#botonPausar').toggleClass('pausa').toggleClass('juega')
}


/**Cuando se pulsa el botón de login, busca el usuario entre los registrados y si se encuentra, se asigna como jugador actual 
 * y se muestra la pantalla de opciones. También se inicia el loop de música.
 */
function login() {
    $('#nombreUsuario').html(variables.userName)
    $('#avatarUsuario').attr('src', variables.userPhoto)

    $('#login').fadeOut()
    opciones()
    // *true* para el loop de la música
    gameRunner.music = new Phaser.Sound(gameRunner.game, 'musica', 1, true)
    gameRunner.music.play()
}


/**Se muestra la pantalla de opciones y se pausa el juego si es necesario. */
function opciones() {
    $('#bloqueo').fadeIn()
    $('#opciones').fadeIn()
    if ($('#botonPausar').hasClass('juega')) {
        pausaJuega()
    }
}


/**Se sale de las opciones, se aplica la dificultad seleccionada y se quita la pausa. */
function salirOpciones() {
    variables.difficulty = $('input[name=dificultad]:checked', '#opciones').val()

    $('#bloqueo').fadeOut()
    $('#opciones').fadeOut()
    if (variables.nivelActual == 0) {
        siguienteNivel()
    }
    else {
        if ($('#botonPausar').hasClass('pausa')) {
            pausaJuega()
        }
    }
}


/**Se cambia al siguiente nivel. Se cambia el fondo y se incrementa un poco la dificultad. */
function siguienteNivel() {
    if ($('#botonPausar').hasClass('juega')) {
        pausaJuega()
    }
    variables.nivelActual++
    $('#cambioNivel').fadeIn()
    $('#tituloNivel').html('Nivel ' + variables.nivelActual)
    $('#puntosNivel').html('Puntos para superar el nivel: ' + (1500 * variables.difficulty * variables.nivelActual))

    variables.minimumSpeed = variables.minimumSpeed + 0.5
    variables.speed = variables.minimumSpeed
    variables.speedRatio = variables.speedRatio + 0.0002

    guardaPuntuacionMax()

    variables.backgroundActual++
    if (variables.backgroundActual > 3)
        variables.backgroundActual = 1
    gameRunner.runnerBackground = gameRunner.game.add.tileSprite(0, 0, gameRunner.width, gameRunner.height, 'runnerfondo' + variables.backgroundActual)
    gameRunner.player.bringToTop()
}


/**Recomienza el juego tras pasar de nivel. */
function comienzaJuego() {
    $('#bloqueo').fadeOut()
    $('#opciones').fadeOut()
    $('#cambioNivel').fadeOut()
    if ($('#botonPausar').hasClass('pausa')) {
        pausaJuega()
    }
}


/**Se borran los chips calavera del tablero. */
function bombardea() {
    removeSkulls()
}


/**Se llama al acabar la partida. Se muestran las puntuaciones. */
function endGame() {
    if ($('#botonPausar').hasClass('juega')) {
        pausaJuega()
    }

    guardaPuntuacionMax()
    $('#puntuacionFinal').html(variables.score)
    $('#recordPersonal').html(variables.puntuacionMaxPropia)
    $('#recordTotal').html(variables.puntuacionMaxTotal)

    $('#bloqueo').fadeIn()
    $('#finJuego').fadeIn()
}


/**Se buscan las puntuaciones máximas totales y personales que hayan sido guardadas. */
function guardaPuntuacionMax() {
    var puntuacionMaxPropia = 0
    var puntuacionMaxTotal = 0
    var listaUsuarios = JSON.parse(localStorage.getItem("tilerunner"))
    for (let i = 0; i < listaUsuarios.length; i++) {
        if (variables.userName == listaUsuarios[i].nombre) {
            if (variables.score > listaUsuarios[i].puntuacion)
                listaUsuarios[i].puntuacion = variables.score
            if (listaUsuarios[i].puntuacion > puntuacionMaxPropia)
                puntuacionMaxPropia = listaUsuarios[i].puntuacion
        }
        if (listaUsuarios[i].puntuacion > puntuacionMaxTotal)
            puntuacionMaxTotal = listaUsuarios[i].puntuacion
    }
    localStorage.setItem("tilerunner", JSON.stringify(listaUsuarios))
    variables.puntuacionMaxPropia = puntuacionMaxPropia
    variables.puntuacionMaxTotal = puntuacionMaxTotal
}

/**Al girar el dispositivo móvil, se pausa el juego y se pide que se regrese al modo vertical. */
jQuery(window).bind('orientationchange', function (e) {
    switch (window.orientation) {
        case 0:
            $('.turnDeviceNotification').css('display', 'none')
            if ($('#botonPausar').hasClass('pausa')) {
                pausaJuega()
            }
            // The device is in portrait mode now
            break

        case 180:
            $('.turnDeviceNotification').css('display', 'none')
            if ($('#botonPausar').hasClass('pausa')) {
                pausaJuega()
            }
            // The device is in portrait mode now
            break

        case 90:
            // The device is in landscape now
            $('.turnDeviceNotification').css('display', 'block')
            if ($('#botonPausar').hasClass('juega')) {
                pausaJuega()
            }
            break

        case -90:
            // The device is in landscape now
            $('.turnDeviceNotification').css('display', 'block')
            if ($('#botonPausar').hasClass('juega')) {
                pausaJuega()
            }
            break
    }
})


/**Se reinicia la partida cambiando las variables necesarias a los valores originales. */
function reininiciarJuego() {
    variables.score = 0
    variables.bombScore = 9
    variables.bombs = 1
    variables.speed = 0.5
    variables.life = 100

    variables.nivelActual = 1
    variables.backgroundActual = 1

    variables.minimumSpeed = 0.5
    variables.speedRatio = 0.0002

    gameRunner.obstacles = []
    gameRunner.runnerBackground = gameRunner.game.add.tileSprite(0, 0, gameRunner.width, gameRunner.height, 'runnerfondo1')
    changeGameVariables(' ')
    gameRunner.player.bringToTop()
    if ($('#botonPausar').hasClass('pausa')) {
        pausaJuega()
    }
    $('#bloqueo').fadeOut()
    $('#finJuego').fadeOut()
}


/**Se controla si existe el usuario que se va a registrar, se inserta si es posible y se muestran mensajes de éxito o error. */
function nuevoUsuario() {
    var existe = false
    var usuario = new Usuario($('#registroNombre').val(), $('#registroPassword').val(), $('#registroTelefono').val(), $('#registroEmail').val(), $('#imagenSeleccionada').attr('src'), 0)
    var listaUsuarios = []
    if (localStorage.getItem("tilerunner") === null) {
        listaUsuarios.push(usuario)
        localStorage.setItem("tilerunner", JSON.stringify(listaUsuarios))
    }
    else {
        listaUsuarios = JSON.parse(localStorage.getItem("tilerunner"))
        for (let i = 0; i < listaUsuarios.length; i++) {
            var loginNombre = $('#registroNombre').val()
            if (loginNombre == listaUsuarios[i].nombre) {
                existe = true
            }
        }
        if (!existe) {
            listaUsuarios.push(usuario)
            localStorage.setItem("tilerunner", JSON.stringify(listaUsuarios))
            toastr.success('', 'Usuario creado')
        }
        else {
            toastr.error('', 'Usuario ya existe')
        }
    }
    return false
}


/**Se controla que el usuario existe, se asignan las variables de usuario y se muestran mensajes de éxito o erro. */
function loginUsuario() {
    var logueado = false
    var listaUsuarios = JSON.parse(localStorage.getItem("tilerunner"))
    if (listaUsuarios != null) {
        for (let i = 0; i < listaUsuarios.length; i++) {
            if (($('#loginNombre').val() == listaUsuarios[i].nombre) && ($('#loginPassword').val() == listaUsuarios[i].password)) {
                variables.userName = listaUsuarios[i].nombre
                variables.userScore = listaUsuarios[i].puntuacion
                variables.userPhoto = listaUsuarios[i].avatar
                logueado = true
            }
        }
    }
    if (logueado) {
        toastr.success('', 'Login conseguido')
        login()
    }
    else {
        toastr.error('', 'Login fallido')
    }
    return false
}