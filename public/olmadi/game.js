kaboom({
	fullscreen: true,
	scale: 2,
	startScene: "main",
	version: "0.5.0",
	clearColor: [0, 0, 0, 0],
	global: true,
});

const MOVE_SPEED = 240

loadSprite("bg", "sprites/bg.png");
loadSprite("player", "sprites/Gladiator-Sprite Sheet.png", {
	sliceX: 8,
	sliceY: 5,
	anims: {
        idle: {
            from: 0,
            to: 4,
        },
        run: {
            from: 8,
            to: 15,
        },
    },
});

loadSprite("ground", "sprites/TX Tileset Grass.png", {
	sliceX: 2,
	sliceY: 2,
});

loadSprite("plant", "sprites/TX Plant.png", {
	sliceX: 3.75,
	sliceY: 3,
});

loadSprite("heykel", "sprites/heykel.png");

loadSprite("mezar", "sprites/mezar.png");

loadSprite("forest", "sprites/forest_tiles.png", {
	sliceX: 16,
	sliceY: 16,
});

scene("game", ({ level=0 }) => {
	gravity(0);
	layers(["bg", "obj", "ui"], "obj");
	camIgnore(["ui"]);

	const maps = [
		[
			"ddddddddddddddddddddddddddddddddd",
			"ddddddddddddddddddddddddddddddddd",
			"ddddddddddddddddddddddddddddddddd",
			"ddddddddddddddddddddddddddddddddd",
			"ddddddddddddddddddddddddddddddddd",
			"dddddctttttttttttttttttttttvddddd",
			"dddddlaaaaaaaaaaaaaaaaaaaaarddddd",
			"dddddlaa---aaaaopaaaaaaaaaarddddd",
			"dddddlaa---aaaaaaaaaaaaaaaarddddd",
			"dddddlaa---aaaaaaaaaaaaaaaarddddd",
			"dddddlaaaaaaaaaaaaaaaaaaaaarddddd",
			"dddddlaaaaaaaaaaaaaaaaaaaaarddddd",
			"dddddlaaaaaaaaaaaaaaaaaaaaarddddd",
			"dddddlaaaaaaaaaaaa123aaaaaarddddd",
			"dddddlaaaaaaaaaaaa456aaaaaarddddd",
			"dddddlaaaaaaaaaaaa789aaaaaarddddd",
			"dddddlaaaaaaaaaaaaaaaaaaaaarddddd",
			"dddddlaaaaaaaaaaaaaaaaaaaaarddddd",
			"dddddlaaaaaaaaaaaaaaaaaaaaarddddd",
			"dddddlaaaaaaaaaaaaaaaaaaaaarddddd",
			"dddddkbbbbbbbbbbbbbbbbbbbbbnddddd",
			"ddddddddddddddddddddddddddddddddd",
			"ddddddddddddddddddddddddddddddddd",
			"ddddddddddddddddddddddddddddddddd",
			"ddddddddddddddddddddddddddddddddd",
		]
	];

	const levelConfig = {
		width: 32,
		height: 32,
		//pos: vec2(width() / 2, height() / 2),
		"a": [sprite("forest", { frame: 0, })],
		"-": [sprite("forest", { frame: 3, })],
		"1": [sprite("forest", { frame: 6, }), solid()],
		"2": [sprite("forest", { frame: 7, }), solid()],
		"3": [sprite("forest", { frame: 8, }), solid()],
		"4": [sprite("forest", { frame: 22, }), solid()],
		"5": [sprite("forest", { frame: 23, }), solid()],
		"6": [sprite("forest", { frame: 24, }), solid()],
		"7": [sprite("forest", { frame: 38, }), solid()],
		"8": [sprite("forest", { frame: 39, }), solid()],
		"9": [sprite("forest", { frame: 40, }), solid()],
		"b": [sprite("forest", { frame: 64, }), solid()],
		"l": [sprite("forest", { frame: 67, }), solid()],
		"t": [sprite("forest", { frame: 70, }), solid()],
		"r": [sprite("forest", { frame: 73, }), solid()],
		"k": [sprite("forest", { frame: 169, }), solid()],
		"c": [sprite("forest", { frame: 185, }), solid()],
		"v": [sprite("forest", { frame: 182, }), solid()],
		"n": [sprite("forest", { frame: 166, }), solid()],
		"d": [sprite("forest", { frame: 133, })],
		"o": [sprite("forest", { frame: 55, }), solid()],
		"p": [sprite("forest", { frame: 56, }), solid()],
	};

	const map = addLevel(maps[level], levelConfig);


	const player = add([
		sprite('player'),
		body(),
		pos(186,186),
		scale(1.5)
	])

	player.play("idle");
	camScale(1.6);

	player.action(() => {
		camPos(player.pos);
	});

	keyDown(["left", "right"], () => {
		if (player.curAnim() !== "run") {
			player.play("run");
		}
	});

	keyRelease(["left", "right"], () => {
		if (!keyIsDown("right") && !keyIsDown("left")) {
			player.play("idle");
		}
	});
	
	  keyDown('left', () => {
		player.flipX(-1);
		player.move(-MOVE_SPEED, 0)
	  })
	
	  keyDown('right', () => {
		player.flipX(1);
		player.move(MOVE_SPEED, 0)
	  })
	
	  keyDown('up', () => {
		player.move(0, -MOVE_SPEED)
	  })
	
	  keyDown('down', () => {
		player.move(0, MOVE_SPEED)
	  })

});


start("game", { level: 0 });
