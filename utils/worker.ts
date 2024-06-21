const timer: {
  [key in string]: ReturnType<typeof setTimeout> | undefined
} = {
  lastFrameTimer: undefined,
}

const requestTimer: {
  [key in string]: ReturnType<typeof requestAnimationFrame> | undefined
} = {
  animateTimerTop: undefined,
  animateTimerTop1: undefined,
  animateTimerTop2: undefined,
  animateTimerTop3: undefined,
  animateTimerTop4: undefined,
  animateTimerTop5: undefined,
  animateTimerTop6: undefined,
  animateTimerTop7: undefined
}

const road = {
  width: 642,
  height: 573,
  gap: -55,
  count: 0,
}

const light = {
  width: 183,
  height: 845,
  smallWidth: 92,
  smallHeight: 408,
}

self.onmessage = (event: MessageEvent) => {
  const {
    command,
    parkCloneCanvas,
    man,
    timer,
    bench,
    walkData,
    roadData,
    imgData,
    lightImgData,
    themeType
  } = event.data;
  if (command === 'clear') {
    clearAnimate();
    return;
  }

  const parkCanvas = parkCloneCanvas;

  // 创建离屏 Canvas
  const offscreenCanvas = new OffscreenCanvas(parkCanvas.width, parkCanvas.height);
  const offscreenCtx = offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  // 在离屏 Canvas 上进行绘制
  function draw() {
    const ctx = offscreenCtx;
  
    //循环动画第一帧
    if (man.stepX * (man.timeControl / 100 - 2) > man.walkWidth + man.stepX * 3) {
      man.timeControl = 0;
      drawIndex = 0;
      man.sitingTime = 100;
      man.walkToSitingWaitTime = 10;
      man.sitingToWalkToWaitTime = 10;
      timer.lastFrameTimer = setTimeout(() => {
        // 将结果传输到主线程
        offscreenCanvas.convertToBlob().then((blob) => {
          createImageBitmap(blob).then((imageBitmap) => {
            self.postMessage(imageBitmap);
            requestTimer.animateTimerTop6 = requestAnimationFrame(draw);
          });
        });
      }, 5000);
      return;
    }
    const moveRate = (man.timeControl / 15 - 2);
  
    //动画
    if (man.timeControl % 8 === 0) {
      ctx.clearRect(0, 0, 5000, 5000);
      ctx.drawImage(imgData, parkCanvas.width / 2 - bench.smallWidth / 2, 
        parkCanvas.height / 2 - bench.smallHeight / 10, 
        bench.smallWidth, bench.smallHeight);
      
      ctx.drawImage(lightImgData, parkCanvas.width / 2 + 3 * light.smallWidth, 
      parkCanvas.height / 2 - light.smallHeight / 1.5, 
      light.smallWidth, light.smallHeight);
      //从屏幕外进入
      if (man.stepX * moveRate >= man.walkWidth / 2 - man.stepX && man.sitingTime > 0) {
        if (man.sitingToWalkToWaitTime > 0 && man.sitingTime === 1) {
          //离开凳子
          man.y -= ((man.sitingToWalkToWaitTime - 10) * 2);
          drawWalking(
            ctx, 
            0, 
            man.y, 
            (man.stepX) * moveRate,
            walkData
          );
          drawLight(ctx, parkCanvas, themeType);
          drawRoad(ctx, parkCanvas, roadData);
          man.sitingToWalkToWaitTime--;
          // 将结果传输到主线程
          offscreenCanvas.convertToBlob().then((blob) => {
            createImageBitmap(blob).then((imageBitmap) => {
              self.postMessage(imageBitmap);
              requestTimer.animateTimerTop2 = requestAnimationFrame(draw);
            });
          });
          return
        } else {
          if (man.sitingTime > 1) {
            drawSitingMan(ctx, parkCanvas.width / 2 - bench.smallWidth / 2 + 180, (parkCanvas.height - man.height - 180 * 2), walkData);
          } else {
            drawWalking(
            ctx, 
            0, 
            man.y, 
            (man.stepX) * moveRate,
            walkData
          );
          }
          drawLight(ctx, parkCanvas, themeType);
          drawRoad(ctx, parkCanvas, roadData);
          man.sitingTime--;
          // 将结果传输到主线程
          offscreenCanvas.convertToBlob().then((blob) => {
            createImageBitmap(blob).then((imageBitmap) => {
              self.postMessage(imageBitmap);
              requestTimer.animateTimerTop3 = requestAnimationFrame(draw);
            });
          });
          return;
        }
      } else {
        if (man.stepX * moveRate >= man.walkWidth / 2 - man.stepX * 2 && man.walkToSitingWaitTime > 0) {
          //移向凳子
          man.y += ((man.walkToSitingWaitTime - 10) * 2);
          drawWalking(
            ctx, 
            0, 
            man.y, 
            (man.stepX) * moveRate,
            walkData
          );
          drawLight(ctx, parkCanvas, themeType);
          drawRoad(ctx, parkCanvas, roadData);
          man.walkToSitingWaitTime--;
          // 将结果传输到主线程
          offscreenCanvas.convertToBlob().then((blob) => {
            createImageBitmap(blob).then((imageBitmap) => {
              self.postMessage(imageBitmap);
              requestTimer.animateTimerTop4 = requestAnimationFrame(draw);
            });
          });
          return
        } else {
          drawWalking(
            ctx, 
            0, 
            man.y, 
            (man.stepX) * moveRate,
            walkData
          );
        }
      }
    } 
    else {
      man.timeControl++;

      // 将结果传输到主线程
      offscreenCanvas.convertToBlob().then((blob) => {
        createImageBitmap(blob).then((imageBitmap) => {
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
    offscreenCanvas.convertToBlob().then((blob) => {
      createImageBitmap(blob).then((imageBitmap) => {
        self.postMessage(imageBitmap);
        requestTimer.animateTimerTop1 = requestAnimationFrame(draw);
      });
    });
  }
  draw();
};

let drawIndex = 0;
function drawWalking(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, offset = 0, walkData: any) {
  if (drawIndex > 8) {
    drawIndex = 0;
  }
  ctx.save();
  ctx.translate(x + offset, y);
  const path = new Path2D(walkData[1][drawIndex]);
  const p = new Path2D();
  p.addPath(path);
  ctx.fillStyle = '#0a0b0b';
  ctx.fill(p);
  ctx.restore();
  drawIndex++
}

function drawSitingMan(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, walkData: any) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(2, 2);
  const path = new Path2D(walkData[0] as string);
  const p = new Path2D();
  p.addPath(path);
  ctx.fillStyle = '#0a0b0b';
  ctx.fill(p);
  ctx.restore();
}

function drawLight(ctx: OffscreenCanvasRenderingContext2D, parkCanvas: any, type = 'light') {
  if (type === 'light') {
    clearYellowLight(ctx, parkCanvas.width / 2 + 3.5 * light.smallWidth, 
    parkCanvas.height / 2 - light.smallHeight / 1.5 + 90, 800);
    return;
  }
  //灯光
  simulateYellowLight(ctx, parkCanvas.width / 2 + 3.5 * light.smallWidth, 
    parkCanvas.height / 2 - light.smallHeight / 1.5 + 90, 800)
}
//#region 路
function drawRoad(ctx: OffscreenCanvasRenderingContext2D, parkCanvas: any, roadData: any) {
  ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, parkCanvas.horizon);
    ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.horizon - 100, 
      parkCanvas.width, parkCanvas.horizon);
    ctx.moveTo(parkCanvas.width, parkCanvas.height - 200);
    ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, 
      0, parkCanvas.height - 200);
    ctx.stroke();
    ctx.closePath();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(0, parkCanvas.height - 200);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 300, 
    parkCanvas.width, parkCanvas.height - 200);
  ctx.lineTo(parkCanvas.width, parkCanvas.height);
  ctx.quadraticCurveTo(parkCanvas.width / 2, parkCanvas.height - 100, 
    0, parkCanvas.height);
  ctx.lineTo(0, parkCanvas.height - 200);
  ctx.stroke();
  ctx.closePath();

  ctx.save();
    ctx.clip();
    ctx.translate(road.gap - 50, road.height + 150);
    for (let i = 0; i <= road.height; i++) {
      if (i % 2 === 1) {
        generateRoad(ctx, () => {
          ctx.translate((i + 1) * road.width - road.gap, road.height / 2);
          ctx.rotate(180 * Math.PI / 180);
          ctx.transform(1, 0, 0, 0.5, 0, 0);
        }, roadData);
      } else {
        generateRoad(ctx, () => {
          ctx.translate(i * road.width, 0);
          ctx.transform(1, 0, 0, 0.5, 0, 0);
        }, roadData);
      }
    }
  ctx.restore();
}
//#endregion

