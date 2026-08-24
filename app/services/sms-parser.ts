/**
 * SMS Parser Service
 *
 * Parses bank/UPI SMS messages to extract transaction details and compute round-ups.
 * Works in two modes:
 *  1. Native SMS reading (requires custom dev build + react-native-get-sms-android)
 *  2. Manual entry fallback (works in Expo Go)
 */

import { Platform } from 'react-native';

export interface ParsedTransaction {
  amount: number;
  merchant: string;
  upiRef?: string;
  bankName?: string;
  smsBody?: string;
  smsTimestamp?: string;
  roundedAmount: number;
  roundUpDelta: number;
}

// ---------------------------------------------------------------------------
// Round-up math
// ---------------------------------------------------------------------------
export function computeRoundUp(amount: number): { roundedAmount: number; roundUpDelta: number } {
  if (amount <= 0) return { roundedAmount: amount, roundUpDelta: 0 };
  const roundedAmount = Math.ceil(amount / 10) * 10;
  const roundUpDelta = roundedAmount - amount;
  return { roundedAmount, roundUpDelta };
}

// ---------------------------------------------------------------------------
// SMS patterns for Indian banks and UPI apps
// ---------------------------------------------------------------------------
const SMS_PATTERNS: Array<{
  bankName: string;
  regex: RegExp;
  amountGroup: number;
  merchantGroup?: number;
  refGroup?: number;
}> = [
  // SBI: "₹26.00 debited from SBI A/c XXXXXX. Info: UPI/1234/ZOMATO"
  {
    bankName: 'SBI',
    regex: /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:debited|deducted).*?(?:at|to|for|info[:\s]+upi\/\d+\/)?\s*([A-Za-z0-9\s@_\-\.]{2,30})?/i,
    amountGroup: 1,
    merchantGroup: 2,
  },
  // HDFC: "Rs.26.00 debited from HDFC Bank A/c. UPI Ref No: 1234. Info: ZOMATO"
  {
    bankName: 'HDFC',
    regex: /(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{1,2})?)\s*debited.*?info[:\s]+([A-Za-z0-9\s@_\-\.]{2,30})/i,
    amountGroup: 1,
    merchantGroup: 2,
  },
  // ICICI: "Your A/c XXXX debited for INR 26.00 on UPI Ref 1234. Merchant: SWIGGY"
  {
    bankName: 'ICICI',
    regex: /debited for (?:INR|Rs\.?|₹)\s*([\d,]+(?:\.\d{1,2})?).*?(?:merchant[:\s]+)?([A-Za-z0-9\s@_\-\.]{2,30})?/i,
    amountGroup: 1,
    merchantGroup: 2,
  },
  // Axis: "INR 26.00 has been debited from your Axis Bank account. Payee: Zomato"
  {
    bankName: 'Axis Bank',
    regex: /(?:INR|Rs\.?|₹)\s*([\d,]+(?:\.\d{1,2})?)\s*has been debited.*?payee[:\s]+([A-Za-z0-9\s@_\-\.]{2,30})/i,
    amountGroup: 1,
    merchantGroup: 2,
  },
  // Paytm/PhonePe/GPay generic UPI: "₹26 paid to ZOMATO via UPI. Ref: 123456"
  {
    bankName: 'UPI',
    regex: /(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:paid|sent|transferred|debited)\s*(?:to|at)?\s*([A-Za-z0-9\s@_\-\.]{2,30})?\s*(?:via upi|upi)/i,
    amountGroup: 1,
    merchantGroup: 2,
  },
  // Generic debit fallback: "26.00 debited ... to MERCHANT"
  {
    bankName: 'Bank',
    regex: /([\d,]+(?:\.\d{1,2})?)\s*(?:has been\s*)?debited.*?(?:to|at|for|payee[:\s]+)\s*([A-Za-z0-9\s@_\-\.]{2,20})/i,
    amountGroup: 1,
    merchantGroup: 2,
  },
];

