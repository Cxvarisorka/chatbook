import { View, Text, Image, StyleSheet, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import { useNavigation } from "@react-navigation/native";

const API_URL = 'http://192.168.100.3:3000';

const PostsList = ({ posts }) => {
    const { user } = useAuth();
    const { deletePost } = usePosts();
    const navigation = useNavigation();

    if (!posts || posts.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts yet</Text>
            </View>
        );
    }


    const handleClick = (userId) => {
        navigation.navigate('profile', {userId})
    }

    return (
        <View>
            {posts.map((item) => (
                <View key={item._id} style={styles.postCard}>
                    <View>
                        <Text onPress={() => handleClick(item.userId)} style={styles.fullname}>{user._id == item.userId ? 'Created By You' : item.fullname}</Text>
                    </View>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postContent}>{item.content}</Text>
                    {item.tags && item.tags.length > 0 && (
                        <View style={styles.tagsRow}>
                            {item.tags.map((tag, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {item.postImage && (
                        <Image
                            source={{ uri: `${API_URL}/${item.postImage}` }}
                            style={styles.postImage}
                        />
                    )}
                    
                    {
                        user._id == item.userId && <Button title="delete" onPress={() => deletePost(item._id)} />
                    }
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    fullname: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2962ff',
        marginBottom: 6,
    },
    postTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    postContent: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 10,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        gap: 6,
    },
    tag: {
        backgroundColor: '#e8f0fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
    },
});

export default PostsList;
