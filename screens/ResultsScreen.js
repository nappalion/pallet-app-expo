import React from 'react';
import { View, StyleSheet } from "react-native";
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


function palletExists(l, w, h) {
    return get(ref(database, `pallet-data/${l.toString()}x${w.toString()}x${h.toString()}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Pallet exists.");
          return JSON.parse(snapshot.val());
        } else {
          console.log("Pallet does not exist.");
          return null;
        }
      }).catch((error) => {
        console.error(error);
        return null;
      });
}

function writePalletData(l, w, h, scene) {
    set(ref(database, `pallet-data/${l.toString()}x${w.toString()}x${h.toString()}`), JSON.stringify(scene))
    .then(() => {
        console.log("Pallet added!")
    })
    .catch((error) => {
        console.log("Failed to add pallet!")
    });
}

const ResultsScreen = ({ route, navigation }) => {
    const {l, w, h} = route.params;
    const [numPlaced, setNumPlaced] = React.useState("")



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

        palletExists(l, w, h).then(function(savedScene) {

            if (savedScene != null) {
                scene = new THREE.ObjectLoader().parse(savedScene)
            }

            else {
                // THREE.js code
                scene = new Scene();
    
                let axes = new AxesHelper(100);
                axes.position.x = -35;
                axes.position.y = -25;
                scene.add(axes)    
                
                // Cube [l, w, h, x, y, z, color]
                let results = getBestPallet(l, w, h)
                let cubes = results[0]
    
                setNumPlaced(results[1].toString())
    
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
    
                    writePalletData(l, w, h, scene); 
                }
            }
        
            const render = ()=> {
                requestAnimationFrame(render)
                renderer.render(scene, camera)
        
                gl.endFrameEXP()
            }
        
            render()
        })
    }


    return(
        <View style={styles.container}>
            <SubHeader title="Box Dimensions: " details={`${l.toString()}" x ${w.toString()}" x ${h.toString()}"`}/>
            <GLView
                onContextCreate={onContextCreate}
                style = {styles.pallet}
            />
            <SubHeader title="Boxes Placed: " details={`${numPlaced}`}/>
            <SubHeader title="Pallet Dimensions: " details={'40" x 48" x 52"'}/>
            <Button 
                text="SCAN AGAIN" 
                style={styles.button}
                secondary
                onPress={ () => { navigation.navigate('Barcode') }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
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
    }
});

export default ResultsScreen;