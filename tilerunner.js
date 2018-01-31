

function GameVariables() {
	this.score = 0
	this.bombs = 0
	this.speed = 0.5
	this.life = 100

	this.timerRandom
}


var tileTypes = ['tileSkull', 'tileBomb', 'tileHeart', 'tileClock', 'tileStar']
var obstaclesGround = ['groundpuddle','groundspike','groundwire','groundstake']
var obstaclesAir = ['airdron','airenergy','aireagle']
var obstacles = ['groundpuddle','groundspike','groundwire','groundstake','airdron','airenergy','aireagle']

function Tile(posX, posY, estado) {
	this.posX = posX
	this.posY = posY
	this.estado = estado
}


function GameRunner() {
	this.originalWidth = 1875
	this.originalHeight = 450

	this.width = 360
	this.height = 180
	if ($(window).width() >= 768) {
		this.width = 410
		this.height = 205
	}

	this.widthRatio = this.width / this.originalWidth
	this.heightRatio = this.height / this.originalHeight

	this.player
	this.animationRun
	this.obstacles = []

	this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, 'phaser-tilerunner', { preload: preload, create: create, update: update })
}


function GameTile() {
	this.originalWidth = 900
	this.originalHeight = 900
	this.width = 306
	this.height = 306
	if ($(window).width() >= 768) {
		this.width = 348
		this.height = 348
	}
	this.widthRatio = this.width / this.originalWidth
	this.heightRatio = this.height / this.originalHeight

	this.canMove
	this.startPosX = 0
	this.startPosY = 0

	this.tileWidth = 0
	this.tileHeight = 0

	this.tileGrid
	this.activeTile1
	this.activeTile2
	this.randomNum

	this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, 'phaser-tilerunner', { preload: preload, create: create, update: update })
}


var variables = new GameVariables()
var gameRunner = new GameRunner()
var gameTile = new GameTile()


function changeGameVariables(tileType) {
	if (tileType == "tileSkull"){
		variables.life -= 1
		if (variables.life <= 0)
			endGame()
	}
	else if (tileType == "tileBomb")
		variables.bombs += 1
	else if (tileType == "tileHeart"){
		if (variables.life >= 100)
			variables.life = 100
	}
		
	else if (tileType == "tileClock") {
		variables.speed -= 0.2
		if (variables.speed < 0.5)
			variables.speed = 0.5
	}

	else if (tileType == "tileStar")
		variables.score += 100

	$('#life').html(variables.life)
	$('#bombs').html(variables.bombs)
	$('#score').html(variables.score)

	var rounded = Math.round(variables.speed * 10) / 10;
	$('#speed').html(rounded)
}


function preload() {
	$('canvas').first().attr('id', 'gamerunner')
	$('canvas').last().attr('id', 'gametile')

	gameRunner.game.load.image('runnerfondo22', 'assets/runnerfondo222.png')

	gameTile.game.load.image('tilefondo', 'assets/tiles/board.png')
	gameTile.game.load.image('tileSkull', 'assets/tiles/skullchip.png')
	gameTile.game.load.image('tileBomb', 'assets/tiles/bombchip.png')
	gameTile.game.load.image('tileHeart', 'assets/tiles/heartchip.png')
	gameTile.game.load.image('tileClock', 'assets/tiles/timechip.png')
	gameTile.game.load.image('tileStar', 'assets/tiles/starchip.png')

	gameRunner.game.load.spritesheet('robot', 'assets/runner/robot3.png', 60, 64)
	gameRunner.game.load.spritesheet('robotfly', 'assets/runner/robotfly.png', 56, 91)

	gameRunner.game.load.image('groundpuddle', 'assets/runner/ground_puddle.png')
	gameRunner.game.load.image('groundspike', 'assets/runner/ground_wire.png')
	gameRunner.game.load.image('groundwire', 'assets/runner/ground_wire.png')
	gameRunner.game.load.image('groundstake', 'assets/runner/ground_stake.png')
	gameRunner.game.load.image('airdron', 'assets/runner/air_dron.png')
	gameRunner.game.load.image('airenergy', 'assets/runner/air_energy.png')
	gameRunner.game.load.image('aireagle', 'assets/runner/air_eagle.png')
}

var num = 1

