// Fill array with zeros
function zeros([length, ...rest], type) {
    if (rest.length > 0)
        return Array.from({length}, _ => zeros(rest, type));

    // By default, fills with zeros
    if (!type)
        return Array(length).fill(0);

    return new type(length);
}

function printPallet(pallet) {
    console.log(pallet.length); // 52 h/z
    console.log(pallet[0].length); // 48 l/y
    console.log(pallet[0][0].length); // 40 w/x

    for (let z = 0; z < pallet.length; z++) {
        for (let y = 0; y < pallet[0].length; y++) {
            width = "";
            for (let x = 0; x < pallet[0][0].length; x++) {
                width += pallet[z][y][x] + ' ';
            }
            console.log(width);
        }
        console.log("");
        console.log("");
    }
}

function calculateConfiguration(l, w, h) {
    let boxesPlaced = 0;
    
    // Get the unique orientations using a set
    let orientations = new Set([[h, w, l], [h, l, w],[l, w, h], [l, h, w], [w, l, h], [w, h, l]].map(JSON.stringify));
    orientations = Array.from(orientations).map(JSON.parse);

    const palletL = 48;
    const palletW = 40;
    const palletH = 52;

    let pallet = zeros([palletH, palletL, palletW]);

    let x = 0;
    let y = 0;
    let z = 0;

    // Check if we can place a box
    function isValid(l, w, h) {
        for (let lOffset = 0; lOffset < l; lOffset++) {
            for (let wOffset = 0; wOffset < w; wOffset++) {
                for (let hOffset = 0; hOffset < h; hOffset++) {

                    // Calculate each inch of the box
                    let lIndex = y + lOffset;
                    let wIndex = x + wOffset;
                    let hIndex = z + hOffset;

                    // Outside of the pallet
                    if ((lIndex >= palletL) || (wIndex >= palletW) || (hIndex >= palletH)) {
                        return false;
                    }

                    // Another box is placed there
                    if (pallet[hIndex][lIndex][wIndex] != 0) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    function moveToNextAvailable() {
        x += 1;

        for (let hOffset = 0; hOffset < palletH; hOffset++) {
            let hIndex = z + hOffset;
            
            // If no more space height-wise
            if (hIndex >= palletH) {
                return false;
            }

            for (let lOffset = 0; lOffset < palletL; lOffset++) {
                let lIndex = y + lOffset;

                // If no more space length-wise
                if (lIndex >= palletL) {
                    y = 0;
                    x = 0;
                    break;
                }

                for (let wOffset = 0; wOffset < palletW; wOffset++) {
                    let wIndex = x + wOffset;

                    // If nore more space width-wise
                    if (wIndex >= palletW) {
                        x = 0;
                        break;
                    }

                    if (pallet[hIndex][lIndex][wIndex] == 0) {
                        x = wIndex;
                        y = lIndex;
                        z = hIndex;
                        return true;
                    }
                }
            }
        }
    }

    function fillBox(l, w, h) {
        boxesPlaced += 1;

        for (let i = 0; i < l; i++) {
            for (let j = 0; j < w; j++) {
                for (let k = 0; k < h; k++) {
                    
                    pallet[z + k][y + i][x + j] = boxesPlaced;

                }
            }
        }
    }

    let tempBestPallets = [];
    let tempBestPlaced = 0;

    ttt = [];

    // Perform the calculation with dynamic orientations (runs once)
    console.log("Starting dynamic orientation")

    let isMoreSpace = true;
    while (isMoreSpace) {
        // Place a box considering different orientations
        for (let i = 0; i < orientations.length; i++) {
            let c1 = orientations[i][0];
            let c2 = orientations[i][1];
            let c3 = orientations[i][2];

            // Break if we've placed a box because we found an orientation that works
            if (isValid(c1, c2, c3)) {
                fillBox(c1, c2, c3);
                break;
            }
        }

        isMoreSpace = moveToNextAvailable();
    }

    console.log(`Boxes Placed: ${boxesPlaced}`)

    tempBestPallets.push(pallet);
    tempBestPlaced = boxesPlaced;
    ttt.push(boxesPlaced);

    // Perform the calculation with static orientations (runs 6 times)
    for (let i = 0; i < orientations.length; i++) {
        console.log(`Static orientation: ${i}`);
        // Reset all the initial values for each orientation
        boxesPlaced = 0;
        isMoreSpace = true;
        pallet = zeros([palletH, palletL, palletW]);
        x = 0;
        y = 0;
        z = 0;

        while (isMoreSpace) {
            let c1 = orientations[i][0];
            let c2 = orientations[i][1];
            let c3 = orientations[i][2];
            if (isValid(c1, c2, c3)) {
                fillBox(c1, c2, c3);
            }
            isMoreSpace = moveToNextAvailable();
        }

        ttt.push(boxesPlaced)
        // Store a list of the best placed pallets (erase the list if we've found a better pallet)
        if (boxesPlaced > tempBestPlaced) {
            tempBestPallets = [];
            tempBestPlaced = boxesPlaced;
            tempBestPallets.push(pallet);
        } 
        else if (boxesPlaced == tempBestPlaced) {
            tempBestPallets.push(pallet);
        }

        console.log(`Boxes Placed: ${boxesPlaced}`) //----------------------
    }

    console.log(ttt)
    // Try to find leftover places to place more boxes (runs len(tempBestPallets) times)

    console.log("Finding the best of the best!")
    let bestPallet = tempBestPallets[0]; // placeholder
    let bestPlaced = tempBestPlaced;
    for (let i = 0; i < tempBestPallets.length; i++) {
        boxesPlaced = tempBestPlaced;
        isMoreSpace = true;
        pallet = tempBestPallets[i];
        x = 0;
        y = 0;
        z = 0;

        while (isMoreSpace) {

            // Place a box considering different orientations
            for (let i = 0; i < orientations.length; i++) {
                let c1 = orientations[i][0];
                let c2 = orientations[i][1];
                let c3 = orientations[i][2];
                if (isValid(c1, c2, c3)) {
                    fillBox(c1, c2, c3);
                    break;
                }
            }

            isMoreSpace = moveToNextAvailable()
        }

        // If we found space to place boxes, store the results
        if (boxesPlaced > bestPlaced) {
            bestPlaced = boxesPlaced;
            bestPallet = pallet;
        }
    }

    console.log(`${bestPlaced} is the best placed!`);

    printPallet(bestPallet);

    return bestPallet;
}

console.log("---------------------------------------------")
console.log("40\"x48\"x52\" Pallet Configuration")
console.log("---------------------------------------------")

l = 18;
w = 8;
h = 10;

console.log(`Test for ${l}, ${w}, ${h}:`);
//console.log(calculateConfiguration(l, w, h));
calculateConfiguration(l, w, h);

