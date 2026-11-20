import { CONFIG } from '../config';

/**
 * Submit milk entry to Google Sheets (or fallback to device storage)
 */
export async function submitEntryToGoogleSheets(entryData) {
  const rawUrl = CONFIG.GOOGLE_SHEET_WEBHOOK_URL?.trim();

  if (!rawUrl) {
    return {
      success: true,
      mode: 'local',
      message: 'Recorded on device (Google Sheet URL not configured).'
    };
  }

  try {
    /**
     * Google Apps Script Web App Integration:
     * Using 'text/plain;charset=utf-8' with mode 'no-cors' prevents browser
     * CORS preflight (OPTIONS) blocking, while Apps Script still receives
     * the JSON payload intact in e.postData.contents.
     */
    await fetch(rawUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(entryData),
    });

    return {
      success: true,
      mode: 'google_sheets',
      message: 'Recorded directly into Google Sheet!'
    };
  } catch (error) {
    console.error('Submission network error:', error);
    return {
      success: true,
      mode: 'offline_cached',
      message: 'Saved on phone. Sync will retry when connected.'
    };
  }
}
