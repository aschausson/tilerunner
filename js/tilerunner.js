
/**
 * Representa las variables generales del juego: puntuación, puntuación de bombas, cantidad de bombas,
 * velocidad de la partida, vida restante del personaje, un número aleatorio para que aparezcan los obstáculos, 
 * la dificultad y el nivel actual.
 * @class
 */
function GameVariables() {
	this.score = 0
	this.bombScore = 9
	this.bombs = 1
	this.speed = 0.5
	this.life = 100

	this.timerRandom
	this.difficulty = 1
	this.nivelActual = 0
	this.backgroundActual = 0

	this.minimumSpeed = 0.5
	this.speedRatio =  0.0002

	this.userPhoto
	this.userName
	this.userScore
}


/**Los diferentes tipos de casillas en el juego. 
 * @type {string|array} */
var tileTypes = ['tileSkull', 'tileBomb', 'tileHeart', 'tileClock', 'tileStar']
/**Los obstáculos en el suelo.
 * @type {string|array}
 */
var obstaclesGround = ['groundpuddle', 'groundspike', 'groundwire', 'groundstake']
/**Los obstáculos en el aire.
 * @type {string|array}
 */
var obstaclesAir = ['airdron', 'airenergy', 'aireagle']


/**Representa el primer juego, 'runner' y sus variables: ancho y alto en píxeles, el jugador y su animación, 
 * el array de obstáculos y el objeto juego.
 * @class
 */
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
	this.runnerBackground
	this.game = new Phaser.Game(this.width, this.height, Phaser.CANVAS, 'phaser-tilerunner', { preload: preload, create: create, update: update })

	this.music
}


/**Representa el segundo juego, 'tile' y sus variables: ancho y alto en píxeles, la variable booleana para permitir el movimiento, 
 * la posición X e Y desde donde comienza un movimiento, el ancho y alto de una casilla, el array donde se almacenarán las casillas,
 * las dos casillas que se activan al hacer un movimiento, un número aleatorio para seleccionar las casillas y el objeto juego.
 * @class
 */
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


/** @type {GameVariables} */
var variables = new GameVariables()
/** @type {GameRunner} */
var gameRunner = new GameRunner()
/** @type {GameTile} */
var gameTile = new GameTile()


/**Se cambian las variables del juego y se muestran en la interfaz, según el tipo de casilla destruida.
 * El tipo de variable destruido.
 * @param {string} tileType 
 */
function changeGameVariables(tileType) {
	if (tileType == "tileSkull") {
		variables.life -= 1 * variables.difficulty
	}
	else if (tileType == "tileBomb") {
		variables.bombScore += 1
		variables.bombs = Math.floor(variables.bombScore / 9)
	}
	else if (tileType == "tileHeart") {
		variables.life += 1
		if (variables.life >= 100)
			variables.life = 100
	}
	else if (tileType == "tileClock") {
		variables.speed -= 0.2
		if (variables.speed < 0.5)
			variables.speed = 0.5
	}
	else if (tileType == "tileStar") {
		variables.score += 100 * variables.difficulty
		if (variables.score >= (1500 * variables.difficulty * variables.nivelActual))
			siguienteNivel()
	}
	if (variables.life <= 0)
		endGame()

	$('#life').html(variables.life)
	$('#bombs').html(variables.bombs)
	$('#score').html(variables.score)
	var rounded = Math.round(variables.speed * 10) / 10;
	$('#speed').html(rounded)
}


function preload() {
	$('canvas').first().attr('id', 'gamerunner')
	$('canvas').last().attr('id', 'gametile')

	gameRunner.game.load.image('runnerfondo1', 'assets/runnerfondo1.png')
	gameRunner.game.load.image('runnerfondo2', 'assets/runnerfondo2.png')
	gameRunner.game.load.image('runnerfondo3', 'assets/runnerfondo3.png')
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

	gameRunner.game.load.audio('musica', 'assets/audio/tilerunnermusic.mp3')
}


function create() {
	gameRunner.game.physics.startSystem(Phaser.Physics.ARCADE)

	gameRunner.runnerBackground = gameRunner.game.add.tileSprite(0, 0, gameRunner.width, gameRunner.height, 'runnerfondo1')

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

	gameRunner.player = gameRunner.game.add.sprite(80, 145, 'robot')
	gameRunner.game.physics.enable(gameRunner.player, Phaser.Physics.ARCADE)
	gameRunner.player.body.collideWorldBounds = false;
	gameRunner.player.body.immovable = true;
	gameRunner.player.body.setSize(30, 54, 13, 6)

	gameRunner.game.input.keyboard.addKey(Phaser.Keyboard.B).onDown.addOnce(removeSkulls)
	runBottom()

	//  Here we create our timer events. They will be set to loop at a random value between 3 seconds and 4 seconds
	variables.timerRandom = gameRunner.game.time.events.loop(gameRunner.game.rnd.integerInRange(3000, 4000), updateCounter);
	gameRunner.game.physics.enable([gameRunner.player, gameRunner.obstacles], Phaser.Physics.ARCADE);

	// *true* param enables looping
	gameRunner.music = new Phaser.Sound(gameRunner.game,'musica',1,true)
	gameRunner.music.play()
}


