/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { usePosts } from "../context/PostContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Posts = ({ userId }) => {
    const { posts, getPosts, deletePost, updatePost } = usePosts();
    const { user } = useAuth();
    const [updatingPostId, setUpdatingPostId] = useState(null); // store the post ID being updated

    useEffect(() => {
        getPosts(userId);
    }, []);

    const handleSubmit = (e, postId) => {
        e.preventDefault();

        const data = {
            title: e.target.title.value,
            content: e.target.content.value,
        };

        setUpdatingPostId(null); // close form
        updatePost(data, postId);
    };

  return (
    <ul>
        {!posts || posts.length === 0 ? (
            <p>No Posts Found</p>
        ) : (
            posts.map((post) => (
                <li key={post._id}>
                    <p>Created By: {post.fullname}</p>

                    {updatingPostId === post._id ? (
                        <form onSubmit={(e) => handleSubmit(e, post._id)}>
                            <div>
                                <label htmlFor={`title-${post._id}`}>Post Title:</label> <br />
                                <input
                                    type="text"
                                    id={`title-${post._id}`}
                                    name="title"
                                    placeholder={post.title}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor={`content-${post._id}`}>Post Content:</label> <br />
                                <textarea
                                    id={`content-${post._id}`}
                                    name="content"
                                    placeholder={post.content}
                                    required
                                />
                            </div>

                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setUpdatingPostId(null)}>
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <>
                            <h3>{post.title}</h3>
                            <p>Content: {post.content}</p>

                            {user._id === userId && (
                                <>
                                    <button onClick={() => deletePost(post._id)}>Delete Post</button>
                                    <button onClick={() => setUpdatingPostId(post._id)}>Update</button>
                                </>
                            )}
                        </>
                    )}
                </li>
            ))
        )}
    </ul>
  );
};

export default Posts;
