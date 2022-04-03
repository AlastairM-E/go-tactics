# Defect

- When the last move is clicked for the 13x13 go game, it does not seem to go to the last move.

## Reproduce

- Test produce the error, I need to check elsewhere.
- LOok at fixtures to confirm the issue.
- The first mvoe does not render, whilst is that.
- Specifically, it is missing the first move.

## Gather

- I have spotted that whent eh first move is rendered, nothing happens unless you click the stored Game moves 2 times.
- clear all boards and start with the 13x13 one. The 9x9 board is fine for some reason. Look at the goHistory, state and co before and after the load. Record those values. THis is to determine if the issue before the GoGame table or after. Then I can try to find what is casuing the issue.

ALso look for any error in the development console. Relay them back.

```
Uncaught (in promise) TypeError: _ref is not iterable
    at turnGoMoveToBoardMove (index.tsx:97:1)
    at setupGoBoard (index.tsx:76:1)
    at clearBoard (index.tsx:92:1)
    at deleteGoGameFromDb (GameFileExplorer.tsx:102:1)
```

Before 13 x13 game is uploaded:

- goGame: newGoGame.
- goBoard: (blank 9x9 board).
- goHistory: [(blank 9x9 board)] (length of array is 1).
- currentMove: 0.

No errors.

After 13 x13 game is uploaded:

- goGame: 13x13 MalmoBudapest game..
- goBoard: (blank 13x13 board).
- goHistory: [(blank 13x13 board)] (length of array is 1).
- currentMove: 0.

Errors: React does not recognize the `data-testClassName` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `data-testclassname` instead. If you accidentally passed it from a parent component, remove it from the DOM element.

WHy is the goBOard blank?

In the setup GoBoard section, the new Board(initXYZ) is called. I want to research the new keyword, as it would point that if the goBoard is the fulty part, the problem gomes from the newGobard variable, sinc ethat create the new board. Look up the new keyword on mdn to find out more and see if there is a decent argument to be made. THink there might be something, look at the docs in sabaki go board before making a decision.

## Hypothesis

- The goBoard is returning the non makeMOve baord rather than the new one. This may be becaus eht e new keyword returns a new instance of an object (in htis case the goBoard constructor). However, the makeMove also returns a new instance.

Due to something inside the api, this means the board instance is the old one rather than the new one.
This is not strong, but it should be explored to confirm that it is incorrect. In addition, it is none breaking change (more of a refactor really), so if it is wrong, it will rule out th eissu ebeing with the newGoBoard variable regarding this situation.

If I am right, given the lack of proof and testing on MDN I have done, it will make no difference and the first move will still error.
If I am wrong, then the issue will be fixed. The issue could still be in the newGoBoard.

### Test

Run the initGOboard (from the initGoSKeletonBoard) and newGoBoard ebign the .makeMove one.
Record if it passes or not.

The test failed, I was right:

- initGoBoard: (blank 13x13 GoBoard).
- newGoBoard: (blank 13x13 GoBoard).

Errors: None.

If the initGoBoard.makeMove returns the same blank board as teh newGoBoard, that should means the moves or function which is passed into it are producing the incorrect result.

I do know that the makeMove function is causing the sympto, fault here. How it is, I don't know.

## Gather

Log what is being passed into the makeMove function and response back. If there is a clear fault, then I need to investigate that and this seems to be where the error is starting.

- initGoBoard: (blank 13x13 Board).
- newGoBoard: (blank 13x13 Board).
- firstMove: ['B', 'K4'].
- moveColor: 1 = BLACK_STONE
- moveVertex: [-1, -1] = error in translation.
- moveOptions: moveOPtions

Any errors:

```
React does not recognize the `data-testClassName` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `data-testclassname` instead. If you accidentally passed it from a parent component, remove it from the DOM element.
```

Since there is in error in the moveVertex --> this means that I need to look into the problem inside the turnGoMoveToBoardMove function.

I need to use breakpoint to understand exactly what is going on it this function. ONce I do, then I can log my findings here and if they point to an issue, I can hypothesis.

```
  const turnGoMoveToBoardMove = ([stoneColor, coordinates]: GoMove): [
    Sign,
    Vertex
  ] => {
    const moveColor = stoneColor === "B" ? BLACK_STONE : WHITE_STONE;
    const moveVertex = goBoard.parseVertex(coordinates);

    return [moveColor, moveVertex];
  };
```

Look into:

- stoneColor: "B".
- coordinates: "K4".
- moveColor: 1.
- moveVertex: [-1, -1].
- goBoard: (blank 9x9 go board).

With the goBoard being a blank 9x9 go board, I can hypothesis.

## Hypothesis - it is the goBoard parseVertex

Note: issue around past goGame moves being passed into translateGoMove?.

The goBoard (state) is beign used to parseVertexes in turnGoMoveToBoardMove. This is the current go board (not future to be setup go board). This is can be 9x9 when the setup go board in 13x13 for example. This means that when the person setup up the new board, they need to make a more. However, in 13x13 boards, the coordinate will be passed differently than in a 9x9 board, as a move in the 44 corner of a 13x13 board, may not exist on a 9x9 one, simply because it is a 9x9 baord odes not have room.

If I am right and this is th eissue, If I pass in the newGoBoard to be and have that parse the moves, then it wil parse the correct moves e.g. for a 13x13 board rather than a 9x9 board for example, and thus this will be correctly done. Repeat for all errors this is a problem.

If I am wrong, the same will remain.

### Test

- Reload app to default 9x9.
- Click 13x13 saved game.

Should see first move. Yes.

Integration suite full run: 14 pass 1 fail.
