/*
  * Comment by Forest Denton
  * Note, for the recReveal function, Gemini 3.1 was used for iterating through all the tiles within 1 tile from the coordinates
  * AI was used because the task is relatively straightforward, limited in scope, and tedious to program, and since I don't have much 
  * familiarity with javascript, it certainly made things easier. Any line made with AI will be adequetly marked
  *
  * for the recReveal function, the following prompt was given to Gemini 3.1 Pro with extended thinking:
  * " can you write me a simple addition to this function that just determines what tiles around the current tile should be checked? The addition should check if we're on the edge of the grid, and likewise not test that null location
      function recReveal(grid, xCord, yCord){ // mis flagged tiles that are 0 don't get revealed
        grid[xCord][yCord].isFlipped = true;
        remaining_tiles -= 1;
      // current tile is done, now to figure out edges 
      }"
  * the result was evaluated by using the simple gridPrint function with a manually changed sample grid.
  * There was very few limitations or challenges using AI, as the function was relatively simple
  *
*/

class Tile {
	constructor()
	{
		this.isFlipped = false;
    		this.isFlagged = false;
		this.isBomb = false;
		this.numSurroundingBombs = null;
	}

}

let grid_height = 0;
let grid_width = 0;

/*
	Grid setup, to be called once at the start of a game

	inputs: grid height (int), grid width (int), number of bombs (int)
	outputs: grid (2d array)

	Ian R : 9/14/26 10:21 AM
*/
function buildGrid(height, width, numBombs)
{
	let grid = [];
  	grid_height = height;
 	grid_width = width;

	for(let i = 0; i < width; i++)
	{
		grid[i] = [];
		for(let j = 0; j < height; j++)
		{
			grid[i][j] = new Tile();
		}
	}

	grid = populateBombs(grid, numBombs);
	grid = setTileNeighboringBombCounts(grid);
	
	return grid;
}


/*
	Places the specified number of bombs randomly throughout the grid (ran once during buildGrid)

	inputs: grid (2d array), number of bombs (int)
	outputs: grid (2d array)

	Ian R : 9/14/26 10:21 AM
*/
function populateBombs(grid, numBombs)
{
	let width = grid[0].length;
	let height = grid.length;
	for(let i = 0; i < numBombs; i++)
	{
		while(true)
		{
			let x = Math.floor(Math.random() * width);
			let y = Math.floor(Math.random() * height);
			if(grid[x][y].isBomb == false)
			{
				grid[x][y].isBomb = true;
				break;
			}
		}
	}
	return grid;
}


/*
	gets the number of bombs around each tile and saves that value (ran once during buildGrid)

	inputs: grid (2d array)
	outputs: grid (2d array)

	9/14/26 10:21 AM
	Ian R
*/
function setTileNeighboringBombCounts(grid)
{
	let width = grid[0].length;
	let height = grid.length;
	for(let i = 0; i < width; i++)
	{
		for(let j = 0; j < height; j++)
		{
			let numBombs = 0;
			
			// :3
			if (j-1 >= 0 && i-1 >= 0 && grid[i-1][j-1].isBomb == true) numBombs += 1;
			if (j-1 >= 0 && grid[i][j-1].isBomb == true) numBombs += 1;
			if (j-1 >= 0 && i+1 < width && grid[i+1][j-1].isBomb == true) numBombs += 1;
			if (i-1 >= 0 && grid[i-1][j].isBomb == true) numBombs += 1;
			if (i+1 < width && grid[i+1][j].isBomb == true) numBombs += 1;
			if (j+1 < height && i-1 >= 0 && grid[i-1][j+1].isBomb == true) numBombs += 1;
			if (j+1 < height && grid[i][j+1].isBomb == true) numBombs += 1;
			if (j+1 < height && i+1 < width && grid[i+1][j+1].isBomb == true) numBombs += 1;
			// I hate it
			
			grid[i][j].numSurroundingBombs = numBombs;
		}
	}
	
	return grid;
}

/*
	Simple function that will return B if a tile is a bomb and the # of surrounding bombs if not

	inputs: tile (tile)
	outputs: tile state (char)

	Ian R : 9/14/26 10:21 AM
*/
function checkTile(tile)
{
	if(tile.isBomb == true)
	{
		return "B";
	}
	else
	{
		return tile.numSurroundingBombs;
	}
}

