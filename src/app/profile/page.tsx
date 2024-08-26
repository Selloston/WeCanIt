'use client';

import { useState, useEffect } from 'react';
import { auth, firestore, storage } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; 
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

interface ProfilProps {
    users: User | null;
    onLogout: () => void;
}

const Profile: React.FC<ProfilProps> = ({ users ,onLogout }) => {
    const [user, setUser] = useState<any>(null);
    const [newDisplayName, setNewDisplayName] = useState<string>('');
    const [photoURL, setPhotoURL] = useState<string>('https://via.placeholder.com/150');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setNewDisplayName(currentUser.displayName || '');
                setPhotoURL(currentUser.photoURL || 'https://via.placeholder.com/150');
                fetchUserProfile(currentUser.uid);
            } else {
                setPhotoURL('https://via.placeholder.com/150');
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserProfile = async (uid: string) => {
        try {
            const docRef = doc(firestore, 'users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setPhotoURL(data.photoURL || 'https://via.placeholder.com/150');
            } else {
                console.log('No document found for user:', uid);
            }
        } catch (error) {
            console.error('Error fetching user profile:', (error as Error).message);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) {
            setError('No user is currently signed in.');
            return;
        }

        try {
            let updatedPhotoURL = photoURL;

            // إذا تم اختيار صورة، قم بتحميلها
            if (selectedFile) {
                const storageRef = ref(storage, `profilePictures/${user.uid}/${selectedFile.name}`);
                const uploadResult = await uploadBytes(storageRef, selectedFile);
                updatedPhotoURL = await getDownloadURL(uploadResult.ref);

                // تخزين عنوان URL للصورة في Firestore
                const userRef = doc(firestore, 'users', user.uid);
                await setDoc(userRef, { photoURL: updatedPhotoURL }, { merge: true });
            }

            // تحديث صورة الملف الشخصي واسم العرض في Firebase Authentication
            await updateProfile(user, {
                displayName: newDisplayName,
                photoURL: updatedPhotoURL
            });

            // تحديث الحالة المحلية بعد النجاح
            setPhotoURL(updatedPhotoURL);
            setError(null);
            router.push('/profile');
        } catch (error) {
            console.error('Error updating profile:', (error as Error).message);
            setError('Error updating profile. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            // تنفيذ عملية تسجيل الخروج
            await signOut(auth); // تنفيذ أي إجراءات بعد تسجيل الخروج
            router.push('/'); // توجيه المستخدم إلى الصفحة المحددة بعد تسجيل الخروج
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            <img
                src={photoURL}
                alt="Profile"
                className="profile-image"
                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
            <div>
                <label>
                    Display Name:
                    <input
                        type="text"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                    />
                </label>
                <label>
                    Upload Photo:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                <button onClick={handleUpdateProfile}>Update Profile</button>
                {error && <p className="error">{error}</p>}
                <button onClick={handleLogout} className="logout-button">Logout</button>
                <Link href="/WeCanIt" className='Link'>Back</Link>
            </div>
        </div>
    );
};

export default Profile;
