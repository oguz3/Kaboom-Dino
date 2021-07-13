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
loadSprite("portal", "sprites/Purple-Portal-Sprite-Sheet.png", {
	sliceX: 8,
	sliceY: 3,
	anims: {
		idle: { from: 0, to: 7 },
		close: { from: 16, to: 22 },
	},
});

scene("game", ({ level }) => {
	gravity(980);
	layers(["bg", "obj", "ui"], "obj");
	camIgnore(["ui", "bg"]);

	add([sprite("bg"), scale(width() / 1000, height() / 750), layer("bg")]);

	const maps = [
		[
			"                             ",
			"                        ==   ",
			"                    =        ",
			"                             ",
			"        ==     ==^         ^ ",
			"<--------------------------->",
		]
	];

	const levelConfig = {
		width: 31,
		height: 32,
		pos: vec2(0, height() - 78),
		//"^": [sprite("space-invader"), scale(0.7), "space-invader"],
		"<": [sprite("ground-l"), "block", solid()],
		"-": [sprite("ground"), solid()],
		">": [sprite("ground-r"), "block", solid()],
		"^": [sprite("grass"), "grass", "block", body()],
		"=": [sprite("crate"), "crate", "block", solid()],
	};

	const map = addLevel(maps[level], levelConfig);

	function small() {
		let timer = 0
		let isSmall= false
		return {
		  update() {
			if (isSmall) {
			  timer -=dt()
			  if (timer <=0) {
				this.normalify()
			  }
			}
		  },
		  isBig() {
			return isSmall
		  },
		  smallify(time) {
			this.scale = 0.8
			timer = time
			isSmall = true
		  },
		  normalify() {
			this.scale = 1.4
			timer = 0
			isSmall = false
		  },
		}
	  }

	const player = add([
		sprite("dino", {
			animSpeed: 0.1,
		}),
		scale(1.4),
		small(),
		pos(map.getPos(2, -4)),
		body(),
		origin("center"),
		{
			speed: 160,
			jumpForce: 340,
			heart: 3,
		},
	]);

	// const coin = add([
	// 	sprite("coin", {
	// 		animSpeed: 0.1,
	// 	}),
	// 	scale(1),
	// 	solid(),
	// 	pos(
	// 		map.getPos(
	// 			Math.floor(Math.random() * 20) + 1,
	// 			Math.floor(Math.random() + Math.floor(Math.random() * 4) + 1),
	// 		),
	// 	),
	// 	origin("center"),
	// 	"coin",
	// ]);

	const portal = add([
		sprite("portal", {
			animSpeed: 0.1,
		}),
		scale(1),
		pos(
			map.getPos(
				Math.floor(Math.random() * 20) + 1,
				Math.floor(Math.random() + Math.floor(Math.random() * 4) + 1.3),
			),
		),
		origin("center"),
		"portal",
	]);

	for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
		add([
			sprite("crate"),
			solid(),
			scale(1),
			pos(
				map.getPos(
					Math.floor(Math.random() * 20) + 1,
					Math.random() + Math.floor(Math.random() * 3),
				),
			),
			origin("center"),
			"crate",
			"block",
		]);
	}

	const score = add([
		text(`score: ${0}`, 18),
		color(rgb(0, 0, 0)),
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
	let worms = [];
	for (let i = 0; i < Math.floor(Math.random() * 15) + 1; i++) {
		worms.push(
			add([
				sprite("worm", {
					animSpeed: 0.1,
				}),
				scale(1),
				pos(map.getPos(Math.floor(Math.random() * 20) + 1, 5)),
				body(),
				origin("center"),
				{
					speed: 10,
				},
				"worm",
			]),
		);
	}

	add([sprite("heart"),scale(2), layer("ui"), pos(12, 12)])
	const heart = add([
		text(player.heart, 16),
		color(rgb(0, 0, 0)),
		layer("ui"),
		pos(56, 30),
		origin("center"),
	]);

	player.play("idle");
	//coin.play("idle");
	portal.play("idle");

	function respawn() {
		score.value = 0;
		player.heart = 3;
		player.pos = vec2(0, 0);
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

	keyDown("shift", () => {
		player.smallify(3)
	});

	player.action(() => {
		camPos(player.pos);
		heart.text = player.heart
	});

	player.action(() => {
		if (player.pos.y >= 800 || player.heart <= 0) {
			respawn();
		}
	});

	player.collides("portal", (b) => {
		destroy(player);
		portal.stop("idle")
		portal.play("close");
		
		console.log(player)
		setTimeout(() => {
			destroy(b);
			score.value += 10;
			score.text = `score: ${score.value}`;
			go("game", {
				level: level++ % maps.length,
			});
		}, 690)
	});

	player.collides("worm", () => {
		camShake(8);
		player.heart--;
	});

	worms.forEach((worm) => {
		worm.action(() => {
			worm.move(worm.speed, 0);
			if (worm.curAnim() !== "run") {
				worm.play("run");
			}
		});

		worm.collides("block", () => {
			worm.flipX(-1);
			worm.speed = -worm.speed;
		});
	});
});

start("game", { level: 0 });