const styleMap: Record<string, 'lineWidth' | 'strokeStyle' | 'miterLimit' | 'lineCap' | 'lineJoin' | 'fillStyle'> = {
  'stroke-width': 'lineWidth',
  'stroke': 'strokeStyle',
  'stroke-miterlimit': 'miterLimit',
  'stroke-linecap': 'lineCap',
  'stroke-linejoin': 'lineJoin',
  'fill': 'fillStyle',
}

function simulateYellowLight(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, radius: number) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
  gradient.addColorStop(0.15, 'rgba(255, 255, 0, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function clearYellowLight(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, radius: number) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 0, 0)');
  gradient.addColorStop(0.15, 'rgba(255, 255, 0, 0)');
  gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function generateRoad(ctx: OffscreenCanvasRenderingContext2D, cb: () => void, roadData: any) {
  ctx.save();
  cb();
  const tmp: Record<string, Path2D> = {};
  roadData.forEach((e: string, i: number) => {
    tmp[`p${i}`] = new Path2D(e);
  });

  const p = new Path2D();
  for (const key in tmp) {
    p.addPath(tmp[key]);
  }
  ctx.stroke(p);
  ctx.restore();
}

function clearAnimate() {
  for (const item in timer) {
    clearTimeout(timer[item]);
  }

  for (const item in requestTimer) {
    if (requestTimer[item] !== undefined) {
      cancelAnimationFrame(requestTimer[item] as number);
    }
  }
}