function create() {
	gameRunner.game.physics.startSystem(Phaser.Physics.ARCADE)

	runnerBackground = gameRunner.game.add.tileSprite(0, 0, gameRunner.width, gameRunner.height, 'runnerfondo22')
	//	runnerBackground.scale.setTo(gameRunner.widthRatio, gameRunner.heightRatio)

	tileBackground = gameTile.game.add.tileSprite(0, 0, gameTile.originalWidth, gameTile.originalHeight, 'tilefondo')
	tileBackground.scale.setTo(gameTile.widthRatio, gameTile.heightRatio)

	gameTile.activeTile1 = null
	gameTile.activeTile2 = null

	gameTile.tileWidth = gameTile.width / 6
	gameTile.tileHeight = gameTile.height / 6

	gameTile.canMove = false

	tiles = gameTile.game.add.group()

	gameTile.tileGrid = [
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null]
	]

	var seed = Date.now()
	gameTile.randomNum = new Phaser.RandomDataGenerator([seed])

	changeGameVariables('')
	initTiles()


	//	gameRunner.obstacles.enableBody = true;
	//	gameRunner.obstacles.physicsBodyType = Phaser.Physics.ARCADE;

	//	gameRunner.obstacles.collideWorldBounds = true;
	
	/*
	
	//  https://phaser.io/examples/v2/tilemaps/blank-tilemap
	// https://www.joshmorony.com/how-to-create-a-candy-crush-or-bejeweled-game-in-phaser/

    //tilebackground = gameTile.game.add.tileSprite(0, 0, anchoTotal, 800, 'tilefondo')
	
	
	//tile = gameTile.game.add.sprite(0, 0, 50, 50, 'tileCalavera');
	//tile.anchor.setTo(0, 0);


    //  Creates a blank tilemap
		map = gameTile.game.add.tilemap();
		
		map.addTilesetImage('tileCalavera');
	
		//  Add a Tileset image to the map
		map.addTilesetImage('tilefondo');
	
		//  Creates a new blank layer and sets the map dimensions.
		//  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
		layer1 = map.create('level1', 800, 800, 133, 133);
*/
	/*
	tileMap = new Tilemap(gameTile.game, null, 130, 130, 6, 6)
	tileLayer = new TilemapLayer(gameTile.game, tileMap, 0, 800, 800)
	tile = new Tile(tileLayer, 0, 0, 0, 130, 130)
	*/

	// https://www.joshmorony.com/how-to-create-an-animated-character-using-sprites-in-phaser/
		//player.scale.setTo(2, 2);
	//player.scale.x *= -1
	gameRunner.player = gameRunner.game.add.sprite(80, 145, 'robot')
	gameRunner.game.physics.enable(gameRunner.player, Phaser.Physics.ARCADE)
	gameRunner.player.body.collideWorldBounds = false;
	gameRunner.player.body.immovable = true;

	runBottom()

	//  Here we create our timer events. They will be set to loop at a random value between 250ms and 1000ms
	variables.timerRandom = gameRunner.game.time.events.loop(gameRunner.game.rnd.integerInRange(3000, 5000), updateCounter);
	//gameRunner.game.time.events.loop(Phaser.Timer.SECOND*num, updateCounter, this);
	gameRunner.game.physics.enable([ gameRunner.player, gameRunner.obstacles ], Phaser.Physics.ARCADE);
}

function updateCounter(){
	gameRunner.game.time.events.remove(variables.timerRandom);
	//num++
	//$('#botonJugar').html(num)
	var obstacle = null
	airOrGround = gameRunner.game.rnd.integerInRange(0, 1)
	if (airOrGround == 0){
		randomObstacle = gameRunner.game.rnd.integerInRange(0, obstaclesGround.length)
		obstacle = gameRunner.game.add.sprite(gameRunner.width, 140, obstaclesGround[randomObstacle])
	}
	else{
		randomObstacle = gameRunner.game.rnd.integerInRange(0, obstaclesAir.length)
		obstacle = gameRunner.game.add.sprite(gameRunner.width, 35, obstaclesAir[randomObstacle])
	}
	gameRunner.game.physics.enable(obstacle, Phaser.Physics.ARCADE)
	obstacle.body.immovable = false;

	//obstacle.gameRunner.game.add.group()
	gameRunner.obstacles.push(obstacle)
	gameRunner.player.bringToTop()
}



