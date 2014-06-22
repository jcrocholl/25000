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

extrusion = 15

motor_screw_grid = 31
motor_cutout_diameter = 22
motor_width = 42.2
motor_offset = 35  # Motor face to extrusion.
motor_side, motor_bend = rotate(0, motor_offset + extrusion, 30)
motor_side += extrusion/2
motor_side += extrusion/cos(pi/6)
mc = motor_cutout_diameter/2 + drill
#nema23 = 47.14  # Mounting screws center-to-center
clover = 6

thickness = 0.0478 * 25.4  # 18 gauge steel.

print >> sys.stderr, 'thickness', thickness
print >> sys.stderr, 'motor_bend', motor_bend
print >> sys.stderr, 'motor_side', motor_side
print >> sys.stderr, 'mc', mc
print >> sys.stderr, 'extrusion-to-extrusion', frame_width
print >> sys.stderr, 'edge-to-edge', frame_width + 2*extrusion

xa = motor_side - drill # Outside wings start
xb = motor_side + motor_bend + drill
xs1 = xa + extrusion/2  # Extrusion screws
xs2 = xb - extrusion/2
# xe = frame_width/2  # Extrusion corner
xt = motor_width/2
xms = motor_screw_grid/sqrt(2)
xgs = 19

ya = frame_height/2 + drill  # Top without flange
yb = frame_height/2 + drill - extrusion
ys = frame_height/2 - extrusion/2  # Extrusion screws
yt = motor_width/2
yt2 = yt + 4
yms = xms
ygs = xgs

s2 = sqrt(2)

print 'G17 ; Select XY plane for arcs'
print 'G90 ; Absolute coordinates'
move('G92', x=0, y=0, z=0)
linear(x=0, y=0, z=0)

print '; Gasket screw holes'
for x in (-xgs, xgs):
    for y in (-x, x):
        jump(x=x, y=y)
        # clockwise(i=1)

print '; Horizontal extrusion screw holes'
for x in (xs1, xs2):
    jump(x=x, y=ys)
for x in (xs2, xs1, -xs1, -xs2):
    jump(x=x, y=-ys)
for x in (-xs2, -xs1):
    jump(x=x, y=ys)

#print '; 22mm dia cutout for reference'
#jump(x=0, y=11)
#clockwise(j=-11)

#print '; NEMA17 square for reference'
#jump(x=0, y=yt*s2)
#linear(x=xt*s2, y=0)
#linear(x=0, y=-yt*s2)
#linear(x=-xt*s2, y=0)
#linear(x=0, y=yt*s2)

print '; Motor cutout clover leaf'
jump(x=-clover+1, y=yms-clover-1)
linear(x=-clover, y=yms-clover)
clockwise(x=clover, i=clover, j=clover)
#clockwise(x=xms-clover, y=clover, r=mc)
linear(x=xms-clover, y=clover, r=mc)
clockwise(y=-clover, i=clover, j=-clover)
#clockwise(x=clover, y=-yms+clover, r=mc)
linear(x=clover, y=-yms+clover, r=mc)
clockwise(x=-clover, i=-clover, j=-clover)
#clockwise(x=-xms+clover, y=-clover, r=mc)
linear(x=-xms+clover, y=-clover, r=mc)
clockwise(y=clover, i=-clover, j=clover)
#clockwise(x=-clover, y=yms-clover, r=mc)
linear(x=-clover, y=yms-clover, r=mc)
linear(x=-clover+1, y=yms-clover+1)

print '; Right wing (outside horizontal extrusions)'
jump(x=xa, y=yb)
clockwise(x=xa+extrusion, y=ya, i=extrusion)
linear(x=xb)
linear(y=-ya)
linear(x=xa+extrusion)
clockwise(x=xa, y=-yb, j=extrusion)

print '; Extrusion pass-through and motor mounting plate'
linear(x=xa-20)
clockwise(x=-xa+20, i=-xa+20, j=yb)
linear(x=-xa, y=-yb)

print '; Left wing (outside horizontal extrusions)'
clockwise(x=-xa-extrusion, y=-ya, i=-extrusion)
linear(x=-xb)
linear(y=ya)
linear(x=-xa-extrusion)
clockwise(x=-xa, y=yb, j=-extrusion)

print '; Extrusion pass-through and motor mounting plate'
linear(x=-xa+20)
clockwise(x=xa-20, i=xa-20, j=-yb)
linear(x=xa, y=yb)