/*
	Function for printing/testing grid generation

	inputs: grid (2d array)
	outputs: IO

	9/14/26 10:21 AM
	Ian R
*/
function printGrid(grid)
{
	for(let i = 0; i < grid.length; i++)
	{
		let nextLine = "";
		for(let j = 0; j < grid[i].length; j++)
		{
			nextLine += checkTile(grid[i][j]);
			nextLine += ","
		}
		console.log(nextLine)
	}
}



// Example for how to generate a new grid (Ian R : 9/14/2026 10:25 AM)
let testGrid = buildGrid(10, 10, 10);
printGrid(testGrid);


var remaining_tiles = 0 // amount of non bomb tiles unrevealed, will be initialized in the init function

/*
 * Inputs: grid (2d array of tiles), xCord of clicked tile, yCord of clicked tile
 * Outputs: Game condition
 * Purpose: When a tile is clicked, just pass along the grid, and x/y cord as ints, and this should take care of the rest 
            It will also return the game state after revealing the tile. 
  Forest Denton, 9/19 4:45pm
*/
function revealTile(grid, xCord, yCord)
{
  let cur_tile = grid[xCord][yCord] // makes operations easier
  if (!cur_tile.isFlagged && !cur_tile.isFlipped) // if the tile isn't flagged nor fliped
  {
    if (checkTile(cur_tile) == "B"){  // if bomb has been clicked
      return "Game Over: Loss";
    }
    if (checkTile(cur_tile) == 0) // if the tile has zero bombs around it
    {
      recReveal(grid, xCord, yCord) // we need to check to see if there's any other 0 bomb tiles around it
    }
    else
    {
      cur_tile.isFlipped = true; // tile has been successfully flipped, and had at least one bomb around it
      remaining_tiles -= 1; // one less non-bomb tile revealed 
    }
    // now to check gameState
    if (remaining_tiles == 0) // if all non bomb tiles have been clicked
    {
      return "Victory";
    }
    else {
      return "Playing";
    }
  }
  return "Playing";  // tried to reveal flagged tile
}

/*
 * Inputs: (2d array of tiles), xCord of flagged tile, yCord of flagged tile 
 * Outputs: None 
 * Purpose: easily change the flagged state of a tiles 
 * Forest Denton 9_19_26 4:48pm

*/
function flagTile(grid, xCord, yCord)
{
  if (grid[xCord][yCord].isFlagged){
    grid[xCord][yCord].isFlagged = false; // flagging a flagged tile = unflagged tile
  }
  else
  {
    grid[xCord][yCord].isFlagged = true; 
  }
  return;
}

/*
  * Inputs: grid (2d array of tiles), xCord of target 0 bomb tile, yCord of target 0 bomb tiles
  * Outputs: None 
  * Purpose: if a tile has 0 bombs around it, we need to recursively ensure that every other 0 bomb tile around it is revealed
  * Forest Denton, 9_19_26 4:50pm
*/
function recReveal(grid, xCord, yCord){ // mis flagged tiles that are 0 don't get revealed
  grid[xCord][yCord].isFlipped = true;
  remaining_tiles -= 1;
  // current tile is done, now to figure out edges 
  // Note: I used gemini 3.1 pro for figuring out these edges 
  for (let dx = -1; dx <= 1; dx++) { // AI, goes through possible x cords
    for (let dy = -1; dy <= 1; dy++) { // AI, goes through possible y cords
      if (dx === 0 && dy === 0) continue; // AI, if we're just looking at the current tile, ignore
      
      let checkX = xCord + dx; // AI, store as a temp variable to later check if our location is a null value
      let checkY = yCord + dy; //AI
      
      // Check if the coordinates are within the grid bounds
      if (checkX >= 0 && checkX < grid_width && // AI, make sure we're in bounds
          checkY >= 0 && checkY < grid_height) { //AU 
          
          // We now know the value is safe, and past this point, there was no AI use for the rest of this function
          let neighborTile = grid[checkX][checkY];
          if (!neighborTile.isFlipped && !neighborTile.isFlagged) // ignore flipped and flagged tiles 
          {
            if (checkTile(neighborTile) == 0) // if the discovered tile needs to be recRevealed as well
            {
              recReveal(grid, checkX, checkY)
          
            }
            else // if the discovered tile does indeed have a bomb somewhere near it
            {
              neighborTile.isFlipped = true;
              remaining_tiles -= 1;

            }
          }
      }
    }
  }
  return; // every valid spot is tested
}
