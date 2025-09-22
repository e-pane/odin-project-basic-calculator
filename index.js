// build a Calc class //
class Calc {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this._validate(left, operator, right);
    }

    add() {
        return this.left + this.right;
    }
    subtract() {
        return this.left - this.right;
    }
    multiply() {
        return this.left * this.right;
    }
    divide() {
        return this.left / this.right;
    }

    _validate() {
        
    }
}
const lowerDisplay = document.querySelector('.lower-display');
const upperDisplay = document.querySelector('.upper-display');

const btnGrid = document.querySelector('.btn-grid');
let calcArray = [];
let resetOnNextKey = false;



// handle click for numbers and operators, display user input and build an array //
btnGrid.addEventListener('click', (e) => {
    const clickedElement = e.target;
    if (clickedElement.tagName === 'BUTTON') {
        const value = clickedElement.dataset.value;

        if (resetOnNextKey && value !== "clear" && value !== "=") {
            lowerDisplay.innerText = "";
            calcArray = [];
            resetOnNextKey= false;
        }

        if (value !== "clear" && value !== "=") {
            if (calcArray.length > 0 && calcArray[calcArray.length - 1] === "+" && value === "-") {
                calcArray[calcArray.length - 1] = "-";
                lowerDisplay.innerText = lowerDisplay.innerText.slice(0, -1) + value;
            }
            else {
                calcArray.push(value);
                lowerDisplay.innerText += value;
            }
            console.log(calcArray);
        }
        else if (value === "=") {
            const transformedArray = transformInput(calcArray);
            console.log(transformedArray);

            if (transformedArray.length === 3) {
                const myCalc = new Calc(...transformedArray);

                const operations = {
                    "+": () => myCalc.add(),
                    "-": () => myCalc.subtract(),
                    "*": () => myCalc.multiply(),
                    "/": () => myCalc.divide()
                }

                const operator = transformedArray[1];
                const operation = operations[operator];

                if(operation) {
                    const answer = operation();
                    if (answer % 1 !== 0) {
                        answer = parseFloat(answer.toFixed(3));
                    }
                    updateDisplays(answer);
                }
                else {
                    console.error(`Invalid operator: "${operator}"`);
                    updateDisplays("ERROR");
                }
            }
            else {
                updateDisplays("ERROR");
            }
        }       
    }
});

function updateDisplays(answer) {
    upperDisplay.innerText = lowerDisplay.innerText;
    lowerDisplay.innerText = "";
    lowerDisplay.innerText = answer;
    resetOnNextKey = true;
}
// array methods to get "left int, operator, right int" [-9, -, 8] [29, +, 987] [45, +, -8]
function transformInput(sequence) {
    let output = [];
    let currentNum = '';

    for (let i = 0; i < sequence.length; i++) {
        item = sequence[i];
        // If the item is a digit, append it to currentNum
        if (!isNaN(item)) {
            currentNum += item;
        }
        // If we hit a non-digit (operator), flush currentNum to output
        // convert string to number and push
        // reset for next number
        else {
            if (currentNum) {
                output.push(Number(currentNum));
                currentNum = "";
            }
            // Push the operator as-is into the output
            output.push(item); 
        }
    }
  // After loop, flush any remaining number
    if (currentNum) {
        output.push(Number(currentNum));
    }
  
  // Step 3: Handle unary minus cases
    for (let i = 0; i < output.length; i++) {
        if (output[i] === "-" && (i === 0 || typeof output[i - 1] !== "number")) {
            output.splice(i, 2, -output[i + 1]);
        }
    }
    return output;
}
