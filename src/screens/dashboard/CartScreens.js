import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Platform,
    Alert,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { PointsDetailContext } from '../../context/PointsDetails';
import Navbar from '../../components/Navbar';
import { BASE_URL, processResponse } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QrRedemption from './redemption/QrRedemption';

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

// Snackbar Component
const Snackbar = ({ visible, text, type = 'success', onHide }) => {
    // console.log(visible, text, type);
    const translateY = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
                Animated.delay(2500),
                Animated.timing(translateY, {
                    toValue: 100,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (onHide) onHide();
            });
        }
    }, [visible]);

    if (!visible) return null;

    const backgroundColor = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#F59E0B';
    const icon = type === 'success' ? 'checkmark-circle' : type === 'error' ? 'close-circle' : 'alert-circle';

    return (
        <Animated.View
            style={[
                styles.snackbar,
                { backgroundColor, transform: [{ translateY }] }
            ]}
        >
            <Ionicons name={icon} size={20} color="#fff" />
            <Text style={styles.snackbarText}>{text}</Text>
        </Animated.View>
    );
};

// Cart Item Component
const CartItem = React.memo(({ item, onQuantityChange, onRemove }) => {
    const handleIncrease = () => {
        if (item.quantity < item.maxQuantity) {
            onQuantityChange(item.stationInventoryId, item.quantity + 1);
        } else {
            Alert.alert('Stock Limit', `Only ${item.maxQuantity} items available in stock.`);
        }
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.stationInventoryId, item.quantity - 1);
        }
    };

    const totalPoints = item.points * item.quantity;
    const savingsPerItem = item.isWeeklyPromo ? item.originalPoints - item.points : 0;
    const totalSavings = savingsPerItem * item.quantity;

    return (
        <View style={styles.cartItem}>
            <View style={styles.cartItemImageContainer}>
                <Image
                    source={item.image ? { uri: item.image } : require('../../../assets/my.png')}
                    style={styles.cartItemImage}
                />
                {item.isWeeklyPromo && (
                    <View style={styles.promoBadge}>
                        <Ionicons name="flash" size={12} color="#fff" />
                    </View>
                )}
            </View>

            <View style={styles.cartItemContent}>
                <View style={styles.cartItemHeader}>
                    <View style={styles.cartItemInfo}>
                        <Text style={styles.cartItemName} numberOfLines={2}>
                            {item.name}
                        </Text>
                        {item.isWeeklyPromo && item.promoDetails && (
                            <View style={styles.promoTag}>
                                <Ionicons name="flash" size={10} color="#8B5CF6" />
                                <Text style={styles.promoTagText}>{item.promoDetails.description}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemove(item.stationInventoryId, item.name)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.cartItemDescription} numberOfLines={1}>
                    {item.description}
                </Text>

                <View style={styles.cartItemFooter}>
                    <View style={styles.pointsDisplay}>
                        {item.isWeeklyPromo && (
                            <View style={styles.originalPriceContainer}>
                                <Image
                                    source={require('../../../assets/my.png')}
                                    style={styles.miniIcon}
                                />
                                <Text style={styles.originalPrice}>{item.originalPoints}</Text>
                            </View>
                        )}
                        <View style={styles.currentPriceContainer}>
                            <Image
                                source={require('../../../assets/my.png')}
                                style={styles.miniIcon}
                            />
                            <Text style={[styles.itemPoints, item.isWeeklyPromo && styles.promoPrice]}>
                                {item.points}
                            </Text>
                            <Text style={styles.pointsLabel}>pts each</Text>
                        </View>
                    </View>

                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
                            onPress={handleDecrease}
                            disabled={item.quantity <= 1}
                        >
                            <Ionicons name="remove" size={16} color={item.quantity <= 1 ? '#D1D5DB' : '#374151'} />
                        </TouchableOpacity>

                        <View style={styles.quantityDisplay}>
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.quantityButton, item.quantity >= item.maxQuantity && styles.quantityButtonDisabled]}
                            onPress={handleIncrease}
                            disabled={item.quantity >= item.maxQuantity}
                        >
                            <Ionicons name="add" size={16} color={item.quantity >= item.maxQuantity ? '#D1D5DB' : '#374151'} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.totalPointsRow}>
                    <Text style={styles.totalPointsLabel}>Subtotal:</Text>
                    <View style={styles.totalPointsValue}>
                        <Image
                            source={require('../../../assets/my.png')}
                            style={styles.miniIcon}
                        />
                        <Text style={styles.totalPoints}>{totalPoints.toLocaleString()}</Text>
                        <Text style={styles.pointsLabel}>pts</Text>
                    </View>
                </View>

                {item.isWeeklyPromo && totalSavings > 0 && (
                    <View style={styles.savingsRow}>
                        <Ionicons name="pricetag" size={14} color="#10B981" />
                        <Text style={styles.savingsText}>
                            You save {totalSavings.toLocaleString()} pts!
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
});

