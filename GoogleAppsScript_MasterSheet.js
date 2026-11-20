/**
 * ============================================================================
 * KARIMNAGAR MILK DISTRIBUTION — JNMC MASTER HEADING TEMPLATE SCRIPT
 * ============================================================================
 * Uses the EXACT header block from "JNMC 18-11-2026(d).xls" (Rows 1 to 6).
 * All data rows start completely blank.
 * ONLY submitted customer entries appear row-by-row starting at Row 7.
 * At the bottom, maintains the exact JNMC:
 * - TOTAL row
 * - Crates row
 * - Packets row
 * ============================================================================
 */

// Rates from JNMC Row 2
var RATES = {
  TM_1000:       58,   // Col D (4)
  TM_500:        59,   // Col E (5)
  TM_200:        12,   // Col F (6)
  PURE_500:      74,   // Col G (7)
  PURE_LOOSE:    73,   // Col H (8)
  GOLD_500:      78,   // Col I (9)
  GOLD_LOOSE:    77,   // Col J (10)
  TM_LOOSE:      58,   // Col K (11)
  TEA_SPL_500:   55,   // Col L (12)
  TM_120:        7.5,  // Col M (13)
  SPECIAL_500:   64,   // Col N (14)
  SPECIAL_LOOSE: 63,   // Col O (15)
  TM_6L:         345,  // Col P (16)
  PM_6L:         425,  // Col Q (17)
  GM_6L:         460,  // Col R (18)
  COW_MILK:      60,   // Col S (19)
  STM_125:       7.5,  // Col T (20)
  THICK_500:     74,   // Col U (21)
  SPECIAL_6L:    380   // Col V (22)
};

var CRATE_SIZES = {
  TM_1000: 12, TM_500: 12, TM_200: 60, PURE_500: 12, PURE_LOOSE: 40,
  GOLD_500: 12, GOLD_LOOSE: 40, TM_LOOSE: 40, TEA_SPL_500: 12, TM_120: 80,
  SPECIAL_500: 12, SPECIAL_LOOSE: 40, TM_6L: 2, PM_6L: 2, GM_6L: 2,
  COW_MILK: 20, STM_125: 80, THICK_500: 12, SPECIAL_6L: 2
};

var PRODUCT_KEYS = [
  'TM_1000', 'TM_500', 'TM_200', 'PURE_500', 'PURE_LOOSE',
  'GOLD_500', 'GOLD_LOOSE', 'TM_LOOSE', 'TEA_SPL_500', 'TM_120',
  'SPECIAL_500', 'SPECIAL_LOOSE', 'TM_6L', 'PM_6L', 'GM_6L',
  'COW_MILK', 'STM_125', 'THICK_500', 'SPECIAL_6L'
];

// Row 5: Column Code Numbers from JNMC
var COL_CODES = ['', '', '', 1, 2, 3, 4, 5, 6, 8, 7, 199, 111, 141, 150, 151, 152, 153, 179, 180, 142, 193, '', '', ''];

// Row 6: Main Column Headers from JNMC
var COL_HEADERS = [
  'code', 'Customer Name', 'Landmark',
  'TM 1000', 'TM 500', 'TM 200', 'PURE 500', 'PURE LOOSE',
  'GOLD 500', 'GOLD LOOSE', 'TM LOOSE', 'TEA SPL 500', 'TM 120 ML',
  'SPECIAL 500', 'SPECIAL LOOSE', 'TM 6 LTRS', 'PM 6 LTRS', 'GM 6 LTRS',
  'COW MILK', 'STM 125', 'THICK 500', 'SPECIAL 6 LTRS',
  'Total', 'Amount', 'CURD'
];

