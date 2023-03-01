[View Hosted Site](https://retrogame.netlify.app/)
# Game
## Technologies

1. HTML Canvas
2. JavaScript
3. CSS

## Overview
This is a short game inspired by 16 bit retro-style games. My intention was to create a game with solid mechanics that can be experienced in <1min, as I'm a developer not a game designer I didn't spend too long creating variations on the gameplay. Some features that I could include in the future might be varied enemies with different movement/attack patterns, sound effects / music, or extra gameplay mechanics at certain stages. While these would also demonstrate my skills as a developer, I found building a game like this to be somewhat of a rabbit hole and didn't want to lose sight of other projects and ideas. Therefore while this game is just the skeleton/mechanics, hopefully it can demonstrate the potential of what it could be as the game engine / core mechanics are already in place. 

## How it works
### Core mechanics
This game uses a setInterval() function to generate new frames using the JavaScript canvas API. This function will check for changes in player input (through event listeners) and enemy movement and refresh the canvas accordingly. The enemies are generated pseudo-randomly with Math.random() based on a % chance each frame, which gradually increases to increase difficult as the player survives for longer. Enemy movement is calculated as a vector between the enemy and player each frame. 

### Animations
This is the first time I've used sprite-based animations in the browser. I approached this problem by creating a tree data structure in a JavaScript object, containing addresses for all of the sprites used for the animations. I wrote this object in a way to allow for programmatic looping through each animation. For each frame, the game will check what animation to play, and will progress to the next frame in that loop. 

### Global Variables
To help keep track of whats happening in the game, global variables are used to store lots of data about things like player positioning, player health, amount of enemies, enemy positioning etc. These are then adjusted each frame to match player input. I also used global constants to simplify tweaking the gameplay after development, these include things like frame-rate, movement speed, attack speed. 
