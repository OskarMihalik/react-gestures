# react-multitouch-gestures

this is an react gesture library that supports:

- tap
- hold
- drag with one finger
- drag with two fingers
- drag with three fingers

[demo](https://codesandbox.io/s/late-cookies-mg0kvt)

# How to use

```
function App() {
    const component = useRef(null)


    const onDrag = (pointer: IPointer) => {
        console.log("dragging")
    }

    useGestures(component, {
    onTapGesture: (pointer) => console.log(pointer.position.at(0)) //example how to print x position of tap
    onDragGesture: onDrag,
    // onPinchGesture: onPinch,
    // onRotateGesture: onRotate,
    // onDoubleDragGesture: onDoubleDrag,
    // onTripleDragGesture: onTripleDrag,
    // onHoldGesture: onHold
  },
    8, //distanceTreshold for hold gesture, the bigger number the further you can drag while holding
    1000 // time in ms when the hold activates
  )

  return (
    <div className="App"
      ref={component}
      style={{ touchAction: 'none' }} //you need to disable default browser gestures
    >
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          react-multitouch-gestures
        </p>
      </header>
    </div>
  );
}
```

## how to run this repository

```
"clone this repository"
"uncomment lines in tsconfig.json"
npm i
npm run start

```
