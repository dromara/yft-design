import { PathPoint } from '@/types/common'
import { util } from 'fabric'

export const getElementPathPoints = (elementPath: util.TSimplePathData) => {
  let clipperPaths: any[] = []
  let pathPoints: PathPoint[] = []
  elementPath.forEach(item => {
    const command = item[0]
    if (command === 'M' || command === 'L' || command === 'Q') {
      pathPoints.push({ X: item[1], Y: item[2] })
    }
    else if (command === 'Z') {
      if (pathPoints.length > 0) {
        clipperPaths.push(pathPoints)
      }
      pathPoints = []
    }
  })
  return clipperPaths
}