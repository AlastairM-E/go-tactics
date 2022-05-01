# Defect

- When a user starts a game from a blank one, when they click to go back the first time, nothing changes, despite there being more than 1 move.

## Reproduce

- Delete any stored games, refresh the page.
- Click on the blank 9 x 9 go board, on all 4 corners.
- press the back button.

- expect: 3 stones.
- Receive: 4 stones.

- Confirm: Yes.

## Gather

- since it occurs with the back button, I can assume it is an issue with the playUpTo Button.
- I should record the inputs and any expected occurances, so I can confirm what is going on inside the function.
- I should gather:

  Init:

  - moveNumber.
  - goHistory.
  - goHistory[moveNumber].
  - currentMove.

  Mannual run through goMoves:

  - nextBoardPosition.
  - CURRENT

---

Log out 1

Init:

- moveNumber: 3.
- goHistory: [goBoard * 4 (4th being 1, 1, -1, -1)].
- goHistory[moveNumber] (1, 1, -1, -1)).
- currentMove: 4.

Mannual run through goMoves:

- nextBoardPosition: (did not run).
- CURRENT: (did not run).

CUrrent move is 4.
Since it can only occur from add move, sicn eth at is the place which currentMove changes, I looked there.
I saw this piece of code. UpdatedGoMove.length = 4 if the previous were 3. The add the 1 would be equal to 4.
However, removal of goHistory that ould bumped up the goHistory, would be th eissue I think.

Spotted this in the addMoveToGoGame:
` setCurrentMove(updatedMoves.length);`

I will write a hypothesis.

## Hypothesis

- The reason why this issue occured is due to updatedMoves.length not beign tailored to an array length.
- Previously this code was fine because when you had a blank GoGame, the goHistory was bumped by 1 (the initial version).
- There when you had a bumped currentMove of 4 - playUpTo would be sent 3. That is the fourth value of the array, so would cause trouble (as currentMove is 4 --> fourth move is on the board), but with an array of 5 [blanl, goBoard * 4], the 3 idnex item is acutally the 3rd move, even though it is the foruth item of the array.
- However, with that gone, it the currentMove is 4, playUpTo take 3 --> the 3 indexed item in the goHistory array is the fourth move (with currentMove beign 4 --> current baord state is fourth move in the game), showing that nothign has happened.

If I am right, then if I have -1 to the updatedMoves.length, this will fix the issue and return a 14 x1 in the cypress tests. If I am wrong, something else will go wrong.

## Test

- is issue fixed when reproduce by steps above: FAIL.

Explore in more depth.

## Reproduce - fix now does not work

Same reproduce

- Delete any stored games, refresh the page.
- Try to click on the blank 9 x 9 go board, on all 4 corners.
- Once you get to the second white stone, the error occurs.

- Confirm reproduction: Yes.

## Gather

Error:

