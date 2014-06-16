G17 ; Select XY plane for arcs
G90 ; Absolute coordinates
; Start at bottom left corner
G92 X-141.6 Y-51.6 Z0
G1 X-132.5 Y-51.6
; Left wing (for vertical extrusion)
G2 R9.1 X-141.6 Y-42.5
G1 Y42.5
G2 R9.1 X-132.5 Y51.6
; Flange
G1 X-132.5 Y51.6
G1 X-126.6
G1 Y71.6
G1 X126.6
G1 Y51.6
G1 X132.5
; Right wing (for vertical extrusion)
G2 R9.1 X141.6 Y42.5
G1 Y-42.5
G2 R9.1 X132.5 Y-51.6
G1 X-141.6
G1 Z20
G1 X-132 Y-43
G1 Z0
G1 Z20
G1 X-132 Y43
G1 Z0
G1 Z20
G1 X132 Y43
G1 Z0
G1 Z20
G1 X132 Y-43
G1 Z0
G1 Z20
