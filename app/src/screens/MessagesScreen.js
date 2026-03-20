import { useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";

const MessagesScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { friends, users } = useUser();
    const { conversations } = useSocket();

    const getFriend = (friendship) => {
        const friendId = friendship.user1 === user._id ? friendship.user2 : friendship.user1;
        const friendUser = (users || []).find(u => u._id === friendId);
        return { id: friendId, name: friendUser?.fullname || 'Unknown' };
    };

    const getLastMessage = (friendId) => {
        const msgs = conversations[friendId];
        if (!msgs || msgs.length === 0) return null;
        return msgs[msgs.length - 1];
    };

    const sortedFriends = [...(friends || [])].sort((a, b) => {
        const friendA = getFriend(a);
        const friendB = getFriend(b);
        const lastA = getLastMessage(friendA.id);
        const lastB = getLastMessage(friendB.id);
        if (!lastA && !lastB) return 0;
        if (!lastA) return 1;
        if (!lastB) return -1;
        return new Date(lastB.createdAt) - new Date(lastA.createdAt);
    });

    const openChat = (friendId, friendName) => {
        navigation.navigate('chat', { friendId, friendName });
    };

    const renderConversation = ({ item }) => {
        const friend = getFriend(item);
        const lastMsg = getLastMessage(friend.id);

        return (
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => openChat(friend.id, friend.name)}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {friend.name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
                <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                        <Text style={styles.friendName} numberOfLines={1}>{friend.name}</Text>
                        {lastMsg && (
                            <Text style={styles.timeText}>
                                {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        )}
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {lastMsg
                            ? (lastMsg.from === user._id ? `You: ${lastMsg.message}` : lastMsg.message)
                            : 'Tap to start chatting'
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sortedFriends}
                keyExtractor={(item) => item._id}
                renderItem={renderConversation}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyTitle}>No conversations</Text>
                        <Text style={styles.emptySubtext}>
                            Add friends to start messaging
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    listContent: {
        flexGrow: 1,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    friendName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
        marginRight: 8,
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    lastMessage: {
        fontSize: 14,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#999',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#bbb',
        marginTop: 6,
    },
});

export default MessagesScreen;
