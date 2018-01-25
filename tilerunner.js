var gamerunner = new Phaser.Game(800, 400, Phaser.CANVAS, 'phaser-tilerunner', { preload: preload, create: create, update: update});

var gametile = new Phaser.Game(900, 900, Phaser.CANVAS, 'phaser-tilerunner', { preload: preload, create: create, update: update});

var velocidad = 0.5
var anchoTotal = 800

var tileGrid

var tileWidth
var tileHeight

var randomNum

var canMove

function Tile (posX,posY,estado) {
    this.posX = posX
    this.posY = posY
    this.estado = estado
}

var tileTypes = ['tileSkull', 'tileBomb', 'tileHeart', 'tileClock', 'tileStar']






function preload() {
	gamerunner.load.image('runnerfondo1', 'assets/fondo.jpg')
	gamerunner.load.image('runnerfondo2', 'assets/runnerfondo.png')

	gametile.load.image('tilefondo', 'assets/fondotile.png')
/*	
	gametile.load.image('tileSkull', 'assets/tiles/skull.png')
	gametile.load.image('tileBomb', 'assets/tiles/bomb.png')
	gametile.load.image('tileHeart', 'assets/tiles/heart.png')
	gametile.load.image('tileClock', 'assets/tiles/clock.png')
	gametile.load.image('tileStar', 'assets/tiles/star.png')
	gametile.load.image('gear', 'assets/tiles/gear.png')*/
	gametile.load.image('tileSkull', 'assets/tiles/skull.png')
	gametile.load.image('tileBomb', 'assets/tiles/skull.png')
	gametile.load.image('tileHeart', 'assets/tiles/skull.png')
	gametile.load.image('tileClock', 'assets/tiles/skull.png')
	gametile.load.image('tileStar', 'assets/tiles/skull.png')
}





function create() {
	runnerBackground1 = gamerunner.add.tileSprite(0, 0, anchoTotal, 400, 'runnerfondo1')
	runnerBackground2 = gamerunner.add.tileSprite(0, 0, anchoTotal, 400, 'runnerfondo2')
	


	activeTile1 = null
    activeTile2 = null

	tileWidth = 150
	tileHeight = 150

	canMove = false

	tiles = gametile.add.group()

	tileGrid = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
    ]

	var seed = Date.now()
    randomNum = new Phaser.RandomDataGenerator([seed])



	initTiles()

	/*
	
	//  https://phaser.io/examples/v2/tilemaps/blank-tilemap
	// https://www.joshmorony.com/how-to-create-a-candy-crush-or-bejeweled-game-in-phaser/

    //tilebackground = gametile.add.tileSprite(0, 0, anchoTotal, 800, 'tilefondo')
	
	
	//tile = gametile.add.sprite(0, 0, 50, 50, 'tileCalavera');
	//tile.anchor.setTo(0, 0);


    //  Creates a blank tilemap
		map = gametile.add.tilemap();
		
		map.addTilesetImage('tileCalavera');
	
		//  Add a Tileset image to the map
		map.addTilesetImage('tilefondo');
	
		//  Creates a new blank layer and sets the map dimensions.
		//  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
		layer1 = map.create('level1', 800, 800, 133, 133);
*/
	/*
	tileMap = new Tilemap(gametile, null, 130, 130, 6, 6)
	tileLayer = new TilemapLayer(gametile, tileMap, 0, 800, 800)
	tile = new Tile(tileLayer, 0, 0, 0, 130, 130)
	*/
}


function initTiles(){
	for (var i = 0; i < tileGrid.length; i++) {
		for (var j = 0; j < tileGrid.length; j++) {
			var tile = addTile(i, j)
			tileGrid[i][j] = tile
		   
		}
	}
}

function addTile(x, y){

		   var tileToAdd = tileTypes[randomNum.integerInRange(0, tileTypes.length - 1)]; 
		
		   //Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
		   var tile = tiles.create((x * tileWidth) + tileWidth / 2, 0, tileToAdd);
		
		   //Animate the tile into the correct vertical position
		   gametile.add.tween(tile).to({y:y*tileHeight+(tileHeight/2)}, 500, Phaser.Easing.Linear.In, true)
		
		   //Set the tiles anchor point to the center
		   tile.anchor.setTo(0.5, 0.5);
		
		   //Enable input on the tile
		   tile.inputEnabled = true;
		
		   //Keep track of the type of tile that was added
		   tile.tileType = tileToAdd;
		
		   //Trigger the tileDown function whenever the user clicks or taps on this tile
		   tile.events.onInputDown.add(tileDown, this);
		
		   return tile
	   
}



function tileDown(tile, pointer){
	
	   //Keep track of where the user originally clicked
	   if(canMove){
		   activeTile1 = tile;
	
		   startPosX = (tile.x - tileWidth/2) / tileWidth;
		   startPosY = (tile.y - tileHeight/2) / tileHeight;
	   }
	
   }
   




function update() {
    runnerBackground2.tilePosition.x -= velocidad;
	velocidad += 0.0001
}




