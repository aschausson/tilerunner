

function GameVariables(){
	this.score = 0
	this.bombs = 0
	this.speed = 0.5
	this.lives = 3
}


function changeGameVariables(tileType){
	if (tileType == "tileSkull")
		variables.lives -= 1
	else if (tileType == "tileBomb")
		variables.bombs += 1
	else if (tileType == "tileHeart")
		variables.lives += 1
	else if (tileType == "tileClock")
		variables.speed -= 0.2
	else if (tileType == "tileStar")
		variables.score += 10

	$('#lives').html(variables.lives)
	$('#bombs').html(variables.bombs)
	$('#score').html(variables.score)

	var rounded = Math.round( variables.speed * 10 ) / 10;
	$('#speed').html(rounded)
}


var variables = new GameVariables()

changeGameVariables('')


var originalWidthTile = 900
var originalHeightTile = 900

var originalWidthRunner = 900
var originalHeightRunner = 450

var gameTileWidth = 306
var gameTileHeight = 306

var widthRatioTile = gameTileWidth / originalWidthTile
var heightRatioTile = gameTileHeight / originalHeightTile

var gamerunner = new Phaser.Game(360, 180, Phaser.CANVAS, 'phaser-tilerunner', { preload: preload, create: create, update: update });

var gametile = new Phaser.Game(gameTileWidth, gameTileHeight, Phaser.CANVAS, 'phaser-tilerunner', { preload: preload, create: create, update: update });

var startPosX = 0
var startPosY = 0



var velocidad = 0.5
var anchoTotal = 800

var tileGrid

var tileWidth
var tileHeight

var activeTile1
var activeTile2

var randomNum

var canMove

function Tile(posX, posY, estado) {
	this.posX = posX
	this.posY = posY
	this.estado = estado
}

var tileTypes = ['tileSkull', 'tileBomb', 'tileHeart', 'tileClock', 'tileStar']






function preload() {
	$('canvas').first().attr('id', 'gamerunner')
	$('canvas').last().attr('id', 'gametile')

	gamerunner.load.image('runnerfondo', 'assets/runnerfondo.png')

	gametile.load.image('tilefondo', 'assets/tiles/board.png')
	gametile.load.image('tileSkull', 'assets/tiles/skullchip.png')
	gametile.load.image('tileBomb', 'assets/tiles/bombchip.png')
	gametile.load.image('tileHeart', 'assets/tiles/heartchip.png')
	gametile.load.image('tileClock', 'assets/tiles/timechip.png')
	gametile.load.image('tileStar', 'assets/tiles/starchip.png')


}





