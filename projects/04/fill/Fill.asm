// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

(MAIN_LOOP)
  @KBD
  D=M
  @WHITE
  D;JEQ
  @BLACK
  0;JMP

(PAINT)
  @8192
  D=A
  @i
  M=D
(PAINT_LOOP)
  @SCREEN
  D=A
  @i
  D=D+M
  @pointer
  M=D
  @color
  D=M
  @pointer
  A=M
  M=D
  @i
  M=M-1
  D=M
  D=D+1
  @MAIN_LOOP
  D;JEQ
  @PAINT_LOOP
  0;JMP

(BLACK)
  @color
  M=-1
  @PAINT
  0;JMP

(WHITE)
  @color
  M=0
  @PAINT
  0;JMP

