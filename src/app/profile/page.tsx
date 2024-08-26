'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // تأكد من المسار الصحيح
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // تأكد من المسار الصحيح
import Link from 'next/link';

const Profile: React.FC = () => {
    const user = auth.currentUser;
    const [newDisplayName, setNewDisplayName] = useState<string>(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState<string>(user?.photoURL || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setPhotoURL(user.photoURL || '');
        }
    }, [user]);

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
            let updatedPhotoURL = user.photoURL || '';

            // إذا تم اختيار صورة، قم بتحميلها
            if (selectedFile) {
                const storageRef = ref(storage, `profilePictures/${user.uid}/${selectedFile.name}`);
                const uploadResult = await uploadBytes(storageRef, selectedFile);
                updatedPhotoURL = await getDownloadURL(uploadResult.ref);
            }

            // تحديث صورة الملف الشخصي واسم العرض في Firebase Authentication
            await updateProfile(user, {
                displayName: newDisplayName,
                photoURL: updatedPhotoURL
            });

            // تحديث الحالة المحلية بعد النجاح
            setPhotoURL(updatedPhotoURL);
            setError(null);
            router.push('/profile'); // أو إلى صفحة الملف الشخصي بعد التحديث
        } catch (error) {
            console.error('Error updating profile:', (error as Error).message);
            setError('Error updating profile. Please try again.');
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            <img
                src={photoURL || 'https://via.placeholder.com/150'}
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
                <Link href="/WeCanIt" className='Link'>Back</Link>
            </div>
        </div>
    );
};

export default Profile;
