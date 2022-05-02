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
const createMovePairs = () => {
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
      const movePairs = separatedGoMoves.map(([blackMove, whiteMove]) => {
      const blankMove = { number: undefined, coordinates: "---" };
      if (blackMove === undefined) {
        return [blankMove, whiteMove];
      }

      if (whiteMove === undefined) {
        return [blackMove, blankMove];
      }

      return [blackMove, whiteMove];
    });

    return movePairs;
  };
```

This occured because we change the addMoveToGoGame function. This changed the currentMove, so I should look at how that coudl effect the control. I should look at the function wider before deciding how I want to tackle the issue.

I should commit my work before conitnuing. Nothign screams out to me, so I will breakpoint to understand precisely everything that is going on in the createMovePairs function. I will do this via breakpoints

State to track inside the createMovePairs function:

On black's move (ran twice - seems ok):

- separatedGoMoves: [].
- GoMoves: ['B', 'A9'].
- stoneColor: 'B'.
- LATEST_MOVE_PAIR: -1.
- tableCoordinates: { coordinates: "A9", number: 1}.

On White's move (ran twice - seems ok):

- separatedGoMoves: [].
- GoMoves: ['W', 'A1'].
- LATEST_MOVE_PAIR: -1.
- stoneColor: 'W'.
- tableCoordinates: { coordinates: "A1", number: 1 }.

separatedGoMoves[LATEST_MOVE_PAIR] --> [][-1] --> undefined.
.push property does not exist, can't be read from udnefined, error is caused.

Look at the goMoves, that is where the probelms to seems to arraise --> there should an array of [blackMove, whiteMove].
not [whiteMove].

goMoves = goGame.moves.
The issue must be from the goGame mvoes beign handled incorrectly. In addition, it is very likely the issue has to do with the currentMove, since once that changed, this error occured.

From dedication, should be from addGoMoveToGame function:

```javascript=
  const addMoveToGoGame = (nextGoMove: GoMove, nextBoardPosition: Board) => {
    const ARRAY_ADJUST = 1;
    const byOnlyPastMoves = (move: GoMove, index: number) => {
      return index < currentMove;
    };
    const byUpToCurrentBoardPosition = (board: Board, index: number) => {
      return index <= currentMove;
    };

    const pastGoMoves = goGame.moves.filter(byOnlyPastMoves);
    const updatedMoves = [...pastGoMoves, nextGoMove];
    const updatedGoGame = { ...goGame, moves: updatedMoves };

    const pastGoHistory = goHistory.filter(byUpToCurrentBoardPosition);
    const updatedGoHistory = [...pastGoHistory, nextBoardPosition];

    setGoGame(updatedGoGame);
    setGoHistory(updatedGoHistory);
    setCurrentMove(updatedMoves.length - ARRAY_ADJUST);

    return updatedGoGame;
  };
