/*
Name(s): Daniel Van Dalsem, Johney Makeen, Ruben Pino Martinez, Christopher Brush
Creation Date: September 14th, 2026
Project: Project 1 - Minesweeping Game
File Description: This is the UI section, where it is responsible 
for displaying the game onto the screen, and providing the user a way to play the game

Daniel - UI Layout
Johney - UI Commenting and understanding functionality of functions created
Chris - Debugging fixes, and testing procedures
Ruben - UI presentation: looks, music, extra add ons
*/

/*
	Comments done by Johney Makeen on 09/16
	- takes the result string by revealTile() ("Game Over: Loss", "Victory" )
	- If its a loss or a win, calls lose()/win() to show the end screen and returns
	false, so render()'s click handler knows to stop redrawing the board. 
	- Otherwise, returns so the game keeps going and the board re-renders.
*/

//Coding in this section is done by Daniel Van Dalsem on 09/14 and 09/15. Coding is original. 

let currentMusic;


function win_loss_continue(input,grid) { //helps return the function lose and win - Johney 09/16
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

}
//Clears the board via resetScreen() and displays "you lose" in its place. - Johney 09/16
function lose(grid) {
	// Stop music immediately
	currentMusic.pause();

	// Reveal every mine
	grid.flat().forEach((tile) => {
		if (tile.isBomb) {
			tile.isFlipped = true;
		}
	});

	// Show the board with the mines revealed
	render(grid, grid.flat().filter((tile) => tile.isBomb).length, false);

	// Prevent the player from clicking anything
	const container = document.getElementById("main-container");
	container.querySelectorAll("button").forEach((button) => {
		button.disabled = true;
	});

	// Let player see the board first
	setTimeout(() => {
		const blackScreen = document.getElementById("intro-screen");

		blackScreen.innerHTML = "";
		blackScreen.style.zIndex = "8";
		blackScreen.style.display = "flex";

		blackScreen.style.opacity = "0";
		blackScreen.style.transition = "opacity 1s ease";

		blackScreen.style.flexDirection = "column";

		// Begin fade to black
		blackScreen.style.opacity = "0";
		blackScreen.style.transition = "opacity 1s ease";

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				blackScreen.style.opacity = "1";
			});
		});

		// After fade finishes, show message
		setTimeout(() => {
			const message = document.createElement("p");
			message.textContent = "you just lost the game.";
			blackScreen.appendChild(message);

			// Then show restart button
			setTimeout(() => {
				addRestartButton(blackScreen);
			}, 1500);

		}, 2000);

	}, 1500);
}
//same as lose(), but displays you win instead - Johney 09/16
function win() {
	let container = resetScreen();
	container.textContent = "You win!";
	addRestartButton(container);
}
//restart button to have the user get back to the start screen, rather than having the user manually refresh the screen - Johney09/16
function addRestartButton(container) {
	const button = document.createElement("button");
	button.className = "restart-button";
	button.textContent = "RESTART";
	button.addEventListener("click", () => window.location.reload()); //reloads the screen, brings them back to the starting screen - Johney 09/16
	container.appendChild(button);
}

//shared helper used by both lose() and win(): clears the flag counter and the board -Johney 09/16
//then creates and returns a cleared out div for the win/loss message to go into -Johney 09/16
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
//Comments done by Johney Makeen (09/16) and Daniel Van Dalsem (09/15)
//Coding in this section is done by Daniel Van Dalsem, Ruben and Chris, on 09/14 and 09/15. Coding is original. 

/*
	- Starts a new game by building a 10x10 grid with the given bomb count.
	- Then, will render it for the first time (first run = true, enables the "first click is never bomb" )
	- This will be called from the Start Button's click handler. 

*/

function startup(bombs) {
	console.log(bombs);
	const grid = buildGrid(10, 10, bombs); // height is 10, width is 10, and number of bombs is however many the user types (between 10-20) - Johney 09/16
	render(grid, bombs, true); //calls render, hands render 3 things: the built grid, the bombs count, and true for first run - Johney 09/16
}
// this waits for the page load - Dainel; 09/15.
// because otherwise we try to manipulate the dom before - Dainel; 09/15.

