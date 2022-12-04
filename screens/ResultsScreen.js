import React from 'react';
import { View } from "react-native";
import { Scene, Vector3, MeshBasicMaterial, Mesh, AxesHelper, PerspectiveCamera, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, Color} from "three"
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Renderer } from "expo-three"
import { GLView } from 'expo-gl';

import { getBestPallet } from "../pallet-configuration"

const ResultsScreen = ({ route, navigation }) => {
    const { l, w, h } = route.params;

    const onContextCreate = async (gl) => {
        // THREE.js code
        const scene = new Scene()
        const camera = new PerspectiveCamera(
            65,
            gl.drawingBufferWidth/gl.drawingBufferHeight,
            0.1,
            1000
        )

        // Position the Camera Correctly
        camera.position.set(-40, 70, 60);
        let point = new Vector3(20, 20, 15);
        camera.lookAt(point);
        camera.rotation.z = 3.7;
        camera.position.set(-80, 65, 80);

        let axes = new AxesHelper(100);
        axes.position.x = -35;
        axes.position.y = -25;
        scene.add(axes)

        // Create a WebGLRenderer/Canvas
        gl.canvas = { width:gl.drawingBufferWidth, heigth:gl.drawingBufferHeight }
        const renderer = new Renderer({gl})
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
    
        
        // Cube [l, w, h, x, y, z, color]
        let results = getBestPallet(l, w, h)
        let cubes = results[0]

        let numberPlaced = results[1]

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
        }
    
    
        const render = ()=> {
            requestAnimationFrame(render)
            renderer.render(scene, camera)
    
            gl.endFrameEXP()
        }
    
        render()
    }


    return(
        <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
            <GLView
                onContextCreate={onContextCreate}
                style = {{width: 500, height: 500, alignSelf: 'center'}}
            />
        </View>
    );
};

export default ResultsScreen;