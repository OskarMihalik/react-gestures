import React, { useEffect, useRef } from 'react'
import { Vector } from 'ts-matrix'
import {
    calculateDelata,
    distance,
    get360angleVector2D,
    twoFingerDirection,
    twoFingerDotProduct
} from './vectorMath'

export interface IPointer {
    id: number
    position: Vector
    delta: Vector
}

export interface IGestures {
    onTapGesture?: (pointer: IPointer) => void,
    onDragGesture?: (pointer: IPointer) => void,
    onRotateGesture?: (rotate: number) => void,
    onPinchGesture?: (scale: number) => void,
    onDoubleDragGesture?: (direction: Vector, pointers: IPointer[]) => void,
    onTripleDragGesture?: (direction: Vector, pointers: IPointer[]) => void,
}

export const useGestures = (
    gestureComponentRef: any,
    gestures: IGestures
) => {
    const {onTapGesture, onDragGesture, onRotateGesture, onPinchGesture, onDoubleDragGesture, onTripleDragGesture} = gestures

    const dragDistance = useRef(0) // save drag distance for calculating if tap is possible
    const onGoingTouches = useRef<IPointer[]>([])

    const copyTouch = (event: PointerEvent): IPointer => {
        let delta = new Vector([0, 0])
        const index = onGoingTouchIndexById(event.pointerId)
        if (index !== -1) {
            delta = calculateDelata(event, index, onGoingTouches.current)
        }

        return {
            id: event.pointerId,
            position: new Vector([event.pageX, event.pageY]),
            delta: delta,
        }
    }

    const handleCancel = (event: PointerEvent) => {
        const index = onGoingTouchIndexById(event.pointerId)
        onGoingTouches.current.splice(index, 1)
    }

    const onGoingTouchIndexById = (idToFind: number) => {
        for (var i = 0; i < onGoingTouches.current.length; i++) {
            var id = onGoingTouches.current[i].id

            if (id == idToFind) {
                return i
            }
        }
        return -1 // not found
    }

    const handleStart = (event: PointerEvent) => {
        event.preventDefault()
        onGoingTouches.current.push(copyTouch(event))
        const index = onGoingTouchIndexById(event.pointerId)
        dragDistance.current = 0
        handleGestures(index)
    }

    const handleEnd = (event: PointerEvent) => {
        const index = onGoingTouchIndexById(event.pointerId)
        if (
            onGoingTouches.current.length === 1 &&
            dragDistance.current < 10 &&
            dragDistance.current >= 0 &&
            index !== -1
        ) {
            // useTapMessage(onGoingTouches.current[index].vector)
            if (onTapGesture){
                onTapGesture(onGoingTouches.current[index])
            }
        }
        dragDistance.current = -0.1
        onGoingTouches.current.splice(index, 1)
    }

    const handleMove = (event: PointerEvent) => {
        event.preventDefault()
        const index = onGoingTouchIndexById(event.pointerId)
        if (index === -1) {
            return
        }
        let curPointer = { ...copyTouch(event) }

        onGoingTouches.current.splice(index, 1, curPointer)

        handleGestures(index)
    }

    const handleGestures = (currentTouchIndex: number) => {
        if (onGoingTouches.current.length === 1) {
            dragGesture(currentTouchIndex)
        } else if (onGoingTouches.current.length === 2) {
            pinchGesture()
            rotateGesture()
            doubleDragGesture()
            dragDistance.current = -0.1
        } else if (onGoingTouches.current.length === 3) {
            tripleDragGesture()
            dragDistance.current = -0.1
        }
    }

    const dragGesture = (touchIndex: number) => {
        const curTouch = onGoingTouches.current[touchIndex]
        dragDistance.current += curTouch.delta.length()
        // useDragMessage(onGoingTouches.current.length, curTouch.delta)
        if (onDragGesture){
            onDragGesture(curTouch)
        }

    }

    const pinchGesture = () => {
        const curDistance = distance(
            onGoingTouches.current[0].position,
            onGoingTouches.current[1].position
        )
        const delta0 = onGoingTouches.current[0].delta
        const delta1 = onGoingTouches.current[1].delta

        const vector0delta0 = new Vector(
            onGoingTouches.current[0].position.values
        ).substract(delta0)

        const vector1delta1 = new Vector(
            onGoingTouches.current[1].position.values
        ).substract(delta1)

        const pinch = curDistance - distance(vector0delta0, vector1delta1)

        // usePinchMessage(pinch)
        if (onPinchGesture)
            onPinchGesture(pinch)
    }

    const rotateGesture = () => {
        const curTouches = onGoingTouches.current

        const delta0 = onGoingTouches.current[0].delta
        const delta1 = onGoingTouches.current[1].delta
        const vector0delta0 = new Vector(
            onGoingTouches.current[0].position.values
        ).substract(delta0)

        const vector1delta1 = new Vector(
            onGoingTouches.current[1].position.values
        ).substract(delta1)

        const curDelta = new Vector(curTouches[0].position.values).substract(
            new Vector(curTouches[1].position.values)
        )

        const prevDelta = vector0delta0.substract(vector1delta1)

        let rotate = get360angleVector2D(curDelta, prevDelta) * 25

        // useRotateMessage(rotate)
        if (onRotateGesture){
            onRotateGesture(rotate)
        }
    }

    const doubleDragGesture = () => {
        const maxDotProduct = twoFingerDotProduct(onGoingTouches.current)
        const doubleDrag = twoFingerDirection(onGoingTouches.current)

        const doubleDragFinal = doubleDrag.multiply(
            new Vector([maxDotProduct, maxDotProduct])
        )

        // useDoubleDragMessage(onGoingTouches.current.length, doubleDragFinal)
        if (onDoubleDragGesture)
            onDoubleDragGesture(doubleDragFinal, onGoingTouches.current)
    }

    const tripleDragGesture = () => {
        const curTouches = onGoingTouches.current
        if (onTripleDragGesture === undefined || curTouches[2].delta.equals(new Vector([0,0])))
            return

        //twoFingerDotProduct
        const _twoFingerDotProduct = twoFingerDotProduct(onGoingTouches.current)
        //twoFingerDirection
        const _twoFingerDirection = twoFingerDirection(onGoingTouches.current)
        //dotProduct
        const vec2Normalized = new Vector(
            curTouches[2].delta.values
        ).normalize()
        const twoFingerDirectionMultiplied = new Vector(
            _twoFingerDirection.values
        )
            .multiply(new Vector([_twoFingerDotProduct, _twoFingerDotProduct]))
            .normalize() //(twoFingerDirection * twoFingerDotProduct).normalized)
        const dotProduct = vec2Normalized.dot(twoFingerDirectionMultiplied)
        const maxDotProduct = Math.max(0, dotProduct)
        //direction
        const direction = _twoFingerDirection.add(curTouches[2].delta)
        //tripledrag
        const tripleDrag = direction.multiply(
            new Vector([maxDotProduct, maxDotProduct])
        )

        //unfortunately ts-matrix returns NaN on some operations like normalize or dot when it should be returning [0,0]
        if (isNaN(tripleDrag.at(0)) || isNaN(tripleDrag.at(1))){
            return
        }
            

        
        // useTripleDragMessage(onGoingTouches.current.length, tripleDrag)
        onTripleDragGesture(tripleDrag, curTouches)
        
    }

    useEffect(() => {
        gestureComponentRef.current.addEventListener(
            'pointerdown',
            handleStart,
            false
        )
        // gestureComponent.current.addEventListener(
        //     'pointerup',
        //     handleCancel,
        //     false
        // )
        gestureComponentRef.current.addEventListener('pointerup', handleEnd, false)
        gestureComponentRef.current.addEventListener(
            'pointermove',
            handleMove,
            false
        )
        gestureComponentRef.current.addEventListener(
            'pointerleave',
            handleCancel,
            false
        )

        return () => {
            gestureComponentRef.current.removeEventListener(
                'pointerdown',
                handleStart
            )
            // gestureComponent.current.removeEventListener(
            //     'pointerup',
            //     handleCancel
            // )
            gestureComponentRef.current.removeEventListener('pointerup', handleEnd)
            gestureComponentRef.current.removeEventListener(
                'pointermove',
                handleMove
            )
            gestureComponentRef.current.removeEventListener(
                'pointerleave',
                handleCancel
            )
        }
    }, [])
}
