function createMatrixInput() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrixCells = document.getElementById('matrix-cells');
    matrixCells.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.value = '0';
            row.appendChild(input);
        }
        matrixCells.appendChild(row);
    }
}

function getMatrixFromInput() {
    const matrixCells = document.getElementById('matrix-cells');
    const rows = matrixCells.children.length;
    const cols = matrixCells.children[0].children.length;
    const matrix = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(parseFloat(matrixCells.children[i].children[j].value));
        }
        matrix.push(row);
    }

    return matrix;
}

function displayMatrix(matrix, container) {
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix';

    for (let row of matrix) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        for (let cell of row) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'matrix-cell';
            cellDiv.textContent = cell.toFixed(2);
            rowDiv.appendChild(cellDiv);
        }
        matrixDiv.appendChild(rowDiv);
    }

    container.appendChild(matrixDiv);
}

function solveMatrix() {
    const matrix = getMatrixFromInput();
    const steps = document.getElementById('steps');
    steps.innerHTML = '<h2>Steps:</h2>';

    displayMatrix(matrix, steps);

    const m = matrix.length;
    const n = matrix[0].length;
    let lead = 0;

    for (let r = 0; r < m; r++) {
        if (lead >= n) {
            return;
        }

        let i = r;
        while (matrix[i][lead] === 0) {
            i++;
            if (i === m) {
                i = r;
                lead++;
                if (n === lead) {
                    return;
                }
            }
        }

        const temp = matrix[i];
        matrix[i] = matrix[r];
        matrix[r] = temp;

        const lv = matrix[r][lead];
        for (let j = 0; j < n; j++) {
            matrix[r][j] /= lv;
        }

        steps.innerHTML += `<p>Step ${r + 1}: Divide row ${r + 1} by ${lv.toFixed(2)}</p>`;
        displayMatrix(matrix, steps);

        for (let i = 0; i < m; i++) {
            if (i !== r) {
                const lv = matrix[i][lead];
                for (let j = 0; j < n; j++) {
                    matrix[i][j] -= lv * matrix[r][j];
                }

                steps.innerHTML += `<p>Step ${r + 1}.${i + 1}: Subtract ${lv.toFixed(2)} times row ${r + 1} from row ${i + 1}</p>`;
                displayMatrix(matrix, steps);
            }
        }

        lead++;
    }
    const rank = calculateRank(matrix);
    steps.innerHTML += `<div id="rank-display">Rank of the matrix: ${rank}</div>`;
}

createMatrixInput();
function calculateRank(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    let rank = 0;
    const rows = new Array(m).fill(0);

    for (let col = 0; col < n && rank < m; col++) {
        let j = 0;
        for (j = rank; j < m; j++) {
            if (Math.abs(matrix[j][col]) > 1e-10) {
                break;
            }
        }

        if (j !== m) {
            rank++;
            if (j !== rank - 1) {
                const temp = matrix[j];
                matrix[j] = matrix[rank - 1];
                matrix[rank - 1] = temp;
            }

            for (let i = rank; i < m; i++) {
                const multiplier = matrix[i][col] / matrix[rank - 1][col];
                for (let k = col; k < n; k++) {
                    matrix[i][k] -= multiplier * matrix[rank - 1][k];
                }
            }
        }
    }

    return rank;
}