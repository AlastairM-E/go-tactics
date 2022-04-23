# Defect

- Pass test has reduced from 14/15 to 10/15.
- (uncaught exception) TypeError: Cannot read properties of undefined (reading 'getCaptures').
- Timed out retrying after 4000ms: Expected to find element: [data-testid="fileUploader"], but never found it.
- [data-testClassName="19x19Games"] : expected undefined to have a length of 2 but got 0.

## Reproduce

- Check that the issue is caused from the refactor I did regarding the goBoardReducer.ts.
  - I can confirm that issue is caused by the refactor.

### (uncaught exception) TypeError: Cannot read properties of undefined (reading 'getCaptures').

- 13x13 fixtures, when uploaded, that setup did not work.
- See to reproduce on main site. Be precise with the exact 13x13 baord in the fixtures tab.
- COnfirm it works or not: DOes not seem to , though I need to repleicate the environment better, since it is a consistent problem.

This one error caused the other to be unaccessible, since screen went blank.
I should fix the key props error though in GameFIleExplorer before continuing, as it may fix the error and should be fixed anyway.

Key addition effected nothing.

However, I can know confirm the steps to reproduce:

- clear all data from the app (go Game files).
- first add a 9x9 go game file to the app.
- press the last item on the move table.
- second, add a 13x13 go game file to the app.

The result should be the can't getCaptures error to be undefined.

**Error has been reproduced.**

### Gather

Reproduce again and analyse the error and where it comes from.

- Aim is understand what causes the error and so I can start to debug that.

Analysis controls are the first layer.
The effected code is:

```
  const captures = {
    blackStones: goHistory[currentMove].getCaptures(BLACK_STONE), // error occurs on this line
    whiteStones: goHistory[currentMove].getCaptures(WHITE_STONE),
  };
```

I need to breakpoint that piece of code to understand what each value is pointing to.

- If I know that, then I can start to think about what the problem might be.

Record 9x9 currentMove, goHistory and captures for black and white stones.
Record 13x13 currentMove, goHistory and captures for black and white stones.

#### 9x9

- currentMove: 0.
- goHistory: [(9x9-board)].
- Black stone captures: unknown.
- White stone captures: unknown.

#### 13x13

- currentMove: 0.
- goHistory: [(9x9-board)].
- Black stone captures: unknown.
- White stone captures: unknown.

- currentMove: 0.
- goHistory: [(13x13-board)].
- Black stone captures: unknown.
- White stone captures: unknown.

In this case, it did work, what was that all about.
If I can't get the output in that context, I will use console.log logs with a counter.

This way I can know how many times the re-render occurred and what point the original error occured.
I am choosign this over the debug, due to the re-renders. It should give me a snapshot of what is happening.
Therefore, giving me the necessary data to work out the problem.

#### Reproduction steps

- clear all data from the app (go Game files).
- first add a 9x9 go game file to the app.
- press the last item on the move table.
- second, add a 13x13 go game file to the app.

#### 9x9

- currentMove: 0.
- goHistory: [(9x9-board)].
- Black stone captures: 0.
- White stone captures: 0.

#### 9x9 after click on 42 last move

- currentMove: 41.
- goHistory: [(9x9-board) * 42] .
- Black stone captures: 2.
- White stone captures: 0.

#### 13x13

- currentMove: 41.
- goHistory: [(13x13-board)].
- Black stone captures: error.
- White stone captures: .

I know what the shallow cause is:

- The goHistory has been updated to the 13x13 board, but currentMove has not updated from it's previous currentMove of 41.
- This causes a discreptency between the 2, which leads to an length goHistory array being asked for the 41 item in the index.
- That returneds udenfined, which means non of the original method around getCaptures works anymore.

What is the root cause though?

I know that the change in values was caused by the refactor the recent reducer.

- Should console.log the values returned from that reducer.
- I should do this since that change led to the test failing.
- Therefore, I should check how the setup board is working and to gather more info.

