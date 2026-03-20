import { useEffect, useRef, useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, FlatList, KeyboardAvoidingView, Platform
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const ChatScreen = ({ route }) => {
    const { friendId, friendName } = route.params;
    const { user } = useAuth();
    const { sendMessage, conversations } = useSocket();
    const [text, setText] = useState('');
    const flatListRef = useRef(null);

    const messages = conversations[friendId] || [];

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        sendMessage(friendId, trimmed);
        setText('');
    };

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages.length]);

    const renderMessage = ({ item }) => {
        const isOwn = item.from === user._id;
        return (
            <View style={[styles.messageBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
                <Text style={[styles.messageText, isOwn ? styles.ownText : styles.otherText]}>
                    {item.message}
                </Text>
                <Text style={[styles.timeText, isOwn ? styles.ownTime : styles.otherTime]}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <View style={styles.header}>
                <View style={styles.headerAvatar}>
                    <Text style={styles.headerAvatarText}>
                        {friendName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={styles.headerName}>{friendName}</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No messages yet</Text>
                        <Text style={styles.emptySubtext}>Say hello!</Text>
                    </View>
                }
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />

            <View style={styles.inputBar}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={1000}
                />
                <TouchableOpacity
                    style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!text.trim()}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerAvatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    messagesList: {
        paddingHorizontal: 12,
        paddingVertical: 16,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageBubble: {
        maxWidth: '78%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        marginBottom: 8,
    },
    ownBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    ownText: {
        color: '#fff',
    },
    otherText: {
        color: '#1a1a1a',
    },
    timeText: {
        fontSize: 11,
        marginTop: 4,
    },
    ownTime: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'right',
    },
    otherTime: {
        color: '#999',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        fontWeight: '500',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#bbb',
        marginTop: 4,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#333',
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
    sendButtonDisabled: {
        opacity: 0.4,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ChatScreen;
