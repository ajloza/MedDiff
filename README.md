# MedDiff

A tool for comparing medication lists. A working web version can be found here.

https://ajloza.github.io/MedDiff/Index.html

## How to use:

1. copy a reference list into the reference text box
2. copy or type the main list into the main text box
3. Click the compare button
4. hover over red text in the "Modified" section to view text that was removed (if this occured)


## List format

The tool parses lists in the following format. More formats will be added as needed.

```
Header will be ignored if followed by line of equal signs
=========================================================
1) first med
2) second med
3) the number-parenthesis format is required

```

## How comparisons are made

1. Matching is attempted for each medication one word at a time
2. the first best match from the reference list perspective is used as a match
3. Medications that match perfectly are listed as "Matched"
4. Medications that partially match are listed as "Modified"
   1. green text shows what is added from the main list perspective
   2. a red "x" is a placeholder for deleted text, hovering shows what's deleted
5. Reference meds that do not match are considered "Removed"
6. Main medications that do not match are considered "Added"


## Todo:

- [ ] change color highlighting red+green = yellow and collapse red
- [ ] develop synonymns for route, frequency, units
- [ ] export list in nice format to clipboard