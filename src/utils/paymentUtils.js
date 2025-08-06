// Utility functions for VNPay payment processing
import CryptoJS from 'crypto-js';

/**
 * Create VNPay date format (YYYYMMDDHHMMSS)
 */
export const createVNPayDateFormat = () => {
  return new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
};

/**
 * Remove Vietnamese accents from string
 */
export const removeVietnameseAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, d => d === 'đ' ? 'd' : 'D');
};

/**
 * Generate a unique transaction ID for VNPay
 * Format: VNPAY_YYYYMMDD_HHMMSS_RANDOM
 */
export const generateServiceId = () => {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  
  const timeStr = now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `LH_${dateStr}_${timeStr}_${random}`;
};

export const generateMedicalTestId = (orderId) => {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0');
  
  const timeStr = now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `XN_${dateStr}_${timeStr}_${random}_${orderId}`;
};

/**
 * Save appointment data to localStorage for later processing
 */
export const saveAppointmentData = (appointmentData) => {
  try {
    const transactionId = generateServiceId();
    const dataToStore = {
      ...appointmentData,
      transactionId,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(transactionId, JSON.stringify(dataToStore));
    return transactionId;
  } catch (error) {
    console.error('Error saving appointment data:', error);
    throw new Error('Không thể lưu dữ liệu đăng ký');
  }
};

/**
 * Get appointment data from localStorage
 */
export const getAppointmentData = (transactionId) => {
  try {
    const data = localStorage.getItem(transactionId);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting appointment data:', error);
    return null;
  }
};

/**
 * Clear appointment data from localStorage
 */
export const clearAppointmentData = () => {
  try {
    localStorage.removeItem('pendingAppointment');
  } catch (error) {
    console.error('Error clearing appointment data:', error);
  }
};

/**
 * Check if payment was successful based on VNPay response
 */
export const isPaymentSuccessful = (vnpayResponse) => {
  // VNPay success response typically includes 'vnp_ResponseCode' = '00'
  return vnpayResponse?.responseCode === '00';
};

/**
 * Extract payment result from VNPay callback URL parameters
 */
export const extractPaymentResult = (urlParams) => {
  return {
    responseCode: urlParams.get('vnp_ResponseCode'),
    transactionId: urlParams.get('vnp_TxnRef'),
    amount: urlParams.get('vnp_Amount'),
    bankCode: urlParams.get('vnp_BankCode'),
    orderInfo: urlParams.get('vnp_OrderInfo'),
    payDate: urlParams.get('vnp_PayDate'),
    transactionNo: urlParams.get('vnp_TransactionNo'),
    secureHash: urlParams.get('vnp_SecureHash'),
  };
};

/**
 * Create HMAC-SHA512 signature using CryptoJS
 */
export const createHMACSHA512 = (message, secret) => {
  try {
    const signature = CryptoJS.HmacSHA512(message, secret).toString();
    console.log('Message:', message);
    console.log('Secret:', secret);
    console.log('Generated Signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error creating HMAC-SHA512 signature:', error);
    throw new Error('Không thể tạo chữ ký số');
  }
};

/**
 * Create signing string according to VNPay standard
 */
export const createVNPaySignString = (params) => {
  // Loại bỏ vnp_SecureHash và vnp_SecureHashType nếu có
  const { vnp_SecureHash, vnp_SecureHashType, ...signData } = params;
  
  // Tạo chuỗi để ký theo thứ tự alphabet
  const signString = Object.keys(signData)
    .sort()
    .filter(key => signData[key] !== '' && signData[key] != null)
    .map(key => `${key}=${signData[key]}`)
    .join('&');
  
  console.log('VNPay Sign String:', signString);
  return signString;
};

/**
 * Create HMAC-SHA512 signature for VNPay
 */
export const createVNPaySignature = (params, hashSecret) => {
  console.log('VNPay Parameters:', params);
  
  // Tạo chuỗi để ký theo chuẩn VNPay
  const signString = createVNPaySignString(params);
  
  // Tạo HMAC-SHA512 signature sử dụng CryptoJS
  const signature = createHMACSHA512(signString, hashSecret);
  
  return signature;
};

/**
 * Validate VNPay signature
 */
export const validateVNPaySignature = (params, hashSecret) => {
  const receivedSignature = params.vnp_SecureHash;
  const calculatedSignature = createVNPaySignature(params, hashSecret);
  
  return receivedSignature === calculatedSignature;
};

/**
 * Debug function to check VNPay parameters order
 */
export const debugVNPayParams = (params) => {
  const sortedKeys = Object.keys(params).sort();
  console.log('VNPay Parameters (sorted):');
  sortedKeys.forEach(key => {
    console.log(`${key}=${params[key]}`);
  });
  return sortedKeys;
};

/**
 * Create VNPay payment URL with proper HMAC-SHA512 signature
 */
export const createVNPayPaymentUrl = (transactionId, amount, orderInfo) => {
  // VNPay configuration - nên đặt trong environment variables
  const TMN_CODE = '4A8BAT9U'; // Thay bằng process.env.REACT_APP_VNPAY_TMN_CODE
  const HASH_SECRET = 'JVFMDDIWCPRYPKKDEHDIAILWLRWXETSN'; // Thay bằng process.env.REACT_APP_VNPAY_HASH_SECRET
  const VNPAY_URL = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  
  const baseUrl = window.location.origin;
  const returnUrl = `${baseUrl}/payment/callback`;
  const createDate = createVNPayDateFormat();
  
  // Tạo parameters cho VNPay
  const vnpayParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: TMN_CODE,
    vnp_Amount: amount,
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_TxnRef: transactionId,
    vnp_ReturnUrl: returnUrl,
  };
  
  // Debug: Kiểm tra thứ tự tham số
  debugVNPayParams(vnpayParams);
  
  // Tạo chữ ký số HMAC-SHA512
  const secureHash = createVNPaySignature(vnpayParams, HASH_SECRET);
  
  // Tạo URL với chữ ký số - sắp xếp theo thứ tự alphabet
  const queryString = Object.keys(vnpayParams)
    .sort() // Sắp xếp theo thứ tự alphabet
    .map(key => `${key}=${encodeURIComponent(vnpayParams[key])}`)
    .join('&');
  
  const vnpayUrl = `${VNPAY_URL}?${queryString}&vnp_SecureHash=${secureHash}`;
  
  console.log('Generated VNPay URL:', vnpayUrl);
  
  return vnpayUrl;
};

