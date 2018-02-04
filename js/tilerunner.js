
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

	this.puntuacionMaxPropia = 0
    this.puntuacionMaxTotal = 0
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

/**Se precargan los ficheros que necesita el juego. */
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

/**Se instancian las variables necesarias para el juego, jugador, casillas.. y se llama a métodos para inicializarlas. */
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

	variables.timerRandom = gameRunner.game.time.events.loop(gameRunner.game.rnd.integerInRange(3000, 4000), updateCounter);
	gameRunner.game.physics.enable([gameRunner.player, gameRunner.obstacles], Phaser.Physics.ARCADE);

}


/**Se crean nuevos obstáculos de forma aleatoria, ya sea volador o de tierra, y el modelo. */
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


/**Anima al jugador para que corra cuando está en el suelo. */
function bottom() {
	gameRunner.player.loadTexture('robot')
	gameRunner.game.input.onDown.addOnce(flyMid)
	gameRunner.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(flyMid)
	gameRunner.player.anchor.setTo(0.5, 0.5)
	gameRunner.player.frame = 0

	gameRunner.player.animations.add('run', [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
	gameRunner.animationRun = gameRunner.player.animations.play('run', 6, true)
}


/**Anima al jugador para que baje del aire al suelo. */
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


/**Anima al jugador para que suba del suelo al aire. */
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


/**Se inicializa todo el tablero con casillas aleatorias. */
function initTiles() {
	for (var i = 0; i < gameTile.tileGrid.length; i++) {
		for (var j = 0; j < gameTile.tileGrid.length; j++) {
			var tile = addTile(i, j)
			gameTile.tileGrid[i][j] = tile
		}
	}
	gameTile.game.time.events.add(600, function () {
		checkMatch();
	})
}


/**Se añade una casilla y si animación en la posición dada. */
function addTile(x, y) {
	var tileToAdd = tileTypes[gameTile.randomNum.integerInRange(0, tileTypes.length - 1)]
	var tile = tiles.create((x * gameTile.tileWidth) + gameTile.tileWidth / 2, 0, tileToAdd)
	tile.scale.setTo(gameTile.widthRatio, gameTile.heightRatio)
	gameTile.game.add.tween(tile).to({ y: y * gameTile.tileHeight + (gameTile.tileHeight / 2) }, 100, Phaser.Easing.Linear.In, true)
	tile.anchor.setTo(0.5, 0.5)
	tile.inputEnabled = true
	tile.tileType = tileToAdd
	tile.events.onInputDown.add(tileDown, this)

	return tile
}


/**Cuando se hace click en una casilla, averigua cual es en el tablero. */
function tileDown(tile, pointer) {
	if (gameTile.canMove) {
		gameTile.activeTile1 = tile

		gameTile.startPosX = (tile.x - gameTile.tileWidth / 2) / gameTile.tileWidth
		gameTile.startPosY = (tile.y - gameTile.tileHeight / 2) / gameTile.tileHeight
	}
}


/**Función de actualización de cada juego. Se mueve el fondo, los obstáculos, se comprueba si se ha hecho un movimiento  y se aumenta la velocidad del juego. */
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

	if (gameTile.activeTile1 && !gameTile.activeTile2) {
		var hoverX = gameTile.game.input.x
		var hoverY = gameTile.game.input.y

		var hoverPosX = Math.floor(hoverX / gameTile.tileWidth)
		var hoverPosY = Math.floor(hoverY / gameTile.tileHeight)

		var difX = (hoverPosX - gameTile.startPosX)
		var difY = (hoverPosY - gameTile.startPosY)

		if (!(hoverPosY > gameTile.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > gameTile.tileGrid.length - 1 || hoverPosX < 0)) {
			if ((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY == 0)) {
				gameTile.canMove = false
				gameTile.activeTile2 = gameTile.tileGrid[hoverPosX][hoverPosY]
				swapTiles()

				gameTile.game.time.events.add(500, function () {
					checkMatch();
					gameTile.canMove = true
				})
			}
		}
	}
}


/**Se llama cuando el jugador choca con un obstáculo. */
function enemyHitsPlayer(player, obs) {
	obs.kill()
	variables.life -= 10

	$('#life').html(variables.life)
	changeGameVariables(' ')
}


/**Se crean las animaciones que hacen que dos casillas intercambien la posición. */
function swapTiles() {
	if (gameTile.activeTile1 && gameTile.activeTile2) {

		var tile1Pos = { x: (gameTile.activeTile1.x - gameTile.tileWidth / 2) / gameTile.tileWidth, y: (gameTile.activeTile1.y - gameTile.tileHeight / 2) / gameTile.tileHeight }
		var tile2Pos = { x: (gameTile.activeTile2.x - gameTile.tileWidth / 2) / gameTile.tileWidth, y: (gameTile.activeTile2.y - gameTile.tileHeight / 2) / gameTile.tileHeight }

		gameTile.tileGrid[tile1Pos.x][tile1Pos.y] = gameTile.activeTile2
		gameTile.tileGrid[tile2Pos.x][tile2Pos.y] = gameTile.activeTile1

		gameTile.game.add.tween(gameTile.activeTile1).to({ x: tile2Pos.x * gameTile.tileWidth + (gameTile.tileWidth / 2), y: tile2Pos.y * gameTile.tileHeight + (gameTile.tileHeight / 2) }, 100, Phaser.Easing.Linear.In, true)
		gameTile.game.add.tween(gameTile.activeTile2).to({ x: tile1Pos.x * gameTile.tileWidth + (gameTile.tileWidth / 2), y: tile1Pos.y * gameTile.tileHeight + (gameTile.tileHeight / 2) }, 100, Phaser.Easing.Linear.In, true)

		gameTile.activeTile1 = gameTile.tileGrid[tile1Pos.x][tile1Pos.y]
		gameTile.activeTile2 = gameTile.tileGrid[tile2Pos.x][tile2Pos.y]
	}
}


/**Se llama a la lista de funciones que comprueban emparejamientos, los borran, rellenan el tablero y se vuelve a comprobar. */
function checkMatch() {
	var matches = getMatches(gameTile.tileGrid)

	if (matches.length > 0) {
		removeTileGroup(matches)
		resetTile()
		fillTile()
		gameTile.game.time.events.add(500, function () {
			tileUp()
		});
		gameTile.game.time.events.add(600, function () {
			checkMatch()
		})
	}
	else {
		swapTiles()
		gameTile.game.time.events.add(600, function () {
			tileUp()
			gameTile.canMove = true
		})
	}
}


/**Se cancelan las casillas que fueron activadas. */
function tileUp() {
	gameTile.activeTile1 = null
	gameTile.activeTile2 = null
}


/**Se comprueban los emparejamientos horizontales y verticales en el tablero. Se agrupan para después ser eliminadas. */
function getMatches(tileGrid) {
	var matches = []
	var groups = []
	//horizontales
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
	//verticales
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


/**Se borra un grupo de casillas coincidentes del tablero. */
function removeTileGroup(matches) {
	for (var i = 0; i < matches.length; i++) {
		var tempArr = matches[i]
		for (var j = 0; j < tempArr.length; j++) {
			var tile = tempArr[j]
			var tilePos = getTilePos(gameTile.tileGrid, tile)
			tiles.remove(tile)
			changeGameVariables(tile.tileType)
			if (tilePos.x != -1 && tilePos.y != -1) {
				gameTile.tileGrid[tilePos.x][tilePos.y] = null
			}
		}
	}
}


/**Se devuelve la posición X e Y de una casilla del tablero. */
function getTilePos(tileGrid, tile) {
	var pos = { x: -1, y: -1 }
	for (var i = 0; i < gameTile.tileGrid.length; i++) {
		for (var j = 0; j < gameTile.tileGrid[i].length; j++) {
			if (tile == gameTile.tileGrid[i][j]) {
				pos.x = i
				pos.y = j
				break
			}
		}
	}
	return pos
}


/**Se deshace el movimiento hecho, si no creaba ningún emparejamiento. */
function resetTile() {
	for (var i = 0; i < gameTile.tileGrid.length; i++) {
		for (var j = gameTile.tileGrid[i].length - 1; j > 0; j--) {
			if (gameTile.tileGrid[i][j] == null && gameTile.tileGrid[i][j - 1] != null) {

				var tempTile = gameTile.tileGrid[i][j - 1]
				gameTile.tileGrid[i][j] = tempTile
				gameTile.tileGrid[i][j - 1] = null

				gameTile.game.add.tween(tempTile).to({ y: (gameTile.tileHeight * j) + (gameTile.tileHeight / 2) }, 200, Phaser.Easing.Linear.In, true)

				j = gameTile.tileGrid[i].length
			}
		}
	}
}


/**Se rellenan las casillas vacias del tablero */
function fillTile() {
	for (var i = 0; i < gameTile.tileGrid.length; i++) {
		for (var j = 0; j < gameTile.tileGrid.length; j++) {
			if (gameTile.tileGrid[i][j] == null) {
				var tile = addTile(i, j);

				gameTile.tileGrid[i][j] = tile;
			}
		}
	}
}


/**Se borran las casillas de calavera. */
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