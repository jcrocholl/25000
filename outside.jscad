function getParameterDefinitions() {
    return [
        {name: 'frame_width', initial: 150, type: 'float', caption: 'Panel width:', size: 5},
        {name: 'frame_height', initial: 75, type: 'float', caption: 'Panel height:', size: 5},
        {name: 'extrusion_width', initial: 15, type: 'float', caption: 'Extrusion width:', size: 5},
        {name: 'extrusion_screw_diameter', initial: 3, type: 'float', caption: 'Extrusion screw size:', size: 5},
        {name: 'motor_screw_diameter', initial: 3, type: 'float', caption: 'Motor screw size:', size: 5},
        {name: 'motor_screw_grid', initial: 31, type: 'float', caption: 'Motor screw grid:', size: 5},
        {name: 'motor_cutout_diameter', initial: 22, type: 'float', caption: 'Motor cutout dia:', size: 5},
        {name: 'roundness', initial: 4, type: 'float', caption: 'Roundness radius:', size: 5},
        {name: 'resolution', initial: 24, type: 'float', caption: 'Resolution:', size: 5}
    ];
}

function motor(params) {
    var result = CAG.circle({
        radius: params.motor_cutout_diameter/2,
        resolution: params.resolution * 4});
    var grid = params.motor_screw_grid;
    for (var x = -grid/2; x < grid; x = x + grid) {
        for (var y = -grid/2; y < grid; y = y + grid) {
            result = result.union(CAG.circle({
                center: [x, y], radius: params.motor_screw_diameter/2,
                resolution: params.resolution}));
        }
    }
    return result;
}

function panel(params) {
    var result = CAG.rectangle({
        radius: [params.frame_width/2 - params.extrusion_width/2,
                 params.frame_height/2]});
    var cutout_x = params.frame_width - params.extrusion_width;
    for (var x = -cutout_x/2; x < cutout_x; x = x + cutout_x) {
        result = result.subtract(CAG.circle({
                center: [x, 0],
                radius: params.frame_height/2 - params.extrusion_width,
                resolution: 2*params.resolution}));
    }
    var offset_x = params.frame_width - params.extrusion_width;
    var offset_y = params.frame_height - params.extrusion_width;
    for (var y = -offset_y/2; y < offset_y; y = y + offset_y) {
        result = result.union(CAG.roundedRectangle({
            center: [0, y],
            radius: [params.frame_width/2, params.extrusion_width/2],
            roundradius: params.roundness,
            resolution: params.resolution}));
        result = result.subtract(CAG.circle({
            center: [0, y],
            radius: params.extrusion_screw_diameter/2,
            resolution: params.resolution}));
        for (x = -offset_x/2; x < offset_x; x = x + offset_x) {
            result = result.subtract(CAG.circle({
                center: [x, y],
                radius: params.extrusion_screw_diameter/2,
                resolution: params.resolution}));
            result = result.subtract(CAG.circle({
                center: [x/2, y],
                radius: params.extrusion_screw_diameter/2,
                resolution: params.resolution}));
        }
    }
    result = result.subtract(motor(params));
    return result;
}

function main(params) {
    return panel(params);
}