/**
 * Process VNPay callback and validate signature
 */
export const processVNPayCallback = (urlParams) => {
  const HASH_SECRET = 'JVFMDDIWCPRYPKKDEHDIAILWLRWXETSN'; // Thay bằng process.env.REACT_APP_VNPAY_HASH_SECRET
  
  // Chuyển URLSearchParams thành object
  const params = {};
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  
  // Validate signature
  const isValidSignature = validateVNPaySignature(params, HASH_SECRET);
  
  if (!isValidSignature) {
    throw new Error('Chữ ký số không hợp lệ');
  }
  
  return extractPaymentResult(urlParams);
};

/**
 * Test VNPay signature with correct data
 */
export const testVNPaySignatureWithCorrectData = () => {
  const params = {
    vnp_Amount: '25000000',
    vnp_Command: 'pay',
    vnp_CreateDate: '20250804100005',
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: 'Thanh toan dich vu: 45',
    vnp_OrderType: 'other',
    vnp_ReturnUrl: 'http://localhost:5173/payment/callback',
    vnp_TmnCode: '4A8BAT9U',
    vnp_TxnRef: 'LH_20250804_170005_HERBXE',
    vnp_Version: '2.1.0'
  };
  
  const HASH_SECRET = 'JVFMDDIWCPRYPKKDEHDIAILWLRWXETSN';
  const correctSignature = 'c879e8eba84a687ddcecdec7c9da7ebf87b91f67e8d32e13d5e318c4f77cc0bc92853eb251d1ae56fcb37dd5a074dc94bdf25313547c08f3b8076bcf5ef1d118';
  
  console.log('=== Testing VNPay Signature Generation with CryptoJS ===');
  console.log('Correct Signature:', correctSignature);
  
  // Test với CryptoJS
  const signString = createVNPaySignString(params);
  const signature = createHMACSHA512(signString, HASH_SECRET);
  console.log('Generated Signature:', signature);
  console.log('Matches correct:', signature === correctSignature);
  
  return {
    signString,
    signature,
    correctSignature,
    matches: signature === correctSignature
  };
}; 