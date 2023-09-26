// window.showStatus = this.showStatus
// const elemStatus = document.getElementById('status');
// const elemFilterInput = document.getElementById('filter-input');
// const elemResult = document.getElementById('result');
// const elemFontsSelect = document.getElementById('fonts-select');
// const elemErrorMessage = document.getElementById('error-message');
// const elemFontInfo = document.getElementById('font-info');
// const elemFontInfoPostscriptName = document.getElementById('font-info-postscript-name');
// const elemFontInfoFullName = document.getElementById('font-info-full-name');
// const elemFontInfoStyle = document.getElementById('font-info-style');
// const elemFontInfoFamily = document.getElementById('font-info-family');
// const elemFontInfoOutlineFormat = document.getElementById('font-info-outline-format');
// const elemFontStyle = document.getElementById('font-style');
const fontMap = new Map();
let enabled = true;



export async function showStatus() {
  if (!self.queryLocalFonts) {
    // elemStatus.innerText = 'API is not available on this platform.';
    enabled = false;
    return;
  }
  
  const status = await navigator.permissions.query({ name: "local-fonts" });
  let statusMessage;
  if (status.state === "granted")
    statusMessage = 'Permission was granted 👍';
  else if (status.state === "prompt")
    statusMessage = 'Permission will be requested';
  else
    statusMessage = 'Permission was denied 👎';
  // elemStatus.innerText = statusMessage;
}

export async function loadFontData(fontFamily) {
  let font
  try {
    const fonts = await window.queryLocalFonts();
    font = fonts.filter(item => item.family === fontFamily)[0]
  } catch(e) {
    console.log(`Cannot query fonts: ${e.message}`)
  } finally {
    return font
  }
}

export function reset() {
  fontMap.clear();  
  while (elemFontsSelect.options.length > 0) {                
    elemFontsSelect.remove(0);
  }   
  elemFontInfo.style.display = 'none';
  elemFontInfoPostscriptName.innerText = '';
  elemFontInfoFullName.innerText = '';
  elemFontInfoStyle.innerText = '';
  elemFontInfoFamily.innerText = '';
  elemErrorMessage.innerText = '';
}

export async function onFontSelected() {
  if (elemFontsSelect.value === '') {
    // The default option selected.
    return;
  }
  const selectedFontData = fontMap.get(elemFontsSelect.value);
  if (selectedFontData /*&& selectedFontData instanceof FontDta*/) {
    elemFontStyle.textContent = `
        @font-face {
          font-family: "dynamic-font";
          src: local("${selectedFontData.postscriptName}");
        }`;
    elemFontInfoPostscriptName.innerText = `Postscript Name: ${selectedFontData.postscriptName}`;
    elemFontInfoFullName.innerText = `Full Name: ${selectedFontData.fullName}`;
    elemFontInfoStyle.innerText = `Style: ${selectedFontData.style}`;
    elemFontInfoFamily.innerText = `Family: ${selectedFontData.family}`;
    elemFontInfoOutlineFormat.innerText = `Outline Format: ${await getFormat(selectedFontData)}`;
    elemFontInfo.style.fontFamily = "dynamic-font";    
    elemFontInfo.style.display = 'inline-block';    
  } else {
    elemErrorMessage.innerText = 'Unable to load font data';
  }
}

export async function getFormat(fontdata) {
  const bytes = await fontdata.blob();
  // Inspect the first four bytes, which for SFNT define the format.
  // Spec: https://docs.microsoft.com/en-us/typography/opentype/spec/otff#organization-of-an-opentype-font
  const sfntVersion = await bytes.slice(0, 4).text();
  let outlineFormat = "UNKNOWN";
  switch (sfntVersion) {
    case '\x00\x01\x00\x00':
    case 'true':
    case 'typ1':
      outlineFormat = "truetype";
      break;
    case 'OTTO':
      outlineFormat = "cff";
      break;
  }
  return outlineFormat;
}

