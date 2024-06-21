var timer = {
    lastFrameTimer: undefined,
};
var requestTimer = {
    animateTimerTop: undefined,
    animateTimerTop1: undefined,
    animateTimerTop2: undefined,
    animateTimerTop3: undefined,
    animateTimerTop4: undefined,
    animateTimerTop5: undefined,
    animateTimerTop6: undefined,
    animateTimerTop7: undefined
};
var road = {
    width: 642,
    height: 573,
    gap: -55,
    count: 0,
};
var light = {
    width: 183,
    height: 845,
    smallWidth: 92,
    smallHeight: 408,
};
self.onmessage = function (event) {
    var _a = event.data, command = _a.command, parkCloneCanvas = _a.parkCloneCanvas, man = _a.man, timer = _a.timer, bench = _a.bench, walkData = _a.walkData, roadData = _a.roadData, imgData = _a.imgData, lightImgData = _a.lightImgData, themeType = _a.themeType;
    if (command === 'clear') {
        clearAnimate();
        return;
    }
    var parkCanvas = parkCloneCanvas;
    // 创建离屏 Canvas
    var offscreenCanvas = new OffscreenCanvas(parkCanvas.width, parkCanvas.height);
    var offscreenCtx = offscreenCanvas.getContext('2d');
    // 在离屏 Canvas 上进行绘制
    function draw() {
        var ctx = offscreenCtx;
        //循环动画第一帧
        if (man.stepX * (man.timeControl / 100 - 2) > man.walkWidth + man.stepX * 3) {
            man.timeControl = 0;
            drawIndex = 0;
            man.sitingTime = 100;
            man.walkToSitingWaitTime = 10;
            man.sitingToWalkToWaitTime = 10;
            timer.lastFrameTimer = setTimeout(function () {
                // 将结果传输到主线程
                offscreenCanvas.convertToBlob().then(function (blob) {
                    createImageBitmap(blob).then(function (imageBitmap) {
                        self.postMessage(imageBitmap);
                        requestTimer.animateTimerTop6 = requestAnimationFrame(draw);
                    });
                });
            }, 5000);
            return;
        }
        var moveRate = (man.timeControl / 15 - 2);
        //动画
        if (man.timeControl % 4 === 0) {
            ctx.clearRect(0, 0, 5000, 5000);
            ctx.drawImage(imgData, parkCanvas.width / 2 - bench.smallWidth / 2, parkCanvas.height / 2 - bench.smallHeight / 10, bench.smallWidth, bench.smallHeight);
            ctx.drawImage(lightImgData, parkCanvas.width / 2 + 3 * light.smallWidth, parkCanvas.height / 2 - light.smallHeight / 1.5, light.smallWidth, light.smallHeight);
            //从屏幕外进入
            if (man.stepX * moveRate >= man.walkWidth / 2 - man.stepX && man.sitingTime > 0) {
                if (man.sitingToWalkToWaitTime > 0 && man.sitingTime === 1) {
                    //离开凳子
                    man.y -= ((man.sitingToWalkToWaitTime - 10) * 2);
                    drawWalking(ctx, 0, man.y, (man.stepX) * moveRate, walkData);
                    drawLight(ctx, parkCanvas, themeType);
                    drawRoad(ctx, parkCanvas, roadData);
                    man.sitingToWalkToWaitTime--;
                    // 将结果传输到主线程
                    offscreenCanvas.convertToBlob().then(function (blob) {
                        createImageBitmap(blob).then(function (imageBitmap) {
                            self.postMessage(imageBitmap);
                            requestTimer.animateTimerTop2 = requestAnimationFrame(draw);
                        });
                    });
                    return;
                }
                else {
                    if (man.sitingTime > 1) {
                        drawSitingMan(ctx, parkCanvas.width / 2 - bench.smallWidth / 2 + 180, (parkCanvas.height - man.height - 180 * 2), walkData);
                    }
                    else {
                        drawWalking(ctx, 0, man.y, (man.stepX) * moveRate, walkData);
                    }
                    drawLight(ctx, parkCanvas, themeType);
                    drawRoad(ctx, parkCanvas, roadData);
                    man.sitingTime--;
                    // 将结果传输到主线程
                    offscreenCanvas.convertToBlob().then(function (blob) {
                        createImageBitmap(blob).then(function (imageBitmap) {
                            self.postMessage(imageBitmap);
                            requestTimer.animateTimerTop3 = requestAnimationFrame(draw);
                        });
                    });
                    return;
                }
            }
            else {
                if (man.stepX * moveRate >= man.walkWidth / 2 - man.stepX * 2 && man.walkToSitingWaitTime > 0) {
                    //移向凳子
                    man.y += ((man.walkToSitingWaitTime - 10) * 2);
                    drawWalking(ctx, 0, man.y, (man.stepX) * moveRate, walkData);
                    drawLight(ctx, parkCanvas, themeType);
                    drawRoad(ctx, parkCanvas, roadData);
                    man.walkToSitingWaitTime--;
                    // 将结果传输到主线程
                    offscreenCanvas.convertToBlob().then(function (blob) {
                        createImageBitmap(blob).then(function (imageBitmap) {
                            self.postMessage(imageBitmap);
                            requestTimer.animateTimerTop4 = requestAnimationFrame(draw);
                        });
                    });
                    return;
                }
                else {
                    drawWalking(ctx, 0, man.y, (man.stepX) * moveRate, walkData);
                }
            }
        }
        else {
            man.timeControl++;
            // 将结果传输到主线程
            offscreenCanvas.convertToBlob().then(function (blob) {
                createImageBitmap(blob).then(function (imageBitmap) {
                    self.postMessage(imageBitmap);
                    requestTimer.animateTimerTop5 = requestAnimationFrame(draw);
                });
            });
            return;
        }
        man.timeControl++;
        drawLight(ctx, parkCanvas, themeType);
        drawRoad(ctx, parkCanvas, roadData);
        // 将结果传输到主线程
        offscreenCanvas.convertToBlob().then(function (blob) {
            createImageBitmap(blob).then(function (imageBitmap) {
                self.postMessage(imageBitmap);
                requestTimer.animateTimerTop1 = requestAnimationFrame(draw);
            });
        });
    }
    draw();
};
var drawIndex = 0;
function drawWalking(ctx, x, y, offset, walkData) {
    if (offset === void 0) { offset = 0; }
    if (drawIndex > 8) {
        drawIndex = 0;
    }
    ctx.save();
    ctx.translate(x + offset, y);
    var path = new Path2D(walkData[1][drawIndex]);
    var p = new Path2D();
    p.addPath(path);
    ctx.fillStyle = '#0a0b0b';
    ctx.fill(p);
    ctx.restore();
    drawIndex++;
}
function drawSitingMan(ctx, x, y, walkData) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2, 2);
    var path = new Path2D(walkData[0]);
    var p = new Path2D();
    p.addPath(path);
    ctx.fillStyle = '#0a0b0b';
    ctx.fill(p);
    ctx.restore();
}
function drawLight(ctx, parkCanvas, type) {
    if (type === void 0) { type = 'light'; }
    if (type === 'light') {
        clearYellowLight(ctx, parkCanvas.width / 2 + 3.5 * light.smallWidth, parkCanvas.height / 2 - light.smallHeight / 1.5 + 90, 800);
        return;
    }
    //灯光
    simulateYellowLight(ctx, parkCanvas.width / 2 + 3.5 * light.smallWidth, parkCanvas.height / 2 - light.smallHeight / 1.5 + 90, 800);
}
//#region 路
function drawRoad(ctx, parkCanvas, roadData) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, parkCanvas.horizon);
    ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.horizon - 100, parkCanvas.width, parkCanvas.horizon);
    ctx.moveTo(parkCanvas.width, parkCanvas.height - 200);
    ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, 0, parkCanvas.height - 200);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(0, parkCanvas.height - 200);
    ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, parkCanvas.width, parkCanvas.height - 200);
    ctx.lineTo(parkCanvas.width, parkCanvas.height);
    ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 100, 0, parkCanvas.height);
    ctx.lineTo(0, parkCanvas.height - 200);
    ctx.stroke();
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.translate(road.gap - 50, road.height + 150);
    var _loop_1 = function (i) {
        if (i % 2 === 1) {
            generateRoad(ctx, function () {
                ctx.translate((i + 1) * road.width - road.gap, road.height / 2);
                ctx.rotate(180 * Math.PI / 180);
                ctx.transform(1, 0, 0, 0.5, 0, 0);
            }, roadData);
        }
        else {
            generateRoad(ctx, function () {
                ctx.translate(i * road.width, 0);
                ctx.transform(1, 0, 0, 0.5, 0, 0);
            }, roadData);
        }
    };
    for (var i = 0; i <= road.height; i++) {
        _loop_1(i);
    }
    ctx.restore();
}
//#endregion
var styleMap = {
    'stroke-width': 'lineWidth',
    'stroke': 'strokeStyle',
    'stroke-miterlimit': 'miterLimit',
    'stroke-linecap': 'lineCap',
    'stroke-linejoin': 'lineJoin',
    'fill': 'fillStyle',
};
function simulateYellowLight(ctx, x, y, radius) {
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}
function clearYellowLight(ctx, x, y, radius) {
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');
    gradient.addColorStop(0.15, 'rgba(255, 255, 0, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}
function generateRoad(ctx, cb, roadData) {
    ctx.save();
    cb();
    var tmp = {};
    roadData.forEach(function (e, i) {
        tmp["p".concat(i)] = new Path2D(e);
    });
    var p = new Path2D();
    for (var key in tmp) {
        p.addPath(tmp[key]);
    }
    ctx.stroke(p);
    ctx.restore();
}
function clearAnimate() {
    for (var item in timer) {
        clearTimeout(timer[item]);
    }
    for (var item1 in requestTimer) {
        if (requestTimer[item1] !== undefined) {
            cancelAnimationFrame(requestTimer[item1]);
        }
    }
}
