import React, { useState, useCallback, useMemo, useEffect, useContext } from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Platform,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";
import CancelRedemptionModal from "./components/CancelRedemptionModal";

const { width, height } = Dimensions.get("window");

const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeTablet = width >= 1024;

const getResponsiveValue = (small, medium, tablet, large) => {
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    if (isTablet) return tablet;
    return large;
};

export default function RedemptionTransactionScreens({ navigation }) {
    const { userInfo } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTab, setSelectedTab] = useState("ready");
    const [cancellingData, setCancellingdata] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const fetchTransactions = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const response = await fetch(`${BASE_URL}customer/redemption-history`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            const { statusCode, data } = await processResponse(response);
            // console.log("transactions: ", data);

            if (statusCode === 200) {
                const transformedData = data.data.map((transaction) => {
                    return {
                        id: transaction.reference_number,
                        station_name: transaction.items[0].station_name,
                        station_address: transaction.items[0].station_address,
                        status: transaction.status.toLowerCase() === "reserved" ? "ready" : transaction.status.toLowerCase(),
                        items_count: transaction.items.length,
                        total_points: transaction.total_points,
                        created_at: transaction.created_at,
                        qr_code: transaction.reference_number,
                        claimed_at: transaction.claimed_at || null,
                        items: transaction.items
                    };
                });

                setTransactions(transformedData);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.log("Error fetching transactions:", error);
            setTransactions([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    const handleCancelRedemption = useCallback(async (transaction) => {
        setShowCancelModal(true);
        setCancellingdata(transaction);
    }, [userInfo.token, fetchTransactions]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        if (selectedTab === "all") return transactions;
        return transactions.filter((t) => t.status === selectedTab);
    }, [transactions, selectedTab]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "ready":
                return "#4CAF50";
            case "claimed":
                return "#2196F3";
            default:
                return "#999";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "ready":
                return "Ready to Claim";
            case "claimed":
                return "Claimed";
            default:
                return status;
        }
    };

    const renderTransactionCard = useCallback(
        ({ item: transaction }) => (
            <TouchableOpacity
                style={styles.transactionCard}
                activeOpacity={0.7}
                onPress={() => {
                    // Navigate to transaction details
                    navigation.navigate("TransactionDetailsPopup", { transaction });
                    // console.log("Transaction pressed:", transaction);
                }}
            >
                {/* Status Badge */}
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(transaction.status) },
                    ]}
                >
                    <Text style={styles.statusBadgeText}>
                        {getStatusText(transaction.status)}
                    </Text>
                </View>

                {/* Transaction Header */}
                <View style={styles.transactionHeader}>
                    <View style={styles.transactionIdContainer}>
                        <Ionicons
                            name="receipt-outline"
                            size={getResponsiveValue(20, 22, 24, 26)}
                            color="#333"
                        />
                        <Text style={styles.transactionId}>{transaction.id}</Text>
                    </View>
                    <Text style={styles.transactionDate}>
                        {formatDate(transaction.created_at)}
                    </Text>
                </View>

                {/* Station Info */}
                <View style={styles.stationInfo}>
                    <Ionicons
                        name="business-outline"
                        size={getResponsiveValue(16, 18, 20, 22)}
                        color="#666"
                    />
                    <View style={styles.stationTextContainer}>
                        <Text style={styles.stationName} numberOfLines={1}>
                            {transaction.station_name}
                        </Text>
                        <Text style={styles.stationAddress} numberOfLines={1}>
                            {transaction.station_address}
                        </Text>
                    </View>
                </View>

                {/* Transaction Details */}
                <View style={styles.transactionDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons
                            name="cube-outline"
                            size={getResponsiveValue(18, 20, 22, 24)}
                            color="#f39c12"
                        />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Items</Text>
                            <Text style={styles.detailValue}>{transaction.items_count}</Text>
                        </View>
                    </View>

                    <View style={styles.detailDivider} />

                    <View style={styles.detailItem}>
                        <Image
                            source={require("../../../assets/my.png")}
                            style={styles.pointsIcon}
                        />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Points</Text>
                            <Text style={[styles.detailValue, styles.pointsValue]}>
                                {transaction.total_points}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* QR Code Preview with Cancel Button (only for ready status) */}
                {transaction.status === "ready" && (
                    <View style={styles.readyActionsContainer}>
                        <View style={styles.qrPreviewContainer}>
                            <Ionicons
                                name="qr-code-outline"
                                size={getResponsiveValue(20, 24, 28, 30)}
                                color="#FF0000"
                            />
                            <Text style={styles.qrPreviewText}>Show QR to claim</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            activeOpacity={0.7}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleCancelRedemption(transaction);
                            }}
                            disabled={cancellingData?.id === transaction.id}
                        >
                            {cancellingData?.id === transaction.id ? (
                                <ActivityIndicator size="small" color="#dc3545" />
                            ) : (
                                <>
                                    <Ionicons
                                        name="close-outline"
                                        size={getResponsiveValue(16, 18, 20, 22)}
                                        color="#dc3545"
                                    />
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Claimed Info */}
                {transaction.status === "claimed" && transaction.claimed_at && (
                    <View style={styles.claimedInfo}>
                        <Ionicons
                            name="checkmark-circle"
                            size={getResponsiveValue(16, 18, 20, 22)}
                            color="#4CAF50"
                        />
                        <Text style={styles.claimedText}>
                            Claimed on {formatDate(transaction.claimed_at)}
                        </Text>
                    </View>
                )}

                {/* Arrow */}
                {/* <View style={styles.arrowContainer}>
                    <Ionicons
                        name="chevron-forward"
                        size={getResponsiveValue(20, 24, 28, 32)}
                        color="#999"
                    />
                </View> */}
            </TouchableOpacity>
        ),
        [cancellingData, handleCancelRedemption]
    );

    const keyExtractor = useCallback((item) => item.id, []);

    const onRefresh = useCallback(() => {
        fetchTransactions(true);
    }, [fetchTransactions]);

    const ListHeaderComponent = useMemo(
        () => (
            <>
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>My Redemptions</Text>
                    <Text style={styles.subtitle}>
                        View and manage your redemption transactions
                    </Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {transactions.filter((t) => t.status === "ready").length}
                        </Text>
                        <Text style={styles.statLabel}>Ready to Claim</Text>
                    </View>
                    {/* <View style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {transactions.filter((t) => t.status === "claimed").length}
                        </Text>
                        <Text style={styles.statLabel}>Claimed</Text>
                    </View> */}
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{transactions.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            selectedTab === "ready" && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab("ready")}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === "ready" && styles.activeTabText,
                            ]}
                        >
                            Ready ({transactions.filter((t) => t.status === "ready").length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            selectedTab === "all" && styles.activeTab,
                        ]}
                        onPress={() => setSelectedTab("all")}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === "all" && styles.activeTabText,
                            ]}
                        >
                            All ({transactions.length})
                        </Text>
                    </TouchableOpacity>
                </View>
            </>
        ),
        [selectedTab, transactions]
    );

    const ListEmptyComponent = useMemo(() => {
        if (loading) {
            return (
                <View style={styles.emptyState}>
                    <ActivityIndicator size="large" color="#FF0000" />
                    <Text style={styles.emptyStateText}>Loading transactions...</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyState}>
                <Ionicons
                    name="receipt-outline"
                    size={getResponsiveValue(64, 80, 96, 112)}
                    color="#ccc"
                />
                <Text style={styles.emptyStateText}>No transactions found</Text>
                <Text style={styles.emptyStateSubtext}>
                    {selectedTab === "ready"
                        ? "You don't have any items ready to claim"
                        : selectedTab === "claimed"
                            ? "You haven't claimed any items yet"
                            : "Start redeeming rewards to see your transactions here"}
                </Text>
            </View>
        );
    }, [loading, selectedTab]);

    return (
        <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <CancelRedemptionModal visible={showCancelModal} onClose={() => { setShowCancelModal(false); setCancellingdata(null); onRefresh(); }} transactionData={cancellingData} />
            {/* <ImageBackground
                resizeMode="stretch"
                source={require("../../../assets/mygas-header.jpeg")}
                style={styles.top_bar}
            >
                <LinearGradient
                    colors={["rgb(249, 250, 141)", "transparent"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1.4 }}
                    style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
                />
                <Image
                    source={require("../../../assets/mygas_logo.png")}
                    style={styles.logo}
                />
                <Navbar
                    onBackPress={() => navigation.goBack()}
                    onProfilePress={() => console.log("Profile tapped")}
                    onNotifPress={() => console.log("Notifications tapped")}
                />
            </ImageBackground> */}
            <Navbar
                onBackPress={() => navigation.goBack()}
                onProfilePress={() => console.log("Profile tapped")}
                onNotifPress={() => console.log("Notifications tapped")}
            />

            <View style={styles.cardContainer}>
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderTransactionCard}
                    keyExtractor={keyExtractor}
                    ListHeaderComponent={ListHeaderComponent}
                    ListEmptyComponent={ListEmptyComponent}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    removeClippedSubviews={Platform.OS === "android"}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={50}
                    initialNumToRender={10}
                    windowSize={10}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    top_bar: {
        height: getResponsiveValue(130, 150, 180, 200),
        width: "100%",
        position: "relative",
    },
    logo: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [
            { translateX: getResponsiveValue(-30, -40, -50, -60) },
            { translateY: getResponsiveValue(-30, -40, -50, -60) },
        ],
        width: getResponsiveValue(55, 65, 80, 100),
        height: getResponsiveValue(55, 65, 80, 100),
        resizeMode: "contain",
        zIndex: 2,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: getResponsiveValue(16, 20, 24, 28),
        borderTopRightRadius: getResponsiveValue(16, 20, 24, 28),
        marginTop: -20,
    },
    flatListContent: {
        paddingHorizontal: getResponsiveValue(12, 16, 24, 32),
        paddingTop: getResponsiveValue(16, 20, 24, 28),
        paddingBottom: getResponsiveValue(80, 100, 120, 140),
        flexGrow: 1,
    },
    headerContainer: {
        alignItems: "center",
        width: "100%",
        marginBottom: getResponsiveValue(16, 20, 24, 28),
    },
    title: {
        fontSize: getResponsiveValue(24, 28, 32, 36),
        fontWeight: "bold",
        color: "#333",
        marginBottom: getResponsiveValue(6, 8, 10, 12),
    },
    subtitle: {
        fontSize: getResponsiveValue(12, 13, 14, 16),
        textAlign: "center",
        color: "#777",
        paddingHorizontal: getResponsiveValue(16, 20, 24, 32),
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    statsContainer: {
        flexDirection: "row",
        gap: getResponsiveValue(10, 12, 14, 16),
        marginBottom: getResponsiveValue(16, 20, 24, 28),
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: getResponsiveValue(10, 12, 14, 16),
        padding: getResponsiveValue(14, 16, 20, 24),
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    statValue: {
        fontSize: getResponsiveValue(22, 26, 30, 34),
        fontWeight: "bold",
        color: "#FF0000",
        marginBottom: getResponsiveValue(4, 5, 6, 7),
    },
    statLabel: {
        fontSize: getResponsiveValue(10, 11, 12, 13),
        color: "#666",
        textAlign: "center",
        fontWeight: "500",
    },
    tabsContainer: {
        flexDirection: "row",
        gap: getResponsiveValue(8, 10, 12, 14),
        marginBottom: getResponsiveValue(16, 20, 24, 28),
    },
    tab: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        paddingVertical: getResponsiveValue(10, 12, 14, 16),
        paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    activeTab: {
        backgroundColor: "#FF0000",
    },
    tabText: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#666",
        fontWeight: "600",
    },
    activeTabText: {
        color: "#fff",
    },
    transactionCard: {
        backgroundColor: "#fff",
        borderRadius: getResponsiveValue(12, 16, 18, 20),
        marginBottom: getResponsiveValue(12, 16, 20, 24),
        padding: getResponsiveValue(14, 16, 20, 24),
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        position: "relative",
    },
    statusBadge: {
        position: "absolute",
        top: getResponsiveValue(14, 16, 18, 20),
        right: getResponsiveValue(14, 16, 18, 20),
        paddingHorizontal: getResponsiveValue(10, 12, 14, 16),
        paddingVertical: getResponsiveValue(5, 6, 7, 8),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        zIndex: 1,
    },
    statusBadgeText: {
        color: "#fff",
        fontSize: getResponsiveValue(9, 10, 11, 12),
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    transactionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: getResponsiveValue(12, 14, 16, 18),
        paddingRight: getResponsiveValue(100, 110, 120, 130),
    },
    transactionIdContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: getResponsiveValue(6, 8, 10, 12),
    },
    transactionId: {
        fontSize: getResponsiveValue(14, 16, 18, 20),
        fontWeight: "bold",
        color: "#333",
    },
    transactionDate: {
        fontSize: getResponsiveValue(10, 11, 12, 13),
        color: "#999",
        fontWeight: "500",
        position: "absolute",
        right: 0,
        top: 2,
    },
    stationInfo: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: getResponsiveValue(8, 10, 12, 14),
        marginBottom: getResponsiveValue(12, 14, 16, 18),
        paddingBottom: getResponsiveValue(12, 14, 16, 18),
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    stationTextContainer: {
        flex: 1,
    },
    stationName: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        fontWeight: "600",
        color: "#333",
        marginBottom: getResponsiveValue(3, 4, 5, 6),
    },
    stationAddress: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#666",
    },
    transactionDetails: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        padding: getResponsiveValue(12, 14, 16, 18),
        marginBottom: getResponsiveValue(10, 12, 14, 16),
    },
    detailItem: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: getResponsiveValue(6, 8, 10, 12),
    },
    detailDivider: {
        width: 1,
        height: "100%",
        backgroundColor: "#e0e0e0",
        marginHorizontal: getResponsiveValue(12, 14, 16, 18),
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: getResponsiveValue(10, 11, 12, 13),
        color: "#999",
        marginBottom: getResponsiveValue(2, 3, 4, 5),
    },
    detailValue: {
        fontSize: getResponsiveValue(16, 18, 20, 22),
        fontWeight: "bold",
        color: "#333",
    },
    pointsIcon: {
        width: getResponsiveValue(18, 20, 22, 24),
        height: getResponsiveValue(18, 20, 22, 24),
        resizeMode: "contain",
    },
    pointsValue: {
        color: "#f39c12",
    },
    readyActionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: getResponsiveValue(8, 10, 12, 14),
    },
    qrPreviewContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: getResponsiveValue(6, 8, 10, 12),
        backgroundColor: "#fff5f5",
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        padding: getResponsiveValue(8, 10, 12, 14),
        borderWidth: 1,
        borderColor: "#ffe0e0",
        borderStyle: "dashed",
    },
    qrPreviewText: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#FF0000",
        fontWeight: "600",
    },
    cancelButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: getResponsiveValue(4, 5, 6, 7),
        backgroundColor: "#fff",
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        paddingVertical: getResponsiveValue(8, 10, 12, 14),
        paddingHorizontal: getResponsiveValue(10, 12, 14, 16),
        borderWidth: 1.5,
        borderColor: "#dc3545",
        minWidth: getResponsiveValue(70, 80, 90, 100),
    },
    cancelButtonText: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#dc3545",
        fontWeight: "600",
    },
    claimedInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: getResponsiveValue(6, 8, 10, 12),
        backgroundColor: "#f1f8f4",
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        padding: getResponsiveValue(10, 12, 14, 16),
    },
    claimedText: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#4CAF50",
        fontWeight: "500",
    },
    arrowContainer: {
        position: "absolute",
        right: getResponsiveValue(12, 16, 20, 24),
        top: "50%",
        transform: [{ translateY: getResponsiveValue(-12, -14, -16, -18) }],
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: getResponsiveValue(40, 60, 80, 100),
    },
    emptyStateText: {
        fontSize: getResponsiveValue(16, 18, 20, 22),
        color: "#999",
        marginTop: getResponsiveValue(12, 16, 20, 24),
        fontWeight: "600",
    },
    emptyStateSubtext: {
        fontSize: getResponsiveValue(12, 14, 15, 16),
        color: "#bbb",
        marginTop: getResponsiveValue(6, 8, 10, 12),
        textAlign: "center",
        paddingHorizontal: getResponsiveValue(20, 30, 40, 50),
    },
});