function bottom(){
	gameRunner.player.loadTexture('robot')
	gameRunner.player.anchor.setTo(0.5, 0.5)
	gameRunner.player.frame = 0

	gameRunner.player.animations.add('run', [10,9,8,7,6,5,4,3,2,1,0])
	gameRunner.animationRun = gameRunner.player.animations.play('run', 6, true)

	gameRunner.game.input.onDown.addOnce(flyMid)
	gameRunner.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(flyMid)

}


function runBottom(){
	
	var tween = null

	if (gameRunner.player.y < 145)
		tween = gameRunner.game.add.tween(gameRunner.player).to( { y: 145 }, 500, Phaser.Easing.Linear.None, true)

	if (tween == null){
		bottom()
	}
	else{
		tween.onComplete.add(bottom)
	}
	
}


function flyMid(){
	gameRunner.player.loadTexture('robotfly')
	gameRunner.player.anchor.setTo(0.5, 0.5)
	gameRunner.player.frame = 0
	gameRunner.player.animations.add('fly', [0,1,2,3])
	gameRunner.animationFly = gameRunner.player.animations.play('fly', 10, true)

	gameRunner.game.add.tween(gameRunner.player).to( { y: 95 }, 500, Phaser.Easing.Linear.None, true)

	gameRunner.game.input.onDown.addOnce(runBottom)
	gameRunner.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(runBottom)
}


function initTiles() {
	for (var i = 0; i < gameTile.tileGrid.length; i++) {
		for (var j = 0; j < gameTile.tileGrid.length; j++) {
			var tile = addTile(i, j)
			gameTile.tileGrid[i][j] = tile

		}
	}

	//Once the tiles are ready, check for any matches on the grid
	gameTile.game.time.events.add(600, function () {
		//	checkMatch();
		gameTile.canMove = true
	})

}

function addTile(x, y) {

	var tileToAdd = tileTypes[gameTile.randomNum.integerInRange(0, tileTypes.length - 1)]

	//Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
	var tile = tiles.create((x * gameTile.tileWidth) + gameTile.tileWidth / 2, 0, tileToAdd)

	tile.scale.setTo(gameTile.widthRatio, gameTile.heightRatio)

	//Animate the tile into the correct vertical position
	gameTile.game.add.tween(tile).to({ y: y * gameTile.tileHeight + (gameTile.tileHeight / 2) }, 100, Phaser.Easing.Linear.In, true)

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
	if (gameTile.canMove) {
		gameTile.activeTile1 = tile

		gameTile.startPosX = (tile.x - gameTile.tileWidth / 2) / gameTile.tileWidth
		gameTile.startPosY = (tile.y - gameTile.tileHeight / 2) / gameTile.tileHeight
	}

}


function collision(){
	
}



function update() {
	runnerBackground.tilePosition.x -= variables.speed
	variables.speed += 0.0002
	var rounded = Math.round(variables.speed * 10) / 10;
	$('#speed').html(rounded)

	gameRunner.animationRun.speed = variables.speed * 9

	for (let i = 0; i < gameRunner.obstacles.length; i++) {
		
		gameRunner.obstacles[i].x -= variables.speed
	}

	for (var i = 0; i < gameRunner.obstacles.length; i++) {
		gameRunner.game.physics.arcade.overlap(gameRunner.player, gameRunner.obstacles[i], enemyHitsPlayer, null, this);
	}

	//The user is currently dragging from a tile, so let's see if they have dragged
	//over the top of an adjacent tile
	if (gameTile.activeTile1 && !gameTile.activeTile2) {

		//Get the location of where the pointer is currently
		var hoverX = gameTile.game.input.x
		var hoverY = gameTile.game.input.y

		//Figure out what position on the grid that translates to
		var hoverPosX = Math.floor(hoverX / gameTile.tileWidth)
		var hoverPosY = Math.floor(hoverY / gameTile.tileHeight)

		//See if the user had dragged over to another position on the grid
		var difX = (hoverPosX - gameTile.startPosX)
		var difY = (hoverPosY - gameTile.startPosY)

		//Make sure we are within the bounds of the grid
		if (!(hoverPosY > gameTile.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > gameTile.tileGrid.length - 1 || hoverPosX < 0)) {

			//If the user has dragged an entire tiles width or height in the x or y direction
			//trigger a tile swap
			if ((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY == 0)) {

				//Prevent the player from making more moves whilst checking is in progress
				gameTile.canMove = false

				//Set the second active tile (the one where the user dragged to)
				gameTile.activeTile2 = gameTile.tileGrid[hoverPosX][hoverPosY]

				//Swap the two active tiles
				swapTiles()

				//After the swap has occurred, check the grid for any matches
				gameTile.game.time.events.add(500, function () {
					checkMatch();
					gameTile.canMove = true
				})
			}

		}

	}
	//game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
}



