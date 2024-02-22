# yft-design 接口

### 接口列表
 
|  接口  | 说明 |
|------ |----- |
|[/api/upload/file](#upload)| 上传文件接口|
|[/api/export/file](#export) | 导出pdf接口|
|[/api/matting/file](#matting) | 抠图接口|
 
***
### 错误码列表
|  错误码  | 说明 |
|------ |----- |
|   200   | 正确 |
|   其他   | 错误 |
 
### 接口详情
* <span id="upload">上传文件（psd, pdf, ai<pdf格式>, cdr<测试>）</span>
 
    * 接口地址：/api/upload/file
    * 返回格式：json
    * 请求方式：post
    * 请求示例：https://yft.design/api/upload/file
    * 接口备注：上传文件解析成fabric.js格式的数据。
    * 请求参数说明：
        | 名称 | 类型 | 必填 |说明|
        |----- |------| ---- |----|
        |<font color=red>file |File|true|上传文件|
 
    * 返回参数说明：
        | 名称 | 类型 |说明|
        |----- |------|----|
        |code | int|状态码
        |data | object|具体数据|
        |msg | string|报错信息|
 
    * JSON返回示例：
    ```
    {
      "code": 200,
      "msg": "",
      "data": {
        "id": "dashdjh-dasdjwe-dasdjkr-rpowei",
        "width": 1063,
        "height": 638,
        "zoom": 1,
        "objects": [
          {
            "id": "WorkSpaceDrawType",
            "name": "rect",
            "fill": "#ffffff",
            "selectable": fFalse,
            "evented": false,
            "lockMovementX": false,
            "lockMovementY": false,
            "objectCaching": true,
            "transparentCorners": false,
            "hasBorders": true,
            "type": "Rect",
            "originX": "left",
            "originY": "top",
            "left": 0,
            "top": 0,
            "width": 1063,
            "height": 638,
          }
        ],
        "workSpace": {
          "fillType": 0,
          "left": 0,
          "top": 0,
          "angle": 0,
          "scaleX": 1,
          "scaleY": 1
        }
      }
    }
    ```

---
 
* <span id="export">导出pdf</span>
 
    * 接口地址：/api/export/file
    * 返回格式：json
    * 请求方式：post
    * 请求示例：https://yft.design/api/export/file
    * 接口备注：通过svg文件生成pdf。
    * 请求参数说明：
        | 名称 | 类型 | 必填 |说明|
        |----- |------| ---- |----|
        |<font color=red>data |string|true|svg字符串|
        |width | int |false|宽|
        |height | int |false|高|
 
    * 返回参数说明：
        | 名称 | 类型 |说明|
        |----- |------|----|
        | code | string|状态码
        |msg | string|返回信息|
        |link | string|pdf链接|
 
    * JSON返回示例：
    ```
    { 
      "code":200,
      "msg":"",
      "link":"/static/export/20240222/1708595113.pdf"
    }
    ```
---

* <span id="matting">抠图API</span>
 
    * 接口地址：/api/matting/file
    * 返回格式：json
    * 请求方式：post
    * 请求示例：https://yft.design/api/matting/file
    * 接口备注：抠图API。
    * 请求参数说明：
        | 名称 | 类型 | 必填 |说明|
        |----- |------| ---- |----|
        |<font color=red>image |File|true|图片文件|
        |model | string |universal|模型名称 universal/people|
 
    * 返回参数说明：
        | 名称 | 类型 |说明|
        |----- |------|----|
        | code | string|状态码
        |result_image_url | string|抠图图片|
        |mask_image_url | string|蒙版图片|
        |original_image_size | object|图片信息|
        |generation_time | string|生成事件|
 
    * JSON返回示例：
    ```
    {
      "code": 0,
      "result_image_url": "/static/matting/20240222/image_9207dddc-2ab9-4e15-9da5-7b2b74610789.png",
      "mask_image_url": "/static/matting/20240222/mask_9207dddc-2ab9-4e15-9da5-7b2b74610789.png",
      "original_image_size": {
        "width": 830,
        "height": 376
      },
      "generation_time": "2024-02-22 18:04:28"
    }
    ```