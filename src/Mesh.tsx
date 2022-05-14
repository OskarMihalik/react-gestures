import React, { useRef } from 'react'
import { MeshProps } from 'react-three-fiber'
import { Vector } from 'ts-matrix'
import { IPointer, useGestures } from './lib/gestures'

type Props = {
    componentRef: any
}

const Mesh = (props: Props) => {
    const myMeshRef = useRef<any>()

    const onTap = (pointer: IPointer) => {
        console.log("tap:", pointer.position)
    }

    const onDrag = (pointer: IPointer) => {
        myMeshRef.current.position.x = myMeshRef.current.position.x + (pointer.delta.at(0) * 0.05)
        myMeshRef.current.position.y = myMeshRef.current.position.y - pointer.delta.at(1) * 0.05
    }

    // const onRotate = (rotation: number) => {
    //     myMeshRef.current.rotation.x = myMeshRef.current.position.x + (pointer.delta.at(0) * 0.05)
    // }

    useGestures(props.componentRef,
        onTap,
        onDrag
    )


    return (
        <mesh rotation={[0, 0, 0]} ref={myMeshRef}>
            <boxGeometry attach="geometry" args={[2, 2, 2]} />
            <meshStandardMaterial
                attach="material"
                color="blue"
            />
        </mesh>
    )
}

export default Mesh