function getParameterDefinitions() {
   return [
      {name: 'frame_width', initial: 360, type: 'float', caption: 'Frame width:', size: 5},
      {name: 'frame_height', initial: 80, type: 'float', caption: 'Frame height:', size: 5},
      {name: 'extrusion_width', initial: 40, type: 'float', caption: 'Extrusion width:', size: 5},
      {name: 'extrusion_thickness', initial: 20, type: 'float', caption: 'Extrusion thickness:', size: 5},
      {name: 'extrusion_screw_diameter', initial: 5, type: 'float', caption: 'Extrusion screw size:', size: 5},
      {name: 'motor_screw_diameter', initial: 3, type: 'float', caption: 'Motor screw size:', size: 5},
      {name: 'motor_screw_grid', initial: 31, type: 'float', caption: 'Motor screw grid:', size: 5},
      {name: 'motor_cutout_diameter', initial: 22, type: 'float', caption: 'Motor cutout dia:', size: 5},
      {name: 'motor_width', initial: 42.2, type: 'float', caption: 'Motor width:', size: 5},
      {name: 'roundness', initial: 10, type: 'float', caption: 'Roundness radius:', size: 5},
      {name: 'resolution', initial: 12, type: 'float', caption: 'Resolution:', size: 5}
   ];
}

function flaps(params) {
  return CAG.roundedRectangle({
      center: [0, -params.frame_height/2],
      radius: [params.frame_width/2 - 2*params.extrusion_thickness,
               params.frame_height + params.extrusion_thickness],
      roundradius: params.roundness, resolution: params.resolution});
}

function side(params) {
  var result = CAG.roundedRectangle({
      radius: [params.frame_width/2, params.frame_height/2],
      roundradius: params.roundness, resolution: params.resolution});
  var offset_x = params.frame_width - params.extrusion_thickness;
  var offset_y = params.frame_height - params.extrusion_thickness;
  for (var x = -offset_x / 2; x < offset_x; x = x + offset_x) {
    for (var y = -offset_y / 2; y < offset_y; y = y + offset_y) {
      result = result.subtract(CAG.circle({
          center: [x, y], radius: params.extrusion_screw_diameter/2,
          resolution: params.resolution}));
    }
  }
  return result;
}

function inside(params) {
  return CAG.circle({radius:80, resolution:3})
    .expand(4*params.roundness, 4*params.resolution)
    .rotateZ(30);
}

function motorcut(params) {
  return CAG.rectangle({
      center: [0, -params.motor_width/2 + 3],
      radius: [params.motor_width/2 + 3, params.motor_width + 3]});
}

function motortab(params) {
  var result = CAG.roundedRectangle({
      center: [0, params.motor_width],
      radius: [params.motor_width/2, params.motor_width],
      roundradius: 5, resolution: params.resolution})
  .subtract(CAG.circle({radius:11, resolution:60}));
  var offset = params.motor_screw_grid;
  for (var x = -offset / 2; x < offset; x = x + offset) {
    for (var y = -offset / 2; y < offset; y = y + offset) {
      result = result.subtract(CAG.circle({
          center: [x, y], radius: params.motor_screw_diameter/2,
          resolution: params.resolution}));
    }
  }
  return result;
}

function main(params) {
  var a;
  var side_offset = params.frame_width * 0.44;
  var motor_offset = params.frame_width * 0.52;
  var triangle = CAG.circle({radius: params.frame_width/3, resolution: 3}).rotateZ(30);
  for (a = 0; a < 360; a = a + 120) {
    triangle = triangle.union(flaps(params).translate([0, side_offset]).rotateZ(a));
  }
  for (a = 0; a < 360; a = a + 120) {
    triangle = triangle.subtract(motorcut(params).translate([0, -motor_offset]).rotateZ(a));
    triangle = triangle.union(motortab(params).translate([0, -motor_offset]).rotateZ(a));
  }
  for (a = 0; a < 360; a = a + 120) {
    triangle = triangle.union(side(params).translate([0, side_offset]).rotateZ(a));
  }
  triangle = triangle.subtract(inside(params));
  return triangle;
}