Logs from setupBoard refeactor (return from the reducer function --> calling 'SETUP_BOARD' action).

- nextCurrentMove: 0
- nextGoBoard: GoBoard {signMap: Array(13), height: 13, width: 13, \_players: Array(2), \_captures: Array(2), …}
- nextGoGameToSetup: {id: '0I_get_a_bit_bored-vs.-MalmöBudapest', gameName: 'I_get_a_bit_bored vs. MalmöBudapest', initialStones: Array(0), moves: Array(111), rules: 'Japanese', …}
- nextGoHistory: [GoBoard {signMap: Array(13), height: 13, width: 13, _players: Array(2), _captur...}]
- nextUserPlayer: -1

SInce nextCurrentMove and nextGoHistory are the values they should be:

_I think the issue might be due to the ordering of the setStates_

In the previous setup board function, the order of setState was like so:

```
  setGoGame(nextGoGame);
  setCurrentMove(FIRST_MOVE);
  setGoBoard(newGoBoard);
  setGoHistory([newGoBoard]);
```

However, in the current set of setStates, it is like this:

```
  setGoGame(nextGoGameToSetup);
  setGoBoard(nextGoBoard);
  setGoHistory(nextGoHistory);
  setCurrentMove(nextCurrentMove);
  setUserPlayer(nextUserPlayer);
```

I think since there is a discrepency between the currentMove being the past goHistory value (not being updated)
and the goHistory beign update to date. It could be the nextGoHistory is updated, and ran in the AnalysisControls
with the not update to date currentMove, leading to this issue.

However, there are multiple re-renders of the Analysis Controls and currently I don't know of those updates are.
Therefore, I need to gather that information before jumping ot any conclusions.

I noted down the above so I did not forget it, but it could be incorrect if the order of the state has the currentMove state
rendered before the rest (for example). This will be done by putting console.log above each setState in setupBoard function.
This means I can identifiy which part of state re-renders each log in AnalysisControls refers to.

Note order of state, from AnalysisControls state logs, finding the ordering of the state rendering:

- SetState 0 {nextGoGameToSetup: {…}}
  - AnalysisControls.tsx:38 17 {currentMove: 41, goHistory: Array(42), currrentBoard: GoBoard}
  - AnalysisControls.tsx:38 19 {currentMove: 41, goHistory: Array(42), currrentBoard: GoBoard}
- index.tsx:112 SetState 1 {nextGoBoard: GoBoard}
  - AnalysisControls.tsx:38 21 {currentMove: 41, goHistory: Array(42), currrentBoard: GoBoard}
- index.tsx:114 SetState 2 {nextGoHistory: Array(1)}
  - AnalysisControls.tsx:38 23 {currentMove: 41, goHistory: Array(1), currrentBoard: undefined}
  - AnalysisControls.tsx:38 24 {currentMove: 41, goHistory: Array(1), currrentBoard: undefined}

Look into how the the re-render could occur in the AnalysisControls. Checking to see if props are 2 renders and no props are 1.

- goGame (props inisde AnalaysisControls) - 2 renders.
- goBoard (no props inside Analysis Controls) - 1 render.
- goHistory (props inside AnalysisControls) - 2 renders.

### Hypothesis

I hypothesis that because of the ordering of setState, goHistory cleared, but th ecurrentMove is not. THis would mean that if the current move is higher than zero, then a bug would occur, sinc eyou are calling an item which does not exist on an array, returning undefined, which would cause an error when trying call a method from undefined.

If I am right, then rejigging ht eorder so that currentMove was second to the top should fix the error and cause all the test to pass (simialr orderign to previous setupBoard). If I am wrong, then the test will continue to fail.

#### Test

- Confirm current test passing ration: 5X 10\_/.
- After change: 1X 14\_/ - ok, as I know what that one X is.

- Reproduce defect - does pass or fail: PASS.
