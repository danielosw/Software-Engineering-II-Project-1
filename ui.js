function win_loss_continue(input, grid) {
	if (input === "Game Over: Loss") {
		lose(grid)
		return false;
	}
	if (input === "Victory") {
		win()
		return false;
	} else {
		return true
	}
}
function lose(grid){
	// show every mine after the player loses
	grid.flat().forEach((tile) => {
		if (tile.isBomb) {
			tile.isFlipped = true;
		}
	});
	render(grid, grid.flat().filter((tile) => tile.isBomb).length, false);
	const container = document.getElementById("main-container");
	const message = document.createElement("p");
	message.textContent = "You lose!";
	container.appendChild(message);
	container.querySelectorAll("button").forEach((button) => button.disabled = true);
	addRestartButton(container);
}
function win(){
	let container = resetScreen();
	container.textContent = "You win!"
	addRestartButton(container);
}
function addRestartButton(container) {
	const button = document.createElement("button");
	button.textContent = "restart";
	button.addEventListener("click", () => window.location.reload());
	container.appendChild(button);
}
function resetScreen() {
	const container = document.getElementById("main-container");
	const flags_remaining = document.getElementById("container-two");
	flags_remaining.innerHTML = "";
	container.innerHTML = "";
	const currentdiv = document.createElement("div");
	currentdiv.className = "grid-column";
	container.appendChild(currentdiv);
	return currentdiv;
}

function startup(bombs) {
	console.log(bombs);
	const grid = buildGrid(10, 10, bombs);
	render(grid, bombs, true);
}
// this waits for the page load
// because otherwise we try to manipulate the dom before 
window.addEventListener("load", () => {
	const container = document.getElementById("main-container");
	const currentdiv = document.createElement("div");
	const bonusInstuctions = document.createElement("div");
	currentdiv.className = "grid-column";
	container.appendChild(currentdiv);
	const titlebar = document.createElement("p");
	const input = document.createElement("input");
	const button = document.createElement("button");
	titlebar.textContent = "Welcome to minesweeper! Input between the amount of mines you want (10-20) then press start."
	button.className = "old-button";
	input.id = "bombNumber";
	input.type = "number"

	button.textContent = "Start!";
	container.appendChild(titlebar)
	container.appendChild(bonusInstuctions)
	container.appendChild(input);
	container.appendChild(button);
	button.addEventListener("click", () => {
		if(input.value>=10 && input.value<=20 && Number.isInteger(Number(input.value))){
			startup(Number(input.value));
		}
		else{
			bonusInstuctions.textContent = "You can only have betweeen 10-20 mines!";
		}
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
function render(grid, bombs, first_run) {
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
				if (tile.isBomb) {
					button.textContent = "B";
				} else if (tile.numSurroundingBombs > 0) {
					button.textContent = tile.numSurroundingBombs;
				}
			}

			button.addEventListener("click", () => {
				// if this is the first click and we have clicked on a bomb
				if(first_run && tile.isBomb == true){
					// move the first clicked mine and refresh nearby numbers
					// if this is a mine get a list of all non mine cells that are not this cell
					let nonbombs = grid.flat(2).filter((tiler) => !tiler.isBomb && !tiler.isFlagged && tiler !== tile);
					// disable the mine
					tile.isBomb = false;
					// set one of the non mine cells to a mine cell
					nonbombs[Math.floor(Math.random() * (nonbombs.length-0)-0)].isBomb = true;
					setTileNeighboringBombCounts(grid);
				}
				const result = revealTile(grid, i, x);

				if(win_loss_continue(result, grid)){
				render(grid, bombs, false);
				}
				else{
					return;
				}
			});
			button.addEventListener("contextmenu", (e) => {
				// prevent the right click menu from actually opening
				e.preventDefault();
				if (!tile.isFlipped && (!tile.isFlagged && flags < bombs || tile.isFlagged)) {
					flagTile(grid, i, x);
				}
				render(grid, bombs, false);
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
