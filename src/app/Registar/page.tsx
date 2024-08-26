'use client'

// Import all assets
import Link from 'next/link'
import './Registar.css'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { app, auth } from "../firebase"
import { useRouter } from 'next/navigation'

// The default function
const Page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log("User signed up:", user);
                setError(""); // Clear any previous errors
                router.push('/WeCanIt'); // توجيه المستخدم إلى الصفحة المطلوبة
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
            });
    }

    return (
        <>
            <div className="bodyRegistar">
                <div className="contaner">
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit} className="contanerinput">
                        <div className="contaneremailregistar">
                            <h3>Email</h3>
                            <input 
                                className='emailRegistar' 
                                type="email" 
                                onChange={(e) => setEmail(e.target.value)}  
                            />
                        </div>
                        <div className="contanerpasswordregistar">
                            <h3>Password</h3>
                            <input 
                                className='passwordRegistar' 
                                type="password" 
                                onChange={(e) => setPassword(e.target.value)}  
                            />
                        </div>
                        <div className="contanerpasswordconfarm">
                            <h3>Confirm Password</h3>
                            <input 
                                className='passwordconfarm' 
                                type="password" 
                                onChange={(e) => setConfirmPassword(e.target.value)}  
                            />
                        </div>
                        <input className='Registar' type="submit" value="Register" />
                        {error && <p className="error">{error}</p>}
                    </form>
                    <p>Do you have an account? <span><Link className='Link' href="/Login">Login</Link></span></p>
                </div>
            </div>
        </>
    )
}

// Export the default function
export default Page