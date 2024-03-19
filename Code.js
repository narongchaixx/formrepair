const SETTINGS = {
  APP_NAME: "ใบรับแจ้งและแก้ไขปัญหาระบบสารสนเทศ สส.ทหาร",
  SHEET_NAME: {
    RESPONSES: "Responses"
  },
  HEADERS: [
    { key: "timestamp", value: "วันที่แจ้ง" },
    { key: "id", value: "ID" },
    { key: "name", value: "ชื่อผู้แจ้ง" },
    // { key: "samnak", value: "สำนัก" },
    { key: "agency", value: "หน่วยงาน" },
    { key: "pb", value: "ปัญหา" },
    { key: "phone", value: "เบอร์โทรศัพท์" },
    // { key: "timejang", value: "เวลาที่แจ้ง"},
    { key: "jai", value: "ผู้จ่ายงาน" },
    { key: "datejai", value: "วันที่จ่าย" },
    { key: "timejai", value: "เวลาจ่ายงาน" },
    { key: "namepati", value: "จนท.ผู้ปฏิบัติงาน" },
    { key: "datepati", value: "วันที่ปฏิบัติงาน"},
    { key: "timepati", value: "เวลาทีปฏิบัติงาน" },
    { key: "pongarndumnern", value: "ผลการปฏิบัติงาน" },
    { key: "rj45", value: "ใช้หัวRJ45(หัว)"},
    { key:"cableutp", value: "ใช้สายUTP(เมตร)"},
    { key: "rang", value: "ใช้ราง(เส้น)"},
    { key: "another", value: "อื่นๆ"},
    // { key: "todsop", value: "ทดสอบ"},
    { key: "finish", value: "สำเร็จ/ไม่สำเร็จ"},
    { key: "nfinish", value: "ไม่สำเร็จเพราะ"},
    { key: "signature", value: "ลายเซ็นต์" },
  ]
}

function link(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent()
}

function doGet() {
  return HtmlService.createTemplateFromFile("index.html")
    .evaluate()
    .setTitle(SETTINGS.APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function submit(data) {
  data = JSON.parse(data)
  const headers = SETTINGS.HEADERS.map(({value}) => value)
  const id = Utilities.getUuid()
  const signatures = []
  const values = SETTINGS.HEADERS.map(({key}, index) => {
    if (key === "id") return id
    if (key === "timestamp") return new Date()
    if (!key in data) return null
    if (Array.isArray(data[key])) return data[key].join(",")
    if (data[key] && data[key].startsWith("data:image")) {
      signatures.push(index)
      return SpreadsheetApp.newCellImage().setSourceUrl(data[key]).build().toBuilder()
    }
    return data[key]
  })
  const ws = SpreadsheetApp.getActive().getSheetByName(SETTINGS.SHEET_NAME.RESPONSES) || SpreadsheetApp.getActive().insertSheet(SETTINGS.SHEET_NAME.RESPONSES)
  ws.getRange(1,1, 1, headers.length).setValues([headers])
  const lastRow = ws.getLastRow()
  ws.getRange(lastRow + 1, 1, 1, values.length).setValues([values])
  signatures.forEach(index => {
    ws.getRange(lastRow + 1, index + 1).setValue(values[index])
  })
  return JSON.stringify({success: true, message: `ส่งใบแจ้งสำเร็จ ขอบคุณที่ใช้บริการ`})
}

// function submit(data) {
//   data = JSON.parse(data);
//   const headers = SETTINGS.HEADERS.map(({value}) => value);
//   const ws = SpreadsheetApp.getActive().getSheetByName(SETTINGS.SHEET_NAME.RESPONSES) || SpreadsheetApp.getActive().insertSheet(SETTINGS.SHEET_NAME.RESPONSES);

//   // หาค่า ID ล่าสุดและเพิ่ม 1 เพื่อใช้เป็นค่า ID ใหม่
//   let lastRowId = ws.getRange(ws.getLastRow(), 2).getValue();
//   if (lastRowId === "") lastRowId = 0; // กรณีไม่มีข้อมูลในแถวสุดท้าย
//   const newId = parseInt(lastRowId) + 1;

//   const signatures = [];
//   const values = SETTINGS.HEADERS.map(({key}, index) => {
//     if (key === "id") return newId;
//     if (key === "timestamp") return new Date();
//     if (!key in data) return null;
//     if (Array.isArray(data[key])) return data[key].join(",");
//     if (data[key] && data[key].startsWith("data:image")) {
//       signatures.push(index);
//       return SpreadsheetApp.newCellImage().setSourceUrl(data[key]).build().toBuilder();
//     }
//     return data[key];
//   });

//   ws.getRange(1, 1, 1, headers.length).setValues([headers]);
//   const lastRow = ws.getLastRow();
//   ws.getRange(lastRow + 1, 1, 1, values.length).setValues([values]);
//   signatures.forEach(index => {
//     ws.getRange(lastRow + 1, index + 1).setValue(values[index]);
//   });

//   // อัพเดทค่า ID ล่าสุดในชีท
//   ws.getRange(ws.getLastRow() + 1, 2).setValue(newId);

//   return JSON.stringify({success: true, message: `ส่งใบแจ้งสำเร็จ ขอบคุณที่ใช้บริการ`});
// }






