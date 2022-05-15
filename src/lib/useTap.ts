import React, { useRef } from 'react'
import { IPointer } from './gestures'

export interface ITap {
    distance: number,
    timer: NodeJS.Timeout | null,
    timerTime: number
}

const useTap = () => {
    const defaultDistance = 10
    const timerTimeMax = 100
    const tapInfo = useRef<ITap>({
        distance: 10,
        timer: null,
        timerTime: 0,
    })

    const startTimer = () => {
        if (tapInfo.current.timer){
            reset()
        }else{
            tapInfo.current.timer = setInterval(()=>{
            tapInfo.current.timerTime += 1
        }, 1)
        }
        
    }

    const stopTimer = () => {
        if (tapInfo.current.timer){
            clearInterval(tapInfo.current.timer)
            tapInfo.current.timerTime = 0
        }
    }

    const reset = () => {
        tapInfo.current.distance = defaultDistance
        tapInfo.current.timerTime = 0
        stopTimer()
        tapInfo.current.timer = null
    }

    const updateDistance = (traveled: number) => {
        if (tapInfo.current.timer)
            tapInfo.current.distance -= traveled
    }

    const differentiatetapHold = (onTap: () => void, onHold: () => void) => {
        if (!tapInfo.current.timer){
            return
        }
        
        if (tapInfo.current.timerTime < timerTimeMax && tapInfo.current.distance > 0 && tapInfo.current.distance <= defaultDistance){
            onTap()
            reset()
        }
            
        else if (tapInfo.current.timerTime >= timerTimeMax && tapInfo.current.distance > 0 && tapInfo.current.distance <= defaultDistance){
            onHold()
            reset()
        }
    }

    const getTimer = () => {
        return tapInfo.current.timer
    }

    return {
        startTimer,
        stopTimer,
        reset,
        updateDistance,
        differentiatetapHold,
        getTimer
    }
}

export default useTap