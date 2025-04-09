import { useState } from 'react';

interface LikeButtonProps {
  postId: number;
  userId: number;
  initialLikes: number;
  onLike: (postId: number, userId: number, isLiked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, userId, initialLikes, onLike }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(likeCount + (liked ? -1 : 1));
        onLike(postId, userId, !liked);
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${liked ? 'text-blue-600' : 'text-gray-600'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{likeCount}</span>
        </button>
    );
}

export default LikeButton;
