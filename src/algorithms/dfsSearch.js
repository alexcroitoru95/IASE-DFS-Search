const directionsMatrix = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // up
    [-1, 0] // left
];

let returnObject = {
    path: [],
    numberOfIterations: 0,
    searchPattern: []
};

let destinationFound = false;
let numberOfIterations = 0;

export const dfsSearch = function(board, start, stop) {
    for (var r = 0; r < board.length; r++) {
        for (var c = 0; c < board[0].length; c++) {
            if (board[r][c] === start) {
                if (dfs(r, c, 0, stop)) {
                    returnObject.numberOfIterations = numberOfIterations;

                    return returnObject;
                }
            }
        }
    }

    return false;

    function dfs(r, c, i, stop) {
        console.log(board);
        var result = false;

        // check how many iterations
        ++numberOfIterations;

        // add element to path
        returnObject.path.push(board[r][c]);

        // mark element
        board[r][c] = '#';

        // loop and recurse each neighbor
        for (var [dx, dy] of directionsMatrix) {
            var nr = r + dx;
            var nc = c + dy;

            // neighbor does not meet conditions
            if (
                nr < 0 ||
                nc < 0 ||
                nr >= board.length ||
                nc >= board[0].length
            ) {
                continue; // neighbor is out of bounds
            }

            if (board[nr][nc] === '#') {
                continue; // neighbor already visited
            }

            if (board[nr][nc] === stop) {
                destinationFound = true; // destination has been found
            }

            if (!destinationFound) {
                result = dfs(nr, nc, i + 1, stop); // recursion
            } else {
                if (returnObject.path[numberOfIterations] !== stop) {
                    // add stop item to path
                    returnObject.path.push(stop);

                    // add pattern to searchPattern Array
                    returnObject.searchPattern.push(board);
                }

                return true;
            }
        }

        return result;
    }
};
