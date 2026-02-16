import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    Platform,
    StatusBar,
    Share
} from "react-native";
import React, { useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PATH_URL } from "../../config";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargeDevice = SCREEN_WIDTH >= 414;

const scale = (size) => {
    if (isSmallDevice) return size * 0.9;
    if (isMediumDevice) return size;
    return size * 1.05;
};

export default function NewsDetailScreen({ navigation, route }) {
    const { news } = route?.params;
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true
        }).start();
    }, []);

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 100, 200],
        outputRange: [0, 0, 1],
        extrapolate: "clamp"
    });

    const imageScale = scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.3, 1],
        extrapolate: "clamp"
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, 200, 250],
        outputRange: [1, 0.8, 0.5],
        extrapolate: "clamp"
    });

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${PATH_URL}`,
                title: news.title
            });
        } catch (error) {
            console.log("Error sharing:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Animated Header */}
            <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
                <LinearGradient
                    colors={["rgba(224, 184, 32, 0.98)", "rgba(224, 184, 32, 0.95)"]}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {news.title}
                        </Text>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={handleShare}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="share-outline" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Hero Image Section */}
                <Animated.View
                    style={[
                        styles.heroContainer,
                        {
                            opacity: imageOpacity,
                            transform: [{ scale: imageScale }]
                        }
                    ]}
                >
                    <Image
                        source={news.image}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.7)"]}
                        style={styles.heroGradient}
                    />

                    {/* Floating Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
                            style={styles.backButtonGradient}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Floating Share Button */}
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={handleShare}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
                            style={styles.shareButtonGradient}
                        >
                            <Ionicons name="share-outline" size={22} color="#FFF" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* Content Section */}
                <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                    {/* Category & Date Row */}
                    <View style={styles.metaRow}>
                        <View style={[styles.categoryBadge, { backgroundColor: news.color }]}>
                            <Ionicons name="pricetag" size={14} color="#FFF" />
                            <Text style={styles.categoryText}>{news.tag}</Text>
                        </View>

                        <View style={styles.dateContainer}>
                            <Ionicons name="calendar-outline" size={14} color="#999" />
                            <Text style={styles.dateText}>{news.date}</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{news.title}</Text>

                    {/* Author Info */}
                    {news.author && (
                        <View style={styles.authorContainer}>
                            <View style={styles.authorAvatar}>
                                <Ionicons name="person" size={18} color="#E0B820" />
                            </View>
                            <View style={styles.authorInfo}>
                                <Text style={styles.authorLabel}>Written by</Text>
                                <Text style={styles.authorName}>{news.author}</Text>
                            </View>
                        </View>
                    )}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Main Content */}
                    <Text style={styles.description}>{news.description}</Text>

                    <Text style={styles.description}>{news.content}</Text>
                    {/* Additional Content Sections */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIconContainer}>
                                <Ionicons name="bulb-outline" size={20} color="#E0B820" />
                            </View>
                            <Text style={styles.sectionTitle}>Key Highlights</Text>
                        </View>
                        <View style={styles.highlightBox}>
                            <Text style={styles.highlightText}>
                                Stay tuned for more updates and detailed insights on this topic. We'll continue to bring you the latest information as it becomes available.
                            </Text>
                        </View>
                    </View>

                    {/* Action Cards */}
                    {/* <View style={styles.actionCardsContainer}>
                        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
                            <View style={[styles.actionIcon, { backgroundColor: '#FFE5E5' }]}>
                                <Ionicons name="bookmark-outline" size={24} color="#FF6B6B" />
                            </View>
                            <Text style={styles.actionText}>Save Article</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
                            <View style={[styles.actionIcon, { backgroundColor: '#E5F5FF' }]}>
                                <Ionicons name="chatbubble-outline" size={24} color="#4ECDC4" />
                            </View>
                            <Text style={styles.actionText}>Comment</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard} onPress={handleShare} activeOpacity={0.7}>
                            <View style={[styles.actionIcon, { backgroundColor: '#FFF5E5' }]}>
                                <Ionicons name="share-social-outline" size={24} color="#FFD93D" />
                            </View>
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* Related Articles Section */}
                    {/* <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIconContainer}>
                                <Ionicons name="newspaper-outline" size={20} color="#E0B820" />
                            </View>
                            <Text style={styles.sectionTitle}>Related Articles</Text>
                        </View>
                        <View style={styles.relatedCard}>
                            <Ionicons name="document-text-outline" size={48} color="#DDD" />
                            <Text style={styles.relatedText}>More articles coming soon</Text>
                        </View>
                    </View> */}

                    {/* Bottom Spacing */}
                    <View style={{ height: scale(40) }} />
                </Animated.View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA"
    },
    animatedHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4
            },
            android: {
                elevation: 4
            }
        })
    },
    headerGradient: {
        paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 0,
        paddingBottom: 12
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scale(16)
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)"
    },
    headerTitle: {
        flex: 1,
        fontSize: scale(16),
        fontWeight: "600",
        color: "#FFF",
        textAlign: "center",
        marginHorizontal: scale(12)
    },
    heroContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.45,
        position: "relative"
    },
    heroImage: {
        width: "100%",
        height: "100%"
    },
    heroGradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "50%"
    },
    backButton: {
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 10,
        left: scale(16),
        zIndex: 10
    },
    backButtonGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4
            },
            android: {
                elevation: 4
            }
        })
    },
    shareButton: {
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 10,
        right: scale(16),
        zIndex: 10
    },
    shareButtonGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4
            },
            android: {
                elevation: 4
            }
        })
    },
    contentContainer: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: scale(30),
        borderTopRightRadius: scale(30),
        marginTop: -scale(30),
        paddingHorizontal: scale(20),
        paddingTop: scale(24),
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8
            },
            android: {
                elevation: 8
            }
        })
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: scale(16)
    },
    categoryBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scale(12),
        paddingVertical: scale(6),
        borderRadius: scale(20),
        gap: scale(6)
    },
    categoryText: {
        color: "#FFF",
        fontSize: scale(12),
        fontWeight: "700",
        letterSpacing: 0.5,
        textTransform: "uppercase"
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(6)
    },
    dateText: {
        fontSize: scale(13),
        color: "#999",
        fontWeight: "500"
    },
    title: {
        fontSize: scale(28),
        fontWeight: "700",
        color: "#222",
        lineHeight: scale(36),
        marginBottom: scale(16)
    },
    authorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: scale(20),
        gap: scale(12)
    },
    authorAvatar: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(22),
        backgroundColor: "#FFF5E5",
        justifyContent: "center",
        alignItems: "center"
    },
    authorInfo: {
        flex: 1
    },
    authorLabel: {
        fontSize: scale(11),
        color: "#999",
        marginBottom: scale(2)
    },
    authorName: {
        fontSize: scale(15),
        fontWeight: "600",
        color: "#222"
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F0",
        marginBottom: scale(24)
    },
    description: {
        fontSize: scale(16),
        lineHeight: scale(26),
        color: "#444",
        marginBottom: scale(24)
    },
    section: {
        marginBottom: scale(28)
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: scale(16),
        gap: scale(10)
    },
    sectionIconContainer: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: "#FFF5E5",
        justifyContent: "center",
        alignItems: "center"
    },
    sectionTitle: {
        fontSize: scale(18),
        fontWeight: "700",
        color: "#222"
    },
    highlightBox: {
        backgroundColor: "#FFF9E6",
        borderLeftWidth: 4,
        borderLeftColor: "#E0B820",
        padding: scale(16),
        borderRadius: scale(12)
    },
    highlightText: {
        fontSize: scale(14),
        lineHeight: scale(22),
        color: "#666",
        fontStyle: "italic"
    },
    actionCardsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: scale(28),
        gap: scale(12)
    },
    actionCard: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: scale(16),
        padding: scale(16),
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F0F0F0",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 4
            },
            android: {
                elevation: 2
            }
        })
    },
    actionIcon: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: scale(8)
    },
    actionText: {
        fontSize: scale(12),
        fontWeight: "600",
        color: "#666"
    },
    relatedCard: {
        backgroundColor: "#FAFAFA",
        borderRadius: scale(16),
        padding: scale(40),
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F0F0F0",
        borderStyle: "dashed"
    },
    relatedText: {
        fontSize: scale(14),
        color: "#999",
        marginTop: scale(12),
        fontWeight: "500"
    }
});