//---------------------------------------------------------------------------------------------------------------

//Comments in this section done by Johney Makeen on 09/16
//Coding in this section is done by Daniel Van Dalsem on 09/14 and 09/15. Coding is original. 

/*
	- Wrapped in window.addEventListener("load ...") so this code only
	runs once the page's HTML is fully parsed. Without it, getElementById("main-container") would
	run before that div exists, and the script would fail immediately.
*/

window.addEventListener("load", () => {

	// RPM
	// Adds the intro screen being a black screen to prompt user into beginning - Ruben 09/18
	const introScreen = document.getElementById("intro-screen");
	let gameStarted = false;

	const main_theme = new Audio("minesweeper_theme.mp3");
	const theme_minus_explosion = new Audio("minesweeper_default.mp3");

	currentMusic = main_theme;
	let musicPaused = false;

	function beginGame() {
		if (gameStarted) {
			return;
		}
		setTimeout(()=>{
			input.style.display = "block";
			button.style.display = "block";
			titlebar.style.display = "block";
		}, 3000);

		gameStarted = true;

		introScreen.style.display = "none";

		document.body.classList.add("game-started");

		main_theme.play();

		main_theme.addEventListener("ended", () => {
			currentMusic = theme_minus_explosion;

			theme_minus_explosion.loop = true;
			theme_minus_explosion.play();
		});
	}

	const volumeButton = document.getElementById("volume-button");
	const volumeIcon = document.getElementById("volume-icon");

	volumeButton.addEventListener("click", () => {

		if (musicPaused) {
			currentMusic.play();
			volumeIcon.src = "volume_on.png";
			musicPaused = false;
		}
		else {
			currentMusic.pause();
			volumeIcon.src = "volume_off.png";
			musicPaused = true;
		}
	});

	introScreen.addEventListener("click", beginGame);
	document.addEventListener("keydown", beginGame);

	//Builds the welcome screen: Instructions text, mine-count input, and start button -Johney 09/16
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

	const button = document.createElement("button");

	// RPM
	// adding code that would have the button be unable to be seen/pressed until after beginning animation
	button.style.display = "none";

	titlebar.textContent = "ENTER AMOUNT OF MINES (10-20), THEN PRESS START."


	titlebar.style.display = "none";

	button.className = "old-button";
	input.id = "bombNumber";
	input.type = "number"

	button.textContent = "START";
	container.appendChild(titlebar)
	container.appendChild(bonusInstuctions)
	container.appendChild(input);
	container.appendChild(button);
//Only start the game if the entered mine count is between 10 and 20; - Johney 09/16
//otherwise, show an error and let the user try again - Johney 09/16
	button.addEventListener("click", () => {
		if(input.value>=10 && input.value<=20){
			document.querySelectorAll(
				".title, .title-shadow, .title-fire, .title-explosion, .webpage_art"
			).forEach(element => {
				element.style.display = "none";
			});
			startup(input.value);
		}
		else{
			bonusInstuctions.className = "out-of-range-message"
			bonusInstuctions.textContent = "Please select between 10-20 mines.";

		}
	});
});
//---------------------------------------------------------------------------------------------------------------

//Comments done by Johney Makeen on 09/16
//Coding in this section is done by Daniel Van Dalsem on 09/14 and 09/15. Coding is original. 

/*
	- to help out with labeling the grid's column, we decided to do the Java script switch cases.
	- this function will convert a column index (0-9) to a letter (A-J) for the row labels. Although, visually, the letters are placed in the column.  
	- Render will grab this function, and then preform so. 

*/
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
/*
	- Draws/redrews the entire baord based on the current grid state. Called once from
	startup() to build the initial board, then called again after every click (see the handlers below)
	since this rebuilds all tiles from scratch each time rather than updating just the one tile that changed.
	- Johney 09/16 
*/

