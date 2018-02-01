
$(document).ready(function (){
    $('#botonJugar').click(comienzaJuego)
    $('#botonPausar').click(pausaJuega)
    $('#botonBomba').click(bombardea)
})


function pausaJuega(){
    if ($('#botonPausar').hasClass('pausa')){
        gameRunner.game.paused = false
        gameTile.game.paused = false
        $('#cover').css('display', 'none')
        $('#bloqueo').css('display', 'none')
    }
    if ($('#botonPausar').hasClass('juega')){
        gameRunner.game.paused = true
        gameTile.game.paused = true
        $('#cover').css('display', 'inline')
        $('#bloqueo').css('display', 'inline')
    } 

    $('#botonPausar').toggleClass('pausa').toggleClass('juega')
}

function comienzaJuego(){

    pausaJuega()
}


function bombardea(){
    removeSkulls()
}


function endGame(){

}