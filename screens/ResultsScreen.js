import React from 'react';
import { View } from 'react-native'
import { Scene, Mesh, MeshBasicMaterial, PerspectiveCamera, BoxGeometry} from "three"
import { Renderer } from "expo-three"
import { GLView } from 'expo-gl';

const ResultsScreen = ({ navigation }) => {


    const onContextCreate = async (gl) => {
        // THREE.js code
        const scene = new Scene()
        const camera = new PerspectiveCamera(
            75,
            gl.drawingBufferWidth/gl.drawingBufferHeight,
            0.1,
            1000
        )
    
        gl.canvas = { width:gl.drawingBufferWidth, heigth:gl.drawingBufferHeight }
    
        // Create a WebGLRenderer
        const renderer = new Renderer({gl})
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
    
    
        let cubes = [[16,8,10,0,0,0], [16,8,10,16,0,0]]
        
        for (let i = 0; i < cubes.length; i++) {
            let color = new THREE.Color(0xffffff);
            color.setHex(Math.random() * 0xffffff);
    
            let geometry = new BoxGeometry(cubes[i][0],cubes[i][1],cubes[i][2])
            let material = new MeshBasicMaterial({
                color: color
            })
            let cube = new Mesh(geometry, material)
            cube.position.set(cubes[i][3],cubes[i][4],cubes[i][5])
    
            scene.add(cube)
        }
        
        camera.position.z = 50

    
        const render = ()=> {
            requestAnimationFrame(render)
            renderer.render(scene, camera)
    
            //controls.update()
            gl.endFrameEXP()
        }
    
        render()
    
    }

    return(
        <View>    
            <GLView
                    onContextCreate={onContextCreate}
                    style = {{width: 500, height: 500}}
                />
        </View>
    )
}

export default ResultsScreen