
importScripts("mupdf/lib/mupdf-wasm.js")

// Import the MuPDF bindings.
importScripts("mupdf/lib/mupdf.js")

self.addEventListener("message", handleMessage);

// let muPdf: MuPdf.Instance | undefined;
// initMuPdf().then((muPdf: MuPdf.Instance)=> {
//     muPdf = muPdf
// }) 

function handleMessage(e) {
    if (e.data.type === "convert") {
    //   convertFile(e.data.file, e.data.mode).then((val: string[] | void) => {
    //     self.postMessage(val);
    //   });
    console.log('convert')
    // console.log(mupdf);
    }
  
    if (e.data.type === "search") {
    //   searchFile(e.data.file, e.data.searchQuery).then((val) => {
    //     self.postMessage(val);
    //   });
    console.log('convert')
    }
  }
  