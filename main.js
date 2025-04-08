const config = {
	pointsPerSequence: 40,
	maxPointsPerSequence: 60,
	animationSpeed: 35,
	movementRadius: 3,
	newPointFrequency: 40,
	swarmFrequency: 180,
	colorCycleSpeed: 5
};

document.addEventListener("DOMContentLoaded", () => {
	const cicadaAnimation = document.getElementById("cicada-animation");
	const codeDisplay = document.getElementById("code-display");
	const cursor = document.getElementById("cursor");
	const infoText = document.getElementById("info-text");

	const c64Colors = [
		"var(--c64-white)",
		"var(--c64-yellow)",
		"var(--c64-cyan)",
		"var(--c64-light-green)",
		"var(--c64-light-red)",
		"var(--c64-purple)",
		"var(--c64-light-blue)"
	];

	const sequences = [
		{ period: 3, elements: [] },
		{ period: 5, elements: [] },
		{ period: 7, elements: [] },
		{ period: 11, elements: [] },
		{ period: 13, elements: [] }
	];

	const codeText = [
		"10 REM *** CICADA PRINCIPLE DEMO ***",
		'20 PRINT "INITIALIZING PATTERN GENERATOR"',
		"30 FOR N = 1 TO 5",
		"40 P(N) = PRIME(N)",
		"50 NEXT N",
		"60 GOSUB 1000: REM GENERATE PATTERN",
		"70 X = RND(1) * 320",
		"80 Y = RND(1) * 200",
		"90 POKE 53280,6: POKE 53281,0",
		"100 GOTO 70"
	];

	function typeCode() {
		let i = 0;
		let line = 0;
		let text = "";

		function typeLetter() {
			if (line < codeText.length) {
				if (i < codeText[line].length) {
					text += codeText[line][i];
					codeDisplay.textContent = text;
					positionCursor();
					i++;
					setTimeout(typeLetter, 50);
				} else {
					text += "\n";
					codeDisplay.textContent = text;
					positionCursor();
					i = 0;
					line++;
					setTimeout(typeLetter, 300);
				}
			} else {
				infoText.textContent = "PATTERN READY. PRIME CYCLES RUNNING.";
				flashScreen();
			}
		}

		typeLetter();
	}

	function positionCursor() {
		const codeSection = document.querySelector(".code-section");
		const textContent = codeDisplay.textContent;
		const lines = textContent.split("\n");
		const lastLine = lines[lines.length - 1];

		const tempSpan = document.createElement("span");
		tempSpan.style.visibility = "hidden";
		tempSpan.style.position = "absolute";
		tempSpan.style.whiteSpace = "pre";
		tempSpan.style.font = window.getComputedStyle(codeDisplay).font;
		tempSpan.textContent = lastLine;
		document.body.appendChild(tempSpan);

		const lastLineWidth = tempSpan.offsetWidth;
		document.body.removeChild(tempSpan);

		const computedStyle = window.getComputedStyle(codeDisplay);
		const lineHeight = parseFloat(computedStyle.lineHeight);

		cursor.style.left = `${lastLineWidth}px`;
		cursor.style.top = `${(lines.length - 1) * lineHeight}px`;

		codeSection.scrollTop = codeSection.scrollHeight;
	}

	function flashScreen() {
		const screen = document.querySelector(".c64-screen");
		screen.style.backgroundColor = "var(--c64-white)";
		setTimeout(() => {
			screen.style.backgroundColor = "var(--c64-blue)";
		}, 100);
	}

	function initCicadaPattern() {
		const container = document.querySelector(".cicada-container");
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;

		sequences.forEach((seq, seqIndex) => {
			const totalPoints = config.pointsPerSequence;

			for (let i = 0; i < totalPoints; i++) {
				const point = document.createElement("div");
				point.className = "cicada-point";
				point.style.backgroundColor = c64Colors[seqIndex % c64Colors.length];

				const x = Math.random() * containerWidth;
				const y = Math.random() * containerHeight;

				point.style.left = `${x}px`;
				point.style.top = `${y}px`;

				cicadaAnimation.appendChild(point);
				seq.elements.push(point);
			}
		});
	}

	function createSwarmEffect(frame) {
		const container = document.querySelector(".cicada-container");
		const targetX = Math.random() * container.offsetWidth;
		const targetY = Math.random() * container.offsetHeight;

		infoText.textContent = "PRIME PATTERN CONVERGENCE!";
		infoText.style.color = "var(--c64-light-red)";

		function multiFlash() {
			const screen = document.querySelector(".c64-screen");
			const colors = [
				"var(--c64-white)",
				"var(--c64-yellow)",
				"var(--c64-cyan)",
				"var(--c64-blue)"
			];

			colors.forEach((color, index) => {
				setTimeout(() => {
					screen.style.backgroundColor = color;
				}, index * 100);
			});
		}

		multiFlash();

		sequences.forEach((seq) => {
			seq.elements.forEach((point, i) => {
				const originalX = parseFloat(point.style.left);
				const originalY = parseFloat(point.style.top);

				const dx = targetX - originalX;
				const dy = targetY - originalY;

				setTimeout(() => {
					const factor = 0.4 + Math.random() * 0.4;
					const newX = originalX + dx * factor;
					const newY = originalY + dy * factor;

					point.style.transition = "all 0.6s cubic-bezier(0.5, 0, 0.75, 1)";
					point.style.left = `${newX}px`;
					point.style.top = `${newY}px`;
					point.classList.add("swarm-pulse");

					setTimeout(() => {
						point.style.transition = "all 0.8s ease-out";
						point.style.left = `${originalX}px`;
						point.style.top = `${originalY}px`;

						setTimeout(() => {
							point.style.transition = "none";
							point.classList.remove("swarm-pulse");
						}, 800);
					}, 600);
				}, i * seq.period * 4);
			});
		});

		setTimeout(() => {
			infoText.textContent = "PATTERN STABILIZED. PRIME CYCLES CONTINUE.";
			infoText.style.color = "var(--c64-light-green)";
		}, 2000);
	}

	function animateCicada() {
		const container = document.querySelector(".cicada-container");
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;

		let frame = 0;

		setInterval(() => {
			frame++;

			sequences.forEach((seq, seqIndex) => {
				if (frame % seq.period === 0) {
					seq.elements.forEach((point, i) => {
						const angle = (i * seq.period + frame) * (Math.PI / 180);
						const radius = config.movementRadius;

						const oldX = parseFloat(point.style.left);
						const oldY = parseFloat(point.style.top);

						const randomOffset = Math.sin(frame * 0.01 + i) * 5;

						let newX = oldX + Math.cos(angle) * (radius + randomOffset);
						let newY = oldY + Math.sin(angle) * (radius + randomOffset);

						newX = Math.max(0, Math.min(containerWidth - 4, newX));
						newY = Math.max(0, Math.min(containerHeight - 4, newY));

						point.style.left = `${newX}px`;
						point.style.top = `${newY}px`;

						if (frame % (seq.period * 5) === 0) {
							const colorIndex =
								(seqIndex + Math.floor(frame / 30)) % c64Colors.length;
							point.style.backgroundColor = c64Colors[colorIndex];

							point.classList.add("pulse");
							setTimeout(() => {
								point.classList.remove("pulse");
							}, 300);
						}
					});
				}
			});

			if (frame % config.colorCycleSpeed === 0) {
				sequences.forEach((seq, seqIndex) => {
					seq.elements.forEach((point) => {
						const colorIndex = (seqIndex + Math.floor(frame / 20)) % c64Colors.length;
						point.style.backgroundColor = c64Colors[colorIndex];
					});
				});
			}

			if (frame % config.newPointFrequency === 0 && frame > 100) {
				const randomSeq = sequences[Math.floor(Math.random() * sequences.length)];

				if (randomSeq.elements.length < config.maxPointsPerSequence) {
					const point = document.createElement("div");
					point.className = "cicada-point";

					const seqIndex = sequences.indexOf(randomSeq);
					point.style.backgroundColor = c64Colors[seqIndex % c64Colors.length];

					const x = Math.random() * containerWidth;
					const y = Math.random() * containerHeight;

					point.style.left = `${x}px`;
					point.style.top = `${y}px`;

					cicadaAnimation.appendChild(point);
					randomSeq.elements.push(point);
				}
			}

			if (frame % config.swarmFrequency === 0 && frame > 100) {
				createSwarmEffect(frame);
			}
		}, config.animationSpeed);
	}

	setTimeout(() => {
		initCicadaPattern();
		typeCode();
		animateCicada();
	}, 1000);
});
