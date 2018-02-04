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

    $('#avatar img').click(function () {
        var src = $(this).attr('src')
        $('#imagenSeleccionada').attr('src', src)
        $('#avatar').fadeOut()
        $('#bloqueo').css('z-index', '20')
    })

    $('#bloqueo').fadeIn()
    $('#login').fadeIn()
})


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

/**Cuando se pulsa el botón de login, busca el usuario entre los registradosy si se encuentra, se asigna como jugador actual 
 * y se muestra la pantalla de opciones.
 */
function login() {
    $('#nombreUsuario').html(variables.userName)
    $('#avatarUsuario').attr('src', variables.userPhoto)

    $('#login').fadeOut()
    opciones()
}


function opciones() {
    $('#bloqueo').fadeIn()
    $('#opciones').fadeIn()
    if ($('#botonPausar').hasClass('juega')) {
        pausaJuega()
    }
   // *true* param enables looping
	gameRunner.music = new Phaser.Sound(gameRunner.game,'musica',1,true)
	gameRunner.music.play()

}

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

    variables.backgroundActual++
    if (variables.backgroundActual > 3)
        variables.backgroundActual = 1
    gameRunner.runnerBackground = gameRunner.game.add.tileSprite(0, 0, gameRunner.width, gameRunner.height, 'runnerfondo' + variables.backgroundActual)
    gameRunner.player.bringToTop()
}


function comienzaJuego() {
    $('#bloqueo').fadeOut()
    $('#opciones').fadeOut()
    $('#cambioNivel').fadeOut()
    if ($('#botonPausar').hasClass('pausa')) {
        pausaJuega()
    }
}


function bombardea() {
    removeSkulls()
}


function endGame() {
    if ($('#botonPausar').hasClass('juega')) {
        pausaJuega()
    }
    $('#bloqueo').fadeIn()
    $('#finJuego').fadeIn()
}


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

function Usuario(nombre, password, telefono, email, avatar, puntuacion) {
    this.nombre = nombre
    this.password = password
    this.telefono = telefono
    this.email = email
    this.avatar = avatar
    this.puntuacion = puntuacion
}

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


function loginUsuario() {
    var logueado = false
    var listaUsuarios = JSON.parse(localStorage.getItem("tilerunner"))
    for (let i = 0; i < listaUsuarios.length; i++) {
        if (($('#loginNombre').val() == listaUsuarios[i].nombre) && ($('#loginPassword').val() == listaUsuarios[i].password)) {
            variables.userName = listaUsuarios[i].nombre
            variables.userScore = listaUsuarios[i].puntuacion
            variables.userPhoto = listaUsuarios[i].avatar
            logueado = true
        }
    }
    if(logueado){
        toastr.success('', 'Login conseguido')
        login()
    }
    else{
        toastr.error('', 'Login fallido') 
    }
    return false
}