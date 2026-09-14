function win_loss_continue(input) {
	if (input === "Game Over: Loss") {
		alert("You lose!");
	}
	if (input === "Victory") {
		alert("You win!");
	} else {
	}
}

function startup(bombs) {
	console.log(bombs);
	const grid = buildGrid(10, 10, bombs);
	render(grid, bombs);
}
window.addEventListener("load", () => {
	const container = document.getElementById("main-container");
	const currentdiv = document.createElement("div");
	currentdiv.className = "grid-column";
	container.appendChild(currentdiv);

	const input = document.createElement("input");
	const button = document.createElement("button");
	button.className = "old-button";
	input.id = "bombNumber";

	button.textContent = "Start!";
	container.appendChild(input);
	container.appendChild(button);
	button.addEventListener("click", () => {
		startup(input.value);
	});
});
function numtoLetter(num) {
	switch (num) {
		case 0:
			return "A";
		case 1:
			return "B";
		case 2:
			return "C";
		case 3:
			return "D";
		case 4:
			return "E";
		case 5:
			return "F";
		case 6:
			return "G";
		case 7:
			return "H";
		case 8:
			return "I";
		case 9:
			return "J";
	}
}
function render(grid, bombs) {
	// All nessesary to reviel to win
	const container = document.getElementById("main-container");
	container.innerHTML = "";
	let flags = 0;
	for (let i = 0; i < grid.length; i++) {
		const currentdiv = document.createElement("div");
		currentdiv.className = "grid-column";
		container.appendChild(currentdiv);
		for (let x = 0; x < grid[i].length; x++) {
			const tile = grid[i][x];
			const button = document.createElement("button");
			currentdiv.appendChild(button);
			button.className = "button";
			if (!tile.isFlipped) {
				button.classList.add("hidden-tile");
				if (tile.isFlagged) {
					button.textContent = "🚩";
					flags += 1;
				}
			} else {
				button.classList.add("revealed-tile");
				revealed += 1;
				if (tile.numSurroundingBombs !== undefined) {
					button.textContent = tile.numSurroundingBombs;
				}
			}

			button.addEventListener("click", () => {
				const result = revealTile(grid, i, x);
				win_loss_continue(result);
				render(grid, bombs);
			});
			button.addEventListener("contextmenu", (e) => {
				// prevent the right click menu from actually opening
				e.preventDefault();
				flagTile(grid, i, x);
				render(grid, bombs);
			});
		}
		const column = document.createElement("div");
		column.className = "icon-thing";
		column.textContent = numtoLetter(i);
		currentdiv.appendChild(column);
	}
	const currentdiv = document.createElement("div");
	currentdiv.className = "grid-column";
	container.appendChild(currentdiv);
	for (let x = 0; x < grid[0].length; x++) {
		const row = document.createElement("div");
		row.className = "icon-thing";
		row.textContent = x + 1;
		currentdiv.appendChild(row);
	}

	const containertwo = document.getElementById("container-two");
	containertwo.innerHTML = "";
	const numberdisplay = document.createElement("p");
	const diff = bombs - flags;
	numberdisplay.textContent = `Remaining flags: ${diff}`;
	containertwo.appendChild(numberdisplay);
}
