/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

export const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

const API_URL = import.meta.env.VITE_SERVER_URL + '/api';

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

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
    }

    const addPost = async (postObj) => {
        try {
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postObj),
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            setPosts([...posts, result]);
        } catch(err) {
            console.log(err);
        }
    }

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

    const updatePost = async (data, postId) => {
        try {
            const res = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await res.json();

            if(!res.ok) {
                throw new Error(result.message);
            }

            const index = posts.findIndex(post => post._id === postId);
            const copyArr = [...posts];
            copyArr.splice(index, 1, result);
            setPosts(copyArr);

            alert("Post updated succsesfully");
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <PostContext.Provider value={{getPosts, posts, addPost, deletePost, updatePost}}>
            {children}
        </PostContext.Provider>
    )
}