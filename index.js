'use strict';

(() => {

    const config = {
        fps: 600,
        nBoxes: 50,
        area: document.getElementById('area')
    }

    const buildGame = (sizeWorld) => {
        config.area.style.width = `${sizeWorld}px`;
        config.area.style.height = `${sizeWorld}px`;
        config.nBoxes = Math.floor((sizeWorld) / 16);
        // O(n**2)
        for (let i = 0; i < config.nBoxes; i++) {
            for (let j = 0; j < config.nBoxes; j++) {
                const segment = document.createElement("div");
                segment.setAttribute('id', `${i}-${j}`);
                segment.className = 'box';
                config.area.appendChild(segment);
            }
        }
    };


    const play = () => {
        let pointer = [0, 0]
        let snake = [[...pointer]];
        let actualDirection = 'r';
        let nextDirection = 'r';

        const move = (direction) => {

            const ignoreMoves = {
                'l': 'r',
                'r': 'l',
                'u': 'd',
                'd': 'u'
            }

            // Validate go bacwards to the direction
            if(!snake.length && ignoreMoves[direction].indexOf(actualDirection) !== -1) {
                direction = ignoreMoves[direction]
            }


            // l = left, r = right, u = up, d = down
            switch (direction) {
                case 'l': {
                    pointer[1] -= 1;
                    break;
                }
                case 'r': {
                    pointer[1] += 1;
                    break;
                }
                case 'u': {
                    pointer[0] -= 1;
                    break;
                }
                case 'd': {
                    pointer[0] += 1;
                    break;
                }
            }
            
            if (( (direction === 'r' || direction === 'd') && pointer[0] === config.nBoxes || pointer[1] === config.nBoxes) || 
                ((direction === 'u' || direction === 'l') &&  pointer[0] === -1 || pointer[1] === -1)) {
                // wall
                stop();
                return;
            }

            snake.unshift([...pointer]);
            const lastSegment = snake.pop();

            getBox(pointer).classList = 'box snake-head';
            getBox(lastSegment).classList = 'box';

            actualDirection = direction;
        };

        const changeDirection = (keyEvent) => {
            switch (keyEvent.key) {
                case 'ArrowLeft': nextDirection = 'l'; break;
                case 'ArrowRight': nextDirection = 'r'; break;
                case 'ArrowDown': nextDirection = 'd'; break;
                case 'ArrowUp': nextDirection = 'u'; break;
            }
        };

        document.addEventListener('keydown', changeDirection);
        const intervalId = setInterval(() => move(nextDirection), config.fps);
        const stop = () => clearInterval(intervalId);
    };

    const getBox = (position) => {
        return document.getElementById(`${position[0]}-${position[1]}`);
    }


    buildGame(800-(113*6));
    play();

})();