```

This function is called twice sicne 2 moves are added. Since updatedMoves is has been made to be 1 less, I think I have found the issue. Hypothesis to do. I think in byOnlyPastMoves.

## Hypothesis - byOnlyPastMoves

byOnlyPastMoves --> the issue occurs because it create a length zero array for updatedMoves on the secodn time round, which filters all moves out, so when the nextMove is added --> an array of 1 and thus you get only 1 white move, leading to the error. To clarify I will sue a trace for the first and second to maek changes clear.

Trace - 1st move added: ['B', 'A9']

- goGame.moves: [].
- currentMove: 0.
- byOnlyPastMoves = [].filter => [].

updatedMoves = [ ...[], ['B', 'A9']] -> [['B', 'A9']].
goGame.moves = updatedMoves ( -> [['B', 'A9']] ).
currentMove = updatedMoves.length - 1 --> 1 - 1 --> 0.

Trace - 2nd move added: ['W', 'A1']

- goGame.moves: [['B', 'A9']].
- currentMove: 0.
- byOnlyPastMoves = [['B', 'A9']].filter => index < currentMove.
  --> .filter((move, index) => index (0) < currentMove (0)) -->
  0 < 0 --> false

since only 1 cycle:

- pastGoMoves = goGame.moves.filter(byOnlyPastMoves) = [].

updatedMoves = [ pastGoMoves --> ...[], ['W', 'A1']] -> [['W', 'A1']].
goGame.moves = updatedMoves ( -> [['W', 'A1']] ).
currentMove = updatedMoves.length - 1 --> 1 - 1 --> 0.

- goGame.moves = [['W', 'A1']].

Thus this lead to the situation where createMovePairs has only 1 item inside the goMoves (['W', 'A1'] from [['W', 'A1']]). This lead to createMovePairs trying to push a whiteMOve into an array inside the separatedGoMoves which is at index -1 from the LATEST_MOVE_PAIR, since it starts at -1 for the first move before moving to zero for the second move. SInce the moves are added in pairs, the lATEST_MOVE_PAIR is always up to date.

Change byOnlyPastMoves from '<' to '<=' could work since it would include the zero index this time and so come second running, it will added the correct number of mvoes in the pastGoMoves array (up to the currentMove, which is good). This means that the updateGoMoves could be the correct length (2 mvoes, one black, one whtie). Once that is done, that should mean that createMovePairs will work accordiningly since, there are a balck and white move pair, in the ocrrect order, which should remove the error.

If I am right,

- it will remove the error when reproduce occurs, it will behave correctly and pass the other error up top.
- It will also pass the cypress test 14 x1, plus Jest tests.

If I am wrong that will not happen or an occur will in some form.

### Test

- Is issue fixed when reproduced: Yes.
- Is other issue fixed: no, it went weird.

## Defect - table & moves are incorrect on board

When a player plays 3 moves --> the third move is not displayed. In addition, the 4th move is in the spot of the 3rd move.

Also, you run 1 black, 1 white, 1 white, 1 black, which is weird.

## Reproduce

- Delete all past go board. Refresh the page.
- Play 3 moves on the default baord - the third move is white when it should be black.
- In addition, there is no third move on the move table.
- If you make a fourht move, it is black when it should be white & it is on the third move when it should be the fourth move.

- Confirm reproduction: Yes.

## Gather - table & moves incorrect on board

- No error messages, this all behaviour which is occuring because of the code written.

- First, I need to check the index.tsx and read how the code is flowing, since that is where the recent change was made. In addition, I want to read the changePlayerColor code.
- In addition, I want to look at the moveTable code once again.

- This is because the issue was msot likely caused becasue of the change in goMoves, which has lead to another issue.
- In addition, the MoveTable will provide clues on issue that originate from there.
- Therefore, I should look in bothe move table & index.tsx to find clues.

- Then I will deicde what to breakpoimt to learn more about.

- if it were 2 whtie moves in a row, the white move would be lost, sicne the array from createMovePairs only expected 2 items, so renders the tabel that way e.g. [B, W, W] --> [B, W].

- Therefore, if there were any issues, they should to do with the color of the stone.
- If that is the case, then fixing the stone color could fix the table issue.
- Since there are 2 issues, the movetable and the stone color --> I will focu son a stone color fix first, as once that is done, I can see if the MoveTable resolves itself. If not, more analysis on the MoveTable is needed.

- Next steps is to analyses the currentMove ebign setup up --> this will involve looking at the setUserPlayer as well as teh adddMoveToGoGame --> as that setups up the currentMove and gogame items, which are dependencies for the changePlayerStoneColor function. Items which I will breakpoint are:

- updatedGoGame.
- currentMove.
- userPlayer.
- nextStoneColor.

**Record information on the variables**

_1st Move_

- goMoves: [['B', 'A9']].
- currentMove: 0.
- userPlayer: 1.
- nextStoneColor: -1.

_2nd Move_

- goMoves: [['B', 'A9'], ['W', 'A1']].
- currentMove: 0.
- userPlayer: -1.
- nextStoneColor: -1.

_3rd Move_

- goMoves: [['B', 'A9'], ['W', 'A1'], ['W', 'J9']].
- currentMove: 1.
- userPlayer: -1.
- nextStoneColor: 1.

_4th Move_

- goMoves: [['B', 'A9'], ['W', 'A1'], ['W', 'J9'], ['B', 'J1']].
- currentMove: 2.
- userPlayer: 1.
- nextStoneColor: 1.

_5th Move_

- goMoves: [['B', 'A9'], ['W', 'A1'], ['W', 'J9'], ['B', 'J1'], ['B', 'E5']].
- currentMove: 3.
- userPlayer: 1.
- nextStoneColor: -1.

I think the issue is actually the array adjust --> I need to trace this out before hypothesis to confirm my understanding.

- (in app) currentMove: 0 (0) B -> 0 (1) B -> 1 (2) W -> 2 (3) W -> 3 (4) B.
- (without the -1) currentMove: 0 (0) B [] -> 1 (1) W [B] -> 2 (2) B [B, W] -> 3 (3) W [B, W, B] -> 4 (4) B [B, W, B, W].

- properly: current move start at 0 since that is what it will be using.

- 0 B [] -> 0 W [B] -> 1 W [B, W] -> 2 B [B, W, B] -> 3 W [B, W, B, W] -> 4 B [B, W, B, W, B].

The first move does nto really count, so as long as the current move starts at zero, the currentMove is correct.

The problem is not with the the currentMove but the changePlayerMOve --> the problem with it is that it default to black for the first move, which messes everything up. I cna make a hypothesis.

## Hypothesis - change userPlayer color causing problem due to disconnected currentMove & updatedGoMoves

- The problem is that updatedGoMoves is correct up to date, but currentMove lags behind. This means the wrong move is gotten when changeUserPlayer runs, thus causing black and white to be mis placed.

trace:

- Start: cm: 0, gm: [], up: B.

Ideal
(starts as B)

- 1st move: cm: 0, gm: [], up: B ~ ucm: 0, ugm: [B] --> W (B converts to W and vice versa).
- 2nd move: cm: 0, gm: [B], up: W ~ ucm: 1, ugm: [B, W] --> B
- 3rd move: cm: 1, gm: [B, W], up: B ~ ucm: 2, ugm: [B, W, B] --> W

Practice (for this goign to include only the depednecies used in the changeUserPlayer function, it takes the cm and ucm)
(starts as B)

- 1st move: cm: 0, ucm: [B], up: B --> W (correct).
- 2nd move: cm: 0, ucm: [B, W], up: W --> W (since the ucm[cm] = B and that converts to W).
- 3rd move: cm: 1, ucm: [B, W, W], up: W --> B (sicne white move is picked up, converts to B).
- 4th move: cm: 2, ucm: [B, W, W, B], up: B --> B (since ucm[cm] = W, converts to B).

etc, etc.

Therefore, if you return both the updatedCurrentMove and updatedGoMoves, and plug them, it should be like the ideal, rather than the in practice.

If I am right, then reproduce will produce no errors, Jest will pass & Cypress will go 14 X1 (on the final test).
If I am wrong, they will not/somethign else will go wrong.

## Test

- does it reproduce correctly: Yes.
- Jest test: 2 / 2 pass.
- Cypress: 14 X 1.
