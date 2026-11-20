# 📊 How to Automatically Record Milk Entries in Google Sheets & Excel

This guide explains how to connect your mobile milk distribution entry frontend to a **Google Sheet** (which can be downloaded as an Excel file anytime with 1 click).

This method is **100% Free**, requires **No backend servers**, **No database setup**, and saves entries in **Real-Time** from any mobile phone!

---

## 🚀 4-Step Setup Procedure

### Step 1: Create a New Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser.
2. Name the sheet: **Karimnagar Milk Distribution Entries**.
3. (Optional) You can leave the sheet completely blank — the script below will automatically create all 26 formatted column headers on the first submission!

---

### Step 2: Open Google Apps Script
1. Inside your Google Sheet, click **Extensions** in the top menu.
2. Click **Apps Script**.
3. Delete any default code in `Code.gs` and paste the following script:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Prevent race conditions from simultaneous mobile submits
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create bold blue headers if this is a brand new sheet
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp", "Date", "Time", "Customer Code", "Customer Name",
        "TM 1000", "TM 500", "TM 200", "PURE 500", "PURE LOOSE", 
        "GOLD 500", "GOLD LOOSE", "TM LOOSE", "TEA SPL 500 ML", "TM 120", 
        "SPECIAL 500", "SPECIAL LOOSE", "TM 6 LTRS", "PM 6 LTRS", "GM 6 LTRS", 
        "COW MILK", "STM 125", "THICK 500", "SPECIAL 6 LTRS", 
        "Total Items", "Total Qty"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
           .setFontWeight("bold")
           .setBackground("#1e40af")
           .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    
    // Append the customer milk entry row
    var row = [
      data.timestamp || new Date().toISOString(),
      data.date || "",
      data.time || "",
      data.customerCode || "",
      data.customerName || "",
      data.products["TM 1000"] || "",
      data.products["TM 500"] || "",
      data.products["TM 200"] || "",
      data.products["PURE 500"] || "",
      data.products["PURE LOOSE"] || "",
      data.products["GOLD 500"] || "",
      data.products["GOLD LOOSE"] || "",
      data.products["TM LOOSE"] || "",
      data.products["TEA SPL 500 ML"] || "",
      data.products["TM 120"] || "",
      data.products["SPECIAL 500"] || "",
      data.products["SPECIAL LOOSE"] || "",
      data.products["TM 6 LTRS"] || "",
      data.products["PM 6 LTRS"] || "",
      data.products["GM 6 LTRS"] || "",
      data.products["COW MILK"] || "",
      data.products["STM 125"] || "",
      data.products["THICK 500"] || "",
      data.products["SPECIAL 6 LTRS"] || "",
      data.totalItems || 0,
      data.totalQuantity || 0
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

---

### Step 3: Deploy as Web App
1. In the Apps Script editor, click the blue **Deploy** button (top right).
2. Click **New deployment**.
3. Click the gear icon ⚙️ next to *"Select type"* and choose **Web app**.
4. Configure the settings:
   - **Description**: `Milk Mobile Entry Webhook`
   - **Execute as**: `Me (your Google email)`
   - **Who has access**: **`Anyone`** *(Important: Choose "Anyone" so the mobile phone app can submit data without Google sign-in prompts)*.
5. Click **Deploy**.
6. Google will ask for permission &bull; Click **Authorize Access** &bull; Choose your account &bull; Click **Advanced** &bull; Click **Go to Untitled project (unsafe)** &bull; Click **Allow**.
7. Copy the **Web App URL** (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

---

### Step 4: Connect to Your Mobile App
1. Open `src/config.js` in your project.
2. Paste the URL into `GOOGLE_SHEET_WEBHOOK_URL`:
   ```javascript
   export const CONFIG = {
     DEMO_PASSWORD: 'milk123',
     GOOGLE_SHEET_WEBHOOK_URL: 'https://script.google.com/macros/s/YOUR_URL_HERE/exec',
   };
   ```
3. Save the file! That's it!

Now, every time someone taps **Submit 1-Time Entry** on a mobile phone, a new row is instantly added to your Google Sheet in real-time.

---

## 📥 How to Get It in Excel

Once entries are in Google Sheets, you can download them as an Excel file anytime:
- Click **File** > **Download** > **Microsoft Excel (.xlsx)**.
- Or use Google Drive desktop sync to keep a live `.xlsx` file on your computer.