// UPI reference number pattern
const UPI_REF_REGEX = /(?:upi\s*ref|ref\s*no|ref)[:\s#]+(\d{10,20})/i;

// ---------------------------------------------------------------------------
// Parse a single SMS body
// ---------------------------------------------------------------------------
export function parseSMS(smsBody: string, smsTimestamp?: string): ParsedTransaction | null {
  if (!smsBody) return null;

  // Only process debit/payment messages — skip balance/credit/OTP
  const bodyLower = smsBody.toLowerCase();
  if (
    !bodyLower.includes('debit') &&
    !bodyLower.includes('paid') &&
    !bodyLower.includes('sent') &&
    !bodyLower.includes('debited') &&
    !bodyLower.includes('purchased')
  ) return null;

  // Skip OTPs, alerts, credit messages
  if (bodyLower.includes('otp') || bodyLower.includes('credited') || bodyLower.includes('received')) return null;

  for (const pattern of SMS_PATTERNS) {
    const match = smsBody.match(pattern.regex);
    if (match) {
      const rawAmount = match[pattern.amountGroup]?.replace(/,/g, '');
      const amount = parseFloat(rawAmount || '0');
      if (!amount || amount <= 0) continue;

      const merchant = (match[pattern.merchantGroup || 2] || 'Unknown Merchant').trim().replace(/[^a-zA-Z0-9\s]/g, '').trim();

      // Extract UPI ref if present
      const refMatch = smsBody.match(UPI_REF_REGEX);
      const upiRef = refMatch?.[1];

      const { roundedAmount, roundUpDelta } = computeRoundUp(amount);

      return {
        amount,
        merchant: merchant.length > 1 ? merchant : 'Unknown Merchant',
        upiRef,
        bankName: pattern.bankName,
        smsBody,
        smsTimestamp,
        roundedAmount,
        roundUpDelta,
      };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Manual transaction entry (Expo Go compatible)
// ---------------------------------------------------------------------------
export function createManualTransaction(
  amount: number,
  merchant: string = 'Manual Entry'
): ParsedTransaction {
  const { roundedAmount, roundUpDelta } = computeRoundUp(amount);
  return {
    amount,
    merchant,
    smsTimestamp: new Date().toISOString(),
    roundedAmount,
    roundUpDelta,
  };
}

// ---------------------------------------------------------------------------
// Native SMS reading (requires custom dev build + react-native-get-sms-android)
// Falls back gracefully if native module is not available.
// ---------------------------------------------------------------------------
export async function readRecentSMS(maxMessages: number = 50): Promise<ParsedTransaction[]> {
  if (Platform.OS !== 'android') {
    console.log('[SMS] SMS reading is Android-only');
    return [];
  }

  try {
    // Try to use native module if available (custom dev build)
    const SmsAndroid = require('react-native-get-sms-android');

    return new Promise((resolve) => {
      const filter = {
        box: 'inbox',
        maxCount: maxMessages,
        indexFrom: 0,
        // Only look at last 7 days
        minDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail: string) => {
          console.warn('[SMS] Failed to read SMS:', fail);
          resolve([]);
        },
        (count: number, smsList: string) => {
          try {
            const messages: Array<{ body: string; date: string }> = JSON.parse(smsList);
            const parsed: ParsedTransaction[] = [];

            for (const msg of messages) {
              const result = parseSMS(msg.body, new Date(parseInt(msg.date)).toISOString());
              if (result && result.roundUpDelta > 0) {
                parsed.push(result);
              }
            }

            resolve(parsed);
          } catch (e) {
            console.error('[SMS] Parse error:', e);
            resolve([]);
          }
        }
      );
    });
  } catch (e) {
    // Native module not available (Expo Go) — return empty, use manual entry
    console.log('[SMS] Native module not available. Use manual entry fallback.');
    return [];
  }
}