// ─── MAIN POST HANDLER ───────────────────────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var customerCode = String(data.customerCode || '').trim();

    // 1. Build the exact JNMC master heading template (Rows 1-6) if not present
    _ensureJnmcMasterTemplate(sheet);

    // 2. Parse product values
    var vals = _parseProductValues(data.products);
    var totalLitres = _calcTotal(vals);
    var totalAmount = _calcAmount(vals);
    var curdQty = _n(data.products ? (data.products['CURD'] || data.products['Curd']) : 0);

    // 3. Find row (update existing customer or append before TOTAL)
    var targetRow = _findOrPrepareRow(sheet, customerCode);

    // 4. Write customer row
    var rowData = [
      parseFloat(customerCode) || customerCode, // Col A: code
      data.customerName || '',                  // Col B: Customer Name
      '',                                       // Col C: Landmark
      _fv(vals.TM_1000),                        // Col D
      _fv(vals.TM_500),                         // Col E
      _fv(vals.TM_200),                         // Col F
      _fv(vals.PURE_500),                       // Col G
      _fv(vals.PURE_LOOSE),                     // Col H
      _fv(vals.GOLD_500),                       // Col I
      _fv(vals.GOLD_LOOSE),                     // Col J
      _fv(vals.TM_LOOSE),                       // Col K
      _fv(vals.TEA_SPL_500),                    // Col L
      _fv(vals.TM_120),                         // Col M
      _fv(vals.SPECIAL_500),                    // Col N
      _fv(vals.SPECIAL_LOOSE),                  // Col O
      _fv(vals.TM_6L),                          // Col P
      _fv(vals.PM_6L),                          // Col Q
      _fv(vals.GM_6L),                          // Col R
      _fv(vals.COW_MILK),                       // Col S
      _fv(vals.STM_125),                        // Col T
      _fv(vals.THICK_500),                      // Col U
      _fv(vals.SPECIAL_6L),                     // Col V
      totalLitres,                              // Col W: Total (litres)
      totalAmount,                              // Col X: Amount (₹)
      _fv(curdQty)                              // Col Y: CURD
    ];

    sheet.getRange(targetRow, 1, 1, 25).setValues([rowData]);
    sheet.getRange(targetRow, 1).setFontWeight('bold');
    sheet.getRange(targetRow, 23).setFontWeight('bold');
    sheet.getRange(targetRow, 24).setFontWeight('bold');

    // 5. Update TOTAL, Crates, and Packets rows
    _updateJnmcTotals(sheet);

    SpreadsheetApp.flush();

    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        row: targetRow,
        customerCode: customerCode,
        totalLitres: totalLitres,
        amount: totalAmount
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// ─── ENSURE JNMC MASTER TEMPLATE (ROWS 1 TO 6) ──────────────────────────────
function _ensureJnmcMasterTemplate(sheet) {
  var headerCell = sheet.getRange(6, 1).getValue().toString();
  if (headerCell !== 'code') {
    sheet.clear();

    var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd-MM-yyyy');

    // Row 1: Top Headers (JNMC Row 1)
    var r1 = [
      'code', 'Customer Name', 'Landmark',
      'TM 1000', 'TM 500', 'TM 200', 'PURE 500', 'PURE LOOSE',
      'GOLD 500', 'GOLD LOOSE', 'TM LOOSE', 'TEA SPL 500', 'TM 120 ML',
      'SPECIAL 500', 'SPECIAL LOOSE', 'TM 6 LTRS', 'PM 6 LTRS', 'GM 6 LTRS',
      'COW MILK', 'STM 125', 'THICK 500', 'SPECIAL 6 LTRS',
      'Total', 'Amount', ''
    ];
    sheet.getRange(1, 1, 1, 25).setValues([r1]);
    sheet.getRange(1, 1, 1, 25).setBackground('#f1f5f9').setFontWeight('bold').setFontSize(9);

    // Row 2: Rates Row (JNMC Row 2)
    var r2 = [
      '', 'Rates', '',
      RATES.TM_1000, RATES.TM_500, RATES.TM_200, RATES.PURE_500, RATES.PURE_LOOSE,
      RATES.GOLD_500, RATES.GOLD_LOOSE, RATES.TM_LOOSE, RATES.TEA_SPL_500, RATES.TM_120,
      RATES.SPECIAL_500, RATES.SPECIAL_LOOSE, RATES.TM_6L, RATES.PM_6L, RATES.GM_6L,
      RATES.COW_MILK, RATES.STM_125, RATES.THICK_500, RATES.SPECIAL_6L, '', '', ''
    ];
    sheet.getRange(2, 1, 1, 25).setValues([r2]);
    sheet.getRange(2, 1, 1, 25).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold').setFontSize(9);

    // Row 3: Section Title (JNMC Row 3)
    sheet.getRange(3, 1).setValue('CITY SUPPLY - 1');
    sheet.getRange(3, 1, 1, 25).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold').setFontSize(11);

    // Row 4: Date & Agent info (JNMC Row 4)
    sheet.getRange(4, 1).setValue(today).setFontWeight('bold');
    sheet.getRange(4, 8).setValue('DAILY DISTRIBUTION');

    // Row 5: Column Codes Row (JNMC Row 5)
    sheet.getRange(5, 1, 1, 25).setValues([COL_CODES]);
    sheet.getRange(5, 1, 1, 25).setBackground('#dbeafe').setFontWeight('bold').setHorizontalAlignment('center').setFontSize(9);

    // Row 6: Main Column Headers (JNMC Row 6)
    sheet.getRange(6, 1, 1, 25).setValues([COL_HEADERS]);
    sheet.getRange(6, 1, 1, 25).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center').setFontSize(9);

    // Column widths matching JNMC layout
    sheet.setColumnWidth(1, 65);   // code
    sheet.setColumnWidth(2, 220);  // Customer Name
    sheet.setColumnWidth(3, 80);   // Landmark
    for (var c = 4; c <= 22; c++) { sheet.setColumnWidth(c, 65); }
    sheet.setColumnWidth(23, 75);  // Total
    sheet.setColumnWidth(24, 85);  // Amount
    sheet.setColumnWidth(25, 60);  // CURD

    sheet.setFrozenRows(6);
  }
}

