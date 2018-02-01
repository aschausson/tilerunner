
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


jQuery(window).bind('orientationchange', function(e) {
    switch ( window.orientation ) {
     case 0:
       $('.turnDeviceNotification').css('display', 'none');
       // The device is in portrait mode now
     break;
   
     case 180:
       $('.turnDeviceNotification').css('display', 'none');
       // The device is in portrait mode now
     break;
   
     case 90:
       // The device is in landscape now
       $('.turnDeviceNotification').css('display', 'block');
     break;
   
     case -90:
       // The device is in landscape now
       $('.turnDeviceNotification').css('display', 'block');
     break;
    }
   });