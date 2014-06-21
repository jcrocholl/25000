#!/usr/bin/env python

from math import *
import sys

def rotate(x, y, degrees):
    c = cos(pi * degrees / 180.0)
    s = sin(pi * degrees / 180.0)
    return x * c + y * s, y * c - x * s

def move(verb, **kwargs):
    keys = kwargs.keys()
    keys.sort()
    words = [verb.upper()]
    for key in keys:
        words.append('%s%g' % (key.upper(), kwargs[key]))
    print ' '.join(words)

def linear(**kwargs): move('G1', **kwargs)
def clockwise(**kwargs): move('G2', **kwargs)

def up(): linear(z=20)
def down(): linear(z=0)

def jump(**kwargs):
    up()
    linear(**kwargs)
    down()

frame_width = 200
frame_height = 75
drill = 1.6  # 1/16 inch radius.

extrusion_width = 15
extrusion_thickness = 15

motor_screw_grid = 31
motor_cutout_diameter = 22
motor_width = 42.2
motor_offset = 30  # Motor face to extrusion.
motor_side, motor_bend = rotate(15, motor_offset, 30)
motor_side += extrusion_width/2
mc = motor_cutout_diameter/2 + drill
clover = motor_screw_grid / 3

thickness = 0.0478 * 25.4  # 18 gauge steel.
roundness = 7.5

print >> sys.stderr, 'thickness', thickness
print >> sys.stderr, 'motor_bend', motor_bend
print >> sys.stderr, 'motor_side', motor_side
print >> sys.stderr, 'mc', mc
print >> sys.stderr, 'extrusion-to-extrusion', frame_width
print >> sys.stderr, 'edge-to-edge', frame_width + 2*extrusion_thickness

xa = frame_width/2 + extrusion_thickness + drill  # Outside
xb = frame_width/2 + extrusion_thickness - roundness
# xc = frame_width/2 + extrusion_thickness/2  # Extrusion screws
# xe = frame_width/2  # Extrusion corner
# xt = frame_width/2 - motor_bend
xms = motor_screw_grid/2
xgs = motor_width/2 + 10

ya = frame_height/2 + drill  # Top without flange
yb = frame_height/2 - roundness
yc = frame_height/2 - extrusion_thickness/2  # Extrusion screws
yt = motor_width/2 + drill
yt2 = yt + 4
yms = xms
ygs = xgs

print 'G17 ; Select XY plane for arcs'
print 'G90 ; Absolute coordinates'
move('G92', x=0, y=0, z=0)
linear(x=0, y=0, z=0)

print '; Gasket screw holes'
for x in (-xgs, xgs):
    jump(x=x, y=0)
for y in (-ygs, ygs):
    jump(x=0, y=y)

print '; Motor cutout clover leaf'
jump(x=xms-clover, y=yms-1)
linear(y=yms)
clockwise(x=xms, y=yms-clover, i=clover)
linear(y=-yms+clover)
clockwise(x=xms-clover, y=-yms, j=-clover)
linear(x=-xms+clover)
clockwise(x=-xms, y=-yms+clover, i=-clover)
linear(y=yms-clover)
clockwise(x=-xms+clover, y=yms, j=clover)
linear(x=xms-clover+1, y=yms)


#print '; Left wing (for vertical extrusion)'
#jump(x=-xb, y=-ya)
#clockwise(x=-xa, y=-yb, i=0, j=r)
#linear(y=yb)
#clockwise(x=-xb, y=ya, i=r, j=0)

#print '; Right wing (for vertical extrusion)'
#clockwise(x=xa, y=yb, i=0, j=-r)
#linear(y=-yb)
#clockwise(x=xb, y=-ya, i=-r, j=0)