// ─── FIND OR PREPARE ROW ────────────────────────────────────────────────────
function _findOrPrepareRow(sheet, customerCode) {
  var lastRow = sheet.getLastRow();

  // Search Row 7 onwards for existing customer
  for (var r = 7; r <= lastRow; r++) {
    var code = String(sheet.getRange(r, 1).getValue()).trim().split('.')[0];
    if (code === customerCode) {
      return r;
    }
  }

  // Insert before TOTAL row if present
  for (var r = 7; r <= lastRow; r++) {
    var name = String(sheet.getRange(r, 2).getValue()).trim();
    if (name.indexOf('TOTAL') >= 0) {
      sheet.insertRowBefore(r);
      return r;
    }
  }

  // Default: next row after headers
  return Math.max(7, lastRow + 1);
}

// ─── UPDATE TOTAL, CRATES & PACKETS ROWS (EXACT JNMC FORMAT) ────────────────
function _updateJnmcTotals(sheet) {
  var lastRow = sheet.getLastRow();

  // Find existing TOTAL row
  var totalRow = -1;
  for (var r = 7; r <= lastRow; r++) {
    var name = String(sheet.getRange(r, 2).getValue()).trim();
    if (name.indexOf('TOTAL') >= 0) {
      totalRow = r;
      break;
    }
  }

  if (totalRow === -1) {
    totalRow = lastRow + 1;
  }

  // Sum product quantities from Row 7 to totalRow - 1
  var sums = new Array(25).fill(0);
  var count = 0;

  for (var r = 7; r < totalRow; r++) {
    var codeVal = sheet.getRange(r, 1).getValue();
    if (codeVal !== '' && codeVal !== null) {
      count++;
      for (var c = 4; c <= 25; c++) {
        var v = parseFloat(sheet.getRange(r, c).getValue() || 0);
        if (!isNaN(v)) sums[c - 1] += v;
      }
    }
  }

  // 1. TOTAL row (bold yellow, matches JNMC Row 28)
  var totalRowData = new Array(25).fill('');
  totalRowData[1] = 'TOTAL 01';
  for (var c = 4; c <= 25; c++) {
    totalRowData[c - 1] = sums[c - 1] > 0 ? Math.round(sums[c - 1] * 1000) / 1000 : 0;
  }
  sheet.getRange(totalRow, 1, 1, 25).setValues([totalRowData]);
  sheet.getRange(totalRow, 1, 1, 25)
    .setBackground('#fef3c7').setFontColor('#92400e').setFontWeight('bold').setFontSize(10);

  // 2. Crates row (matches JNMC Row 30)
  var cratesRow = totalRow + 1;
  var cratesData = new Array(25).fill('');
  cratesData[1] = 'Crates';
  for (var i = 0; i < PRODUCT_KEYS.length; i++) {
    var c = i + 4;
    var tot = sums[c - 1];
    var size = CRATE_SIZES[PRODUCT_KEYS[i]] || 12;
    if (tot > 0) cratesData[c - 1] = Math.floor(tot / size);
  }
  sheet.getRange(cratesRow, 1, 1, 25).setValues([cratesData]);
  sheet.getRange(cratesRow, 1, 1, 25)
    .setBackground('#ecfdf5').setFontColor('#065f46').setFontWeight('bold').setFontSize(9);

  // 3. Packets row (matches JNMC Row 31)
  var packetsRow = totalRow + 2;
  var packetsData = new Array(25).fill('');
  packetsData[1] = 'Packets';
  for (var i = 0; i < PRODUCT_KEYS.length; i++) {
    var c = i + 4;
    var tot = sums[c - 1];
    var size = CRATE_SIZES[PRODUCT_KEYS[i]] || 12;
    if (tot > 0) {
      var rem = tot % size;
      packetsData[c - 1] = rem > 0 ? rem : 0;
    }
  }
  sheet.getRange(packetsRow, 1, 1, 25).setValues([packetsData]);
  sheet.getRange(packetsRow, 1, 1, 25)
    .setBackground('#fef2f2').setFontColor('#991b1b').setFontWeight('bold').setFontSize(9);
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
function _parseProductValues(p) {
  if (!p) p = {};
  return {
    TM_1000:       _n(p['TM 1000']),
    TM_500:        _n(p['TM 500']),
    TM_200:        _n(p['TM 200']),
    PURE_500:      _n(p['PURE 500']),
    PURE_LOOSE:    _n(p['PURE LOOSE']),
    GOLD_500:      _n(p['GOLD 500']),
    GOLD_LOOSE:    _n(p['GOLD LOOSE']),
    TM_LOOSE:      _n(p['TM LOOSE']),
    TEA_SPL_500:   _n(p['TEA SPL 500 ML'] || p['TEA SPL 500']),
    TM_120:        _n(p['TM 120 ML'] || p['TM 120']),
    SPECIAL_500:   _n(p['SPECIAL 500']),
    SPECIAL_LOOSE: _n(p['SPECIAL LOOSE']),
    TM_6L:         _n(p['TM 6 LTRS'] || p['TM 6L']),
    PM_6L:         _n(p['PM 6 LTRS'] || p['PM 6L']),
    GM_6L:         _n(p['GM 6 LTRS'] || p['GM 6L']),
    COW_MILK:      _n(p['COW MILK']),
    STM_125:       _n(p['STM 125']),
    THICK_500:     _n(p['THICK 500']),
    SPECIAL_6L:    _n(p['SPECIAL 6 LTRS'] || p['SPECIAL 6L'])
  };
}

function _n(v) {
  var n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function _fv(n) {
  return (n && n > 0) ? n : '';
}

function _calcTotal(v) {
  var t = v.TM_1000       * 1.0
        + v.TM_500        * 0.5
        + v.TM_200        * 0.2
        + v.PURE_500      * 0.5
        + v.PURE_LOOSE    * 1.0
        + v.GOLD_500      * 0.5
        + v.GOLD_LOOSE    * 1.0
        + v.TM_LOOSE      * 1.0
        + v.TEA_SPL_500   * 0.5
        + v.TM_120        * 0.12
        + v.SPECIAL_500   * 0.5
        + v.SPECIAL_LOOSE * 1.0
        + v.TM_6L         * 6.0
        + v.PM_6L         * 6.0
        + v.GM_6L         * 6.0
        + v.COW_MILK      * 1.0
        + v.STM_125       * 0.125
        + v.THICK_500     * 0.5
        + v.SPECIAL_6L    * 6.0;
  return Math.round(t * 1000) / 1000;
}

function _calcAmount(v) {
  var a = v.TM_1000       * RATES.TM_1000
        + v.TM_500        * (RATES.TM_500 / 2)
        + v.TM_200        * RATES.TM_200
        + v.PURE_500      * (RATES.PURE_500 / 2)
        + v.PURE_LOOSE    * RATES.PURE_LOOSE
        + v.GOLD_500      * (RATES.GOLD_500 / 2)
        + v.GOLD_LOOSE    * RATES.GOLD_LOOSE
        + v.TM_LOOSE      * RATES.TM_LOOSE
        + v.TEA_SPL_500   * (RATES.TEA_SPL_500 / 2)
        + v.TM_120        * RATES.TM_120
        + v.SPECIAL_500   * (RATES.SPECIAL_500 / 2)
        + v.SPECIAL_LOOSE * RATES.SPECIAL_LOOSE
        + v.TM_6L         * RATES.TM_6L
        + v.PM_6L         * RATES.PM_6L
        + v.GM_6L         * RATES.GM_6L
        + v.COW_MILK      * RATES.COW_MILK
        + v.STM_125       * RATES.STM_125
        + v.THICK_500     * (RATES.THICK_500 / 2)
        + v.SPECIAL_6L    * RATES.SPECIAL_6L;
  return Math.round(a * 100) / 100;
}

// Run this once manually from editor to build the template immediately
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  _ensureJnmcMasterTemplate(sheet);
  _updateJnmcTotals(sheet);
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', template: 'JNMC Master Heading' })).setMimeType(ContentService.MimeType.JSON);
}
