import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../App.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorPage from './Error.tsx';

interface User {
    id: number;
    name: string;
    imageUrl?: string;
    email: string;
    followersCount: number;
    followingCount: number;
}

export default function Settings() {
    let user: User | null = null;
    try {
        const userData = sessionStorage.getItem("user_data");
        user = userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        user = null;
    }

    const [username, setUsername] = useState(user?.name);
    const [profileImage, setProfileImage] = useState(user?.imageUrl || '');
    const [newImage, setNewImage] = useState<File | null>(null);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0]);
            setProfileImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let uploadedImageUrl = profileImage;

            if (newImage) {
                const formData = new FormData();
                formData.append('file', newImage);
                formData.append('upload_preset', 'upload_pfp');

                const res = await axios.post(
                    'https://api.cloudinary.com/v1_1/dmqmqd2m9/image/upload',
                    formData
                );
                uploadedImageUrl = res.data.secure_url;
            }

            const url = "https://goymarey-project.onrender.com/graphql";
            const query = `
                mutation {
                    updateUser(user_id: "${user?.id}", name: "${username}", imageUrl: "${uploadedImageUrl}"){
                        id
                        name
                        email
                        imageUrl
                        followersCount
                        followingCount
                    }
                }
            `;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });

            const rez = await response.json();

            if (rez.errors) {
                setErrorMessage("Error: " + rez.errors[0]?.message || "Something went wrong.");
            } else {
                setProfileImage(rez.data.updateUser.imageUrl); 
            }

        } catch (err) {
            console.error("Upload error:", err);
            setErrorMessage("Image upload failed.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const url = "https://goymarey-project.onrender.com/graphql";
            const query = `
                    mutation {
                        deleteUser(email: "${email}", password: "${password}"){
                            success
                            message
                        }
                    }
                `;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            const rez = await response.json();
            if (rez.errors) {
                setErrorMessage("Error: " + rez.errors[0]?.message || "Something went wrong."); // Set the error message
            } else {
                setIsModalOpen(false);
                sessionStorage.removeItem("user_data");
                navigate("/");
            }

        } catch (err) {
            console.error("Upload error:", err);
            setErrorMessage("Unable to delete your account at this time"); // Set the error message
        }
    };

    return (
        <div className="bg-blue-950 h-screen">
            <div className='grid grid-cols-12 gap-10 pl-3 h-full'>
                {/* Sidebar (Left Navigation) */}
                <nav className="col-span-2 bg-gray-800 text-white p-4 h-screen sticky top-0">
                    <div className="space-y-4">
                        <Link to={'/home'} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition">
                            {/* Home Icon */}
                            <span>Home</span>
                        </Link>
                        <Link to={`/profile/${user?.id}`} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition">
                            {/* Profile Icon */}
                            <span>Profile</span>
                        </Link>
                        <Link to={'/settings'} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition bg-blue-700">
                            {/* Settings Icon */}
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>

                <div className="col-span-10 bg-white shadow-lg flex flex-col h-full">
                    {/* Settings Form */}
                    <div className="p-8">
                        <h3 className="text-2xl font-semibold mb-4">Edit Profile</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Edit Username */}
                            <div>
                                <label htmlFor="username" className="block text-lg font-medium">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                    placeholder="Enter new username"
                                />
                            </div>

                            {/* Change Profile Picture */}
                            <div>
                                <label htmlFor="profilePicture" className="block text-lg font-medium">Profile Picture</label>
                                <input
                                    id="profilePicture"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full p-3 border border-gray-300 rounded-md"
                                />
                                {profileImage && (
                                    <p className="mt-2 text-sm text-gray-500">Preview:</p>
                                )}
                                {profileImage && <img src={profileImage} alt="Profile Preview" className="w-32 h-32 mt-2 rounded-full object-cover" />}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 !cursor-pointer text-white py-2 rounded-md hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>

                        {/* Delete Account Button */}
                        <div className="mt-8">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 cursor-pointer"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>

                    {/* Modal for Delete Confirmation */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white p-8 rounded-lg w-96">
                                <h3 className="text-2xl font-semibold mb-4">Confirm Account Deletion</h3>
                                <p className="mb-4 text-gray-600">To delete your account, please enter your email and password.</p>

                                <form onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-lg font-medium">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="block text-lg font-medium">Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            type="submit"
                                            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 cursor-pointer"
                                        >
                                            Confirm Deletion
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Error Page (if error occurs) */}
                    {errorMessage && (
                        <ErrorPage
                            message={errorMessage}
                            onClose={() => setErrorMessage(null)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
