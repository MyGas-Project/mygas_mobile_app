import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    FlatList,
    Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { PointsDetailContext } from "../../context/PointsDetails";
import Navbar from "../../components/Navbar";
import { BASE_URL, processResponse } from "../../config";
import CartComponent from "../../components/CartComponent";

const { width, height } = Dimensions.get("window");

// Enhanced responsive breakpoints
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeTablet = width >= 1024;

// Responsive helper functions
const getResponsiveValue = (small, medium, tablet, large) => {
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    if (isTablet) return tablet;
    return large;
};

const getColumnCount = () => {
    if (isSmallDevice) return 2;
    if (isMediumDevice) return 2;
    if (isTablet) return 3;
    return 4;
};

const getCardWidth = () => {
    const columns = getColumnCount();
    const padding = getResponsiveValue(16, 20, 28, 36);
    const spacing = getResponsiveValue(12, 16, 20, 24);
    return (width - padding * 2 - spacing * (columns - 1)) / columns;
};

// Format date helper
const formatPromoDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return "";
    }
};

// Enhanced Product Card Component
const ProductCard = React.memo(({ product, userPoints, onRedeemPress, cardWidth }) => {
    const canAfford = userPoints >= product.points;
    const isOutOfStock = product.quantity === 0;
    const isLowStock = product.quantity > 0 && product.quantity <= 5;

    const promoDateText = useMemo(() => {
        if (!product.isWeeklyPromo || !product.promoStartDate || !product.promoEndDate) {
            return "";
        }

        const startDate = formatPromoDate(product.promoStartDate);
        const endDate = formatPromoDate(product.promoEndDate);

        if (startDate === endDate) {
            return startDate;
        }
        return `${startDate} - ${endDate}`;
    }, [product.isWeeklyPromo, product.promoStartDate, product.promoEndDate]);

    return (
        <TouchableOpacity
            style={[
                styles.productCard,
                { width: cardWidth },
                (!canAfford || isOutOfStock) && styles.productCardDisabled,
            ]}
            activeOpacity={0.7}
            onPress={() => (canAfford && !isOutOfStock) && onRedeemPress(product)}
            disabled={!canAfford || isOutOfStock}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={product.image ? { uri: product.image } : require("../../../assets/my.png")}
                    style={styles.productImage}
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.imageGradient}
                />

                {/* Stock Badge */}
                {isLowStock && (
                    <View style={[styles.stockBadge, styles.lowStockBadge]}>
                        <Ionicons name="alert-circle" size={12} color="#fff" />
                        <Text style={styles.stockBadgeText}>{product.quantity} left</Text>
                    </View>
                )}

                {isOutOfStock && (
                    <View style={[styles.stockBadge, styles.outOfStockBadge]}>
                        <Text style={styles.stockBadgeText}>Sold Out</Text>
                    </View>
                )}

                {/* Promo Badge */}
                {product.isWeeklyPromo && (
                    <View style={styles.promoBadge}>
                        <Ionicons name="flash" size={10} color="#fff" />
                        <Text style={styles.promoBadgeText}>PROMO</Text>
                    </View>
                )}
            </View>

            <View style={styles.productContent}>
                <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                </Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                    {product.description}
                </Text>

                {/* Promo Date Display */}
                {product.isWeeklyPromo && promoDateText && (
                    <View style={styles.promoDateContainer}>
                        <Ionicons name="calendar-outline" size={12} color="#8B5CF6" />
                        <Text style={styles.promoDateText}>{promoDateText}</Text>
                    </View>
                )}

                {/* Promo Description */}
                {product.isWeeklyPromo && product.promoDescription && (
                    <View style={styles.promoDescriptionContainer}>
                        <Text style={styles.promoDescriptionText} numberOfLines={1}>
                            {product.promoDescription}
                        </Text>
                    </View>
                )}

                <View style={styles.productFooter}>
                    <View style={styles.pointsContainer}>
                        <Image
                            source={require("../../../assets/my.png")}
                            style={styles.miniIcon}
                        />

                        {/* Show promo pricing if it's a weekly promo */}
                        {product.isWeeklyPromo && product.originalPoints ? (
                            <View style={styles.priceContainer}>
                                <Text style={styles.originalPoints}>{product.originalPoints}</Text>
                                <Text style={styles.productPoints}>{product.points}</Text>
                            </View>
                        ) : (
                            <Text style={styles.productPoints}>{product.points}</Text>
                        )}

                        <Text style={styles.pointsLabel}>pts</Text>

                        {/* Promo discount badge */}
                        {product.isWeeklyPromo && product.originalPoints && product.originalPoints > product.points && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>
                                    -{Math.round(((product.originalPoints - product.points) / product.originalPoints) * 100)}%
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});

export default function SpecificStationScreen({ navigation }) {
    const { userInfo, userDetails } = useContext(AuthContext);
    const { rewards } = useContext(PointsDetailContext);
    const route = useRoute();

    const { station } = route.params;
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(["All"]);

    const userPoints = rewards?.points || 0;
    const cardWidth = useMemo(() => getCardWidth(), []);

    const getStationProducts = useCallback(async (station_details) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}customer/get-inventories-by-stations/${station_details.id}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );

            const res = await processResponse(response);
            const { statusCode, data } = res;

            if (statusCode === 200 && data?.data?.inventories) {
                const inventoriesArray = data.data.inventories;

                const transformedProducts = inventoriesArray.map(item => {
                    const isPromo = item.is_weekly_promo === 1;
                    const regularPoints = item.points || 0;
                    // Only use promo_points if it exists and is less than regular points
                    const promoPoints = item.promo_points && item.promo_points < regularPoints
                        ? item.promo_points
                        : regularPoints;

                    // Only show as promo if promo_points is actually set and creates a discount
                    const hasValidPromo = isPromo && item.promo_points && item.promo_points < regularPoints;

                    return {
                        id: item.station_inventories_id,
                        name: item.name,
                        description: item.description || "Reward item",
                        points: hasValidPromo ? promoPoints : regularPoints,
                        originalPoints: hasValidPromo ? regularPoints : null,
                        image: item.image_path,
                        category: item.inventory_type_name || "General",
                        quantity: parseFloat(item.quantity) || 0,
                        isWeeklyPromo: hasValidPromo,
                        promoDescription: item.promo_descriptions,
                        promoStartDate: item.promo_start_date,
                        promoEndDate: item.promo_end_date,
                        sellingPrice: item.selling_price,
                    };
                });

                setProducts(transformedProducts);

                const uniqueCategories = ["All", ...new Set(
                    transformedProducts
                        .map(p => p.category)
                        .filter(Boolean)
                )];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error("Error fetching station products:", error);
        } finally {
            setLoading(false);
        }
    }, [userInfo.token]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            return selectedCategory === "All" || product.category === selectedCategory;
        });
    }, [products, selectedCategory]);

    const handleRedeemPress = useCallback(async (product) => {
        try {
            fetch(`${BASE_URL}customer/add-cart`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    customer_id: userDetails.user_id,
                    station_inventories_id: product.id,
                    quantity: 1,
                    bar_code: userDetails.bar_code,
                    points: product.points
                })
            })
                .then(processResponse)
                .then((res) => {
                    const { statusCode, data } = res;
                    console.log(data);
                    navigation.navigate("CartScreens");
                })
                .catch((err) => console.log(err));

        } catch (error) {
            console.error("Error redeeming product:", error);
        }
    }, [userInfo.token, userDetails, navigation]);

    useEffect(() => {
        getStationProducts(station);
    }, [station, getStationProducts]);

    const renderProductItem = useCallback(({ item }) => (
        <ProductCard
            product={item}
            userPoints={userPoints}
            onRedeemPress={handleRedeemPress}
            cardWidth={cardWidth}
        />
    ), [userPoints, handleRedeemPress, cardWidth]);

    const keyExtractor = useCallback((item) => item.id.toString(), []);

    return (
        <View style={styles.container}>
            {/* Enhanced Header */}
            <ImageBackground
                resizeMode="stretch"
                source={require("../../../assets/mygas-header.jpeg")}
                style={styles.header}
            >
                <LinearGradient
                    colors={["rgba(249, 250, 141, 0.95)", "rgba(249, 250, 141, 0.7)", "transparent"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerGradient}
                />
                <Image
                    source={require("../../../assets/mygas_logo.png")}
                    style={styles.logo}
                />
                <Navbar
                    onProfilePress={() => console.log("Profile tapped")}
                    onNotifPress={() => console.log("Notifications tapped")}
                />
            </ImageBackground>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
            >
                <View style={styles.contentContainer}>
                    {/* Enhanced Station Info Card */}
                    <View style={styles.stationCard}>
                        <View style={styles.stationHeader}>
                            <View style={styles.stationInfo}>
                                <Text style={styles.stationName}>{station.station_name}</Text>
                                <View style={styles.statusContainer}>
                                    <View
                                        style={[
                                            styles.statusIndicator,
                                            { backgroundColor: station.is_open ? "#10B981" : "#EF4444" },
                                        ]}
                                    />
                                    <Text style={[styles.statusText, { color: station.is_open ? "#10B981" : "#EF4444" }]}>
                                        {station.is_open ? "Open Now" : "Closed"}
                                    </Text>
                                    {station.hours && (
                                        <Text style={styles.hoursText}>• {station.hours}</Text>
                                    )}
                                </View>
                            </View>
                            {station.rating && (
                                <View style={styles.ratingBadge}>
                                    <Ionicons name="star" size={16} color="#F59E0B" />
                                    <Text style={styles.ratingText}>{station.rating}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.stationDetails}>
                            <View style={styles.detailRow}>
                                <Ionicons name="location" size={18} color="#6B7280" />
                                <Text style={styles.detailText}>{station.address}</Text>
                            </View>

                            {station.distance && (
                                <View style={styles.detailRow}>
                                    <Ionicons name="navigate" size={18} color="#EF4444" />
                                    <Text style={styles.detailText}>{station.distance} away</Text>
                                </View>
                            )}
                        </View>

                        {station.amenities && station.amenities.length > 0 && (
                            <View style={styles.amenitiesSection}>
                                <Text style={styles.amenitiesTitle}>Available Amenities</Text>
                                <View style={styles.amenitiesGrid}>
                                    {station.amenities.map((amenity, index) => (
                                        <View key={index} style={styles.amenityChip}>
                                            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                            <Text style={styles.amenityText}>{amenity}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Enhanced Points Display */}
                    <View style={styles.pointsCard}>
                        <LinearGradient
                            colors={["#FEF3C7", "#FDE68A"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.pointsGradient}
                        >
                            <View style={styles.pointsContent}>
                                <View>
                                    <Text style={styles.pointsTitle}>Available Points</Text>
                                    <View style={styles.pointsValueContainer}>
                                        <Image
                                            source={require("../../../assets/my.png")}
                                            style={styles.pointsIcon}
                                        />
                                        <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
                                    </View>
                                </View>
                                <View style={styles.pointsIconContainer}>
                                    <Ionicons name="wallet" size={32} color="#F59E0B" />
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Products Section */}
                    <View style={styles.productsSection}>
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>Exclusive Rewards</Text>
                                <Text style={styles.sectionSubtitle}>
                                    Redeem your points for amazing rewards
                                </Text>
                            </View>
                            <View style={styles.productCountBadge}>
                                <Text style={styles.productCountText}>
                                    {filteredProducts.length} items
                                </Text>
                            </View>
                        </View>

                        {/* Enhanced Category Tabs */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesScroll}
                            contentContainerStyle={styles.categoriesContainer}
                        >
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategory === category && styles.categoryChipActive,
                                    ]}
                                    onPress={() => setSelectedCategory(category)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.categoryChipText,
                                            selectedCategory === category && styles.categoryChipTextActive,
                                        ]}
                                    >
                                        {category}
                                    </Text>
                                    {selectedCategory === category && (
                                        <View style={styles.categoryChipDot} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Products Grid */}
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#EF4444" />
                                <Text style={styles.loadingText}>Loading rewards...</Text>
                            </View>
                        ) : filteredProducts.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconContainer}>
                                    <Ionicons name="gift-outline" size={64} color="#D1D5DB" />
                                </View>
                                <Text style={styles.emptyTitle}>No Rewards Available</Text>
                                <Text style={styles.emptySubtitle}>
                                    Check back soon for exciting new rewards!
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredProducts}
                                renderItem={renderProductItem}
                                keyExtractor={keyExtractor}
                                numColumns={getColumnCount()}
                                scrollEnabled={false}
                                columnWrapperStyle={styles.productRow}
                                contentContainerStyle={styles.productsGrid}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
            <CartComponent station={station} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        height: getResponsiveValue(140, 160, 190, 210),
        width: "100%",
    },
    headerGradient: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    logo: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [
            { translateX: getResponsiveValue(-35, -45, -55, -65) },
            { translateY: getResponsiveValue(-35, -45, -55, -65) }
        ],
        width: getResponsiveValue(65, 75, 90, 110),
        height: getResponsiveValue(65, 75, 90, 110),
        resizeMode: "contain",
        zIndex: 2,
    },
    scrollContainer: {
        flex: 1,
        marginTop: -25,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: getResponsiveValue(100, 120, 140, 160),
    },
    contentContainer: {
        backgroundColor: "#F9FAFB",
        borderTopLeftRadius: getResponsiveValue(24, 28, 32, 36),
        borderTopRightRadius: getResponsiveValue(24, 28, 32, 36),
        paddingHorizontal: getResponsiveValue(16, 20, 28, 36),
        paddingTop: getResponsiveValue(24, 28, 32, 36),
        minHeight: "100%",
    },
    stationCard: {
        backgroundColor: "#fff",
        borderRadius: getResponsiveValue(16, 20, 24, 28),
        padding: getResponsiveValue(20, 24, 28, 32),
        marginBottom: getResponsiveValue(16, 20, 24, 28),
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    stationHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: getResponsiveValue(16, 20, 24, 28),
    },
    stationInfo: {
        flex: 1,
    },
    stationName: {
        fontSize: getResponsiveValue(20, 22, 24, 26),
        fontWeight: "700",
        color: "#111827",
        marginBottom: getResponsiveValue(8, 10, 12, 14),
        letterSpacing: -0.5,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        fontWeight: "600",
    },
    hoursText: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: "#6B7280",
        marginLeft: 6,
    },
    ratingBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFBEB",
        paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
        paddingVertical: getResponsiveValue(6, 8, 10, 12),
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        gap: 4,
    },
    ratingText: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: "700",
        color: "#F59E0B",
    },
    stationDetails: {
        gap: getResponsiveValue(12, 14, 16, 18),
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: getResponsiveValue(10, 12, 14, 16),
    },
    detailText: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: "#4B5563",
        flex: 1,
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    amenitiesSection: {
        marginTop: getResponsiveValue(16, 20, 24, 28),
        paddingTop: getResponsiveValue(16, 20, 24, 28),
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    amenitiesTitle: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: "600",
        color: "#374151",
        marginBottom: getResponsiveValue(12, 14, 16, 18),
    },
    amenitiesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: getResponsiveValue(8, 10, 12, 14),
    },
    amenityChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0FDF4",
        paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
        paddingVertical: getResponsiveValue(6, 8, 10, 12),
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        gap: 6,
    },
    amenityText: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: "#065F46",
        fontWeight: "500",
    },
    pointsCard: {
        borderRadius: getResponsiveValue(16, 20, 24, 28),
        marginBottom: getResponsiveValue(24, 28, 32, 36),
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    pointsGradient: {
        padding: getResponsiveValue(20, 24, 28, 32),
    },
    pointsContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pointsTitle: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: "#92400E",
        fontWeight: "600",
        marginBottom: getResponsiveValue(8, 10, 12, 14),
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    pointsValueContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: getResponsiveValue(8, 10, 12, 14),
    },
    pointsIcon: {
        width: getResponsiveValue(28, 32, 36, 40),
        height: getResponsiveValue(28, 32, 36, 40),
        resizeMode: "contain",
    },
    pointsValue: {
        fontSize: getResponsiveValue(28, 32, 36, 40),
        fontWeight: "800",
        color: "#92400E",
        letterSpacing: -1,
    },
    pointsIconContainer: {
        width: getResponsiveValue(56, 64, 72, 80),
        height: getResponsiveValue(56, 64, 72, 80),
        borderRadius: getResponsiveValue(28, 32, 36, 40),
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    productsSection: {
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    sectionTitle: {
        fontSize: getResponsiveValue(22, 24, 26, 28),
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: "#6B7280",
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    productCountBadge: {
        backgroundColor: "#FEE2E2",
        paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
        paddingVertical: getResponsiveValue(6, 8, 10, 12),
        borderRadius: getResponsiveValue(8, 10, 12, 14),
    },
    productCountText: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: "#DC2626",
        fontWeight: "600",
    },
    categoriesScroll: {
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    categoriesContainer: {
        paddingRight: getResponsiveValue(16, 20, 24, 28),
        gap: getResponsiveValue(10, 12, 14, 16),
    },
    categoryChip: {
        paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
        paddingVertical: getResponsiveValue(10, 12, 14, 16),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        backgroundColor: "#fff",
        marginRight: getResponsiveValue(10, 12, 14, 16),
        borderWidth: 2,
        borderColor: "#E5E7EB",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    categoryChipActive: {
        backgroundColor: "#EF4444",
        borderColor: "#EF4444",
    },
    categoryChipText: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: "#6B7280",
        fontWeight: "600",
    },
    categoryChipTextActive: {
        color: "#fff",
    },
    categoryChipDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: getResponsiveValue(60, 70, 80, 90),
    },
    loadingText: {
        marginTop: getResponsiveValue(16, 20, 24, 28),
        fontSize: getResponsiveValue(14, 15, 16, 17),
        color: "#6B7280",
        fontWeight: "500",
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: getResponsiveValue(60, 70, 80, 90),
    },
    emptyIconContainer: {
        width: getResponsiveValue(100, 110, 120, 130),
        height: getResponsiveValue(100, 110, 120, 130),
        borderRadius: getResponsiveValue(50, 55, 60, 65),
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    emptyTitle: {
        fontSize: getResponsiveValue(18, 20, 22, 24),
        fontWeight: "700",
        color: "#374151",
        marginBottom: getResponsiveValue(8, 10, 12, 14),
    },
    emptySubtitle: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: "#9CA3AF",
        textAlign: "center",
    },
    productsGrid: {
        paddingBottom: getResponsiveValue(20, 24, 28, 32),
    },
    productRow: {
        justifyContent: "space-between",
        marginBottom: getResponsiveValue(16, 20, 24, 28),
    },
    productCard: {
        backgroundColor: "#fff",
        borderRadius: getResponsiveValue(16, 18, 20, 22),
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    productCardDisabled: {
        opacity: 0.6,
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: getResponsiveValue(120, 140, 160, 180),
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        backgroundColor: "#F9FAFB",
    },
    imageGradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "50%",
    },
    stockBadge: {
        position: "absolute",
        top: getResponsiveValue(8, 10, 12, 14),
        right: getResponsiveValue(8, 10, 12, 14),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
        paddingVertical: getResponsiveValue(4, 5, 6, 7),
        borderRadius: getResponsiveValue(6, 7, 8, 9),
        gap: 4,
    },
    lowStockBadge: {
        backgroundColor: "#F97316",
    },
    outOfStockBadge: {
        backgroundColor: "#6B7280",
    },
    stockBadgeText: {
        color: "#fff",
        fontSize: getResponsiveValue(10, 11, 12, 13),
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.3,
    },
    promoBadge: {
        position: "absolute",
        top: getResponsiveValue(8, 10, 12, 14),
        left: getResponsiveValue(8, 10, 12, 14),
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#8B5CF6",
        paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
        paddingVertical: getResponsiveValue(4, 5, 6, 7),
        borderRadius: getResponsiveValue(6, 7, 8, 9),
        gap: 3,
    },
    promoBadgeText: {
        color: "#fff",
        fontSize: getResponsiveValue(9, 10, 11, 12),
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    productContent: {
        padding: getResponsiveValue(12, 14, 16, 18),
    },
    productName: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: "700",
        color: "#111827",
        marginBottom: getResponsiveValue(6, 7, 8, 9),
        minHeight: getResponsiveValue(36, 40, 44, 48),
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    productDescription: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#6B7280",
        marginBottom: getResponsiveValue(8, 10, 12, 14),
        minHeight: getResponsiveValue(32, 36, 40, 44),
        lineHeight: getResponsiveValue(16, 18, 20, 22),
    },
    promoDateContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F3FF",
        paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
        paddingVertical: getResponsiveValue(4, 5, 6, 7),
        borderRadius: getResponsiveValue(6, 7, 8, 9),
        marginBottom: getResponsiveValue(8, 10, 12, 14),
        gap: 4,
        alignSelf: "flex-start",
    },
    promoDateText: {
        fontSize: getResponsiveValue(10, 11, 12, 13),
        color: "#8B5CF6",
        fontWeight: "600",
    },
    promoDescriptionContainer: {
        backgroundColor: "#FEF3C7",
        paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
        paddingVertical: getResponsiveValue(6, 7, 8, 9),
        borderRadius: getResponsiveValue(6, 7, 8, 9),
        marginBottom: getResponsiveValue(8, 10, 12, 14),
        borderLeftWidth: 3,
        borderLeftColor: "#F59E0B",
    },
    promoDescriptionText: {
        fontSize: getResponsiveValue(10, 11, 12, 13),
        color: "#92400E",
        fontWeight: "600",
        fontStyle: "italic",
    },
    productFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: getResponsiveValue(12, 14, 16, 18),
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        gap: getResponsiveValue(12, 14, 16, 18),
    },
    pointsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: getResponsiveValue(4, 5, 6, 7),
        flex: 1,
        flexWrap: "wrap",
    },
    miniIcon: {
        width: getResponsiveValue(18, 20, 22, 24),
        height: getResponsiveValue(18, 20, 22, 24),
        resizeMode: "contain",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: getResponsiveValue(6, 7, 8, 9),
    },
    originalPoints: {
        fontSize: getResponsiveValue(13, 15, 17, 19),
        fontWeight: "600",
        color: "#9CA3AF",
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
    },
    productPoints: {
        fontSize: getResponsiveValue(17, 19, 21, 23),
        fontWeight: "800",
        color: "#F59E0B",
    },
    pointsLabel: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#9CA3AF",
        fontWeight: "600",
    },
    discountBadge: {
        backgroundColor: "#DC2626",
        paddingHorizontal: getResponsiveValue(6, 7, 8, 9),
        paddingVertical: getResponsiveValue(2, 3, 4, 5),
        borderRadius: getResponsiveValue(4, 5, 6, 7),
        marginLeft: getResponsiveValue(4, 5, 6, 7),
    },
    discountText: {
        color: "#fff",
        fontSize: getResponsiveValue(9, 10, 11, 12),
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});