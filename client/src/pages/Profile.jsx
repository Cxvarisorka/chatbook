import { useAuth } from "../context/AuthContext"
import { usePosts } from "../context/PostContext";
import Posts from "./Posts";

const Profile = () => {
    const { user } = useAuth();
    const { addPost } = usePosts();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formObj = {
            title: e.target.title.value,
            content: e.target.content.value,
            userId: user._id
        };

        addPost(formObj);
    }

    return (
        <main>
            <h1>Profile</h1>

            <section>
                <h2>User info</h2>
                <p>My email: {user.email}</p>
                <p>My fullname: {user.fullname}</p>
                <p>Verified: {user.isVerified ? "Yes" : "No"}</p>    
            </section>

            <section>
                <h2>Posts</h2>
                <Posts userId={user._id}></Posts>
            </section>

            <section>
                <h2>Add Posts</h2>

                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Title" required/>
                    <input type="text" name="content" placeholder="Content" required/>
                    <button>Submit</button>
                </form>
            </section>
            
        </main>
    )
}

export default Profile;