// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Set @i to the value to R0
  @R0
  D=M
  @i
  M=D

// Set @sum to 0
  @sum
  M=0

// Loop to multiply
(LOOP)
  @i
  D=M
  @SET_OUTPUT
  D;JEQ
  D=D-1
  @i
  M=D
  @R1
  D=M
  @sum
  M=D+M
  @LOOP
  0;JMP

(SET_OUTPUT)
  @sum
  D=M
  @R2
  M=D
  @END
  0;JMP

// End Loop
(END)
  @END
  0;JMP

