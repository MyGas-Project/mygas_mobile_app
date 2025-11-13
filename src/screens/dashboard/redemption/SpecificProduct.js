import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthContext';
import { BASE_URL, processResponse } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
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

// Format date helper
const formatPromoDate = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return "";
    }
};

export default function SpecificProduct({ visible, product, onClose, onCartUpdated, userPoints, selectedStation, onShowStationModal }) {
    const [quantity, setQuantity] = useState(1);
    const { userInfo, userDetails } = useContext(AuthContext);

    if (!product) return null;

    const canAfford = userPoints >= (product.points * quantity);
    const isOutOfStock = product.quantity === 0;
    const maxQuantity = Math.min(product.quantity, 10); // Max 10 items per order
    const totalPoints = product.points * quantity;

    const handleIncrement = () => {
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        // Check if station is selected
        if (!selectedStation) {
            // Close product modal first
            // handleCloseProduct();
            // Then show station selection modal
            // setTimeout(() => {
            //     onShowStationModal();
            // }, 300);
            onShowStationModal(product);
            return;
        }

        try {
            fetch(`${BASE_URL}customer/check-inventory?inventory_id=${product.id}&station_id=${selectedStation.id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                }
            })
                .then(processResponse)
                .then(async (res) => {
                    const { statusCode, data } = res;
                    if (statusCode == 404) {
                        Alert.alert(
                            'Product Not Found',
                            'The selected product is not available in the selected station.',
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        onShowStationModal();
                                    }
                                },
                            ]
                        );
                        return;
                    }
                })
                .catch((err) => console.log(err));
        } catch (error) {
            return;
        }

        // handleCloseProduct();

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
                    inventory_id: product.id,
                    station_id: selectedStation.id,
                    quantity: quantity,
                    bar_code: userDetails.bar_code,
                    points: product.points
                })
            })
                .then(processResponse)
                .then(async (res) => {
                    const { statusCode, data } = res;
                    // console.log(res);
                    if (statusCode == 200 || statusCode == 201) {
                        if (onCartUpdated) {
                            onCartUpdated();
                        }

                        handleCloseProduct();
                    }
                })
                .catch((err) => console.log(err));

        } catch (error) {
            console.error("Error redeeming product:", error);
        }
    };

    const handleCloseProduct = () => {
        setQuantity(1);
        onClose();
    };

    const promoDateText = () => {
        if (!product.isWeeklyPromo || !product.promoStartDate || !product.promoEndDate) {
            return "";
        }

        const startDate = formatPromoDate(product.promoStartDate);
        const endDate = formatPromoDate(product.promoEndDate);

        if (startDate === endDate) {
            return `Valid on ${startDate}`;
        }
        return `Valid from ${startDate} to ${endDate}`;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCloseProduct}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.overlayTouchable}
                    activeOpacity={1}
                    onPress={handleCloseProduct}
                />

                <View style={styles.modalContent}>
                    {/* Header with Close Button */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCloseProduct}
                        >
                            <Ionicons name="close" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.modalBody}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* Product Image */}
                        <View style={styles.imageSection}>
                            <Image
                                source={product.image ? { uri: product.image } : require('../../../../assets/my.png')}
                                style={styles.productImage}
                            />

                            {/* Badges on Image */}
                            {product.isWeeklyPromo && (
                                <View style={styles.promoBadge}>
                                    <Ionicons name="flash" size={14} color="#fff" />
                                    <Text style={styles.promoBadgeText}>PROMO</Text>
                                </View>
                            )}

                            {product.quantity > 0 && product.quantity <= 5 && (
                                <View style={[styles.stockBadge, styles.lowStockBadge]}>
                                    <Ionicons name="alert-circle" size={14} color="#fff" />
                                    <Text style={styles.stockBadgeText}>{product.quantity} left</Text>
                                </View>
                            )}

                            {isOutOfStock && (
                                <View style={[styles.stockBadge, styles.outOfStockBadge]}>
                                    <Text style={styles.stockBadgeText}>Sold Out</Text>
                                </View>
                            )}
                        </View>

                        {/* Station Warning - Show if no station selected */}
                        {!selectedStation && (
                            <View style={styles.stationWarningSection}>
                                <Ionicons name="location" size={20} color="#F97316" />
                                <View style={styles.stationWarningContent}>
                                    <Text style={styles.stationWarningTitle}>Station Required</Text>
                                    <Text style={styles.stationWarningText}>
                                        Please select a station to continue with your redemption.
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Product Details */}
                        <View style={styles.detailsSection}>
                            {/* Category Badge */}
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{product.category}</Text>
                            </View>

                            {/* Product Name */}
                            <Text style={styles.productName}>{product.name}</Text>

                            {/* Product Description */}
                            <Text style={styles.productDescription}>{product.description}</Text>

                            {/* Promo Information */}
                            {product.isWeeklyPromo && (
                                <View style={styles.promoSection}>
                                    <LinearGradient
                                        colors={['#F5F3FF', '#EDE9FE']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.promoGradient}
                                    >
                                        <View style={styles.promoHeader}>
                                            <Ionicons name="flash" size={20} color="#8B5CF6" />
                                            <Text style={styles.promoTitle}>Special Promo</Text>
                                        </View>

                                        {product.promoDescription && (
                                            <Text style={styles.promoDescriptionText}>
                                                {product.promoDescription}
                                            </Text>
                                        )}

                                        {promoDateText() && (
                                            <View style={styles.promoDateContainer}>
                                                <Ionicons name="calendar-outline" size={16} color="#8B5CF6" />
                                                <Text style={styles.promoDateText}>{promoDateText()}</Text>
                                            </View>
                                        )}
                                    </LinearGradient>
                                </View>
                            )}

                            {/* Points Display */}
                            <View style={styles.pointsSection}>
                                <Text style={styles.pointsLabel}>Points Required</Text>
                                <View style={styles.pointsDisplay}>
                                    <Image
                                        source={require('../../../../assets/my.png')}
                                        style={styles.pointsIcon}
                                    />

                                    {product.isWeeklyPromo && product.originalPoints ? (
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.originalPoints}>
                                                {product.originalPoints.toLocaleString()}
                                            </Text>
                                            <Text style={styles.productPoints}>
                                                {product.points.toLocaleString()}
                                            </Text>
                                            <View style={styles.discountBadge}>
                                                <Text style={styles.discountText}>
                                                    -{Math.round(((product.originalPoints - product.points) / product.originalPoints) * 100)}%
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={styles.productPoints}>
                                            {product.points.toLocaleString()}
                                        </Text>
                                    )}

                                    <Text style={styles.pointsSuffix}>pts</Text>
                                </View>
                            </View>

                            {/* Quantity Selector */}
                            {!isOutOfStock && (
                                <View style={styles.quantitySection}>
                                    <Text style={styles.quantityLabel}>Quantity</Text>
                                    <View style={styles.quantityControls}>
                                        <TouchableOpacity
                                            style={[
                                                styles.quantityButton,
                                                quantity === 1 && styles.quantityButtonDisabled
                                            ]}
                                            onPress={handleDecrement}
                                            disabled={quantity === 1}
                                        >
                                            <Ionicons
                                                name="remove"
                                                size={20}
                                                color={quantity === 1 ? "#D1D5DB" : "#374151"}
                                            />
                                        </TouchableOpacity>

                                        <View style={styles.quantityDisplay}>
                                            <Text style={styles.quantityText}>{quantity}</Text>
                                        </View>

                                        <TouchableOpacity
                                            style={[
                                                styles.quantityButton,
                                                quantity === maxQuantity && styles.quantityButtonDisabled
                                            ]}
                                            onPress={handleIncrement}
                                            disabled={quantity === maxQuantity}
                                        >
                                            <Ionicons
                                                name="add"
                                                size={20}
                                                color={quantity === maxQuantity ? "#D1D5DB" : "#374151"}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {quantity === maxQuantity && product.quantity > 10 && (
                                        <Text style={styles.quantityNote}>
                                            Maximum 10 items per order
                                        </Text>
                                    )}
                                </View>
                            )}

                            {/* Total Points */}
                            {!isOutOfStock && (
                                <View style={styles.totalSection}>
                                    <Text style={styles.totalLabel}>Total Points</Text>
                                    <View style={styles.totalDisplay}>
                                        <Image
                                            source={require('../../../../assets/my.png')}
                                            style={styles.totalIcon}
                                        />
                                        <Text style={styles.totalPoints}>
                                            {totalPoints.toLocaleString()}
                                        </Text>
                                        <Text style={styles.totalSuffix}>pts</Text>
                                    </View>
                                </View>
                            )}

                            {/* Points Balance Warning */}
                            {!canAfford && !isOutOfStock && (
                                <View style={styles.warningSection}>
                                    <Ionicons name="alert-circle" size={20} color="#DC2626" />
                                    <Text style={styles.warningText}>
                                        Insufficient points. You need {(totalPoints - userPoints).toLocaleString()} more points.
                                    </Text>
                                </View>
                            )}

                            {/* Product Info */}
                            <View style={styles.infoSection}>
                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="cube-outline" size={20} color="#6B7280" />
                                        <Text style={styles.infoLabel}>Stock</Text>
                                    </View>
                                    <Text style={[
                                        styles.infoValue,
                                        product.quantity === 0 && styles.outOfStockText,
                                        product.quantity > 0 && product.quantity <= 5 && styles.lowStockText
                                    ]}>
                                        {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} available`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer with Add to Cart Button */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[
                                styles.addToCartButton,
                                (!canAfford || isOutOfStock) && styles.addToCartButtonDisabled
                            ]}
                            onPress={handleAddToCart}
                            disabled={!canAfford || isOutOfStock}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={(!canAfford || isOutOfStock) ? ['#D1D5DB', '#9CA3AF'] :
                                    !selectedStation ? ['#F97316', '#EA580C'] :
                                        ['#EF4444', '#DC2626']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.addToCartGradient}
                            >
                                <Ionicons
                                    name={!selectedStation ? "location" : "cart"}
                                    size={20}
                                    color="#fff"
                                />
                                <Text style={styles.addToCartText}>
                                    {isOutOfStock ? 'Out of Stock' :
                                        !canAfford ? 'Insufficient Points' :
                                            !selectedStation ? 'Select Pick-up Station' :
                                                'Add to Cart'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    overlayTouchable: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: getResponsiveValue(24, 28, 32, 36),
        borderTopRightRadius: getResponsiveValue(24, 28, 32, 36),
        maxHeight: '90%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    modalHeader: {
        alignItems: 'center',
        paddingTop: getResponsiveValue(45, 15, 16, 18),
        paddingHorizontal: getResponsiveValue(10, 24, 28, 32),
        paddingBottom: getResponsiveValue(8, 10, 12, 14),
    },
    closeButton: {
        position: 'absolute',
        right: getResponsiveValue(20, 24, 28, 32),
        top: getResponsiveValue(12, 14, 16, 18),
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    },
    imageSection: {
        width: '100%',
        height: getResponsiveValue(150, 280, 320, 360),
        borderRadius: getResponsiveValue(16, 18, 20, 22),
        overflow: 'hidden',
        marginBottom: getResponsiveValue(20, 24, 28, 32),
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: '#F9FAFB',
    },
    promoBadge: {
        position: 'absolute',
        top: getResponsiveValue(12, 14, 16, 18),
        left: getResponsiveValue(12, 14, 16, 18),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B5CF6',
        paddingHorizontal: getResponsiveValue(10, 12, 14, 16),
        paddingVertical: getResponsiveValue(6, 7, 8, 9),
        borderRadius: getResponsiveValue(8, 9, 10, 11),
        gap: 4,
    },
    promoBadgeText: {
        color: '#fff',
        fontSize: getResponsiveValue(11, 12, 13, 14),
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    stockBadge: {
        position: 'absolute',
        top: getResponsiveValue(12, 14, 16, 18),
        right: getResponsiveValue(12, 14, 16, 18),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: getResponsiveValue(10, 12, 14, 16),
        paddingVertical: getResponsiveValue(6, 7, 8, 9),
        borderRadius: getResponsiveValue(8, 9, 10, 11),
        gap: 4,
    },
    lowStockBadge: {
        backgroundColor: '#F97316',
    },
    outOfStockBadge: {
        backgroundColor: '#6B7280',
    },
    stockBadgeText: {
        color: '#fff',
        fontSize: getResponsiveValue(11, 12, 13, 14),
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    stationWarningSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF7ED',
        padding: getResponsiveValue(16, 18, 20, 22),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        gap: getResponsiveValue(12, 14, 16, 18),
        marginBottom: getResponsiveValue(20, 24, 28, 32),
        borderLeftWidth: 4,
        borderLeftColor: '#F97316',
    },
    stationWarningContent: {
        flex: 1,
    },
    stationWarningTitle: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: '700',
        color: '#EA580C',
        marginBottom: 4,
    },
    stationWarningText: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#C2410C',
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    detailsSection: {
        paddingBottom: getResponsiveValue(20, 24, 28, 32),
    },
    categoryBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
        paddingVertical: getResponsiveValue(6, 7, 8, 9),
        borderRadius: getResponsiveValue(8, 9, 10, 11),
        alignSelf: 'flex-start',
        marginBottom: getResponsiveValue(12, 14, 16, 18),
    },
    categoryText: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#92400E',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    productName: {
        fontSize: getResponsiveValue(24, 26, 28, 30),
        fontWeight: '800',
        color: '#111827',
        marginBottom: getResponsiveValue(10, 12, 14, 16),
        lineHeight: getResponsiveValue(30, 32, 34, 36),
    },
    productDescription: {
        fontSize: getResponsiveValue(15, 16, 17, 18),
        color: '#6B7280',
        lineHeight: getResponsiveValue(22, 24, 26, 28),
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    promoSection: {
        marginBottom: getResponsiveValue(20, 24, 28, 32),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        overflow: 'hidden',
    },
    promoGradient: {
        padding: getResponsiveValue(16, 18, 20, 22),
    },
    promoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: getResponsiveValue(8, 10, 12, 14),
    },
    promoTitle: {
        fontSize: getResponsiveValue(16, 17, 18, 19),
        fontWeight: '700',
        color: '#8B5CF6',
    },
    promoDescriptionText: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        color: '#6B21A8',
        fontStyle: 'italic',
        marginBottom: getResponsiveValue(8, 10, 12, 14),
    },
    promoDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    promoDateText: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#8B5CF6',
        fontWeight: '600',
    },
    pointsSection: {
        backgroundColor: '#FEF3C7',
        padding: getResponsiveValue(16, 18, 20, 22),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    pointsLabel: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#92400E',
        fontWeight: '600',
        marginBottom: getResponsiveValue(8, 10, 12, 14),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pointsDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(8, 10, 12, 14),
    },
    pointsIcon: {
        width: getResponsiveValue(32, 36, 40, 44),
        height: getResponsiveValue(32, 36, 40, 44),
        resizeMode: 'contain',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(10, 12, 14, 16),
    },
    originalPoints: {
        fontSize: getResponsiveValue(20, 22, 24, 26),
        fontWeight: '600',
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    productPoints: {
        fontSize: getResponsiveValue(28, 30, 32, 34),
        fontWeight: '800',
        color: '#F59E0B',
    },
    pointsSuffix: {
        fontSize: getResponsiveValue(16, 17, 18, 19),
        color: '#92400E',
        fontWeight: '600',
    },
    discountBadge: {
        backgroundColor: '#DC2626',
        paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
        paddingVertical: getResponsiveValue(4, 5, 6, 7),
        borderRadius: getResponsiveValue(6, 7, 8, 9),
    },
    discountText: {
        color: '#fff',
        fontSize: getResponsiveValue(12, 13, 14, 15),
        fontWeight: '700',
    },
    quantitySection: {
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    quantityLabel: {
        fontSize: getResponsiveValue(16, 17, 18, 19),
        fontWeight: '700',
        color: '#111827',
        marginBottom: getResponsiveValue(12, 14, 16, 18),
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(16, 18, 20, 22),
    },
    quantityButton: {
        width: getResponsiveValue(44, 48, 52, 56),
        height: getResponsiveValue(44, 48, 52, 56),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    quantityButtonDisabled: {
        backgroundColor: '#F9FAFB',
        borderColor: '#F3F4F6',
    },
    quantityDisplay: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        paddingVertical: getResponsiveValue(12, 14, 16, 18),
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    quantityText: {
        fontSize: getResponsiveValue(20, 22, 24, 26),
        fontWeight: '700',
        color: '#111827',
    },
    quantityNote: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#F97316',
        marginTop: getResponsiveValue(8, 10, 12, 14),
        fontStyle: 'italic',
    },
    totalSection: {
        backgroundColor: '#111827',
        padding: getResponsiveValue(16, 18, 20, 22),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: getResponsiveValue(16, 18, 20, 22),
    },
    totalLabel: {
        fontSize: getResponsiveValue(16, 17, 18, 19),
        fontWeight: '700',
        color: '#fff',
    },
    totalDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(8, 10, 12, 14),
    },
    totalIcon: {
        width: getResponsiveValue(24, 26, 28, 30),
        height: getResponsiveValue(24, 26, 28, 30),
        resizeMode: 'contain',
    },
    totalPoints: {
        fontSize: getResponsiveValue(24, 26, 28, 30),
        fontWeight: '800',
        color: '#FBBF24',
    },
    totalSuffix: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        color: '#D1D5DB',
        fontWeight: '600',
    },
    warningSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: getResponsiveValue(14, 16, 18, 20),
        borderRadius: getResponsiveValue(10, 12, 14, 16),
        gap: getResponsiveValue(10, 12, 14, 16),
        marginBottom: getResponsiveValue(16, 18, 20, 22),
    },
    warningText: {
        flex: 1,
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#DC2626',
        fontWeight: '600',
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    infoSection: {
        backgroundColor: '#F9FAFB',
        padding: getResponsiveValue(16, 18, 20, 22),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: getResponsiveValue(12, 14, 16, 18),
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(10, 12, 14, 16),
    },
    infoLabel: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        color: '#6B7280',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: getResponsiveValue(15, 16, 17, 18),
        color: '#111827',
        fontWeight: '700',
    },
    outOfStockText: {
        color: '#DC2626',
    },
    lowStockText: {
        color: '#F97316',
    },
    modalFooter: {
        padding: getResponsiveValue(20, 24, 28, 32),
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    addToCartButton: {
        borderRadius: getResponsiveValue(14, 16, 18, 20),
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    addToCartButtonDisabled: {
        opacity: 0.6,
    },
    addToCartGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: getResponsiveValue(16, 18, 20, 22),
        gap: getResponsiveValue(10, 12, 14, 16),
    },
    addToCartText: {
        fontSize: getResponsiveValue(17, 18, 19, 20),
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
});