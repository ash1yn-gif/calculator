// Get the keypad so I can detect which button was clicked
const keypads = document.querySelector(".sub-container#keypads")

// This stores the calculator expression
// Numbers are combined into one string, operators stay separate
let arr = [];

// Listen for clicks on the keypad and send the event + array to the function
keypads.addEventListener("click", (event) => {
    outputScreen(event, arr)
})


// Deals with multiplication and division first
// Basically handles the operators with higher precedence
function higherPrecendence(arr) {
    for (let i = 0; i < arr.length; i++) {
        switch(arr[i]) {
            case("*"):
                // Calculate the numbers around the * and replace the first number with the result
                arr[i - 1] = `${(arr[i - 1] - '0') * (arr[i + 1] - '0')}`;

                // Remove the operator and the number after it
                i = popIndex(arr, i);
                break;
                
            case("/"): 
                // Same thing as multiplication but with division
                arr[i - 1] = `${(arr[i - 1] - '0') / (arr[i + 1] - '0')}`;

                // Remove the operator and the number after it
                i = popIndex(arr, i);
                break;
        }
    }

    // Now that * and / are done, deal with + and -
    lowerPrecendence(arr)

    return arr;
}


// Deals with addition and subtraction after higher precedence is done
function lowerPrecendence(arr) {
    for (let i = 0; i < arr.length; i++) {
        switch(arr[i]) {
            case("+"):
                // Add the numbers around the + and replace the first number with the result
                arr[i - 1] = `${(arr[i - 1] - '0') + (arr[i + 1] - '0')}`;

                // Remove the operator and the number after it
                i = popIndex(arr, i);
                break;

            case("-"):
                // Same thing but with subtraction
                arr[i - 1] = `${(arr[i - 1] - '0') - (arr[i + 1] - '0')}`;

                // Remove the operator and the number after it
                i = popIndex(arr, i);
                break;
        }
    }
}


// Removes the operator and the number after it
// Also moves i back because the array got smaller
function popIndex(arr, i) {
    arr.splice(i + 1, 1)
    arr.splice(i, 1)
    i--;
    return i;
}


// Handles basically everything that happens when I click a calculator button
function outputScreen(event, arr) {

    // Get the actual screen where the clicked stuff gets displayed
    const outputScreen = document.querySelector(".sub-container#output-screen #screen");

    // Get the button that was clicked
    const clickedKey = event.target;

    if (outputScreen.childElementCount > 20) {
        if (clickedKey.classList.contains("clear")) {
            // Clear everything from the screen
            outputScreen.innerHTML = "";
            arr.length = 0;
            return;
        }
        alert("You cannot enter more than 20 characters")
        return;
    }
    
    // Make a new p element for whatever was clicked
    const p = document.createElement("p");

    // Give the p element a class so I can style it
    p.classList.add("output-keys");

    // Check if the clicked button is a number
    if (clickedKey.classList.contains("number")) {

        // If the last thing in the array is already a number,
        // just add the new digit to that number instead of making a new element
        if (arr.length > 0 && isDigit(arr[arr.length - 1])) {
            console.log(arr[arr.length - 1])
            console.log(isDigit(arr[arr.length - 1]))

            // Show the clicked number on the screen
            p.textContent = clickedKey.value;

            // Add the new digit to the existing number
            arr[arr.length - 1] += clickedKey.value;

            console.log(arr);

            // Add the clicked number to the screen
            outputScreen.appendChild(p);
        }
        else {
            // If there isn't already a number, make a new number in the array
            p.textContent = clickedKey.value;
            arr.push(clickedKey.value);

            console.log(arr);

            // Add it to the screen
            outputScreen.appendChild(p);
        }
        
    }

    // Check if the clicked button is an operator
    else if (clickedKey.classList.contains("operator")) {
        // Display the operator's symbol
        p.textContent = clickedKey.textContent;

        // Store the operator in the array
        arr.push(clickedKey.value);

        console.log(arr);

        // Add it to the screen
        outputScreen.appendChild(p);
    }

    // Check if the clear button was clicked
    else if (clickedKey.classList.contains("clear")) {
        // Clear everything from the screen
        outputScreen.innerHTML = "";

        // Clear the array
        arr.length = 0;

    }

    // Check if the equals button was clicked
    else if (clickedKey.classList.contains("finish")) {
        // Calculate the expression
        let output = higherPrecendence(arr);

        // Convert the result to a number
        output = output -'0';

        // Clear the old expression from the screen
        outputScreen.innerHTML = "";

        // Round the result to 5 decimal places
        // Number() gets rid of unnecessary trailing zeroes
        p.textContent = Number(output.toFixed(5));

        // Show the result
        outputScreen.appendChild(p)
    }

    // Check if the delete button was clicked
    else if (clickedKey.classList.contains("delete")) {
        // Get the current length of the array
        const length = arr.length;

        // If the last number has more than one digit,
        // just remove the last digit
        if (arr[length - 1].length !== 1){
            arr[length - 1] = arr[arr.length - 1].slice(0, -1)
        }

        // If it only has one digit, remove the whole element
        else {
            arr.pop()
        }

        // Remove the last thing displayed on the screen
        outputScreen.removeChild(outputScreen.lastElementChild)
    }
    if (outputScreen.childElementCount > 12) {
        const ps = outputScreen.querySelectorAll(".output-keys")
        ps.forEach(p => {
            p.style.fontSize = "2em";
        })
    }
    
}

// Check if a value contains only digits with regex
function isDigit(value) {
    return /^\d+$/.test(value);
}