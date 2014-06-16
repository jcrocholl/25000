#!/usr/bin/env python

from math import *
import sys

def rotate(x, y, degrees):
    c = cos(pi * degrees / 180.0)
    s = sin(pi * degrees / 180.0)
    return x * c + y * s, y * c - x * s

def width():
    # Extrusion vertical edge near metal bend.
    x1 = extrusion_width / 2
    y1 = frame_radius
    # Same point on other end of panel.
    x2, y2 = rotate(-x1, y1, 120)
    # Width of the straight section, between extrusion bends.
    return sqrt((x2-x1)**2 + (y2-y1)**2)

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


frame_radius = 150
frame_height = 100
frame_width = 250  # Extrusion to extrusion.
flange = 20
drill = 1.6  # 1/16 inch radius.

extrusion_width = 15
extrusion_thickness = 15

motor_screw_grid = 31
motor_cutout_diameter = 22
motor_width = 42.2
motor_offset = 50  # Motor face to extrusion.

thickness = 2  # Thickness of sheet metal.
roundness = 7.5


print >> sys.stderr, 'extrusion-to-extrusion', frame_width
print >> sys.stderr, 'edge-to-edge', frame_width + 2*extrusion_thickness

xa = frame_width/2 + extrusion_thickness + drill  # Outside
xb = frame_width/2 + extrusion_thickness - roundness
xc = frame_width/2 + extrusion_thickness/2  # Extrusion screws
xf = frame_width/2 + drill  # Around flange

yf = frame_height/2 + flange + drill  # Top with flange
ya = frame_height/2 + drill  # Top without flange
yb = frame_height/2 - roundness
yc = frame_height/2 - extrusion_thickness/2  # Extrusion screws

r = roundness + drill

print 'G17 ; Select XY plane for arcs'
print 'G90 ; Absolute coordinates'
print '; Start at bottom left corner'
move('G92', x=-xa, y=-ya, z=0)
linear(x=-xb, y=-ya)

print '; Left wing (for vertical extrusion)'
clockwise(x=-xa, y=-yb, r=r)
linear(y=yb)
clockwise(x=-xb, y=ya, r=r)

print '; Flange'
linear(x=-xb, y=ya)
linear(x=-xf)
linear(y=yf)
linear(x=xf)
linear(y=ya)
linear(x=xb)

print '; Right wing (for vertical extrusion)'
clockwise(x=xa, y=yb, r=r)
linear(y=-yb)
clockwise(x=xb, y=-ya, r=r)
linear(x=-xa)

# Extrusion holes.
for x, y in ((-1, -1), (-1, 1), (1, 1), (1, -1)):
    up()
    linear(x=x*xc, y=y*yc)
    down()

up()
