kaboom({
	fullscreen: true,
	scale: 2,
	startScene: "main",
	version: "0.5.0",
	clearColor: [0, 0, 0, 1],
	global: true,
});
loadSprite("bg", "sprites/BG.png");

loadSprite("ground-l", "sprites/ground-l.png");
loadSprite("ground-r", "sprites/ground-r.png");
loadSprite("ground", "sprites/ground.png");
loadSprite("crate", "sprites/Crate.png");
loadSprite("heart", "sprites/hearts_hud.png");
loadSprite("grass", "sprites/grass_props.png");
loadSprite("worm", "sprites/worm_walk_anim.png", {
	sliceX: 6,
	sliceY: 1,
	anims: {
		run: { from: 0, to: 5 },
	},
});
loadSprite("coin", "sprites/coin_anim_strip_6.png", {
	sliceX: 6,
	sliceY: 1,
	anims: {
		idle: { from: 0, to: 5 },
	},
});
loadSprite("dino", "sprites/DinoSprites - mort.png", {
	sliceX: 24,
	sliceY: 1,
	anims: {
		idle: { from: 0, to: 2 },
		run: { from: 19, to: 23 },
		dead: { from: 11, to: 16 },
	},
});

scene("main", () => {
	gravity(980);
	layers(["bg", "obj", "ui"], "obj");
	camIgnore(["ui", "bg"]);

	add([sprite("bg"), scale(width() / 1000, height() / 750), layer("bg")]);

	const map = addLevel(
		[
			"                             ",
			"                        ==   ",
			"                    =        ",
			"                =            ",
			"        ==     ==^         ^ ",
			"<--------------------------->",
		],
		{
			width: 31,
			height: 32,
			pos: vec2(0, height() - 78),
			//"^": [sprite("space-invader"), scale(0.7), "space-invader"],
			"<": [sprite("ground-l"), solid()],
			"-": [sprite("ground"), solid()],
			">": [sprite("ground-r"), solid()],
			"^": [sprite("grass"), "grass", body()],
			"=": [sprite("crate"), solid()],
		},
	);

	const player = add([
		sprite("dino", {
			animSpeed: 0.1,
		}),
		scale(1.4),
		pos(map.getPos(2, 0)),
		body(),
		origin("center"),
		{
			speed: 160,
			jumpForce: 340,
			heart: 3,
		},
	]);

	const coin = add([
		sprite("coin", {
			animSpeed: 0.1,
		}),
		scale(1),
		pos(map.getPos(19, -1)),
		origin("center"),
		"coin",
	]);

	const score = add([
		text(`score: ${0}`, 18),
		layer("ui"),
		pos(width() - 86, 24),
		origin("center"),
		{ value: 0 },
	]);

	// const heart = add([
	// 	//sprite("heart"),
	// 	text(player.heart, 24),
	// 	layer("ui"),
	// 	pos(12, 12),
	// ]);

	const worm = add([
		sprite("worm", {
			animSpeed: 0.1,
		}),
		scale(1),
		pos(map.getPos(21, 0)),
		body(),
		origin("center"),
		{
			speed: 10,
		},
		"worm",
	]);

	let heart = [];
	for (let i = 0; i < player.heart; i++) {
		heart.push(add([sprite("heart"), layer("ui"), pos(12 + i * 18, 12)]));
	}

	player.play("idle");
	coin.play("idle");

	function respawn() {
		score.value = 0;
		player.heart = 3;
		player.pos = vec2(0, 0);
		heart = [];
		for (let i = 0; i < player.heart; i++) {
			heart.push(add([sprite("heart"), layer("ui"), pos(12 + i * 18, 12)]));
		}
	}

	keyDown(["left", "right"], () => {
		if (player.grounded() && player.curAnim() !== "run") {
			player.play("run");
		}
	});

	keyRelease(["left", "right"], () => {
		if (!keyIsDown("right") && !keyIsDown("left")) {
			player.play("idle");
		}
	});

	keyPress("space", () => {
		if (player.grounded()) {
			player.jump(player.jumpForce);
		}
	});

	keyDown("left", () => {
		player.flipX(-1);
		player.move(-player.speed, 0);
	});

	keyDown("right", () => {
		player.flipX(1);
		player.move(player.speed, 0);
	});

	player.action(() => {
		camPos(player.pos);
	});

	player.action(() => {
		if (player.pos.y >= 600 || player.heart <= 0) {
			respawn();
		}
	});

	player.collides("coin", (b) => {
		destroy(b);
		score.value += 10;
		score.text = `score: ${score.value}`;
	});

	player.collides("worm", () => {
		camShake(4);
		player.heart--;
		destroy(heart[player.heart]);
	});

	worm.action(() => {
		worm.move(worm.speed, 0);
		if (worm.curAnim() !== "run") {
			worm.play("run");
		}
	});

	worm.collides("grass", () => {
		player.flipX(-1);
		worm.speed = -worm.speed;
	});
});
start("main");
