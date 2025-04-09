import { Link } from 'react-router-dom';
import '../App.css';
import LikeButton from './Like.tsx';
import { useState, useEffect } from 'react';

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
    _count: number,
}

function Home() {
    const [all_posts, setAllposts] = useState<Post[]>([]);
    const [following_posts, setFollowingPosts] = useState<Post[]>([]);
    const [showAllPosts, setShowAllPosts] = useState(true);
    const [contents, setContent] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const user = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    console.log(user.name);

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
                alert("Error: " + rez.errors[0]?.message || "Something went wrong.");
            } else {
                console.log("Success:", rez.data);
                window.location.reload();
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Network error. Try again later.");
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
                alert("Error: " + rez.errors[0]?.message || "Something went wrong.");
            } else {
                console.log("Success:", rez.data);
                window.location.reload();
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Network error. Try again later.");
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
                    alert("Error: " + rez.errors[0]?.message || "Something went wrong.");
                } else {
                    setAllposts(rez.data.posts);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                alert("Network error. Try again later.");
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
                    alert("Error: " + rez.errors[0]?.message || "Something went wrong.");
                } else {
                    setFollowingPosts(rez.data.postsByFollowing);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                alert("Network error. Try again later.");
            }
        }

        getAllPost();
        getFollow();
    }, [user.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-blue-950 h-screen">
            <div className='grid grid-cols-12 gap-10 pl-3 h-full'>
                {/* Sidebar (Left Navigation) */}
                <nav className="col-span-2 bg-gray-800 text-white p-4 h-full sticky top-0">
                    <div className="space-y-4">
                        <Link to={'/home'} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span>Home</span>
                        </Link>
                        <Link to={'/profile'} className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span>Profile</span>
                        </Link>
                        <button className="w-full text-white bg-blue-600 p-2 rounded-md hover:bg-blue-700 transition">Post</button>
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
                            <h3 className="p-4 text-xl font-semibold">All Posts</h3>
                            <ul className="space-y-4 p-4 overflow-y-auto h-[50vh]">
                                {all_posts.map((post) => (
                                    <li key={post.id} className="border-b pb-4 flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            {post.user.imageUrl ? (
                                                <Link to={"/profile"} state={{ userId: post.user.id }}>
                                                    <img src={post.user.imageUrl} alt={`${post.user.name}'s profile`} className="w-12 h-12 rounded-full object-cover" />
                                                </Link>
                                            ) : (
                                                <Link to={"/profile"} state={{ userId: post.user.id }}>
                                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                        {post.user.name[0]}
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-lg">{post.content}</div>
                                            <div className="text-sm text-gray-500"><LikeButton
                                                postId={post.id}
                                                userId={user.id}
                                                initialLikes={post.likes}
                                                onLike={handleLikeChange}
                                            /></div>
                                            <div className="mt-2 text-sm font-semibold text-gray-700">{post.user.name}</div>
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
                                                <Link to={"/profile"} state={{ userId: post.user.id }}>
                                                    <img src={post.user.imageUrl} alt={`${post.user.name}'s profile`} className="w-12 h-12 rounded-full object-cover" />
                                                </Link>
                                            ) : (
                                                <Link to={"/profile"} state={{ userId: post.user.id }}>
                                                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                                        {post.user.name[0]}
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-lg">{post.content}</div>
                                            <div className="text-sm text-gray-500">
                                                <LikeButton
                                                    postId={post.id}
                                                    userId={user.id}
                                                    initialLikes={post._count?.Like || 0}
                                                    onLike={handleLikeChange}
                                                />
                                            </div>
                                            <div className="mt-2 text-sm font-semibold text-gray-700">{post.user.name}</div>
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
