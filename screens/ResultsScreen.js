import React, {useEffect, useLayoutEffect, useState} from 'react';
import { View, StyleSheet, ScrollView, Text, Image} from "react-native";
import { HeaderBackButton } from '@react-navigation/elements'
import { Scene, Vector3, MeshBasicMaterial, Mesh, AxesHelper, PerspectiveCamera, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, Color} from "three"
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Renderer } from "expo-three"
import { GLView } from 'expo-gl';

import SubHeader from '../components/SubHeader';
import Button from '../components/Button';


import { getBestPallet } from "../pallet-configuration"
import { COLORS } from '../colors';

import { database } from "../firebaseConfig.js"
import { ref, child, get, set } from "firebase/database";
import { scaleLongestSideToSize } from 'expo-three/build/utils';

import { Button as RNButton } from 'react-native';


const ResultsScreen = ({ route, navigation }) => {
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");
    const [ dimensions, setDimensions ] = useState(route.params.dimensions || "")
    const [ itemName, setItemName ] = useState((route.params.itemName) ? route.params.itemName : "" )
    const [ l, setLength ] = useState((route.params.dimensions) ? Math.ceil(route.params.dimensions.length).toString() : "" );
    const [ w, setWidth ] = useState((route.params.dimensions) ? Math.ceil(route.params.dimensions.width).toString() : "" );
    const [ h, setHeight ] = useState((route.params.dimensions) ? Math.ceil(route.params.dimensions.height).toString() : "" );
    const [ previousScreenName, setPreviousScreenName ] = useState((route.params.previousScreenName) ? route.params.previousScreenName : "" );
    const [numPlaced, setNumPlaced] = useState("");
    const [ loaded, setLoaded ] = useState(false);

    useLayoutEffect(() => {
        
        if (previousScreenName == "Calculate") {
            navigation.setOptions({
                headerLeft: () => (
                    <HeaderBackButton
                        onPress={() => {
                        
                            console.log("Previous Screen Name: " + previousScreenName)
                            navigation.navigate('Calculate', {
                                currUser: currUser,
                                barcode: "",
                                previousScreenName: previousScreenName
                            })
                        }}
                    />
                ),
            });
        }
    }, [navigation])


    function palletExists(l, w, h) {
        // Get the unique orientations using a set
        let orientations = new Set([[h, w, l], [h, l, w],[l, w, h], [l, h, w], [w, l, h], [w, h, l]].map(JSON.stringify));
        orientations = Array.from(orientations).map(JSON.parse);

        return get(ref(database, `pallet-data/`)).then((snapshot) => {
            const result = snapshot.val();
            for (const pallet in result) {
                for (let j = 0; j < orientations.length; j++) {
                    if (pallet == `${Math.ceil(orientations[j][0]).toString()}x${Math.ceil(orientations[j][1]).toString()}x${Math.ceil(orientations[j][2]).toString()}`) {
                        console.log("Pallet exists.");
                        return result[pallet];
                    }
                }
            }   

            console.log("Pallet does not exist.");
            return null;

          }).catch((error) => {
            console.error(error);
            return null;
          });
    }
    
    function writePalletData(l, w, h, scene, numPlaced) {
        set(ref(database, `pallet-data/${l.toString()}x${w.toString()}x${h.toString()}/`), { scene: JSON.stringify(scene), numPlaced:numPlaced })
        .then(() => {
            console.log("Pallet added!")
        })
        .catch((error) => {
            console.log("Failed to add pallet!")
        });
    }

    const onContextCreate = async (gl) => {
        
        // Create a WebGLRenderer/Canvas
        gl.canvas = { width:gl.drawingBufferWidth, heigth:gl.drawingBufferHeight }
        const renderer = new Renderer({gl})
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)

        // Create Camera and Position it Correctly
        const camera = new PerspectiveCamera(
            65,
            gl.drawingBufferWidth/gl.drawingBufferHeight,
            0.1,
            1000
        )

        camera.position.set(-40, 70, 60);
        let point = new Vector3(20, 20, 15);
        camera.lookAt(point);
        camera.rotation.z = 3.7;
        camera.position.set(-80, 65, 80);

        let scene = null;

        palletExists(l, w, h).then(function(result) {
            console.log("Calculating with: " + l + ", " + w + ", " + h + ".")

            function calculatePallet(l, w, h) {
                    
                // THREE.js code
                scene = new Scene();
    
                let axes = new AxesHelper(100);
                axes.position.x = -35;
                axes.position.y = -25;
                scene.add(axes)    
                
                // Cube [l, w, h, x, y, z, color]
                let results = getBestPallet(l, w, h)
                let cubes = results[0]
    
                let numPlaced = results[1].toString()
    
                let coreColor = cubes[0][6].toString();
                let sections = {};

                
                for (let i = 0; i < cubes.length; i++) {
                    let cubeColorKey = cubes[i][6].toString();
            
                    // Add to dictionary if color isn't already there
                    if (!(cubes[i][6] in sections)) {
                        sections[cubeColorKey] = [[], 0, 0, 0, []];
                    }
            
                    let l = cubes[i][0];
                    let w = cubes[i][1];
                    let h = cubes[i][2];
            
                    // Create main object
                    let geometry = new BoxGeometry(w, l, h);
                    geometry.translate(
                    w / 2 + cubes[i][3] - 24,
                    l / 2 + cubes[i][4] - 20,
                    h / 2 + cubes[i][5]
                    );
            
                    // Create edge object
                    let edges = new EdgesGeometry(geometry);
            
                    // Add the geometry to section array
                    sections[cubeColorKey][0].push(geometry);
                    sections[cubeColorKey][4].push(edges);
            
                    // Replace max x, y, z of section
                    sections[cubeColorKey][1] = Math.max(
                    sections[cubeColorKey][1],
                    cubes[i][3]
                    );
                    sections[cubeColorKey][2] = Math.max(
                    sections[cubeColorKey][2],
                    cubes[i][4]
                    );
                    sections[cubeColorKey][3] = Math.max(
                    sections[cubeColorKey][3],
                    cubes[i][5]
                    );
                }
            
                for (const [key, data] of Object.entries(sections)) {
                    // Create a color
                    let color = new Color(0xffffff);
                    color.setHex(parseInt(key));
    
                    let section = BufferGeometryUtils.mergeBufferGeometries(data[0]);
                    let edges = BufferGeometryUtils.mergeBufferGeometries(data[4]);
    
    
                    // Add a Mesh and Add to Scene
                    let material = new MeshBasicMaterial({
                        color: color,
                    });
                    let cube = new Mesh(section, material);

                    
                    let line = new LineSegments(
                        edges,
                        new LineBasicMaterial({ color: 0x000000 })
                    );
    
                    // Add Offset
                    // Create a dictionary of each color: array(with each being a BoxBufferGeometry) and the largest x, y, and z for that section
                    // If the x, y, or z is greater than the core's values, then increase the x, y, or z of the section
                    // Section data: [boxes, max-x, max-y, max-z, edges]
    
                    let xOffset = 18;
                    let zOffset = 17;
                    let yOffset = 19;
    
                    if (data[1] > sections[coreColor][1]) {
                        cube.position.x += xOffset;
                        line.position.x += xOffset;
                    } else if (data[2] > sections[coreColor][2]) {
                        cube.position.y += yOffset;
                        line.position.y += yOffset;
                    } else if (data[3] > sections[coreColor][3]) {
                        cube.position.z += zOffset;
                        line.position.z += zOffset;
                    }
    
                    scene.add(cube);
                    scene.add(line);
                }

                return {
                    scene: scene,
                    numPlaced: numPlaced
                }
            }

            function calculatePromise() {
                return new Promise(function(resolve, reject) {
                    resolve(calculatePallet(l, w, h));
                })
            }

            if (result != null) {
                scene = new THREE.ObjectLoader().parse(JSON.parse(result.scene));
                let axes = new AxesHelper(100);
                axes.position.x = -35;
                axes.position.y = -25;
                scene.add(axes) 
                setNumPlaced(result.numPlaced);
                setLoaded(true);
            }
            else {
                calculatePromise().then((result) => {
                    writePalletData(l, w, h, result.scene, result.numPlaced);
                    setNumPlaced(result.numPlaced);
                    setLoaded(true);
                });
            }

            const render = ()=> {
                requestAnimationFrame(render)
                renderer.render(scene, camera)
        
                camera.zoom = 1.2
                camera.updateProjectionMatrix()
                gl.endFrameEXP()
            }
        
            render()
        });
    }


    return(
        <ScrollView style={styles.container}>
            { itemName
                && <SubHeader title="Item Name: " details={`${itemName}`}/>
            }

            <SubHeader title="Box Dimensions: " details={`${dimensions.length.toString()}" x ${dimensions.width.toString()}" x ${dimensions.height.toString()}"`}/>
            { !loaded 
                && <View>
                    <Text style={styles.text}>Calculating pallet configuration...</Text>
                    <Text style={styles.text}>Since this is the first calculation, it may take some time (2 minute max).</Text>
                    <Image source={require('../assets/loading.gif')} style={styles.loading}/>
                </View>
            }

            <GLView
                onContextCreate={onContextCreate}
                style = {styles.pallet}
            />

            <SubHeader title="TIHI: " details={`${numPlaced}`}/>
            <SubHeader title="Pallet Dimensions: " details={'40" x 48" x 52"'}/>
            <Button 
                text="SCAN AGAIN" 
                style={styles.button}
                secondary
                onPress={ () => { navigation.navigate("Barcode", {
                    currUser: currUser,
                    previousScreenName: "Landing"
                }) }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignContent: 'center', 
        paddingLeft: 20, 
        paddingRight: 20
    },
    pallet: {
        width: 450, 
        height: 450, 
        margin: 20,
        alignSelf: 'center', 
        backgroundColor: COLORS.light_yellow
    },
    button: {
        marginTop: 20
    },
    loading: {
        height: 50,
        alignSelf: "center",
        margin: 20,
        resizeMode: 'contain'
    },
    text: {
        color: COLORS.dark_purple,
        fontWeight: 'bold',
        marginTop: 10
    }
});

export default ResultsScreen;