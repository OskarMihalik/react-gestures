import React from 'react'
import { MeshProps } from 'react-three-fiber'
import { Vector } from 'ts-matrix'
import { IPointer, useGestures } from './lib/gestures'

type Props = {
    componentRef: any,
    meshRef: React.MutableRefObject<MeshProps | undefined>,
}

const Mesh = (props: Props) => {
    const onTap = (pointer: IPointer) => {
        console.log("tap:", pointer.position)
    }

    const onDrag = (pointer: IPointer) => {
        if (!props.meshRef.current) {
            return;
        }
        props.meshRef.current.position.x = props.meshRef.current.position.x + (pointer.delta.at(0) * 0.05)
        props.meshRef.current.position.y = props.meshRef.current.position.y - pointer.delta.at(1) * 0.05
    }

    const onRotate = (rotation: number) => {
        if (!props.meshRef.current) {
            return;
        }
        props.meshRef.current.rotation.y += rotation * 0.1
    }

    const onPinch = (scale: number) => {
        if (!props.meshRef.current) {
            return;
        }
        const pinch = scale * 0.005
        props.meshRef.current.scale.x += pinch
        props.meshRef.current.scale.y += pinch
        props.meshRef.current.scale.z += pinch
    }

    const onDoubleDrag = (direction: Vector, pointers: IPointer[]) => {
        if (!props.meshRef.current) {
            return;
        }
        props.meshRef.current.position.x += (direction.at(0) * 0.05)
        props.meshRef.current.position.z += (direction.at(1) * 0.05)
    }

    const onTripleDrag = (direction: Vector, pointers: IPointer[]) => {
        if (!props.meshRef.current) {
            return;
        }

        props.meshRef.current.position.y -= (direction.at(1) * 0.05)
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
        <mesh rotation={[0, 0, 0]} ref={props.meshRef}>
            <boxGeometry attach="geometry" args={[2, 2, 2]} />
            <meshStandardMaterial
                attach="material"
                color="blue"
            />
        </mesh>
    )
}

export default Mesh