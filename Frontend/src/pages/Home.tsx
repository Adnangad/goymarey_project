import { Link } from 'react-router-dom';
import '../App.css';
import LikeButton from './Like.tsx';
import { useState, useEffect } from 'react';
import { Atom } from 'react-loading-indicators';
import ErrorPage from './Error.tsx';

interface User {
    id: number;
    name: string;
    imageUrl?: string;
    email: string;
}


interface Post {
    id: number;
    user: User;
    content: string;
    likes: number;
    _count: {
        Like: number
    },
}

function Home() {
    const [all_posts, setAllposts] = useState<Post[]>([]);
    const [following_posts, setFollowingPosts] = useState<Post[]>([]);
    const [showAllPosts, setShowAllPosts] = useState(true);
    const [contents, setContent] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('user_data') || '{}');

    async function handleLikeChange(postid: number, userid: number) {
        try {
            const url = "http://localhost:4000/graphql";
            const query = `
                mutation {
                    like(post_id: "${postid}", user_id: "${userid}") {
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
                console.log("Success:", rez.data);
                window.location.reload();
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setErrorMessage("Network Error, Try again later.");
            setShowError(true);
        }
    }

    async function post() {
        try {
            if (!contents) {
                alert("Post must not be empty");
                return;
            }
            const url = "http://localhost:4000/graphql";
            const query = `
                mutation {
                    createPost(content: "${contents}", user_id: "${user.id}") {
                        id
                        content
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
                console.log("Success:", rez.data);
                window.location.reload();
            }
        } catch (err) {
            setErrorMessage("Network error. Try again later.");
            setShowError(true);
        }
    }

    useEffect(() => {
        setLoading(true);
        async function getAllPost() {
            try {
                const url = "http://localhost:4000/graphql";
                const query = `
                    query {
                        posts {
                            id
                            content
                            likes
                            user {
                                id
                                name
                                imageUrl
                            }
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
                    setAllposts(rez.data.posts);
                    console.log(rez.data.posts);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorMessage("Network error. Try again later.");
                setShowError(true);
            } finally {
                setLoading(false);
            }
        }

        async function getFollow() {
            try {
                const url = "http://localhost:4000/graphql";
                const query = `
                    query {
                        postsByFollowing(user_id: "${user.id}"){
                            id
                            content
                            user {
                                id
                                name
                                email
                                imageUrl
                            }
                            _count {
                                Like
                            }
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
                    setFollowingPosts(rez.data.postsByFollowing);
                    console.log(rez.data.postsByFollowing);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setErrorMessage("Network error. Try again later.");
                setShowError(true);
            }
        }

        getAllPost();
        getFollow();
    }, [user.id]);

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
    return (
        <div className="bg-blue-950 h-screen">
            <div className='grid grid-cols-12 gap-10 pl-3 h-full'>
                {/* Sidebar (Left Navigation) */}
                <nav className="col-span-2 bg-gray-800 text-white p-4 h-full sticky top-0">
                    <div className="space-y-4">
                        <Link to={'/home'} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition bg-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span>Home</span>
                        </Link>
                        <Link to={`/profile/${user.id}`} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition">
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

                <div className='col-span-10 bg-white shadow-lg flex flex-col justify-between h-full overflow-scroll'>
                    <div className="flex items-center gap-4 px-4 pt-4 sticky top-0 bg-white z-10">
                        <input
                            type="text" value={contents} onChange={(e) => { setContent(e.target.value) }}
                            placeholder="What's on your mind?"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
                            onClick={post}
                        >
                            Post
                        </button>
                    </div>

                    <div className="flex justify-between space-x-8 px-4 py-2">
                        <button
                            onClick={() => setShowAllPosts(true)}
                            className={`text-xl font-semibold cursor-pointer ${showAllPosts ? "text-blue-600" : "text-gray-500"}`}
                        >
                            All Posts
                        </button>
                        <button
                            onClick={() => setShowAllPosts(false)}
                            className={`text-xl font-semibold cursor-pointer ${!showAllPosts ? "text-blue-600" : "text-gray-500"}`}
                        >
                            Following
                        </button>
                    </div>
                    <div className="flex space-x-6">
                        <div className={`flex-1 ${showAllPosts ? "" : "hidden"}`}>
                            <ul className="space-y-4 p-4 overflow-y-auto h-[50vh]">
                                {all_posts.map((post) => (
                                    <li key={post.id} className="border-b pb-4 flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {post.user.imageUrl ? (
                                                <Link to={`/profile/${post.user.id}`}>
                                                    <img src={post.user.imageUrl} alt={`${post.user.name}'s profile`} className="w-12 h-12 rounded-full object-cover" />
                                                </Link>
                                            ) : (
                                                <Link to={`/profile/${post.user.id}`}>
                                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                        {post.user.name[0]}
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-2xl">{post.content}</div>
                                            <div className="text-sm text-gray-500"><LikeButton
                                                postId={post.id}
                                                userId={user.id}
                                                initialLikes={post.likes}
                                                onLike={handleLikeChange}
                                            /></div>
                                            <div className="mt-2 font-bold text-xl text-gray-700">{post.user.name}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={`flex-1 ${!showAllPosts ? "" : "hidden"}`}>
                            <h3 className="p-4 text-xl font-semibold">Following</h3>
                            <ul className="space-y-4 p-4 overflow-y-auto h-[50vh]">
                                {following_posts.map((post) => (
                                    <li key={post.id} className="border-b pb-4 flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {post.user.imageUrl ? (
                                                <Link to={`/profile/${post.user.id}`}>
                                                    <img src={post.user.imageUrl} alt={`${post.user.name}'s profile`} className="w-12 h-12 rounded-full object-cover" />
                                                </Link>
                                            ) : (
                                                <Link to={`/profile/${post.user.id}`}>
                                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                        {post.user.name[0]}
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-2xl">{post.content}</div>
                                            <div className="text-sm text-gray-500">
                                                <LikeButton
                                                    postId={post.id}
                                                    userId={user.id}
                                                    initialLikes={post._count?.Like || 0}
                                                    onLike={handleLikeChange}
                                                />
                                            </div>
                                            <div className="mt-2 font-bold text-xl text-gray-700">{post.user.name}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Home;
