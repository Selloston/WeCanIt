'use client'

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth'; // تأكد من استيراد User
import { auth } from "@/app/firebase"; // تأكد من أن المسار صحيح
import { Header, Container } from './components/index';

const App = () => {
    const [user, setUser] = useState<User | null>(null); // تحديد نوع الحالة كـ User أو null

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); // user هو من نوع User
            } else {
                setUser(null); // null يتطابق مع النوع المحدد
            }
        });

        return () => unsubscribe(); // تنظيف الاشتراك عند فك التركيب
    }, []);

    const handleLogout = () => {
        signOut(auth).then(() => {
            // إعادة توجيه إلى الصفحة الرئيسية بعد تسجيل الخروج
            window.location.href = '/';
        }).catch((error) => {
            console.error('Sign out error:', error.message);
        });
    };

    return (
        <>
            <Header user={user} onLogout={handleLogout} />
            <Container />
        </>
    );
}

export default App;
