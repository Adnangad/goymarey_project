import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import OtherProf from './OtherProf.tsx';
import { Atom } from 'react-loading-indicators';
import "../App.css";
import ErrorPage from './Error.tsx';

interface User {
    id: number;
    name: string;
    imageUrl?: string;
    email: string;
    followersCount: number;
    followingCount: number;
}


interface Post {
    id: number;
    user: User;
    content: string;
    likes: number;
    _count: number,
    created_at: string;
}

function Profile() {
    let { profId } = useParams();
    const user = JSON.parse(sessionStorage.getItem("user_data") || '{}');
    const [userDet, setUserDet] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [otherUsers, setOtherUsers] = useState<User[]>([]);

    const [activeTab, setActiveTab] = useState("posts");

    async function deletePost(post_id: Number) {
        try {
            const url = "https://goymarey-project.onrender.com/graphql";
            const query = `
                mutation {
                    deletePost(post_id: "${post_id}") {
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
                setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                setShowError(true);
            } else {
                window.location.reload();
            }
        } catch (err) {
            setErrorMessage("Network Error, Try Again Later.");
            setShowError(true);
        }

    }
    async function unfollow(person_id: Number) {
        try {
            const url = "https://goymarey-project.onrender.com/graphql";
            const query = `
                mutation {
                    unfollow(user_id: "${user.id}", unfollow_id: "${person_id}") {
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
                console.error("GraphQL errors:", rez.errors);
                setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                setShowError(true);
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setErrorMessage("Network Error, Try Again Later");
            setShowError(true);
        }
    }
    async function follow(person_id: Number) {
        try {
            const url = "https://goymarey-project.onrender.com/graphql";
            const query = `
                mutation {
                    follow(user_id: "${user.id}", follow_id: "${person_id}") {
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
                console.error("GraphQL errors:", rez.errors);
                setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                setShowError(true);
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setErrorMessage("Network Error, Try again Later");
            setShowError(true);
        }
    }

    useEffect(() => {
        async function getInfo() {
            try {
                const url = "https://goymarey-project.onrender.com/graphql";
                const query = `
                    query {
                        user(id: "${profId}"){
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
                    console.error("GraphQL errors:", rez.errors);
                    setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                    setShowError(true);
                } else {
                    setUserDet(rez.data.user);
                    console.log(rez.data.user);
                    if (!userDet) return <div>Loading...</div>;
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorMessage("Network Error");
                setShowError(true);
            }
        }
        async function getMyposts() {
            try {
                setLoading(true);
                const url = "https://goymarey-project.onrender.com/graphql";
                const query = `
                    query {
                        postsByUser(user_id: "${profId}") {
                            id
                            content
                            created_at
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
                    console.error("GraphQL errors:", rez.errors);
                    setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                    setShowError(true);
                } else {
                    setMyPosts(rez.data.postsByUser);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorMessage("Network Error");
                setShowError(true);
            } finally {
                setLoading(false);
            }

        }
        async function getfollowers() {
            try {
                setLoading(true);
                const url = "https://goymarey-project.onrender.com/graphql";
                const query = `
                    query {
                        followers(user_id: "${profId}") {
                            id
                            name
                            email
                            imageUrl
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
                    console.error("GraphQL errors:", rez.errors);
                    setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                    setShowError(true);
                } else {
                    setFollowers(rez.data.followers);
                    console.log(typeof (rez.data.followers));

                }
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorMessage("Something went wrong with the server");
                setShowError(true);
            } finally {
                setLoading(false);
            }

        }
        async function getfollowing() {
            try {
                setLoading(true);
                const url = "https://goymarey-project.onrender.com/graphql";
                const query = `
                    query {
                        following(user_id: "${profId}") {
                            id
                            name
                            email
                            imageUrl
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
                    console.error("GraphQL errors:", rez.errors);
                    setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                    setShowError(true);
                } else {
                    setFollowing(rez.data.following);
                    console.log(typeof (rez.data.following))
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorMessage("Something went wrong with the server");
                setShowError(true);
            } finally {
                setLoading(false);
            }
        }
        async function otherUsers() {
            try {
                const url = "https://goymarey-project.onrender.com/graphql";
                const query = `
                    query {
                        users {
                            id
                            name
                            email
                            imageUrl
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
                    console.error("GraphQL errors:", rez.errors);
                    setErrorMessage(rez.errors[0]?.message || "Something went wrong.");
                    setShowError(true);
                } else {
                    setOtherUsers(rez.data.users);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorMessage("Something went wrong with the server");
                setShowError(true);
            }
        }
        getMyposts();
        getfollowers();
        otherUsers();
        getfollowing();
        getInfo();
    }, [profId]);

    const handleTabSwitch = (tab: string) => {
        setActiveTab(tab);
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="flex flex-col items-center space-y-4">
                    <Atom color="#33b8ff" size="large" text="Loading..." textColor="#33b8ff" />
                </div>
            </div>
        );
    }
    if (showError) {
        return <ErrorPage message={errorMessage} onClose={() => setShowError(false)} />;
    }
    else if (profId === user.id) {
        return (
            <div className="bg-blue-950 h-screen">
                <div className='grid grid-cols-12 gap-10 pl-3 h-full'>
                    {/* Sidebar (Left Navigation) */}
                    <nav className="col-span-2 bg-gray-800 text-white p-4 h-screen sticky top-0">
                        <div className="space-y-4">
                            <Link to={'/home'} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                                <span>Home</span>
                            </Link>
                            <Link to={`/profile/${user.id}`} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition bg-blue-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <span>Profile</span>
                            </Link>
                            <Link to={'/settings'} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>

                                <span>Settings</span>
                            </Link>
                        </div>
                    </nav>

                    {/* Main Content Section */}
                    <div className="col-span-10 bg-white shadow-lg flex flex-col h-full">
                        {/* Profile Header */}
                        <div className="p-8 bg-blue-200 flex justify-between items-center">
                            <div className="flex items-center">
                                <img
                                    src={userDet?.imageUrl}
                                    alt={`${userDet?.name}'s profile`}
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                                <div className="ml-6">
                                    <h2 className="text-3xl font-semibold">{userDet?.name}</h2>
                                    <p className="text-lg text-gray-600">{userDet?.email}</p>
                                    <div className="mt-4">
                                        <span className="mr-4 font-medium">Followers: {userDet?.followersCount}</span>
                                        <span className="font-medium">Following: {userDet?.followingCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="p-4 bg-gray-100 flex space-x-4 border-b">
                            <button
                                onClick={() => handleTabSwitch("posts")}
                                className={`px-6 py-2 rounded-md cursor-pointer text-lg ${activeTab === "posts" ? "bg-blue-600 text-white" : "bg-transparent text-blue-600"}`}
                            >
                                My Posts
                            </button>
                            <button
                                onClick={() => handleTabSwitch("followers")}
                                className={`px-6 py-2 rounded-md cursor-pointer text-lg ${activeTab === "followers" ? "bg-blue-600 text-white" : "bg-transparent text-blue-600"}`}
                            >
                                Followers
                            </button>
                            <button
                                onClick={() => handleTabSwitch("following")}
                                className={`px-6 py-2 rounded-md cursor-pointer text-lg ${activeTab === "following" ? "bg-blue-600 text-white" : "bg-transparent text-blue-600"}`}
                            >
                                Following
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-hidden p-8 bg-gray-100">
                            {activeTab === "posts" && (
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-semibold mb-4">My Posts</h3>
                                    <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
                                        {myPosts.map((post) => (
                                            <div key={post.id} className="border p-4 rounded-lg shadow-md">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">P</div>
                                                    <div className="ml-4">
                                                        <p className="font-medium">{post.content}</p>
                                                        <p className="text-sm text-gray-500">Date Posted: {post.created_at}</p>
                                                    </div>
                                                    <div><button
                                                        onClick={() => deletePost(post.id)}
                                                        className="px-6 py-2 rounded-md ml-120 cursor-pointer text-lg bg-blue-600 text-white hover:bg-red-600">Delete Post
                                                    </button></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === "followers" && (
                                <div className="flex flex-col">
                                    <div className="grid grid-cols-1 gap-4 max-h-79 overflow-y-auto">
                                        {followers.length === 0 ? (
                                            <h3 className="text-xl font-semibold mb-4">You Have 0 Followers</h3>) : (
                                            followers.map((followr) => (
                                                <div key={followr.id} className="border p-4 rounded-lg shadow-md">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            {followr.imageUrl ? (
                                                                <Link to={`/profile/${followr.id}`}>
                                                                    <img src={followr.imageUrl} alt={`${followr.name}'s profile`} className="w-12 h-12 rounded-full object-cover" />
                                                                </Link>
                                                            ) : (
                                                                <Link to={`/profile/${followr.id}`}>
                                                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                                        {followr.name[0]}
                                                                    </div>
                                                                </Link>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <p className="font-medium">{followr.name}</p>
                                                            <p className="text-sm text-gray-500">{followr.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                            {activeTab === "following" && (
                                <div className="flex flex-col">
                                    <div className="grid grid-cols-1 gap-4 max-h-79 overflow-y-auto">
                                        {following.length === 0 ? (
                                            <>
                                                <h3 className="text-xl font-semibold mb-4">You are yet to follow someone, below are some suggestions</h3>
                                                {otherUsers.filter((others) => others.id !== user.id).map((others) => (
                                                    <div key={others.id} className="border p-4 rounded-lg shadow-md">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0">
                                                                {others.imageUrl ? (
                                                                    <Link to={`/profile/${others.id}`}>
                                                                        <img src={others.imageUrl} alt={`${others.name}'s profile`} className="w-12 h-12 rounded-full object-cover" />
                                                                    </Link>
                                                                ) : (
                                                                    <Link to={`/profile/${others.id}`}>
                                                                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                                            {others.name[0]}
                                                                        </div>
                                                                    </Link>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <p className="font-medium">{others.name}</p>
                                                                <p className="text-sm text-gray-500">{others.email}</p>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    onClick={() => follow(others.id)}
                                                                    className="px-6 py-2 rounded-md ml-140 cursor-pointer text-lg bg-blue-600 text-white hover:bg-green-600"
                                                                >
                                                                    Follow
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            following.map((follo) => (
                                                <div key={follo.id} className="border p-4 rounded-lg shadow-md">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            {follo.imageUrl ? (
                                                                <Link to={`/profile/${follo.id}`}>
                                                                    <img src={follo.imageUrl} alt={`${follo.name}'s profile`} className="w-12 h-12 rounded-full object-cover" />
                                                                </Link>
                                                            ) : (
                                                                <Link to={`/profile/${follo.id}`}>
                                                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                                        {follo.name[0]}
                                                                    </div>
                                                                </Link>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <p className="font-medium">{follo.name}</p>
                                                            <p className="text-sm text-gray-500">{follo.email}</p>
                                                        </div>
                                                        <div>
                                                            <button
                                                                onClick={() => unfollow(follo.id)}
                                                                className="px-6 py-2 rounded-md ml-140 cursor-pointer text-lg bg-blue-600 text-white hover:bg-red-600"
                                                            >
                                                                Unfollow
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <OtherProf></OtherProf>
        )
    }
}

export default Profile;
