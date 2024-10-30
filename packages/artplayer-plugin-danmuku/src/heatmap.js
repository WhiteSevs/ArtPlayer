import workerText from 'bundle-text:./heatmapWorker';

export default function heatmap(art, danmuku, option) {
    const { query } = art.constructor.utils;

    art.controls.add({
        name: 'heatmap',
        position: 'top',
        html: '',
        style: {
            position: 'absolute',
            top: '-100px',
            left: '0px',
            right: '0px',
            height: '100px',
            width: '100%',
            pointerEvents: 'none',
        },
        mounted($heatmap) {
            let $start = null;
            let $stop = null;
            let isUpdate = false;

            // 创建 Web Worker, 用于计算热力图的值
            const blob = new Blob([workerText], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            worker.onmessage = () => {
                const { data } = event;
                try {
                    updateHeatMapHTML({
                        width: data.workerOption.svg.w,
                        height: data.workerOption.svg.h,
                        opacity: data.workerOption.options.opacity,
                        path: data.result,
                    });
                    updateHeatMapAttribute();
                } catch (error) {
                    console.error(error);
                } finally {
                    isUpdate = true;
                }
            };
            /**
             * 更新热力图的html
             */
            function updateHeatMapHTML({ width, height, opacity, path }) {
                $heatmap.innerHTML = /*html*/ `
                    <svg viewBox="0 0 ${width} ${height}">
                        <defs>
                            <linearGradient id="heatmap-solids" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${opacity}" />
                                <stop offset="0%" style="stop-color:var(--art-theme);stop-opacity:${opacity}" id="heatmap-start" />
                                <stop offset="0%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="heatmap-stop" />
                                <stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#heatmap-solids)" d="${path}"></path>
                    </svg>
                `;
            }
            /**
             * 更新热力图的属性
             */
            function updateHeatMapAttribute() {
                $start = query('#heatmap-start', $heatmap);
                $stop = query('#heatmap-stop', $heatmap);
                $start.setAttribute('offset', `${art.played * 100}%`);
                $stop.setAttribute('offset', `${art.played * 100}%`);
            }
            /**
             * 使用worker通知计算
             */
            function workerUpdate(arg = []) {
                if (isUpdate) {
                    return;
                }
                isUpdate = true;
                $heatmap.innerHTML = '';
                if (!art.duration || art.option.isLive) {
                    isUpdate = false;
                    return;
                }
                const svg = {
                    w: $heatmap.offsetWidth,
                    h: $heatmap.offsetHeight,
                };

                const options = {
                    xMin: 0,
                    xMax: svg.w,
                    yMin: 0,
                    yMax: 128,
                    scale: 0.25,
                    opacity: 0.2,
                    minHeight: Math.floor(svg.h * 0.05),
                    sampling: Math.floor(svg.w / 100),
                    smoothing: 0.2,
                    flattening: 0.2,
                };

                if (typeof option === 'object') {
                    Object.assign(options, option);
                }

                let points = [];

                if (Array.isArray(arg) && arg.length) {
                    points = [...arg];
                } else {
                    const gap = art.duration / svg.w;
                    for (let x = 0; x <= svg.w; x += options.sampling) {
                        const y = danmuku.queue.filter(
                            ({ time }) => time > x * gap && time <= (x + options.sampling) * gap,
                        ).length;
                        points.push([x, y]);
                    }
                }

                if (points.length === 0) return;

                const message = {
                    id: Date.now(),
                    type: 'heatmap-calc',
                    svg: svg,
                    option: option,
                    options: options,
                    points: points,
                };
                worker.postMessage(message);
            }

            art.on('video:timeupdate', () => {
                if ($start && $stop) {
                    $start.setAttribute('offset', `${art.played * 100}%`);
                    $stop.setAttribute('offset', `${art.played * 100}%`);
                }
            });

            art.on('setBar', (type, percentage) => {
                if ($start && $stop && type === 'played') {
                    $start.setAttribute('offset', `${percentage * 100}%`);
                    $stop.setAttribute('offset', `${percentage * 100}%`);
                }
            });

            art.on('destroy', () => worker.terminate());
            art.on('ready', () => workerUpdate());
            art.on('resize', () => workerUpdate());
            art.on('artplayerPluginDanmuku:loaded', () => workerUpdate());
            art.on('artplayerPluginDanmuku:points', (points) => workerUpdate(points));
        },
    });
}
