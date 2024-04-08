function getDotPosition(x, y, w, h) {
  // 每一个控制点都是4x4的
  return [
    // 第一行
    [x - 2, y - 2, 4, 4],
    [x + w / 2 - 2, y - 2, 4, 4],
    [x + w - 2, y - 2, 4, 4],
    // 第二行
    [x - 2, y + h / 2 - 2, 4, 4],
    [x + w - 2, y + h / 2 - 2, 4, 4],
    // 第三行
    [x - 2, y + h - 2, 4, 4],
    [x + w / 2 - 2, y + h - 2, 4, 4],
    [x + w - 2, y + h - 2, 4, 4],
  ]
}

// 返回dash线的起始点和终止点
function getDashPosition(x, y, w, h) {
  return [
    // 第一条竖线
    [x + w / 3, y, x + w / 3, y + h],
    // 第二条竖线
    [x + (2 * w) / 3, y, x + (2 * w) / 3, y + h],
    // 第一条横线
    [x, y + h / 3, x + w, y + h / 3],
    [x, y + (2 * h) / 3, x + w, y + (2 * h) / 3],
  ]
}

function getOperablePartsPosition(x, y, w, h) {
  return [
    // 左上 右上 右下 左下 四个点。这里操作点本身是4x4的，但是为了方便选中，将区域扩大为8x8
    [x - 4, y - 4, 8, 8],
    [x + w - 4, y - 4, 8, 8],
    [x + w - 4, y + h - 4, 8, 8],
    [x - 4, y + h - 4, 8, 8],

    // 上 右 下 左 四条边
    [x - 4, y - 4, w + 8, 8],
    [x + w - 4, y - 4, 8, h + 8],
    [x - 4, y + h - 4, w + 8, 8],
    [x - 4, y - 4, 8, h + 8],
  ]
}

function getCursorStyle(i) {
  let cursor = 'default'
  switch (i) {
    case 0:
    case 2:
      cursor = 'nwse-resize'
      break
    case 1:
    case 3:
      cursor = 'nesw-resize'
      break
    case 4:
    case 6:
      cursor = 'ns-resize'
      break
    case 5:
    case 7:
      cursor = 'ew-resize'
      break
    case 8:
      cursor = 'move'
      break
    default:
      break
  }
  return cursor
}

/**
 *
 * @param {*} i 操作区的下标
 * @param {*} selectorInfo 当前的选择框信息
 * @param {*} disX 相较于鼠标按下位置的x轴距离
 * @param {*} disY 相较于鼠标按下位置的y轴距离
 */
function getSelectorInfoByMousePosition(i, selectorInfo, disX, disY) {
  switch (i) {
    case 0:
      // 左上
      selectorInfo.x = selectorInfo.x + disX
      selectorInfo.y = selectorInfo.y + disY
      selectorInfo.w = selectorInfo.w - disX
      selectorInfo.h = selectorInfo.h - disY
      break
    case 1:
      selectorInfo.y = selectorInfo.y + disY
      selectorInfo.w = selectorInfo.w + disX
      selectorInfo.h = selectorInfo.h - disY
      break
    case 2:
      selectorInfo.w = selectorInfo.w + disX
      selectorInfo.h = selectorInfo.h + disY
      break
    case 3:
      selectorInfo.x = selectorInfo.x + disX
      selectorInfo.w = selectorInfo.w - disX
      selectorInfo.h = selectorInfo.h + disY
      break
    case 4:
      selectorInfo.y = selectorInfo.y + disY
      selectorInfo.h = selectorInfo.h - disY
      break
    case 5:
      selectorInfo.w = selectorInfo.w + disX
      break
    case 6:
      selectorInfo.h = selectorInfo.h + disY
      break
    case 7:
      selectorInfo.x = selectorInfo.x + disX
      selectorInfo.w = selectorInfo.w - disX
      break
    case 8:
      selectorInfo.x = selectorInfo.x + disX
      selectorInfo.y = selectorInfo.y + disY
      break
    default:
      break
  }
  return selectorInfo
}

function getImageData(img, width, height, selectorInfo) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = selectorInfo.w
  canvas.height = selectorInfo.h

  ctx.save()
  ctx.drawImage(
    img,
    selectorInfo.x,
    selectorInfo.y,
    selectorInfo.w,
    selectorInfo.h,
    0,
    0,
    width,
    height,
  )
  ctx.restore()
  return canvas.toDataURL()
}
