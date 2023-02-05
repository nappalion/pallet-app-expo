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

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}


function calculateConfiguration(l, w, h) {
    let boxesPlaced = 0;
    
    // Get the unique orientations using a set
    let orientations = new Set([[h, w, l], [h, l, w],[l, w, h], [l, h, w], [w, l, h], [w, h, l]].map(JSON.stringify));
    orientations = Array.from(orientations).map(JSON.parse);

    for (let i = 0; i < orientations.length; i++) {
        let hue = Math.floor(Math.random() * 360);
        let saturation = Math.floor(Math.random() * 100);
        let lightness = Math.floor(Math.random() * 50) + 50;
        let rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);
        let color = rgb[0] << 16 | rgb[1] << 8 | rgb[2]
        orientations[i].push(color)
    }

    const palletL = 48;
    const palletW = 40;
    const palletH = 52;

    let pallet = zeros([palletH, palletL, palletW]);
    let uiPallet = []; // Holds data that three.js can use

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

    function fillBox(l, w, h, color) {
        boxesPlaced += 1;

        for (let i = 0; i < l; i++) {
            for (let j = 0; j < w; j++) {
                for (let k = 0; k < h; k++) {
                    
                    pallet[z + k][y + i][x + j] = boxesPlaced;
                    
                }
            }
        }
        uiPallet.push([l, w, h, x, y, z, color])
    }

    let tempBestPallets = [];
    let tempBestUIPallets = [];
    let tempBestPlaced = 0;

    ttt = [];

    // Perform the calculation with dynamic orientations (runs once)
    //console.log("Starting dynamic orientation")

    let isMoreSpace = true;
    while (isMoreSpace) {
        // Place a box considering different orientations
        for (let i = 0; i < orientations.length; i++) {
            let c1 = orientations[i][0];
            let c2 = orientations[i][1];
            let c3 = orientations[i][2];
            let color = orientations[i][3];

            // Break if we've placed a box because we found an orientation that works
            if (isValid(c1, c2, c3)) {
                fillBox(c1, c2, c3, color);
                break;
            }
        }

        isMoreSpace = moveToNextAvailable();
    }

    //console.log(`Boxes Placed: ${boxesPlaced}`)

    tempBestPallets.push(pallet);
    tempBestUIPallets.push(uiPallet)
    tempBestPlaced = boxesPlaced;
    ttt.push(boxesPlaced);

    // Perform the calculation with static orientations (runs 6 times)
    for (let i = 0; i < orientations.length; i++) {
        //console.log(`Static orientation: ${i}`);
        // Reset all the initial values for each orientation
        boxesPlaced = 0;
        isMoreSpace = true;
        pallet = zeros([palletH, palletL, palletW]);
        uiPallet = [];
        x = 0;
        y = 0;
        z = 0;

        while (isMoreSpace) {
            let c1 = orientations[i][0];
            let c2 = orientations[i][1];
            let c3 = orientations[i][2];
            let color = orientations[i][3];
            if (isValid(c1, c2, c3)) {
                fillBox(c1, c2, c3, color);
            }
            isMoreSpace = moveToNextAvailable();
        }

        ttt.push(boxesPlaced)
        // Store a list of the best placed pallets (erase the list if we've found a better pallet)
        if (boxesPlaced > tempBestPlaced) {
            tempBestPallets = [];
            tempBestUIPallets = [];
            tempBestPlaced = boxesPlaced;
            tempBestPallets.push(pallet);
            tempBestUIPallets.push(uiPallet);
        } 
        else if (boxesPlaced == tempBestPlaced) {
            tempBestPallets.push(pallet);
            tempBestUIPallets.push(uiPallet);
        }

        //console.log(`Boxes Placed: ${boxesPlaced}`) //----------------------
    }

    //console.log(ttt)
    // Try to find leftover places to place more boxes (runs len(tempBestPallets) times)

    //console.log("Finding the best of the best!")
    let bestPallet = tempBestPallets[0]; // placeholder
    let bestUIPallet = tempBestUIPallets[0];
    let bestPlaced = tempBestPlaced;
    for (let i = 0; i < tempBestPallets.length; i++) {
        boxesPlaced = tempBestPlaced;
        isMoreSpace = true;
        pallet = tempBestPallets[i];
        uiPallet = tempBestUIPallets[i];
        x = 0;
        y = 0;
        z = 0;

        while (isMoreSpace) {

            // Place a box considering different orientations
            for (let i = 0; i < orientations.length; i++) {
                let c1 = orientations[i][0];
                let c2 = orientations[i][1];
                let c3 = orientations[i][2];
                let color = orientations[i][3];
                if (isValid(c1, c2, c3)) {
                    fillBox(c1, c2, c3, color);
                    break;
                }
            }

            isMoreSpace = moveToNextAvailable()
        }

        // If we found space to place boxes, store the results
        if (boxesPlaced > bestPlaced) {
            bestPlaced = boxesPlaced;
            bestPallet = pallet;
            bestUIPallet = uiPallet;
        }
    }

    //console.log(`${bestPlaced} is the best placed!`);

    //printPallet(bestPallet);

    return [bestUIPallet, bestPlaced];
}

export const getBestPallet = (l, w, h) => {
    // Get the unique orientations using a set
    let orientations = new Set([[h, w, l], [h, l, w],[l, w, h], [l, h, w], [w, l, h], [w, h, l]].map(JSON.stringify));
    orientations = Array.from(orientations).map(JSON.parse);

    let bestUIPallet = 0 // placeholder
    let bestPlaced = 0 // placeholder

    for (let i = 0; i < orientations.length; i++) {
        result = calculateConfiguration(orientations[i][0], orientations[i][1], orientations[i][2])
        //console.log(orientations[i])
        if (bestPlaced < result[1]) {
            bestUIPallet = result[0]
            bestPlaced = result[1]
        }
    }

    return [bestUIPallet, bestPlaced]
}

// console.log("---------------------------------------------")
// console.log("40\"x48\"x52\" Pallet Configuration")
// console.log("---------------------------------------------")

// l = 18;
// w = 8;
// h = 10;

// console.log(`Test for ${l}, ${w}, ${h}:`);
// //console.log(calculateConfiguration(l, w, h));
// console.log(getBestPallet(l, w, h)[1])

