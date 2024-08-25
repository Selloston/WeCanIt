'use client'

// Import all assets
import Link from 'next/link'
import './page.css'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from "../firebase"
import { useRouter } from 'next/navigation'

// The default function
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("User logged in:", user);
                setError(""); 
                router.push('/');
                // Redirect or handle successful login
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
            });
    }

    return (
        <>
            <div className="body">
                <div className="contaner">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit} className="contanerinput">
                        <div className="contaneremail">
                            <h3>Email</h3>
                            <input 
                                className='email' 
                                type="email" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="contanerpassword">
                            <h3>Password</h3>
                            <input 
                                className='password' 
                                type="password" 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <input className='Login' type="submit" value="Login" />
                        {error && <p className="error">{error}</p>}
                    </form>
                    <p>Don't have an account? <span><Link className='Link' href="/Registar">Create Account</Link></span></p>
                </div>
            </div>
        </>
    )
}

// Export the default function
export default Login
