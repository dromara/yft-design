export const downloadSVGFile = (str: string, name: string) => {
  const blob = new Blob([str], { type: "image/svg+xml" })
  const href = URL.createObjectURL(blob)
  const alink = document.createElement("a")
  alink.style.display = "none"
  alink.download = name // 下载后文件名
  alink.href = href
  document.body.appendChild(alink)
  alink.click()
  document.body.removeChild(alink) // 下载完成移除元素
  URL.revokeObjectURL(href) // 释放掉blob对象
}

export const downloadLinkFile = (link: string, name: string) => {
  // const blob = new Blob([str], { type: "image/svg+xml" })
  // const href = URL.createObjectURL(blob)
  const alink = document.createElement("a")
  alink.style.display = "none"
  alink.download = name // 下载后文件名
  alink.href = link
  document.body.appendChild(alink)
  alink.click()
  document.body.removeChild(alink) // 下载完成移除元素
  URL.revokeObjectURL(link) // 释放掉blob对象
}