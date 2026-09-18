function win_loss_continue(input) {
	if (input === "Game Over: Loss") {
		lose()
		return false;
	}
	if (input === "Victory") {
		win()
		return false;
	} else {
		return true
	}
}
function lose(){
	let container = resetScreen();
		container.textContent = "You lose!"
}
function win(){
	let container = resetScreen();
	container.textContent = "You win!"
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

	// RPM
	// changing font and text for the mime-prompt in CSS
	titlebar.className = "mine-prompt";

	const input = document.createElement("input");

	// RPM
	// creating a place holder to let user know where to type
	input.placeholder = "Type Here..."
	// creating visual changes inside of CSS
	input.className = "prompt-box";

	input.style.display = "none";
	setTimeout(()=>{
		input.style.display = "block"
	}, 3000);

	const button = document.createElement("button");

	// RPM
	// adding code that would have the button be unable to be seen/pressed until after beginning animation
	button.style.display = "none";
	setTimeout(()=>{
		button.style.display = "block";
	}, 3000);

	titlebar.textContent = "ENTER AMOUNT OF MINES (10-20), THEN PRESS START."


	titlebar.style.display = "none";
	setTimeout(()=>{
		titlebar.style.display = "block";
	}, 3000);

	button.className = "old-button";
	input.id = "bombNumber";
	input.type = "number"

	button.textContent = "START";
	container.appendChild(titlebar)
	container.appendChild(bonusInstuctions)
	container.appendChild(input);
	container.appendChild(button);
	button.addEventListener("click", () => {
		if(input.value>=10 && input.value<=20){
		startup(input.value);
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
				if (tile.numSurroundingBombs !== undefined) {
					button.textContent = tile.numSurroundingBombs;
				}
			}

			button.addEventListener("click", () => {
				// if this is the first click and we have clicked on a bomb
				if(first_run && tile.isBomb == true){
					// if this is a mine get a list of all non mine cells that are not this cell
					let nonbombs = grid.flat(2).filter((tiler) => !tiler.isBomb);
					// disable the mine
					tile.isBomb = false;
					// set one of the non mine cells to a mine cell
					nonbombs[Math.floor(Math.random() * (nonbombs.length-0)-0)].isBomb = true;
				}
				const result = revealTile(grid, i, x);

				if(win_loss_continue(result)){
				render(grid, bombs, false);
				}
				else{
					return;
				}
			});
			button.addEventListener("contextmenu", (e) => {
				// prevent the right click menu from actually opening
				e.preventDefault();
				flagTile(grid, i, x);
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