function enemyHitsPlayer (player,obs) {
    
    obs.kill();
variables.life -= 10

$('#life').html(variables.life)
}
	

/*
game.physics.startSystem(Phaser.Physics.ARCADE);

game.physics.enable(player, Phaser.Physics.ARCADE);
    // The enemy's bullets
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);


function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}


function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}

*/


function swapTiles() {


	//If there are two active tiles, swap their positions
	if (gameTile.activeTile1 && gameTile.activeTile2) {

		var tile1Pos = { x: (gameTile.activeTile1.x - gameTile.tileWidth / 2) / gameTile.tileWidth, y: (gameTile.activeTile1.y - gameTile.tileHeight / 2) / gameTile.tileHeight }
		var tile2Pos = { x: (gameTile.activeTile2.x - gameTile.tileWidth / 2) / gameTile.tileWidth, y: (gameTile.activeTile2.y - gameTile.tileHeight / 2) / gameTile.tileHeight }

		//Swap them in our "theoretical" grid
		gameTile.tileGrid[tile1Pos.x][tile1Pos.y] = gameTile.activeTile2
		gameTile.tileGrid[tile2Pos.x][tile2Pos.y] = gameTile.activeTile1

		//Actually move them on the screen
		gameTile.game.add.tween(gameTile.activeTile1).to({ x: tile2Pos.x * gameTile.tileWidth + (gameTile.tileWidth / 2), y: tile2Pos.y * gameTile.tileHeight + (gameTile.tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true)
		gameTile.game.add.tween(gameTile.activeTile2).to({ x: tile1Pos.x * gameTile.tileWidth + (gameTile.tileWidth / 2), y: tile1Pos.y * gameTile.tileHeight + (gameTile.tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true)

		gameTile.activeTile1 = gameTile.tileGrid[tile1Pos.x][tile1Pos.y]
		gameTile.activeTile2 = gameTile.tileGrid[tile2Pos.x][tile2Pos.y]

	}

}




function checkMatch() {

	//Call the getMatches function to check for spots where there is
	//a run of three or more tiles in a row
	var matches = getMatches(gameTile.tileGrid)

	//If there are matches, remove them
	if (matches.length > 0) {

		//Remove the tiles
		removeTileGroup(matches)

		//Move the tiles currently on the board into their new positions
		resetTile()

		//Fill the board with new tiles wherever there is an empty spot
		fillTile()

		//Trigger the tileUp event to reset the active tiles
		gameTile.game.time.events.add(500, function () {
			tileUp()
		});

		//Check again to see if the repositioning of tiles caused any new matches
		gameTile.game.time.events.add(600, function () {
			checkMatch()
		})

	}
	else {

		//No match so just swap the tiles back to their original position and reset
		swapTiles()
		gameTile.game.time.events.add(500, function () {
			tileUp()
			gameTile.canMove = true
		})
	}

}



function tileUp() {

	//Reset the active tiles
	gameTile.activeTile1 = null
	gameTile.activeTile2 = null

}



function getMatches(tileGrid) {

	var matches = []
	var groups = []

	//Check for horizontal matches
	for (var i = 0; i < gameTile.tileGrid.length; i++) {
		var tempArr = gameTile.tileGrid[i]
		groups = []
		for (var j = 0; j < tempArr.length; j++) {
			if (j < tempArr.length - 2) {
				if (gameTile.tileGrid[i][j] && gameTile.tileGrid[i][j + 1] && gameTile.tileGrid[i][j + 2]) {
					if (gameTile.tileGrid[i][j].tileType == gameTile.tileGrid[i][j + 1].tileType && gameTile.tileGrid[i][j + 1].tileType == gameTile.tileGrid[i][j + 2].tileType) {
						if (groups.length > 0) {
							if (groups.indexOf(gameTile.tileGrid[i][j]) == -1) {
								matches.push(groups)
								groups = []
							}
						}

						if (groups.indexOf(gameTile.tileGrid[i][j]) == -1) {
							groups.push(gameTile.tileGrid[i][j])
						}
						if (groups.indexOf(gameTile.tileGrid[i][j + 1]) == -1) {
							groups.push(gameTile.tileGrid[i][j + 1])
						}
						if (groups.indexOf(gameTile.tileGrid[i][j + 2]) == -1) {
							groups.push(gameTile.tileGrid[i][j + 2])
						}
					}
				}
			}
		}
		if (groups.length > 0)
			matches.push(groups)
	}

	//Check for vertical matches
	for (j = 0; j < gameTile.tileGrid.length; j++) {
		var tempArr = gameTile.tileGrid[j]
		groups = []
		for (i = 0; i < tempArr.length; i++) {
			if (i < tempArr.length - 2)
				if (gameTile.tileGrid[i][j] && gameTile.tileGrid[i + 1][j] && gameTile.tileGrid[i + 2][j]) {
					if (gameTile.tileGrid[i][j].tileType == gameTile.tileGrid[i + 1][j].tileType && gameTile.tileGrid[i + 1][j].tileType == gameTile.tileGrid[i + 2][j].tileType) {
						if (groups.length > 0) {
							if (groups.indexOf(gameTile.tileGrid[i][j]) == -1) {
								matches.push(groups)
								groups = []
							}
						}
						if (groups.indexOf(gameTile.tileGrid[i][j]) == -1) {
							groups.push(gameTile.tileGrid[i][j]);
						}
						if (groups.indexOf(gameTile.tileGrid[i + 1][j]) == -1) {
							groups.push(gameTile.tileGrid[i + 1][j]);
						}
						if (groups.indexOf(gameTile.tileGrid[i + 2][j]) == -1) {
							groups.push(gameTile.tileGrid[i + 2][j])
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
			var tilePos = getTilePos(gameTile.tileGrid, tile)

			//Remove the tile from the screen
			tiles.remove(tile)

			//Change variables depending of the type of tile removed and show them
			changeGameVariables(tile.tileType)

			//Remove the tile from the theoretical grid
			if (tilePos.x != -1 && tilePos.y != -1) {
				gameTile.tileGrid[tilePos.x][tilePos.y] = null
			}
		}
	}
}



function getTilePos(tileGrid, tile) {
	var pos = { x: -1, y: -1 }

	//Find the position of a specific tile in the grid
	for (var i = 0; i < gameTile.tileGrid.length; i++) {
		for (var j = 0; j < gameTile.tileGrid[i].length; j++) {
			//There is a match at this position so return the grid coords
			if (tile == gameTile.tileGrid[i][j]) {
				pos.x = i
				pos.y = j
				break
			}
		}
	}
	return pos
}



function resetTile() {

	//Loop through each column starting from the left
	for (var i = 0; i < gameTile.tileGrid.length; i++) {

		//Loop through each tile in column from bottom to top
		for (var j = gameTile.tileGrid[i].length - 1; j > 0; j--) {

			//If this space is blank, but the one above it is not, move the one above down
			if (gameTile.tileGrid[i][j] == null && gameTile.tileGrid[i][j - 1] != null) {
				//Move the tile above down one
				var tempTile = gameTile.tileGrid[i][j - 1]
				gameTile.tileGrid[i][j] = tempTile
				gameTile.tileGrid[i][j - 1] = null

				gameTile.game.add.tween(tempTile).to({ y: (gameTile.tileHeight * j) + (gameTile.tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true)

				//The positions have changed so start this process again from the bottom
				//NOTE: This is not set to me.gameTile.tileGrid[i].length - 1 because it will immediately be decremented as
				//we are at the end of the loop.
				j = gameTile.tileGrid[i].length
			}
		}
	}

}




function fillTile() {

	//Check for blank spaces in the grid and add new tiles at that position
	for (var i = 0; i < gameTile.tileGrid.length; i++) {

		for (var j = 0; j < gameTile.tileGrid.length; j++) {

			if (gameTile.tileGrid[i][j] == null) {
				//Found a blank spot so lets add animate a tile there
				var tile = addTile(i, j);

				//And also update our "theoretical" grid
				gameTile.tileGrid[i][j] = tile;
			}

		}
	}

}