function updateCounter() {
	gameRunner.game.time.events.remove(variables.timerRandom);

	var obstacle = null
	airOrGround = gameRunner.game.rnd.integerInRange(0, 1)
	if (airOrGround == 0) {
		randomObstacle = gameRunner.game.rnd.integerInRange(0, obstaclesGround.length)
		obstacle = gameRunner.game.add.sprite(gameRunner.width, 140, obstaclesGround[randomObstacle])
		obstacle.preUpdate()
	}
	else {
		randomObstacle = gameRunner.game.rnd.integerInRange(0, obstaclesAir.length)
		obstacle = gameRunner.game.add.sprite(gameRunner.width, 20, obstaclesAir[randomObstacle])
		obstacle.preUpdate()
	}
	
	gameRunner.obstacles.push(obstacle)
	gameRunner.player.bringToTop()
	gameRunner.game.physics.enable(obstacle, Phaser.Physics.ARCADE)
	obstacle.body.immovable = false
	obstacle.body.setSize(30, 30, 25, 25)
}


function bottom() {
	gameRunner.player.loadTexture('robot')
	gameRunner.game.input.onDown.addOnce(flyMid)
	gameRunner.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(flyMid)
	gameRunner.player.anchor.setTo(0.5, 0.5)
	gameRunner.player.frame = 0

	gameRunner.player.animations.add('run', [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
	gameRunner.animationRun = gameRunner.player.animations.play('run', 6, true)

	
}


function runBottom() {
	var tween = null
	if (gameRunner.player.y < 145)
		tween = gameRunner.game.add.tween(gameRunner.player).to({ y: 145 }, 200, Phaser.Easing.Linear.None, true)

	if (tween == null) {
		bottom()
	}
	else {
		tween.onComplete.add(bottom)
	}
}


function flyMid() {
	gameRunner.player.loadTexture('robotfly')
	gameRunner.game.input.onDown.addOnce(runBottom)
	gameRunner.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(runBottom)
	gameRunner.player.anchor.setTo(0.5, 0.5)
	gameRunner.player.frame = 0
	gameRunner.player.animations.add('fly', [0, 1, 2, 3])
	gameRunner.animationFly = gameRunner.player.animations.play('fly', 10, true)

	gameRunner.game.add.tween(gameRunner.player).to({ y: 85 }, 200, Phaser.Easing.Linear.None, true)

	
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
		checkMatch();
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


function update() {
	if ($('#botonPausar').hasClass('pausa')) {
		gameRunner.game.paused = true
		gameTile.game.paused = true
	}

	gameRunner.runnerBackground.tilePosition.x -= variables.speed
	variables.speed += variables.speedRatio  * variables.difficulty
	var rounded = Math.round(variables.speed * 10) / 10
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
}


function enemyHitsPlayer(player, obs) {
	obs.kill()
	variables.life -= 10

	$('#life').html(variables.life)
	changeGameVariables(' ')
}




function swapTiles() {
	//If there are two active tiles, swap their positions
	if (gameTile.activeTile1 && gameTile.activeTile2) {

		var tile1Pos = { x: (gameTile.activeTile1.x - gameTile.tileWidth / 2) / gameTile.tileWidth, y: (gameTile.activeTile1.y - gameTile.tileHeight / 2) / gameTile.tileHeight }
		var tile2Pos = { x: (gameTile.activeTile2.x - gameTile.tileWidth / 2) / gameTile.tileWidth, y: (gameTile.activeTile2.y - gameTile.tileHeight / 2) / gameTile.tileHeight }

		//Swap them in our "theoretical" grid
		gameTile.tileGrid[tile1Pos.x][tile1Pos.y] = gameTile.activeTile2
		gameTile.tileGrid[tile2Pos.x][tile2Pos.y] = gameTile.activeTile1

		//Actually move them on the screen
		gameTile.game.add.tween(gameTile.activeTile1).to({ x: tile2Pos.x * gameTile.tileWidth + (gameTile.tileWidth / 2), y: tile2Pos.y * gameTile.tileHeight + (gameTile.tileHeight / 2) }, 100, Phaser.Easing.Linear.In, true)
		gameTile.game.add.tween(gameTile.activeTile2).to({ x: tile1Pos.x * gameTile.tileWidth + (gameTile.tileWidth / 2), y: tile1Pos.y * gameTile.tileHeight + (gameTile.tileHeight / 2) }, 100, Phaser.Easing.Linear.In, true)

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
		gameTile.game.time.events.add(600, function () {
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


function removeSkulls() {
	if (variables.bombs > 0) {
		gameTile.canMove = false

		var group = []
		for (let i = 0; i < gameTile.tileGrid.length; i++) {
			for (let j = 0; j < gameTile.tileGrid[0].length; j++) {
				if (gameTile.tileGrid[i][j].tileType == 'tileSkull')
					group.push(gameTile.tileGrid[i][j])
			}
		}
		var matches = []
		matches.push(group)
		removeTileGroup(matches)
		fillTile()

		variables.bombs--
		variables.bombScore = variables.bombScore - 9
		changeGameVariables(' ')
	}
	checkMatch()
}