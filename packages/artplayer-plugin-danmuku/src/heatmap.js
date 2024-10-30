import workerText from 'bundle-text:./heatmapWorker';

export default function heatmap(art, danmuku, option) {
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
            let isRender = false;
            let controlsIsShow = true;

            // 创建 Web Worker, 用于计算热力图的值
            const blob = new Blob([workerText], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            worker.onmessage = () => {
                const { data } = event;
                try {
                    const { workerOption, result } = data;
                    if (result) {
                        updateHeatMapHTML({
                            width: workerOption.svg.w,
                            height: workerOption.svg.h,
                            opacity: workerOption.info.opacity,
                            path: result,
                        });
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    isRender = false;
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
                                <stop offset="${art.played * 100}%" style="stop-color:var(--art-theme);stop-opacity:${opacity}" id="heatmap-start" />
                                <stop offset="${art.played * 100}%" style="stop-color:var(--art-progress-color);stop-opacity:1" id="heatmap-stop" />
                                <stop offset="100%" style="stop-color:var(--art-progress-color);stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#heatmap-solids)" d="${path}"></path>
                    </svg>
                `;
                $start = $heatmap.querySelector('#heatmap-start');
                $stop = $heatmap.querySelector('#heatmap-stop');
            }
            /**
             * 渲染热力图的svg路径
             * @param {[index:number,y:any][]} points
             */
            function renderHeatMap(points = [], isForce = false) {
                if (isForce) {
                    isRender = false;
                }
                if (isRender) {
                    return;
                }
                isRender = true;
                $heatmap.innerHTML = '';
                if (!art.duration || art.option.isLive) {
                    isRender = false;
                    return;
                }
                const svg = {
                    w: $heatmap.offsetWidth,
                    h: $heatmap.offsetHeight,
                };

                const info = {
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
                    Object.assign(info, option);
                }

                if (!points.length) {
                    // 没有热力图数据，自行计算
                    const gap = art.duration / svg.w;
                    for (let index = 0; index <= svg.w; index += info.sampling) {
                        const y = danmuku.queue.filter(
                            ({ time }) => time > index * gap && time <= (index + info.sampling) * gap,
                        ).length;
                        points.push([index, y]);
                    }
                }

                if (points.length === 0) {
                    isRender = false;
                    return;
                }

                const message = {
                    id: Date.now(),
                    type: 'heatmap-calc',
                    svg: svg,
                    info: info,
                    points: points,
                };
                worker.postMessage(message);
            }
            /**
             * 更新热力图的进度
             * @param {number} progress
             */
            function updateHeatMapProgress(progress) {
                if ($start && $stop) {
                    // 更新热力图进度
                    $start.setAttribute('offset', `${progress * 100}%`);
                    $stop.setAttribute('offset', `${progress * 100}%`);
                }
            }

            art.on('video:timeupdate', () => {
                updateHeatMapProgress(art.played);
            });
            art.on('setBar', (type, percentage) => {
                updateHeatMapProgress(percentage);
            });
            art.on('destroy', () => worker.terminate());
            art.on('ready', () => renderHeatMap());

            let timeId = null;
            art.on('resize', () => {
                if (controlsIsShow) {
                    renderHeatMap();
                } else {
                    timeId = setTimeout(() => {
                        renderHeatMap([], true);
                        timeId = null;
                    }, 800);
                }
            });
            art.on('control', (state) => {
                controlsIsShow = state;
                if (controlsIsShow && timeId != null) {
                    clearTimeout(timeId);
                    timeId = null;
                    renderHeatMap([], true);
                }
            });
            art.on('artplayerPluginDanmuku:loaded', () => renderHeatMap());
            art.on('artplayerPluginDanmuku:points', (points) => renderHeatMap(points));
        },
    });
}
