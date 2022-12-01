import React, { useRef, useState } from 'react';
import { View } from 'react-native'
import { Canvas, useFrame, useThree } from '@react-three/fiber/native'
import {Slider} from '@miblanchard/react-native-slider';




const ResultsScreen = ({ navigation }) => {

    const [rotation, setRotation] = useState(0)


    function Box(props) {
        const mesh = useRef(null)
        const [hovered, setHover] = useState(false)
        const [active, setActive] = useState(false)
        //useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
        return (
          <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
            onPointerMove={console.log("bye")}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
          </mesh>
        )
    }

    const cubes = [];
    let x = -2;
    for (let i = 0; i < 5; i++) {
        cubes.push(<Box position={[x, 0, 0]} key={i}/>)
        x += 1
    }
    return(  

        <View style={{flex: 1}}>
            <Canvas>
                <group rotateY={0.8}>
                    {cubes}
                </group>
            </Canvas>
            <Slider 
                value={rotation}
                onValueChange={value => {
                    setRotation(value)
                }}
            />
        </View>



    );
}

export default ResultsScreen