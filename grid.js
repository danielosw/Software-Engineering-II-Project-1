class Tile {
	constructor()
	{
		this.isFlipped = false;
		this.isBomb = false;
		this.numSurroundingBombs = null;
	}

}

// Grid setup, to be called once at the start of a game
function buildGrid(height, width, numBombs)
{
	let grid = []

	for(let i = 0; i < width; i++)
	{
		grid[i] = [];
		for(let j = 0; j < height; j++)
		{
			grid[i][j] = new Tile()
		}
	}

	grid = populateBombs(grid, numBombs);
	grid = setTileNeighboringBombCounts(grid);
	
	return grid
}

// Places the specified number of bombs randomly throughout the grid (ran once during buildGrid)
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

// gets the number of bombs around each tile and saves that value (ran once during buildGrid)
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

// Simple function that will return B if a tile is a bomb and the # of surrounding bombs if not
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

// Function for printing/testing grid generation
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

// Example for how to generate a new grid
let testGrid = buildGrid(10, 10, 10);
printGrid(testGrid);

