const lib = {
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },
    range(start, end, tick) {
        const s = Math.round(start / tick) * tick;
        return Array.from(
            {
                length: Math.floor((end - start) / tick),
            },
            (v, k) => {
                return k * tick + s;
            },
        );
    },
};
const line = (pointA, pointB) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX),
    };
};

/**
 * 计算热力图的path
 */
const calcHeatMapPath = ({ svg, info, points }) => {
    const options = info;

    const lastPoint = points[points.length - 1];
    const lastX = lastPoint[0];
    const lastY = lastPoint[1];
    if (lastX !== svg.w) {
        points.push([svg.w, lastY]);
    }

    const yPoints = points.map((point) => point[1]);
    const yMin = Math.min(...yPoints);
    const yMax = Math.max(...yPoints);
    const yMid = (yMin + yMax) / 2;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const y = point[1];
        point[1] = y * (y > yMid ? 1 + options.scale : 1 - options.scale) + options.minHeight;
    }

    const controlPoint = (current, previous, next, reverse) => {
        const p = previous || current;
        const n = next || current;
        const o = line(p, n);
        const flat = lib.map(Math.cos(o.angle) * options.flattening, 0, 1, 1, 0);
        const angle = o.angle * flat + (reverse ? Math.PI : 0);
        const length = o.length * options.smoothing;
        const x = current[0] + Math.cos(angle) * length;
        const y = current[1] + Math.sin(angle) * length;
        return [x, y];
    };

    const bezierCommand = (point, i, a) => {
        const cps = controlPoint(a[i - 1], a[i - 2], point);
        const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
        const close = i === a.length - 1 ? ' z' : '';
        return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}${close}`;
    };

    const pointsPositions = points.map((e) => {
        const x = lib.map(e[0], options.xMin, options.xMax, 0, svg.w);
        const y = lib.map(e[1], options.yMin, options.yMax, svg.h, 0);
        return [x, y];
    });

    const pathD = pointsPositions.reduce(
        (acc, e, i, a) =>
            i === 0
                ? `M ${a[a.length - 1][0]},${svg.h} L ${e[0]},${svg.h} L ${e[0]},${e[1]}`
                : `${acc} ${bezierCommand(e, i, a)}`,
        '',
    );

    return pathD;
};
onmessage = (event) => {
    const { data } = event;
    const messageOption = {
        id: data.id,
        workerOption: data,
    };
    if (!data.id || data.type !== 'heatmap-calc') {
        self.postMessage(messageOption);
        return;
    }

    const result = calcHeatMapPath(data);
    messageOption['result'] = result;
    self.postMessage(messageOption);
};
