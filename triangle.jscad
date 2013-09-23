function getParameterDefinitions() {
    return [
	{name: 'frame_radius', initial: 180, type: 'float', caption: 'Center to extrusion:', size: 5},
	{name: 'frame_height', initial: 80, type: 'float', caption: 'Triangle height:', size: 5},
	{name: 'flange', initial: 20, type: 'float', caption: 'Flange:', size: 5},
	{name: 'gap', initial: 2, type: 'float', caption: 'Gap:', size: 5},
	{name: 'extrusion_width', initial: 40, type: 'float', caption: 'Extrusion width:', size: 5},
	{name: 'extrusion_thickness', initial: 20, type: 'float', caption: 'Extrusion thickness:', size: 5},
	{name: 'extrusion_screw_diameter', initial: 5, type: 'float', caption: 'Extrusion screw size:', size: 5},
	{name: 'motor_screw_diameter', initial: 3, type: 'float', caption: 'Motor screw size:', size: 5},
	{name: 'motor_screw_grid', initial: 31, type: 'float', caption: 'Motor screw grid:', size: 5},
	{name: 'motor_cutout_diameter', initial: 22, type: 'float', caption: 'Motor cutout dia:', size: 5},
	{name: 'motor_width', initial: 42.2, type: 'float', caption: 'Motor width:', size: 5},
	{name: 'motor_offset', initial: 30, type: 'float', caption: 'Motor to extrusion:', size: 5},
	{name: 'roundness', initial: 10, type: 'float', caption: 'Roundness radius:', size: 5},
	{name: 'resolution', initial: 12, type: 'float', caption: 'Resolution:', size: 5}
    ];
}

function motortab(params, offset) {
    var result = CAG.roundedRectangle({
	center: [0, params.motor_width / 2],
	radius: [params.motor_width / 2 + params.gap,
		 params.motor_width + params.gap],
	roundradius: 5 + params.gap,
	resolution: params.resolution})
    result = result.subtract(CAG.roundedRectangle({
	center: [0, params.motor_width / 2],
	radius: [params.motor_width/2,
		 params.motor_width],
	roundradius: 5,
	resolution: params.resolution}));
    result = result.union(CAG.circle({
	radius: params.motor_cutout_diameter / 2,
	resolution: params.resolution * 4}));
    var grid = params.motor_screw_grid;
    for (var x = -grid / 2; x < grid; x = x + grid) {
	for (var y = -grid / 2; y < grid; y = y + grid) {
	    result = result.union(CAG.circle({
		center: [x, y], radius: params.motor_screw_diameter/2,
		resolution: params.resolution}));
	}
    }
    result = result.union(CAG.rectangle({
	center: [0, offset],
	radius: [5, params.gap / 2]}));
    result = result.subtract(CAG.rectangle({
	center: [0, 100 + offset + params.gap],
	radius: [100, 100]}));
    return result;
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
		center: [x, y],
		radius: params.extrusion_screw_diameter/2,
		resolution: params.resolution}));
	}
    }
    result = result.union(CAG.roundedRectangle({
	radius: [params.frame_width/2 - params.extrusion_thickness,
		 params.flange * 2],
	roundradius: params.roundness,
	resolution: params.resolution}));
    result = result.subtract(
	motortab(params,
		 params.motor_width / 2
		 + params.motor_offset)
	    .rotateZ(90)
	    .translate([-params.frame_width / 2
			+ params.motor_width / 2
			+ params.extrusion_thickness
			+ params.motor_offset * 3, 0, 0]));
    result = result.subtract(
	motortab(params,
		 params.motor_width / 2
		 + params.motor_offset)
	    .rotateZ(-90)
	    .translate([params.frame_width / 2
			- params.motor_width / 2
			- params.extrusion_thickness
			- params.motor_offset * 3, 0, 0]));
    return result;
}

function inside(params) {
    return CAG.circle({
	radius: params.frame_radius * 0.5, resolution: 3})
	.expand(params.frame_radius * 0.2, params.resolution * 4)
	.rotateZ(-30);
}

function main(params) {
    var sin = Math.sin(Math.PI * 2 / 3);
    var cos = Math.cos(Math.PI * 2 / 3);
    var x1 = params.extrusion_width / 2;
    var y1 = params.frame_radius;
    var x2 = cos * -x1 + sin * y1;
    var y2 = sin * x1 + cos * y1;
    var x3 = cos * x1 + sin * y1;
    var y3 = sin * -x1 + cos * y1;

    var dx = x2 - x1;
    var dy = y2 - y1;
    params.frame_width = Math.sqrt(dx*dx + dy*dy)
	+ 2 * params.extrusion_thickness;

    var triangle = CAG.fromPoints([
	[x1, y1], [x2, y2], [x3, y3], [-x3, y3], [-x2, y2], [-x1, y1]])
	.subtract(inside(params));
    var a;

    var sx = (x1 + x2) / 2;
    var sy = (y1 + y2) / 2;
    var side_offset = Math.sqrt(sx*sx + sy*sy) + params.frame_height/2 + 2;
    for (a = 0; a < 360; a = a + 120) {
	triangle = triangle
	    .union(side(params).translate([0, -side_offset]).rotateZ(a));
    }
    return triangle;
}
