G17 ; Select XY plane for arcs
G90 ; Absolute coordinates
G92 X0 Y0 Z0
G1 X0 Y0 Z0
; Gasket screw holes
G1 Z20
G1 X-31.1 Y0
G1 Z0
G1 Z20
G1 X31.1 Y0
G1 Z0
G1 Z20
G1 X0 Y-31.1
G1 Z0
G1 Z20
G1 X0 Y31.1
G1 Z0
; Motor cutout clover leaf
G1 Z20
G1 X5 Y14
G1 Z0
G1 Y15
G2 I10 X15 Y5
G1 Y-5
G2 J-10 X5 Y-15
G1 X-5
G2 I-10 X-15 Y-5
G1 Y5
G2 J10 X-5 Y15
G1 X6 Y15
