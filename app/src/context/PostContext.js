import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

const API_URL = 'http://192.168.100.3:3000/api';

const PostProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const { user } = useAuth();

    const getPosts = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/posts${userId ? `?userId=${userId}` : ''}`, {
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            setPosts(result.data.posts);
        } catch(err) {
            console.log(err);
        }
    };

    const deletePost = async (postId) => {
        try {
            const res = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if(!res.ok) {
                const result = await res.json();
                throw new Error(result.message);
            }

            setPosts(posts.filter(post => post._id !== postId));

            alert('Post deleted succesfully!');
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    const addPost = async (title, content, file, tags = []) => {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);

                if (tags.length > 0) {
                    tags.forEach(tag => formData.append('tags', tag));
                }
    
                if (file) {
                    const filename = file.split('/').pop();
                    const ext = filename.split('.').pop();
                    formData.append('postImg', {
                        uri: file,
                        name: filename,
                        type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
                    });
                }
    
                const res = await fetch(`${API_URL}/posts`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });

               
    
                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message || 'Failed to create post');
                }
    
                Alert.alert("Success", "Post created!");
                setPosts(prev => [...prev, result]);
            } catch (err) {
                Alert.alert("Error", err.message);
            } finally {
                setLoading(false);
            }
    };
    return (
        <PostContext.Provider value={{addPost, deletePost, getPosts, posts, loading}}>
            {children}
        </PostContext.Provider>
    )
};

export default PostProvider;