```
MoveTable.tsx:93

       Uncaught TypeError: Cannot read properties of undefined (reading 'push')
    at MoveTable.tsx:93:1
    at Array.forEach (<anonymous>)
    at createMovePairs (MoveTable.tsx:77:1)
    at MoveTable (MoveTable.tsx:127:1)
    at renderWithHooks (react-dom.development.js:14985:1)
    at mountIndeterminateComponent (react-dom.development.js:17811:1)
    at beginWork (react-dom.development.js:19049:1)
    at HTMLUnknownElement.callCallback (react-dom.development.js:3945:1)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:3994:1)
    at invokeGuardedCallback (react-dom.development.js:4056:1)
(anonymous) @ MoveTable.tsx:93
createMovePairs @ MoveTable.tsx:77
MoveTable @ MoveTable.tsx:127
renderWithHooks @ react-dom.development.js:14985
mountIndeterminateComponent @ react-dom.development.js:17811
beginWork @ react-dom.development.js:19049
callCallback @ react-dom.development.js:3945
invokeGuardedCallbackDev @ react-dom.development.js:3994
invokeGuardedCallback @ react-dom.development.js:4056
beginWork$1 @ react-dom.development.js:23964
performUnitOfWork @ react-dom.development.js:22776
workLoopSync @ react-dom.development.js:22707
renderRootSync @ react-dom.development.js:22670
performSyncWorkOnRoot @ react-dom.development.js:22293
(anonymous) @ react-dom.development.js:11327
unstable_runWithPriority @ scheduler.development.js:468
runWithPriority$1 @ react-dom.development.js:11276
flushSyncCallbackQueueImpl @ react-dom.development.js:11322
flushSyncCallbackQueue @ react-dom.development.js:11309
discreteUpdates$1 @ react-dom.development.js:22420
discreteUpdates @ react-dom.development.js:3756
dispatchDiscreteEvent @ react-dom.development.js:5889
react_devtools_backend.js:3973

       The above error occurred in the <MoveTable> component:

    at MoveTable (http://localhost:3000/static/js/bundle.js:651:5)
    at MoveTable
    at div
    at http://localhost:3000/static/js/bundle.js:37609:66
    at http://localhost:3000/static/js/bundle.js:13308:94
    at div
    at http://localhost:3000/static/js/bundle.js:37609:66
    at http://localhost:3000/static/js/bundle.js:13482:20
    at div
    at http://localhost:3000/static/js/bundle.js:37609:66
    at http://localhost:3000/static/js/bundle.js:13436:20
    at EnvironmentProvider (http://localhost:3000/static/js/bundle.js:20259:24)
    at ColorModeProvider (http://localhost:3000/static/js/bundle.js:8512:21)
    at ThemeProvider (http://localhost:3000/static/js/bundle.js:37649:64)
    at ThemeProvider (http://localhost:3000/static/js/bundle.js:25643:27)
    at http://localhost:3000/static/js/bundle.js:10782:23
    at ChakraProvider (http://localhost:3000/static/js/bundle.js:19557:24)
    at IndexPage (http://localhost:3000/static/js/bundle.js:1428:80)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
overrideMethod @ react_devtools_backend.js:3973
logCapturedError @ react-dom.development.js:20085
update.callback @ react-dom.development.js:20118
callCallback @ react-dom.development.js:12318
commitUpdateQueue @ react-dom.development.js:12339
commitLifeCycles @ react-dom.development.js:20736
commitLayoutEffects @ react-dom.development.js:23426
callCallback @ react-dom.development.js:3945
invokeGuardedCallbackDev @ react-dom.development.js:3994
invokeGuardedCallback @ react-dom.development.js:4056
commitRootImpl @ react-dom.development.js:23151
unstable_runWithPriority @ scheduler.development.js:468
runWithPriority$1 @ react-dom.development.js:11276
commitRoot @ react-dom.development.js:22990
performSyncWorkOnRoot @ react-dom.development.js:22329
(anonymous) @ react-dom.development.js:11327
unstable_runWithPriority @ scheduler.development.js:468
runWithPriority$1 @ react-dom.development.js:11276
flushSyncCallbackQueueImpl @ react-dom.development.js:11322
flushSyncCallbackQueue @ react-dom.development.js:11309
discreteUpdates$1 @ react-dom.development.js:22420
discreteUpdates @ react-dom.development.js:3756
dispatchDiscreteEvent @ react-dom.development.js:5889
MoveTable.tsx:93

       Uncaught TypeError: Cannot read properties of undefined (reading 'push')
    at MoveTable.tsx:93:1
    at Array.forEach (<anonymous>)
    at createMovePairs (MoveTable.tsx:77:1)
    at MoveTable (MoveTable.tsx:127:1)
    at renderWithHooks (react-dom.development.js:14985:1)
    at mountIndeterminateComponent (react-dom.development.js:17811:1)
    at beginWork (react-dom.development.js:19049:1)
    at HTMLUnknownElement.callCallback (react-dom.development.js:3945:1)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:3994:1)
    at invokeGuardedCallback (react-dom.development.js:4056:1)
(anonymous) @ MoveTable.tsx:93
createMovePairs @ MoveTable.tsx:77
MoveTable @ MoveTable.tsx:127
renderWithHooks @ react-dom.development.js:14985
mountIndeterminateComponent @ react-dom.development.js:17811
beginWork @ react-dom.development.js:19049
callCallback @ react-dom.development.js:3945
invokeGuardedCallbackDev @ react-dom.development.js:3994
invokeGuardedCallback @ react-dom.development.js:4056
beginWork$1 @ react-dom.development.js:23964
performUnitOfWork @ react-dom.development.js:22776
workLoopSync @ react-dom.development.js:22707
renderRootSync @ react-dom.development.js:22670
performSyncWorkOnRoot @ react-dom.development.js:22293
(anonymous) @ react-dom.development.js:11327
unstable_runWithPriority @ scheduler.development.js:468
runWithPriority$1 @ react-dom.development.js:11276
flushSyncCallbackQueueImpl @ react-dom.development.js:11322
flushSyncCallbackQueue @ react-dom.development.js:11309
discreteUpdates$1 @ react-dom.development.js:22420
discreteUpdates @ react-dom.development.js:3756
dispatchDiscreteEvent @ react-dom.development.js:5889
```

I can presume this issue is here from the error:
MoveTable.tsx:93

       Uncaught TypeError: Cannot read properties of undefined (reading 'push')
    at MoveTable.tsx:93:1
    at Array.forEach (<anonymous>)
    at createMovePairs (MoveTable.tsx:77:1)
    at MoveTable (MoveTable.tsx:127:1)

I should read the code from there and try to figure out what more information I need to fix the problem.

Issue was triggered from this function

```javascript=
const separatedGoMoves: TableMove[][] = [];

    goMoves.forEach(([stoneColor, coordinates], index) => {
      const DECREMENT_TO_GET_MOVE_INTO_PAIR = 1;
      const MOVE_NUMBER_ADJUSTMENT = 1;
      const LATEST_MOVE_PAIR =
        separatedGoMoves.length - DECREMENT_TO_GET_MOVE_INTO_PAIR;

      const tableCoordinates: TableMove = {
        number: index + MOVE_NUMBER_ADJUSTMENT,
        coordinates: coordinates !== PASS ? coordinates : "Pass",
      };

      if (stoneColor === "B") {
        separatedGoMoves.push([tableCoordinates]);
      }

      if (stoneColor === "W") {
        separatedGoMoves[LATEST_MOVE_PAIR].push(tableCoordinates);
      }
    });
```

This occured because we change the addMoveToGoGame function. This changed the currentMove, so I should look at how that coudl effect the control. I should look at the function wider before deciding how I want to tackle the issue.

I should commit my work before conitnuing.
