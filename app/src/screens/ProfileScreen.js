import {
    View, Text, TextInput, Image, TouchableOpacity,
    StyleSheet, Alert, ScrollView, ActivityIndicator,
    Button
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { usePosts } from "../context/PostContext";
import PostsList from "../components/PostsList";


function SelectImage({ file, setFile }) {
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Sorry, we need camera roll permission to upload images."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setFile(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                <Text style={styles.pickButtonText}>
                    {file ? "Change Image" : "Choose Image"}
                </Text>
            </TouchableOpacity>

            {file && (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: file }} style={styles.previewImage} />
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => setFile(null)}
                    >
                        <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const { addPost, loading, posts } = usePosts();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState('');

    const handleCreatePost = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Validation", "Please fill in title and content.");
            return;
        }

        const tagsArray = tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        addPost(title, content, file, tagsArray);

        setTitle('');
        setContent('');
        setFile(null);
        setTags('');
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
            {/* Profile Section */}
            <View style={styles.profileCard}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                        {user?.fullname?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={styles.fullname}>{user?.fullname}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Button title="Logout" onPress={logout}/>
            </View>

            {/* New Post Section */}
            <View style={styles.postCard}>
                <Text style={styles.sectionTitle}>Create New Post</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                />

                <TextInput
                    style={[styles.input, styles.contentInput]}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#999"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Tags (comma separated)"
                    placeholderTextColor="#999"
                    value={tags}
                    onChangeText={setTags}
                />

                <SelectImage file={file} setFile={setFile} />

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleCreatePost}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* User Posts Section */}
            <PostsList posts={posts.filter(post => post.userId == user._id)} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    screenContent: {
        padding: 16,
        paddingBottom: 32,
    },

    // Profile card
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    fullname: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
    },

    // Post card
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: '#333',
        backgroundColor: '#fafafa',
        marginBottom: 12,
    },
    contentInput: {
        minHeight: 100,
    },

    // Image picker
    imagePickerContainer: {
        marginBottom: 16,
    },
    pickButton: {
        backgroundColor: '#e8e8e8',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    pickButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
    previewContainer: {
        marginTop: 12,
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    removeButton: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    removeButtonText: {
        color: '#ff3b30',
        fontSize: 13,
        fontWeight: '500',
    },

    // Submit
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;
