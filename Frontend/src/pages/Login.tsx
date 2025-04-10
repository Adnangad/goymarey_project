import '../App.css'
import logo from '../static/logo_2.png';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import ErrorPage from './Error.tsx';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const login_url = "https://goymarey-project.onrender.com/graphql";
    const navigate = useNavigate();

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const query = ` query {
        login(email: "${email}", password: "${password}") {
            id
            name
            email
            imageUrl
            }
        }`;
        if (!email || !password) {
            setErrorMessage("Please fill in all of the fields");
            setShowError(true);
        }
        try {
            const response = await fetch(login_url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            const rez = await response.json();
            if (rez.errors) {
                setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                setShowError(true);
            }
            else {
                console.log("Success:", rez.data);
                sessionStorage.setItem('user_data', JSON.stringify(rez.data.login));
                navigate("/home")
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setErrorMessage("Something went wrong with the server.");
            setShowError(true);
        }
    }
    if (showError) {
        return <ErrorPage message={errorMessage} onClose={() => setShowError(false)} />;
    }
    return (
        <>
            <div className='flex justify-center items-center h-screen bg-blue-500'>
                <div className="max-w-4xl max-sm:max-w-lg mx-auto p-6 mt-2 shadow bg-white rounded-2xl">
                    <div className='max-w-4xl max-sm:max-w-lg mx-auto p-6 text-center'>
                        <a href='#'>
                            <img src={logo} alt='logo' className='w-44 inline-block rounded-full'></img>
                        </a>
                        <h3 className='text-slate-800  mt-6 text-xl'>Sign Up for an Account</h3>
                    </div>
                    <form onSubmit={login}>
                        <div className='grid sm:grid-cols-2 gap-8'>
                            <div>
                                <label className='text-slate-800 text-sm font-medium mb-2 block'>Email</label>
                                <div className="relative">
                                    <input
                                        type='email'
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 pr-10 rounded focus:bg-transparent outline-blue-500 transition-all'
                                        placeholder="Enter Email"
                                    />
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-slate-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-slate-100 w-full text-slate-800 text-sm px-4 py-3 pr-10 rounded focus:bg-transparent outline-blue-500 transition-all"
                                        placeholder="Enter password"
                                    />
                                    <div
                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-5 h-5 text-slate-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12">
                            <button type="submit" className="mx-auto w-2xl block py-3 px-6 text-sm font-medium tracking-wider rounded text-white bg-blue-600 hover:bg-blue-200 focus:outline-none cursor-pointer">
                                Login
                            </button>
                        </div>
                        <div>
                            <h4>Not a member?<Link to="/signup" className='text-fuchsia-700'>Register</Link></h4>
                        </div>
                    </form >
                </div >
            </div>
        </>
    )
}
export default Login