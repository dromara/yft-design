import { PathPoint } from '@/types/common'
import { util } from 'fabric'

export const getPathPoints = (elementPath: util.TSimplePathData) => {
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

export const paths2str = (paths: any[], scale: number) => {
  let svgPath = "", i, j;
  if (!scale) scale = 1;
  for(i = 0; i < paths.length; i++) {
      for(j = 0; j < paths[i].length; j++){
          if (!j) svgPath += "M";
          else svgPath += "L";
          svgPath += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
      }
      svgPath += "Z";
  }
  if (svgPath === "") svgPath = "M0,0";
  return svgPath;
}