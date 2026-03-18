import { useMemo, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

const USERS_PER_PAGE = 5;

const getRelationship = (userId, loggedInUserId, friendIds, incomingIds, sentIds) => {
    if (userId === loggedInUserId) return "self";
    if (friendIds.has(userId)) return "friend";
    if (incomingIds.has(userId)) return "incoming";
    if (sentIds.has(userId)) return "sent";
    return "none";
};

const StatusBadge = ({ label, badgeStyle, textStyle }) => (
    <View style={[styles.statusBadge, badgeStyle]}>
        <Text style={[styles.statusBadgeText, textStyle]}>{label}</Text>
    </View>
);

const UserActionButton = ({ relationship, userId, onSend, onCancel, onRemove }) => {
    switch (relationship) {
        case "self":
            return null;
        case "friend":
            return (
                <TouchableOpacity
                    style={[styles.friendActionButton, styles.removeActionButton]}
                    activeOpacity={0.85}
                    onPress={() => onRemove(userId)}
                >
                    <Text style={[styles.friendActionText, styles.removeActionText]}>Remove</Text>
                </TouchableOpacity>
            );
        case "sent":
            return (
                <TouchableOpacity
                    style={[styles.friendActionButton, styles.cancelActionButton]}
                    activeOpacity={0.85}
                    onPress={() => onCancel(userId)}
                >
                    <Text style={[styles.friendActionText, styles.cancelActionText]}>Cancel</Text>
                </TouchableOpacity>
            );
        case "incoming":
            return null;
        default:
            return (
                <TouchableOpacity
                    style={styles.friendActionButton}
                    activeOpacity={0.85}
                    onPress={() => onSend(userId)}
                >
                    <Text style={styles.friendActionText}>Add Friend</Text>
                </TouchableOpacity>
            );
    }
};

const RelationshipBadge = ({ relationship }) => {
    switch (relationship) {
        case "self":
            return <StatusBadge label="You" badgeStyle={styles.selfBadge} textStyle={styles.selfBadgeText} />;
        case "friend":
            return <StatusBadge label="Friend" badgeStyle={styles.friendBadge} textStyle={styles.friendBadgeText} />;
        case "incoming":
            return <StatusBadge label="Requested you" badgeStyle={styles.incomingBadge} textStyle={styles.incomingBadgeText} />;
        case "sent":
            return <StatusBadge label="Sent" badgeStyle={styles.sentBadge} textStyle={styles.sentBadgeText} />;
        default:
            return null;
    }
};

const UsersScreen = () => {
    const { user: loggedInUser } = useAuth();
    const {
        users, friendRequests, sentFriendRequests,
        sendFriendRequest, cancelFriendRequest, friends, removeFriend,
    } = useUser();
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const safeUsers = users || [];
    const safeFriendRequests = friendRequests || [];
    const safeSentFriendRequests = sentFriendRequests || [];
    const safeFriends = friends || [];

    const incomingRequestSenderIds = useMemo(
        () => new Set(safeFriendRequests.map((r) => r.from?._id).filter(Boolean)),
        [safeFriendRequests]
    );
    const sentRequestReceiverIds = useMemo(
        () => new Set(safeSentFriendRequests.map((r) => r.to?._id).filter(Boolean)),
        [safeSentFriendRequests]
    );
    const friendIds = useMemo(
        () => {
            const ids = new Set();
            const myId = loggedInUser?._id;
            safeFriends.forEach((f) => {
                if (f.user1 === myId) ids.add(f.user2);
                else if (f.user2 === myId) ids.add(f.user1);
            });
            return ids;
        },
        [safeFriends, loggedInUser?._id]
    );

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return safeUsers;
        return safeUsers.filter(
            (user) =>
                user.fullname?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query)
        );
    }, [safeUsers, search]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleOpenProfile = (userId) => {
        navigation.navigate("profile", { userId });
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            {/* Hero / Search */}
            <View style={styles.heroCard}>
                <Text style={styles.title}>Community</Text>
                <Text style={styles.subtitle}>
                    Browse members, search by name or email, and move through the list 5 users at a time.
                </Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    placeholderTextColor="#7d8794"
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Summary */}
            <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>
                    {filteredUsers.length} user{filteredUsers.length === 1 ? "" : "s"} found
                </Text>
                <Text style={styles.summaryText}>
                    Page {currentPage} / {totalPages}
                </Text>
            </View>

            {/* User List */}
            {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => {
                    const relationship = getRelationship(
                        user._id, loggedInUser?._id, friendIds, incomingRequestSenderIds, sentRequestReceiverIds
                    );

                    return (
                        <View key={user._id} style={styles.userCard}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user.fullname?.charAt(0)?.toUpperCase() || "?"}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.userInfo}
                                activeOpacity={0.85}
                                onPress={() => handleOpenProfile(user._id)}
                            >
                                <View style={styles.userMetaRow}>
                                    <Text style={styles.userName}>{user.fullname}</Text>
                                    <RelationshipBadge relationship={relationship} />
                                </View>
                                <Text style={styles.userEmail}>{user.email}</Text>
                                <Text style={styles.tapHint}>Tap to view profile</Text>
                            </TouchableOpacity>

                            <UserActionButton
                                relationship={relationship}
                                userId={user._id}
                                onSend={sendFriendRequest}
                                onCancel={cancelFriendRequest}
                                onRemove={removeFriend}
                            />
                        </View>
                    );
                })
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No users found</Text>
                    <Text style={styles.emptyText}>
                        Try a different name or email in the search field.
                    </Text>
                </View>
            )}

            {/* Pagination */}
            <View style={styles.paginationRow}>
                <TouchableOpacity
                    style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                    disabled={currentPage === 1}
                    onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                    <Text style={[styles.pageButtonText, currentPage === 1 && styles.pageButtonTextDisabled]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                    disabled={currentPage === totalPages}
                    onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                    <Text style={[styles.pageButtonText, currentPage === totalPages && styles.pageButtonTextDisabled]}>
                        Next
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Friend Requests */}
            <View style={styles.requestsSection}>
                <View style={styles.requestsHeader}>
                    <Text style={styles.requestsTitle}>Friend Requests</Text>
                    <View style={styles.requestsCountPill}>
                        <Text style={styles.requestsCountText}>{safeFriendRequests.length}</Text>
                    </View>
                </View>

                <Text style={styles.requestsSubtitle}>
                    People who have already sent you a request.
                </Text>

                {safeFriendRequests.length === 0 ? (
                    <View style={styles.requestsEmptyState}>
                        <Text style={styles.requestsEmptyTitle}>No pending requests</Text>
                        <Text style={styles.requestsEmptyText}>
                            New incoming requests will show up here.
                        </Text>
                    </View>
                ) : (
                    safeFriendRequests.map((request) => (
                        <TouchableOpacity
                            key={request._id}
                            style={styles.requestCard}
                            activeOpacity={0.85}
                            onPress={() => handleOpenProfile(request.from._id)}
                        >
                            <View style={styles.requestAvatar}>
                                <Text style={styles.requestAvatarText}>
                                    {request.from?.fullname?.charAt(0)?.toUpperCase() || "?"}
                                </Text>
                            </View>

                            <View style={styles.requestInfo}>
                                <Text style={styles.requestName}>{request.from?.fullname}</Text>
                                <Text style={styles.requestEmail}>{request.from?.email}</Text>
                            </View>

                            <View style={styles.requestPill}>
                                <Text style={styles.requestPillText}>Pending</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#eef3f8",
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    heroCard: {
        backgroundColor: "#16324f",
        borderRadius: 22,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#00111f",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#f8fbff",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 21,
        color: "#c7d8ea",
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: "#f8fbff",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#16324f",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    summaryText: {
        fontSize: 13,
        color: "#566575",
        fontWeight: "600",
    },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#dde6ef",
        shadowColor: "#3a4d61",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        gap: 12,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#f28f3b",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 2,
    },
    avatarText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    userInfo: {
        flex: 1,
    },
    userMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginBottom: 4,
    },
    userName: {
        flex: 1,
        fontSize: 17,
        fontWeight: "700",
        color: "#1a2433",
    },
    userEmail: {
        fontSize: 14,
        color: "#68778a",
    },
    tapHint: {
        marginTop: 6,
        fontSize: 12,
        color: "#8a96a3",
        fontWeight: "600",
    },
    statusBadge: {
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: "700",
    },
    selfBadge: {
        backgroundColor: "#e2ebf4",
    },
    selfBadgeText: {
        color: "#35516d",
    },
    friendBadge: {
        backgroundColor: "#d1fae5",
    },
    friendBadgeText: {
        color: "#065f46",
    },
    incomingBadge: {
        backgroundColor: "#dff5e8",
    },
    incomingBadgeText: {
        color: "#237a4f",
    },
    sentBadge: {
        backgroundColor: "#fce8d7",
    },
    sentBadgeText: {
        color: "#9b5d17",
    },
    friendActionButton: {
        backgroundColor: "#16324f",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    cancelActionButton: {
        backgroundColor: "#fee2e2",
    },
    removeActionButton: {
        backgroundColor: "#fee2e2",
    },
    friendActionText: {
        color: "#f8fbff",
        fontSize: 13,
        fontWeight: "700",
    },
    cancelActionText: {
        color: "#b42318",
    },
    removeActionText: {
        color: "#b42318",
    },
    emptyState: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#dde6ef",
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1a2433",
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#68778a",
        textAlign: "center",
        lineHeight: 21,
    },
    paginationRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 10,
    },
    pageButton: {
        flex: 1,
        backgroundColor: "#16324f",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    pageButtonDisabled: {
        backgroundColor: "#c9d4df",
    },
    pageButtonText: {
        color: "#f8fbff",
        fontSize: 15,
        fontWeight: "700",
    },
    pageButtonTextDisabled: {
        color: "#6e7d8c",
    },
    requestsSection: {
        marginTop: 18,
        backgroundColor: "#ffffff",
        borderRadius: 22,
        padding: 18,
        borderWidth: 1,
        borderColor: "#dde6ef",
        shadowColor: "#3a4d61",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
    },
    requestsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    requestsTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a2433",
    },
    requestsCountPill: {
        minWidth: 34,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: "#16324f",
        alignItems: "center",
    },
    requestsCountText: {
        color: "#f8fbff",
        fontSize: 12,
        fontWeight: "700",
    },
    requestsSubtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: "#68778a",
        marginBottom: 14,
    },
    requestsEmptyState: {
        backgroundColor: "#f7fafc",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5edf5",
    },
    requestsEmptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1a2433",
        marginBottom: 6,
    },
    requestsEmptyText: {
        fontSize: 13,
        color: "#7a8795",
        textAlign: "center",
        lineHeight: 19,
    },
    requestCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fbff",
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#e3ebf3",
        marginBottom: 10,
    },
    requestAvatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#f28f3b",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    requestAvatarText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
    },
    requestInfo: {
        flex: 1,
    },
    requestName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1a2433",
        marginBottom: 2,
    },
    requestEmail: {
        fontSize: 13,
        color: "#68778a",
    },
    requestPill: {
        backgroundColor: "#dff5e8",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    requestPillText: {
        color: "#237a4f",
        fontSize: 12,
        fontWeight: "700",
    },
});

export default UsersScreen;
