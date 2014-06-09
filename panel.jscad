function getParameterDefinitions() {
    return [
        {name: 'frame_radius', initial: 180, type: 'float', caption: 'Center to extrusion:', size: 5},
        {name: 'frame_height', initial: 75, type: 'float', caption: 'Panel height:', size: 5},
        {name: 'flange', initial: 20, type: 'float', caption: 'Flange:', size: 5},
        {name: 'gap', initial: 2, type: 'float', caption: 'Gap:', size: 5},
        {name: 'extrusion_width', initial: 15, type: 'float', caption: 'Extrusion width:', size: 5},
        {name: 'extrusion_thickness', initial: 15, type: 'float', caption: 'Extrusion thickness:', size: 5},
        {name: 'extrusion_screw_diameter', initial: 3, type: 'float', caption: 'Extrusion screw size:', size: 5},
        {name: 'motor_screw_diameter', initial: 3, type: 'float', caption: 'Motor screw size:', size: 5},
        {name: 'motor_screw_grid', initial: 31, type: 'float', caption: 'Motor screw grid:', size: 5},
        {name: 'motor_cutout_diameter', initial: 22, type: 'float', caption: 'Motor cutout dia:', size: 5},
        {name: 'motor_width', initial: 42.2, type: 'float', caption: 'Motor width:', size: 5},
        {name: 'motor_offset', initial: 13, type: 'float', caption: 'Motor to extrusion:', size: 5},
        {name: 'roundness', initial: 7.5, type: 'float', caption: 'Roundness radius:', size: 5},
        {name: 'resolution', initial: 24, type: 'float', caption: 'Resolution:', size: 5},
        {name: 'count', initial: 1, type: 'int', caption: 'Count:', size: 5}
    ];
}

function bend(params, length, step) {
    var result = CAG.rectangle({
        center: [step/2, 0],
        radius: [params.gap / 4, params.gap / 4]});
    for (var x = step/2; x < length/2 - 10; x = x + step) {
        result = result.union(CAG.rectangle({
            center: [x, 0],
            radius: [5, params.gap/2]}));
        result = result.union(CAG.rectangle({
            center: [-x, 0],
            radius: [5, params.gap/2]}));
    }
    return result;
}

function motortab(params, offset) {
    var result = CAG.roundedRectangle({
        center: [0, params.motor_width*1.2],
        radius: [params.motor_width/2 + params.gap,
                 params.motor_width + params.gap],
        roundradius: params.roundness + params.gap,
        resolution: params.resolution});
    result = result.subtract(
        CAG.roundedRectangle({
            center: [0, params.motor_width*1.2],
            radius: [params.motor_width/2,
                     params.motor_width],
            roundradius: params.roundness,
            resolution: params.resolution})
            .subtract(CAG.circle({
                radius: params.motor_cutout_diameter/2,
                resolution: params.resolution * 4})));
    var grid = params.motor_screw_grid;
    for (var x = -grid/2; x < grid; x = x + grid) {
        for (var y = grid/2; y < grid; y = y + grid) {
            result = result.union(CAG.circle({
                center: [x, y], radius: params.motor_screw_diameter/2,
                resolution: params.resolution}));
        }
    }
    result = result.union(CAG.rectangle({
        center: [0, offset],
        radius: [5, params.gap/2]}));
    result = result.subtract(CAG.rectangle({
        center: [0, 100 + offset + params.gap],
        radius: [100, 100]}));
    return result;
}

function flange(params) {
    var result = CAG.rectangle({
        radius: [params.frame_width/2 - params.extrusion_thickness,
                 params.gap + params.flange]});
    for (var s = -1; s < 2; s = s + 2) {
        result = result.subtract(
            CAG.rectangle({radius: [
                100, 2 * (params.flange - params.extrusion_width) + 2]})
                .rotateZ(s * 30)
                .translate([
                    s * (params.extrusion_thickness - params.frame_width/2),
                    params.gap + params.flange,
                    0]));
        // Cutout for timing belt.
        result = result.subtract(
            CAG.roundedRectangle({radius: [22, 22],
                                  roundradius: params.roundness/2})
                .translate([32 * s, 0, 0])
                .rotateZ(30 * s)
                .translate([
                    s * (params.extrusion_thickness - params.frame_width/2),
                    params.gap + params.flange,
                    0]));
    }
    return result;
}

function panel(params) {
    var result = CAG.roundedRectangle({
        radius: [params.frame_width/2, params.frame_height/2],
        roundradius: params.roundness, resolution: params.resolution});
    var offset_x = params.frame_width - params.extrusion_thickness;
    var offset_y = params.frame_height - params.extrusion_thickness;
    for (var x = -offset_x/2; x < offset_x; x = x + offset_x) {
        for (var y = -offset_y/2; y < offset_y; y = y + offset_y) {
            result = result.subtract(CAG.circle({
                center: [x, y],
                radius: params.extrusion_screw_diameter/2,
                resolution: params.resolution}));
        }
    }
    result = result.union(
        flange(params).translate([0, params.frame_height/2, 0]));
    result = result.subtract(
        bend(params, params.frame_width - 2 * params.extrusion_thickness, 48)
            .translate([0, params.frame_height/2 + params.gap/2, 0]));
    result = result.subtract(
        bend(params, params.frame_height, 30)
            .rotateZ(90)
            .translate([-params.frame_width/2
                        - params.gap/2
                        + params.extrusion_thickness, 0, 0]));
    result = result.subtract(
        bend(params, params.frame_height, 30)
            .rotateZ(90)
            .translate([params.frame_width/2
                        + params.gap/2
                        - params.extrusion_thickness, 0, 0]));
    for (var s = -1; s < 2; s = s + 2) {
        result = result.subtract(
            motortab(params,
                     params.motor_width/2 + params.motor_offset)
                .rotateZ(s * 90)
                .translate([s * (params.frame_width/2
                                 - params.motor_width/2
                                 - params.motor_offset), 0, 0]));
    }
    return result;
}

function main(params) {
    var sin = Math.sin(Math.PI*2/3);
    var cos = Math.cos(Math.PI*2/3);
    var x1 = params.extrusion_width/2;
    var y1 = params.frame_radius;
    var x2 = cos * -x1 + sin * y1;
    var y2 = sin * x1 + cos * y1;
    var x3 = cos * x1 + sin * y1;
    var y3 = sin * -x1 + cos * y1;

    var dx = x2 - x1;
    var dy = y2 - y1;
    params.frame_width = Math.sqrt(dx*dx + dy*dy)
        + 2 * params.extrusion_thickness;

    var result = panel(params);
    for (var s = 0; s < params.count; s++) {
        result = result.union(panel(params).translate(
            [0, s * (params.frame_height
                     + params.flange
                     + 2*params.gap), 0]));
    }
    return result;
}
