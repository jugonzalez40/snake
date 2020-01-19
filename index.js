'use strict';
/**
 * Snake Game for Van Hack
 * @author Juan Sebastian Gonzalez Rivera
 */
(() => {

    const config = {
        fps: 100,
        nBoxes: 50,
        area: document.getElementById('area'),
        game: document.getElementById('game'),
        playBtn: document.getElementById('play-btn'),
        sizeWorld: (800),
        running: true,
        inverseDirections: {
            'l': 'r',
            'r': 'l',
            'u': 'd',
            'd': 'u'
        },
        fruit: [1, 1],
        score: 0,
        previousScore: 0,
        fruitTimeout: null
    }

    const buildGame = (sizeWorld) => {
        config.nBoxes = Math.floor((sizeWorld) / 16);
        if(config.nBoxes === 0) {
            gameOver();
            return false;
        }
        // Avoid when snake crash with a wall resize the world
        config.game.removeChild(config.area) 
        config.area = document.createElement('div');
        config.area.setAttribute('id', 'area');
        game.appendChild(config.area);

        config.sizeWorld = sizeWorld;
        config.area.style.width = `${sizeWorld}px`;
        config.area.style.height = `${sizeWorld}px`;
        
        
        // O(n**2)
        for (let i = 0; i < config.nBoxes; i++) {
            for (let j = 0; j < config.nBoxes; j++) {
                const segment = document.createElement("div");
                segment.setAttribute('id', `${i}-${j}`);
                segment.className = 'box';
                config.area.appendChild(segment);
            }
        }
        return true;
    };

    const dropFruit = (snake) => {
        if(!config.running) return;
        const fruits = [...document.getElementsByClassName('fruit')];

        fruits.forEach(_fruit => {
            _fruit.classList = 'box';
        });

        const randomX = Math.floor(Math.random() * (config.nBoxes));
        const randomY = Math.floor(Math.random() * (config.nBoxes));
        const randomTime = Math.floor(Math.random() * (10000 - 4000)) + 4000;
        const fruitPos = [randomX, randomY];

        if(snake.some(segment => `${segment}` === `${fruitPos}`)){
            return dropFruit(snake);
        }
        config.fruit = fruitPos;
        getBox(fruitPos).classList = 'box fruit'
        config.fruitTimeout = setTimeout(() => dropFruit(snake), randomTime);
    };

    const play = () => {
        config.running = true;
        let pointer = [0, 0];
        getBox(pointer).classList = 'box snake-head';
        let snake = [[...pointer]];
        let actualDirection = 'r';
        let nextDirection = 'r';
        dropFruit(snake);

        const move = (direction) => {
            // Validate go bacwards to the direction
            if(snake.length > 1 && config.inverseDirections[direction] === actualDirection) {
                direction = config.inverseDirections[direction]
            }//TODO:

            // l = left, r = right, u = up, d = down
            // Incresee the pointer to the actual direction
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
            
            //Validat if crashes with walls
            if (( (direction === 'r' || direction === 'd') && pointer[0] === config.nBoxes || pointer[1] === config.nBoxes) || 
                ((direction === 'u' || direction === 'l') &&  pointer[0] === -1 || pointer[1] === -1)) {
                if(!buildGame(config.sizeWorld - 113)) return stop();
                actualDirection = config.inverseDirections[direction];
                nextDirection = config.inverseDirections[direction];
                repaintSnake(snake.reverse());
                repaintFruit(config.fruit);

                pointer = [...snake[0]];
                return;
            }

            // Validate if crashes himself
            if(snake.some(segment => `${segment}` === `${pointer}` )) {
                stop();
                return gameOver();
            }

            //add the new head 
            snake.unshift([...pointer]);
            //reder the snake agan
            renderSnake(snake);
            actualDirection = direction;

            //if eating fruit
            if(`${pointer}` === `${config.fruit}`) {
                clearTimeout(config.fruitTimeout)
                dropFruit(snake);
                config.score += 1;
                setScore(config.score);
                getBox(snake[snake.length-1]).classList = 'box snake-tail'
            } else {
            //remove the last snake segment
                const lastSegment = snake.pop();
                getBox(lastSegment).classList = 'box';
            } 
        };

        const changeDirection = (keyEvent) => {
            switch (keyEvent.key) {
                case 'ArrowLeft': nextDirection = 'l'; break;
                case 'ArrowRight': nextDirection = 'r'; break;
                case 'ArrowDown': nextDirection = 'd'; break;
                case 'ArrowUp': nextDirection = 'u'; break;
            }
        };

        const repaintSnake = (snake) => {
            snake = snake.map(segment => {
                const diffX = segment[0] - config.nBoxes-1;
                const diffY = segment[1] - config.nBoxes-1;
                const maxDiff = Math.max(diffY, diffX);
                if(diffX >= -1) segment[0] = config.nBoxes-1 - (maxDiff - diffX);
                if(diffY >= -1) segment[1] = config.nBoxes-1 - (maxDiff - diffY);
                return segment;
            });
            renderSnake(snake);
        };

        const renderSnake = (snake) => {
            snake.forEach((segment, index) => {
                const box = getBox(segment);
                box.classList = (index === 0) ? 'box snake-head' : 'box snake-tail';
            });
        }

        const repaintFruit = (fruit) => {
            const diffX = fruit[0] - config.nBoxes-1;
            const diffY = fruit[1] - config.nBoxes-1;
            const maxDiff = Math.max(diffY, diffX);
            if(diffX >= -1) fruit[0] = config.nBoxes-1 - (maxDiff - diffX);
            if(diffY >= -1) fruit[1] = config.nBoxes-1 - (maxDiff - diffY);
            config.fruit = fruit;
            
            getBox(fruit).classList = 'box fruit';
        };   

        document.addEventListener('keydown', changeDirection);
        const intervalId = setInterval(() => move(nextDirection), config.fps);

        const stop = () => {
            clearInterval(intervalId);
            config.running = false;
        };
    };

    const setScore = (score, id) => {
        const scoreLabel = document.getElementById(id || 'score')
        scoreLabel.innerText = `${score}`;
        scoreLabel.style.color = (score > config.previousScore) ? '#bc5100' : 'black'
    } 

    const getBox = (position) => {
        return document.getElementById(`${position[0]}-${position[1]}`);
    };

    const gameOver = () => {
        clearTimeout(config.fruitTimeout);
        config.previousScore = config.score;
        config.score = 0;
        setScore(config.previousScore, 'p-score');
        setScore(0, 'score');
        config.playBtn.style.display = 'block';
        config.playBtn.innerText = 'Play Agan!';
    };


    buildGame(800);
    config.playBtn.addEventListener('click', () => {
        config.playBtn.style.display = 'none';
        buildGame(800);
        play();
    })

})();