export default function CartScreens({ navigation, route }) {
    const { userInfo, userDetails } = useContext(AuthContext);
    const { rewards } = useContext(PointsDetailContext);
    const station = route?.params?.station;
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' });
    const [showQR, setShowQR] = useState(false);
    const [transaction, setTransaction] = useState(null);
    const userPoints = rewards?.points || 0;

    const totalPoints = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.points * item.quantity), 0);
    }, [cartItems]);

    const totalItems = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const canAfford = userPoints >= totalPoints;
    const pointsRemaining = userPoints - totalPoints;

    // Show snackbar helper
    const showSnackbar = (message, type = 'success') => {
        // setSnackbar({ visible: true, message, type });
    };

    const hideSnackbar = () => {
        setSnackbar({ visible: false, message: '', type: 'success' });
    };

    const transformCartData = (apiData) => {
        if (!apiData || !Array.isArray(apiData)) return [];

        return apiData.map(item => {
            const cart = item.cart;

            // Use cart.points as the original/default price
            const originalPoints = cart.points || 0;

            // Check if it's actually a valid promo (not just flag, but has actual promo data)
            const hasValidPromo = cart.weekly_promo?.promo_points !== null &&
                cart.weekly_promo?.promo_points !== undefined &&
                cart.weekly_promo?.promo_descriptions !== null;

            // Use promo_points as the discounted price if valid promo exists, otherwise use cart.points
            const currentPoints = hasValidPromo
                ? cart.weekly_promo.promo_points
                : originalPoints;

            return {
                id: cart.id,
                name: cart.inventory?.name || 'Unknown Item',
                description: cart.inventory?.description || '',
                points: currentPoints, // Discounted price if promo, otherwise cart.points
                originalPoints: originalPoints, // cart.points (NOT station_inventory.points)
                quantity: cart.quantity || 1,
                maxQuantity: parseFloat(cart.station_inventory?.quantity || 0),
                totalPoints: currentPoints * (cart.quantity || 1),
                isWeeklyPromo: hasValidPromo,
                promoDetails: hasValidPromo ? {
                    description: cart.weekly_promo.promo_descriptions || 'Special Promo',
                    startDate: cart.weekly_promo.promo_start_date,
                    endDate: cart.weekly_promo.promo_end_date,
                    promoPoints: cart.weekly_promo.promo_points,
                } : null,
                image: cart.inventory?.image || null,
                inventoryId: cart.inventory?.id,
                stationInventoryId: cart.station_inventory?.id,
            };
        });
    };

    const getCartItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${BASE_URL}customer/get-cart?bar_code=${userDetails.bar_code}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );

            const res = await processResponse(response);
            const { statusCode, data } = res;
            // console.log(userDetails.bar_code);

            if (statusCode === 201 && data?.data) {
                const transformedData = transformCartData(data.data);
                setCartItems(transformedData);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            showSnackbar('Failed to load cart items', 'error');
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        try {
            fetch(`${BASE_URL}customer/adjust-quantity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    bar_code: userDetails.bar_code,
                    station_inventories_id: itemId,
                    quantity_change: newQuantity
                })
            })
                .then(processResponse)
                .then(res => {
                    const { statusCode, data } = res;
                    // console.log(data.data);
                    // console.log(itemId, newQuantity);
                    if (statusCode === 200) {
                        setCartItems(prev =>
                            prev.map(item =>
                                item.stationInventoryId === itemId ? { ...item, quantity: newQuantity } : item
                            )
                        );
                        showSnackbar(`${data.data.message}`, 'success');
                    } else {
                        showSnackbar(`${data.data.message}`, 'failure');
                    }
                })
                .catch(error => {
                    console.error('Error updating quantity:', error);
                    showSnackbar(`${error}`, 'error');
                })
                .finally(() => {
                    // showSnackbar(``, )
                });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }

    };

    const handleRemoveItem = async (itemId, itemName) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${BASE_URL}customer/remove-cart`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Accept: "application/json",
                                    Authorization: `Bearer ${userInfo.token}`,
                                },
                                body: JSON.stringify({
                                    bar_code: userDetails.bar_code,
                                    station_inventories_id: itemId
                                })
                            });

                            const res = await processResponse(response);
                            const { statusCode, data } = res;

                            if (statusCode === 200) {
                                setCartItems(prev => prev.filter(item => item.stationInventoryId !== itemId));
                                showSnackbar(`${itemName} removed from cart`, 'success');
                                // await getCartItems();

                                const storedCount = await AsyncStorage.getItem("cartCount");
                                let newCount = storedCount ? parseInt(storedCount, 10) - 1 : 0;
                                if (newCount < 0) newCount = 0;
                                await AsyncStorage.setItem("cartCount", newCount.toString());
                            } else {
                                showSnackbar('Failed to remove item', 'error');
                            }
                        } catch (error) {
                            console.error('Error removing item:', error);
                            showSnackbar('Failed to remove item', 'error');
                        }
                    },
                },
            ]
        );
    };

    const handleClearCart = () => {
        Alert.alert(
            'Clear Cart',
            'Are you sure you want to remove all items from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${BASE_URL}customer/remove-all-cart`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                    Accept: "application/json",
                                    Authorization: `Bearer ${userInfo.token}`,
                                },
                                body: JSON.stringify({
                                    bar_code: userDetails.bar_code,
                                })
                            });

                            const res = await processResponse(response);
                            const { statusCode, data } = res;

                            if (statusCode === 200) {
                                AsyncStorage.removeItem('cartCount');
                                setCartItems([]);
                                showSnackbar('Cart cleared', 'success');
                                // await getCartItems();
                            } else {
                                showSnackbar('Failed to remove item', 'error');
                            }
                        } catch (error) {
                            console.error('Error removing item:', error);
                            showSnackbar('Failed to remove item', 'error');
                        }
                    },
                },
            ]
        );
    };

    const handleCheckout = () => {
        if (!canAfford) {
            Alert.alert(
                'Insufficient Points',
                `You need ${(totalPoints - userPoints).toLocaleString()} more points to complete this redemption.`,
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Confirm Redemption',
            `Redeem ${totalItems} item(s) for ${totalPoints.toLocaleString()} points?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Redeem',
                    onPress: async () => {
                        try {
                            // console.log(station);
                            // console.log(cartItems);
                            const now = new Date();
                            const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
                            const randomPart = Math.floor(10000 + Math.random() * 90000);
                            const referenceNumber = `${datePart}-${randomPart}`;
                            fetch(`${BASE_URL}customer/checkout`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Accept: "application/json",
                                    Authorization: `Bearer ${userInfo.token}`,
                                },
                                body: JSON.stringify({
                                    reference_number: referenceNumber,
                                    bar_code: userDetails.bar_code,
                                    quantity: cartItems.quantity,
                                    total_points: totalPoints,
                                    station_id: station ? station.id : null
                                })
                            })
                                .then(processResponse)
                                .then((res) => {
                                    const { statusCode, data } = res;

                                    if (statusCode === 201) {
                                        AsyncStorage.removeItem('cartCount');
                                        setCartItems([]);
                                        showSnackbar(`${data.message}`, 'success');
                                        setTransaction(referenceNumber);
                                        setShowQR(true);
                                    } else {
                                        showSnackbar(`${data.message}`, 'error');
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error redeeming items:', error);
                                    showSnackbar('Failed to redeem items', 'error');
                                });

                            // Call your checkout API
                            // console.log('Checkout:', cartItems);

                        } catch (error) {
                            console.error('Error redeeming items:', error);
                            // console.error('Checkout error:', error);
                            // showSnackbar('Failed to complete redemption', 'error');
                        }
                    },
                },
            ]
        );
    };

    const renderCartItem = ({ item }) => (
        <CartItem
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
        />
    );

    const keyExtractor = (item) => item.id.toString();

    useEffect(() => {
        getCartItems();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Loading cart...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <ImageBackground
                resizeMode="stretch"
                source={require('../../../assets/mygas-header.jpeg')}
                style={styles.header}
            >
                <LinearGradient
                    colors={['rgba(249, 250, 141, 0.95)', 'rgba(249, 250, 141, 0.7)', 'transparent']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerGradient}
                />
                <Image
                    source={require('../../../assets/mygas_logo.png')}
                    style={styles.logo}
                />
                <Navbar
                    onProfilePress={() => console.log('Profile tapped')}
                    onNotifPress={() => console.log('Notifications tapped')}
                />
            </ImageBackground>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    {/* Page Header */}
                    <View style={styles.pageHeader}>
                        <View style={styles.pageHeaderContent}>
                            <Text style={styles.pageTitle}>My Cart</Text>
                            <Text style={styles.pageSubtitle}>
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                            </Text>
                        </View>
                        {cartItems.length > 0 && (
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={handleClearCart}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.clearButtonText}>Clear</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Points Card and My Redemption Button */}
                    <View style={styles.pointsSection}>
                        <View style={styles.pointsCard}>
                            <LinearGradient
                                colors={['#FEF3C7', '#FDE68A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.pointsGradient}
                            >
                                <View style={styles.pointsRow}>
                                    <View>
                                        <Text style={styles.pointsLabel}>Available Points</Text>
                                        <View style={styles.pointsValueContainer}>
                                            <Image
                                                source={require('../../../assets/my.png')}
                                                style={styles.pointsIcon}
                                            />
                                            <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.pointsIconContainer}>
                                        <Ionicons name="wallet" size={28} color="#F59E0B" />
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>

                        <TouchableOpacity
                            style={styles.redemptionButton}
                            onPress={() => navigation.navigate("RedemptionTransactionScreens")}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={['#EF4444', '#DC2626']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.redemptionButtonGradient}
                            >
                                <Ionicons name="receipt-outline" size={20} color="#fff" />
                                <Text style={styles.redemptionButtonText}>My Redemption</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Cart Items or Empty State */}
                    {cartItems.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
                            </View>
                            <Text style={styles.emptyTitle}>Your cart is empty</Text>
                            <Text style={styles.emptySubtitle}>
                                Add some rewards to get started!
                            </Text>
                            <TouchableOpacity
                                style={styles.shopButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.shopButtonText}>Browse Rewards</Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <FlatList
                                data={cartItems}
                                renderItem={renderCartItem}
                                keyExtractor={keyExtractor}
                                scrollEnabled={false}
                                contentContainerStyle={styles.cartList}
                            />

                            {/* Summary Card */}
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryTitle}>Order Summary</Text>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Total Items</Text>
                                    <Text style={styles.summaryValue}>{totalItems}</Text>
                                </View>

                                <View style={styles.summaryDivider} />

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Total Points</Text>
                                    <View style={styles.summaryPointsValue}>
                                        {/* <Image
                                            source={require('../../../assets/my.png')}
                                            style={styles.miniIcon}
                                        /> */}
                                        <Text style={styles.summaryPoints}>{totalPoints.toLocaleString()}</Text>
                                        <Text style={styles.pointsLabel}>pts</Text>
                                    </View>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Points After</Text>
                                    <View style={styles.summaryPointsValue}>
                                        <Text style={[styles.summaryPoints, !canAfford && styles.insufficientPoints]}>
                                            {pointsRemaining.toLocaleString()}
                                        </Text>
                                        <Text style={styles.pointsLabel}>pts</Text>
                                    </View>
                                </View>

                                {!canAfford && (
                                    <View style={styles.warningBanner}>
                                        <Ionicons name="alert-circle" size={16} color="#DC2626" />
                                        <Text style={styles.warningText}>
                                            You need {Math.abs(pointsRemaining).toLocaleString()} more points
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Checkout Button */}
            {cartItems.length > 0 && (
                <View style={styles.checkoutContainer}>
                    <TouchableOpacity
                        style={[styles.checkoutButton, !canAfford && styles.checkoutButtonDisabled]}
                        onPress={handleCheckout}
                        disabled={!canAfford}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={canAfford ? ['#EF4444', '#DC2626'] : ['#9CA3AF', '#6B7280']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.checkoutGradient}
                        >
                            <View style={styles.checkoutContent}>
                                <View>
                                    <Text style={styles.checkoutLabel}>Redeem Now</Text>
                                    <View style={styles.checkoutPointsContainer}>
                                        <Image
                                            source={require('../../../assets/my.png')}
                                            style={styles.miniIcon}
                                        />
                                        <Text style={styles.checkoutPoints}>{totalPoints.toLocaleString()}</Text>
                                        <Text style={styles.checkoutPointsLabel}>points</Text>
                                    </View>
                                </View>
                                <View style={styles.checkoutArrow}>
                                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}

            {/* Snackbar */}
            <Snackbar
                visible={snackbar.visible}
                text={snackbar.message}
                type={snackbar.type}
                onHide={hideSnackbar}
            />

            <QrRedemption
                visible={showQR}
                onClose={() => setShowQR(false)}
                qrCode={transaction}
                transactionId={transaction}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
    },
    header: {
        height: getResponsiveValue(140, 160, 190, 210),
        width: '100%',
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    logo: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [
            { translateX: getResponsiveValue(-35, -45, -55, -65) },
            { translateY: getResponsiveValue(-35, -45, -55, -65) },
        ],
        width: getResponsiveValue(65, 75, 90, 110),
        height: getResponsiveValue(65, 75, 90, 110),
        resizeMode: 'contain',
        zIndex: 2,
    },
    scrollContainer: {
        flex: 1,
        marginTop: -25,
        paddingBottom: 100
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: getResponsiveValue(120, 140, 160, 180),
    },
    contentContainer: {
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: getResponsiveValue(24, 28, 32, 36),
        borderTopRightRadius: getResponsiveValue(24, 28, 32, 36),
        paddingHorizontal: getResponsiveValue(16, 20, 28, 36),
        paddingTop: getResponsiveValue(24, 28, 32, 36),
        minHeight: '100%',
    },
    pageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: getResponsiveValue(20, 24, 28, 32),
        gap: getResponsiveValue(12, 14, 16, 18),
    },
    backButton: {
        width: getResponsiveValue(40, 44, 48, 52),
        height: getResponsiveValue(40, 44, 48, 52),
        borderRadius: getResponsiveValue(20, 22, 24, 26),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    pageHeaderContent: {
        flex: 1,
    },
    pageTitle: {
        fontSize: getResponsiveValue(24, 26, 28, 30),
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.5,
    },
    pageSubtitle: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#6B7280',
        marginTop: 2,
    },
    clearButton: {
        paddingHorizontal: getResponsiveValue(16, 18, 20, 22),
        paddingVertical: getResponsiveValue(8, 10, 12, 14),
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        backgroundColor: '#FEE2E2',
    },
    clearButtonText: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        fontWeight: '700',
        color: '#DC2626',
    },
    pointsSection: {
        flexDirection: 'row',
        gap: getResponsiveValue(12, 14, 16, 18),
        marginBottom: getResponsiveValue(24, 28, 32, 36),
    },
    pointsCard: {
        flex: 1,
        borderRadius: getResponsiveValue(16, 20, 24, 28),
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    redemptionButton: {
        borderRadius: getResponsiveValue(16, 20, 24, 28),
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    redemptionButtonGradient: {
        paddingVertical: getResponsiveValue(23, 24, 28, 32),
        paddingHorizontal: getResponsiveValue(16, 18, 20, 22),
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    redemptionButtonText: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#fff",
        fontWeight: "700",
        textAlign: "center",
        lineHeight: getResponsiveValue(14, 16, 18, 20),
    },
    pointsGradient: {
        padding: getResponsiveValue(20, 24, 28, 32),
    },
    pointsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pointsLabel: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#92400E',
        fontWeight: '600',
        marginBottom: getResponsiveValue(6, 8, 10, 12),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pointsValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(8, 10, 12, 14),
    },
    pointsIcon: {
        width: getResponsiveValue(15, 28, 32, 36),
        height: getResponsiveValue(15, 28, 32, 36),
        resizeMode: 'contain',
    },
    pointsValue: {
        fontSize: getResponsiveValue(24, 28, 32, 36),
        fontWeight: '800',
        color: '#92400E',
        letterSpacing: -1,
    },
    pointsIconContainer: {
        width: getResponsiveValue(48, 56, 64, 72),
        height: getResponsiveValue(48, 56, 64, 72),
        borderRadius: getResponsiveValue(24, 28, 32, 36),
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: getResponsiveValue(60, 80, 100, 120),
    },
    emptyIconContainer: {
        width: getResponsiveValue(120, 140, 160, 180),
        height: getResponsiveValue(120, 140, 160, 180),
        borderRadius: getResponsiveValue(60, 70, 80, 90),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: getResponsiveValue(24, 28, 32, 36),
    },
    emptyTitle: {
        fontSize: getResponsiveValue(20, 22, 24, 26),
        fontWeight: '700',
        color: '#374151',
        marginBottom: getResponsiveValue(8, 10, 12, 14),
    },
    emptySubtitle: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: getResponsiveValue(24, 28, 32, 36),
    },
    shopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingHorizontal: getResponsiveValue(24, 28, 32, 36),
        paddingVertical: getResponsiveValue(12, 14, 16, 18),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    shopButtonText: {
        fontSize: getResponsiveValue(15, 16, 17, 18),
        fontWeight: '700',
        color: '#fff',
    },
    cartList: {
        gap: getResponsiveValue(16, 18, 20, 22),
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: getResponsiveValue(16, 18, 20, 22),
        padding: getResponsiveValue(12, 14, 16, 18),
        borderWidth: 1,
        borderColor: '#F3F4F6',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    cartItemImageContainer: {
        position: 'relative',
    },
    cartItemImage: {
        width: getResponsiveValue(80, 90, 100, 110),
        height: getResponsiveValue(80, 90, 100, 110),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        backgroundColor: '#F9FAFB',
        resizeMode: 'cover',
    },
    promoBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#8B5CF6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cartItemContent: {
        flex: 1,
        marginLeft: getResponsiveValue(12, 14, 16, 18),
    },
    cartItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: getResponsiveValue(6, 7, 8, 9),
    },
    cartItemInfo: {
        flex: 1,
        marginRight: getResponsiveValue(8, 10, 12, 14),
    },
    cartItemName: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    promoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        gap: 4,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#E9D5FF',
    },
    promoTagText: {
        fontSize: getResponsiveValue(9, 10, 11, 12),
        fontWeight: '700',
        color: '#8B5CF6',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    removeButton: {
        width: getResponsiveValue(32, 36, 40, 44),
        height: getResponsiveValue(32, 36, 40, 44),
        borderRadius: getResponsiveValue(16, 18, 20, 22),
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartItemDescription: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#6B7280',
        marginBottom: getResponsiveValue(10, 12, 14, 16),
    },
    cartItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: getResponsiveValue(10, 12, 14, 16),
    },
    pointsDisplay: {
        flexDirection: 'column',
        gap: 2,
    },
    originalPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    originalPrice: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        fontWeight: '600',
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    currentPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    miniIcon: {
        width: getResponsiveValue(16, 18, 20, 22),
        height: getResponsiveValue(16, 18, 20, 22),
        resizeMode: 'contain',
    },
    itemPoints: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: '700',
        color: '#F59E0B',
    },
    promoPrice: {
        color: '#8B5CF6',
        fontSize: getResponsiveValue(15, 16, 17, 18),
    },
    pointsLabel: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: '#6B7280',
        fontWeight: '500',
    },
    savingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: getResponsiveValue(8, 10, 12, 14),
        paddingTop: getResponsiveValue(8, 10, 12, 14),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#ECFDF5',
        marginHorizontal: getResponsiveValue(-12, -14, -16, -18),
        paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
        paddingVertical: getResponsiveValue(8, 10, 12, 14),
        borderBottomLeftRadius: getResponsiveValue(12, 14, 16, 18),
        borderBottomRightRadius: getResponsiveValue(12, 14, 16, 18),
    },
    savingsText: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        fontWeight: '700',
        color: '#10B981',
        flex: 1,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: getResponsiveValue(8, 10, 12, 14),
        padding: 2,
    },
    quantityButton: {
        width: getResponsiveValue(28, 32, 36, 40),
        height: getResponsiveValue(28, 32, 36, 40),
        borderRadius: getResponsiveValue(7, 8, 9, 10),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonDisabled: {
        opacity: 0.4,
    },
    quantityDisplay: {
        minWidth: getResponsiveValue(32, 36, 40, 44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: '700',
        color: '#111827',
    },
    totalPointsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: getResponsiveValue(10, 12, 14, 16),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    totalPointsLabel: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#6B7280',
        fontWeight: '600',
    },
    totalPointsValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    totalPoints: {
        fontSize: getResponsiveValue(16, 17, 18, 19),
        fontWeight: '800',
        color: '#111827',
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: getResponsiveValue(16, 18, 20, 22),
        padding: getResponsiveValue(20, 24, 28, 32),
        marginBottom: getResponsiveValue(20, 24, 28, 32),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    summaryTitle: {
        fontSize: getResponsiveValue(18, 20, 22, 24),
        fontWeight: '700',
        color: '#111827',
        marginBottom: getResponsiveValue(16, 18, 20, 22),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: getResponsiveValue(12, 14, 16, 18),
    },
    summaryLabel: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        color: '#6B7280',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: '700',
        color: '#111827',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: getResponsiveValue(12, 14, 16, 18),
    },
    summaryPointsValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    summaryPoints: {
        fontSize: getResponsiveValue(16, 17, 18, 19),
        fontWeight: '800',
        color: '#111827',
    },
    insufficientPoints: {
        color: '#DC2626',
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: getResponsiveValue(12, 14, 16, 18),
        borderRadius: getResponsiveValue(10, 12, 14, 16),
        gap: 8,
        marginTop: getResponsiveValue(12, 14, 16, 18),
    },
    warningText: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#DC2626',
        fontWeight: '600',
        flex: 1,
    },
    checkoutContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: getResponsiveValue(16, 20, 28, 36),
        paddingVertical: getResponsiveValue(16, 20, 24, 28),
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
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
    checkoutButton: {
        borderRadius: getResponsiveValue(14, 16, 18, 20),
        overflow: 'hidden',
    },
    checkoutButtonDisabled: {
        opacity: 0.6,
    },
    checkoutGradient: {
        padding: getResponsiveValue(18, 20, 22, 24),
    },
    checkoutContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkoutLabel: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#fff',
        fontWeight: '600',
        marginBottom: 4,
        opacity: 0.9,
    },
    checkoutPointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    checkoutPoints: {
        fontSize: getResponsiveValue(20, 22, 24, 26),
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    checkoutPointsLabel: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#fff',
        fontWeight: '600',
        opacity: 0.9,
    },
    checkoutArrow: {
        width: getResponsiveValue(40, 44, 48, 52),
        height: getResponsiveValue(40, 44, 48, 52),
        borderRadius: getResponsiveValue(20, 22, 24, 26),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    snackbar: {
        position: 'absolute',
        bottom: getResponsiveValue(100, 120, 140, 160),
        left: getResponsiveValue(16, 20, 28, 36),
        right: getResponsiveValue(16, 20, 28, 36),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: getResponsiveValue(16, 18, 20, 22),
        paddingVertical: getResponsiveValue(14, 16, 18, 20),
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        gap: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    snackbarText: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        color: '#fff',
        fontWeight: '600',
        flex: 1,
    },
});