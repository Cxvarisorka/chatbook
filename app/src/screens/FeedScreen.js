import { ScrollView, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { usePosts } from "../context/PostContext";
import PostsList from "../components/PostsList";

const FeedScreen = () => {
    const { posts } = usePosts();
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    // Collect all unique tags from posts
    const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

    // Filter posts by search text and selected tag
    const filteredPosts = posts.filter(post => {
        const matchesSearch = !search.trim() ||
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.content.toLowerCase().includes(search.toLowerCase());

        const matchesTag = !selectedTag ||
            (post.tags && post.tags.includes(selectedTag));

        return matchesSearch && matchesTag;
    });

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search posts..."
                placeholderTextColor="#999"
                value={search}
                onChangeText={setSearch}
            />

            {allTags.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
                    <TouchableOpacity
                        style={[styles.tagChip, !selectedTag && styles.tagChipActive]}
                        onPress={() => setSelectedTag(null)}
                    >
                        <Text style={[styles.tagChipText, !selectedTag && styles.tagChipTextActive]}>All</Text>
                    </TouchableOpacity>
                    {allTags.map(tag => (
                        <TouchableOpacity
                            key={tag}
                            style={[styles.tagChip, selectedTag === tag && styles.tagChipActive]}
                            onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
                        >
                            <Text style={[styles.tagChipText, selectedTag === tag && styles.tagChipTextActive]}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <PostsList posts={filteredPosts} />
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
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        color: '#333',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    tagsScroll: {
        marginBottom: 12,
        maxHeight: 40,
    },
    tagChip: {
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    tagChipActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    tagChipText: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },
    tagChipTextActive: {
        color: '#fff',
    },
});

export default FeedScreen;
