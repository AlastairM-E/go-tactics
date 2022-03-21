# Defect

- When I click on any vertex the site goes blank.

## Reproduce

- Click on any vertex on the default site board.
- if you do, the page will go blank.

## Gather

- See if it works on go game boards, checks to see if the probnlem is universal.
- If not, that means it is almost definitely regarding my addGoMoveToGoGame thingy.
- Then breakpoints to confirm.

Is just when you click the go board, though sound is not coming through either.

Breakpoint to find the issue.

- Initial looks show: `AnalysisControls.tsx:32 Uncaught TypeError: Cannot read properties of undefined (reading 'getCaptures')`.
- In additions: `at IndexPage (http://localhost:3000/static/js/bundle.js:1265:80)`.
- No network issue.

Ran integration test suite as well. 4 passed, 11 failed:

- Cannot read properties of undefined (reading 'getCaptures').
- undefined is not iterable (forward button).
- undefined is not iterable (forward button).
- undefined is not iterable (tableMove).
- undefined is not iterable (tableMove).
- undefined is not iterable (tableMove).
- undefined is not iterable (tableMove).
- undefined is not iterable (tableMove).
- undefined is not iterable (forward button).
- undefined is not iterable (forward button).
- Accordian being covered up shudan.

I need to figure out what is undefined. Breakpoints on everything new, since this was not any issue last time.

goHistory needs to have the first item as well as the last -\_> it is not the current boardposition, but the next one it gets.

Exits, going inside the goGame.moves.length first --> that is zero.

- I need to fix this issue as well, by providing the updatedGoGame as well.

Updated mvoes.length = 1, yet histroy has only 1 element, indexed at zero.

Therefore, I can hypothesis the issue

## Hypothesis

SInce the udnefiend is in the captures, which uses currentMove for to get the apprioprate captures, then when the currentMOve is set to updatedMove.length which is 1, hwoever, there is a only a zero index history items, since the intial bnlank board was not added beforehand.

If I am right, then if I keep the blank board in history board, then it will have the apprioprate currentMOve for the goHIstory array to access, thus, it will all work fine.

However, if I am wrong, then the error will remain or will change in some way.

### Test

- Breakpoint, and then see what the updatedGoHistory, is, check that it has 2 values isntead of 1.

History api has 2, lets see if it fixes teh integration test suite., aiming for the undefined errors to go away.

Test still failed? Captures are not working.

I will pass in the updatedGoGame to the changeUserPlayerColor, then I will work with the rest.

13 2 from new test, issue seems fixed now, but needs more work to get game to change.
goGame is past one, not the future one, so it will always be incorrect.