function create() {
	runnerBackground = gamerunner.add.tileSprite(0, 0, anchoTotal, 400, 'runnerfondo')

	tileBackground = gametile.add.tileSprite(0, 0, originalWidthTile, originalHeightTile, 'tilefondo')
	tileBackground.scale.setTo(widthRatioTile, heightRatioTile)

	activeTile1 = null
	activeTile2 = null

	tileWidth = gameTileWidth / 6
	tileHeight = gameTileHeight / 6

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


function initTiles() {
	for (var i = 0; i < tileGrid.length; i++) {
		for (var j = 0; j < tileGrid.length; j++) {
			var tile = addTile(i, j)
			tileGrid[i][j] = tile

		}
	}

	//Once the tiles are ready, check for any matches on the grid
	gametile.time.events.add(600, function () {
		//	checkMatch();
		canMove = true
	})

}

function addTile(x, y) {

	var tileToAdd = tileTypes[randomNum.integerInRange(0, tileTypes.length - 1)]

	//Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
	var tile = tiles.create((x * tileWidth) + tileWidth / 2, 0, tileToAdd)

	tile.scale.setTo(widthRatioTile, heightRatioTile)

	//Animate the tile into the correct vertical position
	gametile.add.tween(tile).to({ y: y * tileHeight + (tileHeight / 2) }, 500, Phaser.Easing.Linear.In, true)

	//Set the tiles anchor point to the center
	tile.anchor.setTo(0.5, 0.5)

	//Enable input on the tile
	tile.inputEnabled = true

	//Keep track of the type of tile that was added
	tile.tileType = tileToAdd

	//Trigger the tileDown function whenever the user clicks or taps on this tile
	tile.events.onInputDown.add(tileDown, this)

	return tile

}



function tileDown(tile, pointer) {

	//Keep track of where the user originally clicked
	if (canMove) {
		activeTile1 = tile

		startPosX = (tile.x - tileWidth / 2) / tileWidth
		startPosY = (tile.y - tileHeight / 2) / tileHeight
	}

}




function update() {
	runnerBackground.tilePosition.x -= variables.speed
	variables.speed += 0.0002
	var rounded = Math.round( variables.speed * 10 ) / 10;
	$('#speed').html(rounded)



	//The user is currently dragging from a tile, so let's see if they have dragged
	//over the top of an adjacent tile
	if (activeTile1 && !activeTile2) {

		//Get the location of where the pointer is currently
		var hoverX = gametile.input.x
		var hoverY = gametile.input.y

		//Figure out what position on the grid that translates to
		var hoverPosX = Math.floor(hoverX / tileWidth)
		var hoverPosY = Math.floor(hoverY / tileHeight)

		//See if the user had dragged over to another position on the grid
		var difX = (hoverPosX - startPosX)
		var difY = (hoverPosY - startPosY)

		//Make sure we are within the bounds of the grid
		if (!(hoverPosY > tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > tileGrid.length - 1 || hoverPosX < 0)) {

			//If the user has dragged an entire tiles width or height in the x or y direction
			//trigger a tile swap
			if ((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY == 0)) {

				//Prevent the player from making more moves whilst checking is in progress
				canMove = false

				//Set the second active tile (the one where the user dragged to)
				activeTile2 = tileGrid[hoverPosX][hoverPosY]

				//Swap the two active tiles
				swapTiles()

				//After the swap has occurred, check the grid for any matches
				gametile.time.events.add(500, function () {
					 checkMatch();
					canMove = true
				})
			}

		}

	}
}


function swapTiles() {


	//If there are two active tiles, swap their positions
	if (activeTile1 && activeTile2) {

		var tile1Pos = { x: (activeTile1.x - tileWidth / 2) / tileWidth, y: (activeTile1.y - tileHeight / 2) / tileHeight }
		var tile2Pos = { x: (activeTile2.x - tileWidth / 2) / tileWidth, y: (activeTile2.y - tileHeight / 2) / tileHeight }

		//Swap them in our "theoretical" grid
		tileGrid[tile1Pos.x][tile1Pos.y] = activeTile2
		tileGrid[tile2Pos.x][tile2Pos.y] = activeTile1

		//Actually move them on the screen
		gametile.add.tween(activeTile1).to({ x: tile2Pos.x * tileWidth + (tileWidth / 2), y: tile2Pos.y * tileHeight + (tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true)
		gametile.add.tween(activeTile2).to({ x: tile1Pos.x * tileWidth + (tileWidth / 2), y: tile1Pos.y * tileHeight + (tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true)

		activeTile1 = tileGrid[tile1Pos.x][tile1Pos.y]
		activeTile2 = tileGrid[tile2Pos.x][tile2Pos.y]

	}

}




function checkMatch() {

	//Call the getMatches function to check for spots where there is
	//a run of three or more tiles in a row
	var matches = getMatches(tileGrid)

	//If there are matches, remove them
	if (matches.length > 0) {

		//Remove the tiles
		removeTileGroup(matches)

		//Move the tiles currently on the board into their new positions
		resetTile()

		//Fill the board with new tiles wherever there is an empty spot
		fillTile()

		//Trigger the tileUp event to reset the active tiles
		gametile.time.events.add(500, function () {
			tileUp()
		});

		//Check again to see if the repositioning of tiles caused any new matches
		gametile.time.events.add(600, function () {
			checkMatch()
		})

	}
	else {

		//No match so just swap the tiles back to their original position and reset
		swapTiles()
		gametile.time.events.add(500, function () {
			tileUp()
			canMove = true
		})
	}

}



function tileUp() {

	//Reset the active tiles
	activeTile1 = null
	activeTile2 = null

}



function getMatches(tileGrid) {

	var matches = []
	var groups = []

	//Check for horizontal matches
	for (var i = 0; i < tileGrid.length; i++) {
		var tempArr = tileGrid[i]
		groups = []
		for (var j = 0; j < tempArr.length; j++) {
			if (j < tempArr.length - 2) {
				if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2]) {
					if (tileGrid[i][j].tileType == tileGrid[i][j + 1].tileType && tileGrid[i][j + 1].tileType == tileGrid[i][j + 2].tileType) {
						if (groups.length > 0) {
							if (groups.indexOf(tileGrid[i][j]) == -1) {
								matches.push(groups)
								groups = []
							}
						}

						if (groups.indexOf(tileGrid[i][j]) == -1) {
							groups.push(tileGrid[i][j])
						}
						if (groups.indexOf(tileGrid[i][j + 1]) == -1) {
							groups.push(tileGrid[i][j + 1])
						}
						if (groups.indexOf(tileGrid[i][j + 2]) == -1) {
							groups.push(tileGrid[i][j + 2])
						}
					}
				}
			}
		}
		if (groups.length > 0)
			matches.push(groups)
	}

	//Check for vertical matches
	for (j = 0; j < tileGrid.length; j++) {
		var tempArr = tileGrid[j]
		groups = []
		for (i = 0; i < tempArr.length; i++) {
			if (i < tempArr.length - 2)
				if (tileGrid[i][j] && tileGrid[i + 1][j] && tileGrid[i + 2][j]) {
					if (tileGrid[i][j].tileType == tileGrid[i + 1][j].tileType && tileGrid[i + 1][j].tileType == tileGrid[i + 2][j].tileType) {
						if (groups.length > 0) {
							if (groups.indexOf(tileGrid[i][j]) == -1) {
								matches.push(groups)
								groups = []
							}
						}
						if (groups.indexOf(tileGrid[i][j]) == -1) {
							groups.push(tileGrid[i][j]);
						}
						if (groups.indexOf(tileGrid[i + 1][j]) == -1) {
							groups.push(tileGrid[i + 1][j]);
						}
						if (groups.indexOf(tileGrid[i + 2][j]) == -1) {
							groups.push(tileGrid[i + 2][j])
						}
					}
				}
		}
		if (groups.length > 0)
			matches.push(groups)
	}
	return matches
}



function removeTileGroup(matches) {

	//Loop through all the matches and remove the associated tiles
	for (var i = 0; i < matches.length; i++) {
		var tempArr = matches[i]

		for (var j = 0; j < tempArr.length; j++) {

			var tile = tempArr[j]
			//Find where this tile lives in the theoretical grid
			var tilePos = getTilePos(tileGrid, tile)

			//Remove the tile from the screen
			tiles.remove(tile)

			//Change variables depending of the type of tile removed and show them
			changeGameVariables(tile.tileType)

			//Remove the tile from the theoretical grid
			if (tilePos.x != -1 && tilePos.y != -1) {
				tileGrid[tilePos.x][tilePos.y] = null
			}
		}
	}
}



function getTilePos(tileGrid, tile){
    var pos = {x:-1, y:-1}
 
    //Find the position of a specific tile in the grid
    for(var i = 0; i < tileGrid.length ; i++){
        for(var j = 0; j < tileGrid[i].length; j++){
            //There is a match at this position so return the grid coords
            if(tile == tileGrid[i][j]){
                pos.x = i
                pos.y = j
                break
            }
        }
    }
    return pos
}



function resetTile(){
 
    //Loop through each column starting from the left
    for (var i = 0; i < tileGrid.length; i++){
 
        //Loop through each tile in column from bottom to top
        for (var j = tileGrid[i].length - 1; j > 0; j--){
 
            //If this space is blank, but the one above it is not, move the one above down
            if(tileGrid[i][j] == null && tileGrid[i][j-1] != null){
                //Move the tile above down one
                var tempTile = tileGrid[i][j-1]
                tileGrid[i][j] = tempTile
                tileGrid[i][j-1] = null
 
                gametile.add.tween(tempTile).to({y:(tileHeight*j)+(tileHeight/2)}, 200, Phaser.Easing.Linear.In, true)
 
                //The positions have changed so start this process again from the bottom
                //NOTE: This is not set to me.tileGrid[i].length - 1 because it will immediately be decremented as
                //we are at the end of the loop.
                j = tileGrid[i].length
            }
        }
    }
 
}




function fillTile(){
 
    //Check for blank spaces in the grid and add new tiles at that position
    for(var i = 0; i < tileGrid.length; i++){
 
        for(var j = 0; j < tileGrid.length; j++){
 
            if (tileGrid[i][j] == null)
            {
                //Found a blank spot so lets add animate a tile there
                var tile = addTile(i, j);
 
                //And also update our "theoretical" grid
                tileGrid[i][j] = tile;
            }
 
        }
    }
 
}