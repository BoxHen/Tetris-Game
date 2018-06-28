# Tetris Game with JavaScript
Setting up the Game:

	To start, we must first define the blocks. These are the different shapes 
	you are given in tetris. 
![tetris blocks](images/blocks.png) 

	Going along with the image, starting at the top left and going across, lets 
	define the first block as an, i, the next block as a J, the next as a L,
	and the next as an O. From the second row, going across, I defined the blocks 
	as a S, T, and Z respectively.

	In game, these blocks get chosen randomly and slowly move toward the bottom 
	of the game board. In the meantime, the player is allowed to horizontally 
	move and rotate the pieces. The player is allowed to speed up the downward 
	motion of the block by using the DOWN arrow key or by doing a hard drop with
	the space bar. While the game is running, the player will be notified of the 
	next incoming piece so plan your moves carefully. Also players may utilize 
	the shift key to swap a piece out. You may use this to your advantage to 
	replace a bad piece or make a tetris.

	For this game, I will define each block as a 4x4. Not all spaces on the 4x4 
	will be used at one time but this space allows for rotations of different 
	pieces. If a spaces on the 4x4 is used we will represent that as a 1 and a 	
	0 if it is not used. each row will be defined as a binary and we will put 
	these rows together to form a hexadecimal
![block rotations](images/blockRotations.PNG)

	Using this convention, the blocks will be:
	I: 0x0F00, 0x4444, 0x00F0, 0x2222
	L: 0x2E00, 0x4460, 0x0E80, 0xC440
	J: 0x8E00, 0x44C0, 0x0710, 0x6440
	O: 0x0660, 0x0660, 0x0660, 0x0660
	S: 0x06C0, 0x8C40, 0x06C0, 0x8C40
	T: 0x0C60, 0x2640, 0x0C60, 0x2640
	Z: 0x04E0, 0x4640, 0x0E40, 0x4C40

	Accordingly, we will make JavaScript objects for each block:
	var I = { blocks: [0x0F00, 0x4444, 0x00F0, 0x2222], color:'cyan'   }
	var L = { blocks: [0x2E00, 0x4460, 0x0E80, 0xC440], color:'orange' }
	var J = { blocks: [0x8E00, 0x44C0, 0x0710, 0x6440], color:'blue'   }
	var O = { blocks: [0x0660, 0x0660, 0x0660, 0x0660], color:'yellow' }
	var S = { blocks: [0x06C0, 0x8C40, 0x06C0, 0x8C40], color:'green'  }
	var T = { blocks: [0x0C60, 0x2640, 0x0C60, 0x2640], color:'purple' }
	var Z = { blocks: [0x04E0, 0x4640, 0x0E40, 0x4C40], color:'red'    }
	
	
=================================================================================
Included files: 



=================================================================================
Running the program: 

	Run on your internet browser such as Chrome, FireFox, etc
--------------------------------------------------
