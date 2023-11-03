export async function loadFont(fontFamily: string) {
  let font
  try {
    const fonts = self.queryLocalFonts();
    font = fonts.filter(item => item.family === fontFamily)[0]
  } catch(e: any) {
    console.log(`Cannot query fonts: ${e.message}`)
  } finally {
    return font
  }
}