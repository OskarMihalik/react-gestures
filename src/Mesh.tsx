import React, { useRef } from 'react'
import { MeshProps } from 'react-three-fiber'
import { Vector } from 'ts-matrix'
import { IPointer, useGestures } from './lib/gestures'

type Props = {
    componentRef: any
}

const Mesh = (props: Props) => {
    const myMeshRef = useRef<MeshProps>()

    const onTap = (pointer: IPointer) => {
        console.log("tap:", pointer.position)
    }

    const onDrag = (pointer: IPointer) => {
        if (!myMeshRef.current) {
            return;
        }
        myMeshRef.current.position.x = myMeshRef.current.position.x + (pointer.delta.at(0) * 0.05)
        myMeshRef.current.position.y = myMeshRef.current.position.y - pointer.delta.at(1) * 0.05
    }

    const onRotate = (rotation: number) => {
        if (!myMeshRef.current) {
            return;
        }
        myMeshRef.current.rotation.y += rotation * 0.1
    }

    const onPinch = (scale: number) => {
        if (!myMeshRef.current) {
            return;
        }
        const pinch = scale * 0.005
        myMeshRef.current.scale.x += pinch
        myMeshRef.current.scale.y += pinch
        myMeshRef.current.scale.z += pinch
    }

    const onDoubleDrag = (direction: Vector, pointers: IPointer[]) => {
        if (!myMeshRef.current) {
            return;
        }
        myMeshRef.current.position.x += (direction.at(0) * 0.05)
        myMeshRef.current.position.z += (direction.at(1) * 0.05)
    }

    const onTripleDrag = (direction: Vector, pointers: IPointer[]) => {
        if (!myMeshRef.current) {
            return;
        }

        myMeshRef.current.position.y -= (direction.at(1) * 0.05)
    }

    const onHold = (pointer: IPointer) => {
        console.log("Hold:", pointer.position)
    }

    useGestures(props.componentRef, {
        onTapGesture: onTap,
        onDragGesture: onDrag,
        onPinchGesture: onPinch,
        onRotateGesture: onRotate,
        onDoubleDragGesture: onDoubleDrag,
        onTripleDragGesture: onTripleDrag,
        onHoldGesture: onHold
    },
        // 8,
        // 1000
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