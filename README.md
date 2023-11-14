# Pallet Configuration Application

- Developed with React Native and uses JavaScript for the pallet configuration. 
- Uses Google Firebase for storing calculated pallets and user information.

<img src="https://i.imgur.com/FZ03ZTg.png" width="200" height="400" /> <img src="https://i.imgur.com/Sw7xwpn.png" width="200" height="400" />

### Description
The idea of pallet configuration seemed similar to the idea of creating a Tetris solving AI. Initially, solving the problem in a 2D-space would allow us to then repeat this with as many layers as we can for the height of the pallet. This problem is more formally called a “packing problem” which is a mathematic optimization problem where the goal is to “pack a single container as densely as possible.”

Goal and Given Inputs:
- Pack a single container as densely as possible.
- A three-dimensional container of fixed size 40”x48”x52”.
- A set of same-sized boxes

### Brute Force Approach:

To start solving the problem, I first thought of a brute force solution (initially in Python) that imitates how a person would fit boxes into a pallet. They would place one at the very corner of the pallet and then place one next to it until there is no more room in that row (x-axis). Then, they would move to the next row (y-axis) and continue the same thing. This would repeat this until the whole bottom floor was filled. In that case, we’d then need to move up (along the z-axis) and repeat. 

The perfect data structure to solve this problem would then be a 3-dimensional array where each value represents an inch. By default, the array will be filled with zeros to represent nothing being there. This value will change to a number depending on the box we are at. I decided to use “numpy” to create this array since accessing values is easier using this library. After asking the user for a box length, width, and height, I would then use these values inside the functions: `isValid(l, w, h)` and `fillBox(l, w, h)`.

`isValid(l, w, h)` checks if the current location is a valid place to place the box. It uses three `for` loops that are nested to check each inch that the box would occupy. If that inch is outside of the pallet or already occupied by another box, then we’d return “False”; otherwise we’d return “True”. 

```
def isValid(l, w, h):
    global x, y, z


    # check if box can be placed
    for lOffset in range(l):
        for wOffset in range(w):
            for hOffset in range(h):


                # calculate all the pixels of the box
                lIndex = y + lOffset
                wIndex = x + wOffset
                hIndex = z + hOffset


                if (lIndex >= palletL) or (wIndex >= palletW) or (hIndex >= palletH):
                    print("outside of pallet!")
                    return False


                if (pallet[hIndex, lIndex, wIndex]) != 0:
                    print("box there!")
                    return False
    return True
```

`fillBox(l,w,h)` places the box. This is only done after we’ve checked for valid boxes. Thinking about it now, this method will only be using a list of valid functions when we start using recursion.

```
def fillBox(l, w, h):
    global x, y, z, boxesPlaced
    boxesPlaced += 1


    for i in range(l):
        for j in range(w):
            for k in range(h):
                # print(z + k, y + i, x + j)
                pallet[z + k, y + i, x + j] = boxesPlaced


    moveToNextAvailable(l, w, h)


    print(str(boxesPlaced) + " placed!")
```
Then to mimic checking if all the sides fit, I filled an array with various box orientations. A loop will loop through each orientation and place the first valid instance. Later we can optimize this so that it doesn’t include orientations if, for example, the length, width, and height are all the same.

```
orientations = [[h, w, l], [h, l, w],
                [l, w, h], [l, h, w],
                [w, l, h], [w, h, l]]
    for i in range(len(orientations)):
        c1, c2, c3 = orientations[i][0], orientations[i][1], orientations[i][2]
        if isValid(c1, c2, c3):
            fillBox(c1, c2, c3)
            break
```
Now, we need to determine when, where, and how to move to the next available spot. To do this, I needed to first move the current x position. From there I would need to use a triple nested for loop to search all the positions starting from the current position. If this position surpassed the box limits, I would skip to the next row, column, or level (height). 

From there I separated the code into a separate function to run multiple tests. I then calculated the time it took the algorithm to run for a certain box size. For 100 different boxes, I achieved an **average of 6.52 seconds with a max of 26 seconds and min of 0 seconds.**

I initially plotted this using Matplotlib.

![Matplotlib Graphics](https://i.imgur.com/oQTfTxP.png)

This is very slow and it doesn’t outperform in terms of number of boxes placed, so I have some ideas in mind in terms of optimization.

Optimizations:
- For boxes that have the same size for multiple dimensions, for example (10x10x10), we don’t need to do every orientation. This would waste time as the algorithm would need to perform 6 orientations for every inch when we only needed to do one.
- We could skip to a specific coordinate depending on how we placed the box. For example, if we placed a box that was 10 long, then we need to move 10 inches along x.
- We could cache the box we’ve calculated so we don’t need to calculate the same box again.
- We can recursively call every working orientation for every position (will result in slower run time).

Some Problems:
- We also need to account for decimals for the inches, ex: 15.5 inches. You can’t do half a loop.
- If the algorithm is currently slow then calling recursion on it (to find every combination) would make it exponentially slower.

### After Some Optimizations and Switching to React Native

I rewrote all the Python code in Javascript, and it turns out that the results are different (sometimes better) for some pallets. The Javascript also performs MUCH faster than Python. With 100 tests in the new pallet JS program, the average runtime was **982.72 milliseconds or 0.98 seconds**.



