import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // إضافة استيراد Firebase Storage

// أدخل تفاصيل إعدادات Firebase الخاصة بك هنا
const firebaseConfig = {
  apiKey: "AIzaSyAuYNvJ-ETbd7tzXTg4jfTeNu4MNtgdhBQ",
  authDomain: "wecanit-1d9ed.firebaseapp.com",
  projectId: "wecanit-1d9ed",
  storageBucket: "wecanit-1d9ed.appspot.com",
  messagingSenderId: "1087655477696",
  appId: "1:1087655477696:web:b7cd87bf9221c5ece04825"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// الحصول على المثيلات المختلفة
export {app}
export const auth = getAuth(app);
export const storage = getStorage(app);// إضافة تصدير Firebase Storage