//Coding in this section is done by Daniel Van Dalsem, Ruben and Chris, on 09/14 and 09/15. Coding is original. 
function render(grid, bombs, first_run) {
	// All nessesary to reviel to win - Daniel 09/15
	const container = document.getElementById("main-container");
	container.innerHTML = ""; //this will wipe the previous board, before rebuilding it - Johney 09/16
	let flags = 0; //flags counter - Johney 09/16
	for (let i = 0; i < grid.length; i++) { //iterating through the grid - Johney 09/16
		const currentdiv = document.createElement("div");
		currentdiv.className = "grid-column";
		container.appendChild(currentdiv);
		for (let x = 0; x < grid[i].length; x++) {
			const tile = grid[i][x];
			const button = document.createElement("button");
			currentdiv.appendChild(button);
			button.className = "button";
			//hidden tiles will be shown as gray, with a flag emoji if its flagged - Johney 09/16
			//revealed tiles show white with the surrounding-bomb count -Johney 09/16
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
					}
					else if (tile.numSurroundingBombs !== undefined) {
						button.textContent = tile.numSurroundingBombs;

						if (tile.numSurroundingBombs === 0) {
							button.classList.add("tile-zero");
						}
						else if (tile.numSurroundingBombs === 1) {
							button.classList.add("tile-one");
						}
						else if (tile.numSurroundingBombs === 2) {
							button.classList.add("tile-two");
						}
						else if (tile.numSurroundingBombs === 3) {
							button.classList.add("tile-three");
						}
					}
				}

			button.addEventListener("click", () => {
				// if this is the first click and we have clicked on a bomb - Daniel 09/15
				if(first_run && tile.isBomb == true){
					// if this is a mine get a list of all non mine cells that are not this cell - Daniel 09/15
					let nonbombs = grid.flat(2).filter((tiler) => !tiler.isBomb);
					// disable the mine - Daniel 09/15
					tile.isBomb = false;
					// set one of the non mine cells to a mine cell - Daniel 09/15
					nonbombs[Math.floor(Math.random() * (nonbombs.length-0)-0)].isBomb = true;
				}
				const result = revealTile(grid, i, x); //Only redraw if the game is still in progress; otherwise leave the win/loss screen (set by win_loss_continue) up - Johney 09/16

				if(win_loss_continue(result, grid)){
				render(grid, bombs, false);
				}
				else{
					return;
				}
			});
			button.addEventListener("contextmenu", (e) => {
				// prevent the right click menu from actually opening - Daniel 09/15
				e.preventDefault();

				if (!tile.isFlipped && (!tile.isFlagged && flags < bombs || tile.isFlagged)) {
					flagTile(grid, i, x);
				}

				render(grid, bombs, false);
			});
		}
		//Row letter label (A-J) from numtoLetter() - variablle is named "column" - Johney 09/16
		//even though it labels a row (see numtoLetter's comment) - Johney 09/16
		const column = document.createElement("div");
		column.className = "icon-thing letter-stack";
		column.textContent = numtoLetter(i);
		currentdiv.appendChild(column);
	}
	// Column number labels (1-10) in their own role below the board - Johney 09/16
	// is named "row" even though it labels columns - Johney 09/16
	const currentdiv = document.createElement("div");
	currentdiv.className = "grid-column";
	container.appendChild(currentdiv);
	for (let x = 0; x < grid[0].length; x++) {
		const row = document.createElement("div");
		row.className = "icon-thing";
		row.textContent = x + 1;
		currentdiv.appendChild(row);
	}
	// Displays flags remaining: total bombs minus flags currently placed - Johney 09/16
	const containertwo = document.getElementById("container-two");
	containertwo.innerHTML = "";


	
	const flagCounter = document.createElement("div");
	flagCounter.className = "flag-counter";

	const flagIcon = document.createElement("span");
	flagIcon.textContent = "🚩";

	const flagNumber = document.createElement("span");
	const diff = bombs - flags;
	flagNumber.textContent = diff;

	flagCounter.appendChild(flagIcon);
	flagCounter.appendChild(flagNumber);

	containertwo.appendChild(flagCounter);

}
