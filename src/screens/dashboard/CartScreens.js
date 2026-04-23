import React, { useState, useContext, useMemo, useEffect, useRef, useCallback } from 'react';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { clearAllCartItems, removeCartItem } from '../../lib/CartCountHelper';
import { useRedemption } from '../../hooks/RedemptionHooks';
import { Dialog, SkeletonGroup, useToast } from 'heroui-native';

const { width, height } = Dimensions.get('window');

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

// Cart Item Component
const CartItem = React.memo(({ item, onQuantityChange, onRemove }) => {
    const handleIncrease = () => {
        if (item.quantity < item.maxQuantity) {
            onQuantityChange(item.stationInventoryId, item.quantity + 1, item.inventoryId);
        } else {
            onQuantityChange(item.stationInventoryId, item.quantity, item.inventoryId, 'stock_limit');
        }
    };

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.stationInventoryId, item.quantity - 1, item.inventoryId);
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
                        onPress={() => onRemove(item.stationInventoryId, item.name, item.inventoryId)}
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
    const { rewards, refreshPoints, redemptionCount, setRedemptionCount, getRedemptionCount } = useContext(PointsDetailContext);
    const { toast } = useToast();
    const station = route?.params?.station;
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(false);
    const [transaction, setTransaction] = useState(null);
    const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

    // ── Single unified dialog state ────────────────────────────────
    const [activeDialog, setActiveDialog] = useState({ type: null, payload: {} });

    const closeDialog = () => setActiveDialog({ type: null, payload: {} });
    const openDialog = (type, payload = {}) => setActiveDialog({ type, payload });

    const userPoints = rewards?.points || 0;

    const totalPoints = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.points * item.quantity), 0);
    }, [cartItems]);

    const totalItems = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const canAfford = userPoints >= totalPoints;
    const pointsRemaining = userPoints - totalPoints;

    // ── Dialog config map ──────────────────────────────────────────
    const dialogConfig = {
        remove: {
            title: 'Remove Item',
            description: `Are you sure you want to remove "${activeDialog.payload?.itemName}" from your cart?`,
            buttons: [
                { label: 'Cancel', style: 'cancel', onPress: closeDialog },
                { label: 'Remove', style: 'destructive', onPress: confirmRemoveItem },
            ],
        },
        clear: {
            title: 'Clear Cart',
            description: 'Are you sure you want to remove all items from your cart? This cannot be undone.',
            buttons: [
                { label: 'Cancel', style: 'cancel', onPress: closeDialog },
                { label: 'Clear All', style: 'destructive', onPress: confirmClearCart },
            ],
        },
        checkout: {
            title: 'Confirm Redemption',
            description: `Redeem ${totalItems} item${totalItems !== 1 ? 's' : ''} for ${totalPoints.toLocaleString()} points?\n\nYou will have ${(userPoints - totalPoints).toLocaleString()} points remaining after this redemption.`,
            buttons: [
                { label: 'Cancel', style: 'cancel', onPress: closeDialog },
                { label: 'Redeem', style: 'confirm', onPress: confirmCheckout },
            ],
        },
        stock_limit: {
            title: 'Stock Limit Reached',
            description: `Only ${activeDialog.payload?.maxQuantity} ${activeDialog.payload?.maxQuantity === 1 ? 'item is' : 'items are'} available in stock for this product.`,
            buttons: [
                { label: 'Got it', style: 'confirm', onPress: closeDialog },
            ],
        },
    };

    const currentDialog = dialogConfig[activeDialog.type] ?? null;

    // ── Data fetching ──────────────────────────────────────────────
    const transformCartData = (apiData) => {
        if (!apiData || !Array.isArray(apiData)) return [];

        return apiData.map(item => {
            const cart = item.cart;
            const originalPoints = cart.points || 0;
            const hasValidPromo = cart.weekly_promo?.promo_points !== null &&
                cart.weekly_promo?.promo_points !== undefined &&
                cart.weekly_promo?.promo_descriptions !== null;
            const currentPoints = hasValidPromo ? cart.weekly_promo.promo_points : originalPoints;

            return {
                id: cart.id,
                name: cart.inventory?.name || 'Unknown Item',
                description: cart.inventory?.description || '',
                points: currentPoints,
                originalPoints,
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

            if (statusCode === 201 && data?.data) {
                setCartItems(transformCartData(data.data));
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.show({ variant: 'danger', label: 'Failed!', description: 'Failed to load cart items', icon: <Ionicons name="close-circle" size={24} color="red" />, duration: 3000 });
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    // ── Quantity change ────────────────────────────────────────────
    const handleQuantityChange = async (itemId, newQuantity, inventoryId, flag) => {
        if (flag === 'stock_limit') {
            const item = cartItems.find(i => i.stationInventoryId === itemId);
            openDialog('stock_limit', { maxQuantity: item?.maxQuantity ?? 0 });
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}customer/adjust-quantity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    bar_code: userDetails.bar_code,
                    station_inventories_id: itemId,
                    quantity_change: newQuantity,
                }),
            });

            const res = await processResponse(response);
            const { statusCode, data } = res;

            if (statusCode === 200) {
                const getCarts = await AsyncStorage.getItem("carts");
                let carts = getCarts ? JSON.parse(getCarts) : [];
                const existingIndex = carts.findIndex(item => item.id === inventoryId);

                if (existingIndex !== -1) {
                    if (newQuantity > 0) {
                        carts[existingIndex].quantity = newQuantity;
                    } else {
                        carts.splice(existingIndex, 1);
                    }
                    await AsyncStorage.setItem("carts", JSON.stringify(carts));
                }

                setCartItems(prev =>
                    prev.map(item =>
                        item.stationInventoryId === itemId ? { ...item, quantity: newQuantity } : item
                    )
                );
                setCartUpdateTrigger(prev => prev + 1);
            } else {
                toast.show({ variant: 'danger', label: "Something went wrong!", description: data?.data?.message || 'Failed to update quantity' });
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.show({ variant: 'danger', label: 'Failed to update quantity', description: 'An error occurred while updating the quantity.', icon: <Ionicons name="close-circle" size={24} color="red" />, duration: 3000 });
        }
    };

    // ── Remove item ────────────────────────────────────────────────
    const handleRemoveItem = (itemId, itemName, inventoryId) => {
        openDialog('remove', { itemId, itemName, inventoryId });
    };

    async function confirmRemoveItem() {
        const { itemId, itemName, inventoryId } = activeDialog.payload;
        closeDialog();

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
                    station_inventories_id: itemId,
                }),
            });

            const res = await processResponse(response);
            const { statusCode } = res;

            if (statusCode === 200) {
                const getCarts = await AsyncStorage.getItem("carts");
                let carts = getCarts ? JSON.parse(getCarts) : [];
                carts = carts.filter(item => item.id !== inventoryId);
                await AsyncStorage.setItem("carts", JSON.stringify(carts));
                await removeCartItem(inventoryId);

                setCartItems(prev => prev.filter(item => item.stationInventoryId !== itemId));
                setCartUpdateTrigger(prev => prev + 1);
                toast.show({ variant: 'success', label: 'Item removed', description: `${itemName} removed from cart`, icon: <Ionicons name="checkmark-circle" size={24} color="green" />, duration: 3000 });
            } else {
                toast.show({ variant: 'danger', label: 'Failed to remove item', description: 'Failed to remove the item from the cart.', icon: <Ionicons name="close-circle" size={24} color="red" />, duration: 3000 });
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.show({ variant: 'danger', label: 'Failed to remove item', description: 'An error occurred while removing the item.', icon: <Ionicons name="close-circle" size={24} color="red" />, duration: 3000 });
        }
    }

    // ── Clear cart ─────────────────────────────────────────────────
    const handleClearCart = () => openDialog('clear');

    async function confirmClearCart() {
        closeDialog();

        try {
            const response = await fetch(`${BASE_URL}customer/remove-all-cart`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ bar_code: userDetails.bar_code }),
            });

            const res = await processResponse(response);
            const { statusCode } = res;

            if (statusCode === 200) {
                await AsyncStorage.removeItem('carts');
                await clearAllCartItems();
                setCartItems([]);
                toast.show({ variant: 'success', label: 'Cart cleared', description: 'All items have been removed from your cart.', icon: <Ionicons name="checkmark-circle" size={24} color="green" />, duration: 3000 });
            } else {
                toast.show({ variant: 'danger', label: 'Failed to clear cart', description: 'Failed to remove all items from your cart.', icon: <Ionicons name="close-circle" size={24} color="red" />, duration: 3000 });
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.show({ variant: 'danger', label: 'Failed to clear cart', description: 'An error occurred while clearing the cart.', icon: <Ionicons name="close-circle" size={24} color="red" />, duration: 3000 });
        }
    }

    // ── Checkout ───────────────────────────────────────────────────
    const handleCheckout = () => {
        if (!canAfford) {
            toast.show({
                variant: 'danger',
                label: 'Insufficient Points',
                description: `You need ${(totalPoints - userPoints).toLocaleString()} more points to complete this redemption.`,
                icon: <Ionicons name="close-circle" size={24} color="red" />,
                duration: 3000
            });
            return;
        }
        openDialog('checkout');
    };

    async function confirmCheckout() {
        closeDialog();

        const stored_station = await AsyncStorage.getItem("stationSelected");
        const parsed_station = stored_station ? JSON.parse(stored_station) : null;

        try {
            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
            const randomPart = Math.floor(10000 + Math.random() * 90000);
            const referenceNumber = `${datePart}-${randomPart}`;

            const response = await fetch(`${BASE_URL}customer/checkout`, {
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
                    station_id: station ? station.id : parsed_station?.id,
                }),
            });

            const res = await processResponse(response);
            const { statusCode, data } = res;

            if (statusCode === 201) {
                await AsyncStorage.removeItem('carts');
                await clearAllCartItems();
                setCartItems([]);
                setTransaction(referenceNumber);
                refreshPoints?.();
                setShowQR(true);
                getRedemptionCount();
            } else {
                toast.show({ variant: 'danger', label: 'Redemption failed', description: data.message, icon: <Ionicons name="close-circle" size={24} color="red" />, duration: 3000 });
            }
        } catch (error) {
            console.error('Error redeeming items:', error);
            toast.show({ variant: 'danger', label: 'Failed to redeem items', icon: <Ionicons name="close-circle" size={24} color="red" />, duration: 3000 });
        }
    }

    const renderCartItem = ({ item }) => (
        <CartItem
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
        />
    );

    const keyExtractor = (item) => item.id.toString();

    useEffect(() => {
        getRedemptionCount();
        getCartItems();
    }, []);

    return (
        <SafeAreaProvider>
            <View style={styles.container}>

                <Dialog
                    isOpen={!!activeDialog.type}
                    onOpenChange={(open) => !open && closeDialog()}
                >
                    <Dialog.Portal>
                        <Dialog.Overlay />
                        <Dialog.Content>
                            <Dialog.Title>{currentDialog?.title}</Dialog.Title>
                            <Dialog.Description>{currentDialog?.description}</Dialog.Description>
                            <View style={styles.dialogFooter}>
                                {currentDialog?.buttons.map((btn, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={btn.style === 'cancel' ? styles.dialogCancelButton : btn.style === 'destructive' ? styles.dialogDestructiveButton : styles.dialogConfirmButton}
                                        onPress={btn.onPress}
                                    >
                                        <Text style={btn.style === 'cancel' ? styles.dialogCancelText : styles.dialogActionText}>
                                            {btn.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog>

                <Navbar
                    onProfilePress={() => console.log('Profile tapped')}
                    onNotifPress={() => console.log('Notifications tapped')}
                />

                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentContainer}>
                        {loading ? (
                            <>
                                {/* Page Header skeleton */}
                                <SkeletonGroup
                                    isLoading={true}
                                    isSkeletonOnly
                                    style={styles.pageHeader}
                                >
                                    <View style={{ flex: 1, gap: 6 }}>
                                        <SkeletonGroup.Item style={{ height: 30, width: '45%', borderRadius: 8 }} />
                                        <SkeletonGroup.Item style={{ height: 16, width: '20%', borderRadius: 6 }} />
                                    </View>
                                </SkeletonGroup>

                                {/* Points card + redemption button skeleton */}
                                <SkeletonGroup
                                    isLoading={true}
                                    isSkeletonOnly
                                    style={styles.pointsSection}
                                >
                                    <SkeletonGroup.Item style={{ flex: 1, height: 90, borderRadius: 20 }} />
                                    <SkeletonGroup.Item style={{ width: 110, height: 90, borderRadius: 20 }} />
                                </SkeletonGroup>

                                {/* Cart item skeletons × 3 */}
                                {[0, 1, 2].map((i) => (
                                    <SkeletonGroup
                                        key={i}
                                        isLoading={true}
                                        isSkeletonOnly
                                        style={[styles.cartItem, { marginBottom: 16 }]}
                                    >
                                        {/* Thumbnail */}
                                        <SkeletonGroup.Item style={{ width: 90, height: 90, borderRadius: 14 }} />

                                        <View style={{ flex: 1, marginLeft: 14, gap: 10 }}>
                                            {/* Name */}
                                            <SkeletonGroup.Item style={{ height: 16, width: '80%', borderRadius: 6 }} />
                                            {/* Description */}
                                            <SkeletonGroup.Item style={{ height: 12, width: '55%', borderRadius: 6 }} />
                                            {/* Points + quantity row */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <SkeletonGroup.Item style={{ height: 20, width: 70, borderRadius: 6 }} />
                                                <SkeletonGroup.Item style={{ height: 32, width: 96, borderRadius: 10 }} />
                                            </View>
                                            {/* Subtotal row */}
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <SkeletonGroup.Item style={{ height: 12, width: 56, borderRadius: 6 }} />
                                                <SkeletonGroup.Item style={{ height: 18, width: 80, borderRadius: 6 }} />
                                            </View>
                                        </View>
                                    </SkeletonGroup>
                                ))}

                                {/* Summary card skeleton */}
                                <SkeletonGroup
                                    isLoading={true}
                                    isSkeletonOnly
                                    style={styles.summaryCard}
                                >
                                    <SkeletonGroup.Item style={{ height: 22, width: '50%', borderRadius: 8, marginBottom: 20 }} />
                                    <SkeletonGroup.Item style={{ height: 16, width: '100%', borderRadius: 6, marginBottom: 14 }} />
                                    <SkeletonGroup.Item style={{ height: 1, width: '100%', borderRadius: 1, marginBottom: 14 }} />
                                    <SkeletonGroup.Item style={{ height: 16, width: '100%', borderRadius: 6, marginBottom: 14 }} />
                                    <SkeletonGroup.Item style={{ height: 16, width: '75%', borderRadius: 6 }} />
                                </SkeletonGroup>
                            </>
                        ) : (
                            <>
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

                                    <View style={styles.myRedemptionButtonWrapper}>
                                        {redemptionCount > 0 && (
                                            <View style={styles.redemptionBadgeContainer}>
                                                <LinearGradient
                                                    colors={["#FBBF24", "#F59E0B"]}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.redemptionBadge}
                                                >
                                                    <Text style={styles.redemptionBadgeText}>
                                                        {redemptionCount > 99 ? '99+' : redemptionCount}
                                                    </Text>
                                                </LinearGradient>
                                            </View>
                                        )}
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
                            </>
                        )}
                    </View>
                </ScrollView>

                {/* Checkout Button — hidden while loading */}
                {!loading && cartItems.length > 0 && (
                    <View style={styles.checkoutContainer}>
                        <TouchableOpacity
                            style={[styles.checkoutButton, !canAfford && styles.checkoutButtonDisabled]}
                            onPress={handleCheckout}
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

                <QrRedemption
                    visible={showQR}
                    onClose={() => setShowQR(false)}
                    qrCode={transaction}
                    transactionId={transaction}
                />
            </View>
        </SafeAreaProvider>
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
    scrollContainer: {
        flex: 1,
        marginTop: -25,
        paddingBottom: 100,
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
        alignItems: 'stretch',
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
            android: { elevation: 4 },
        }),
    },
    myRedemptionButtonWrapper: {
        position: 'relative',
        width: getResponsiveValue(100, 110, 120, 130),
    },
    redemptionButton: {
        flex: 1,
        borderRadius: getResponsiveValue(16, 20, 24, 28),
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: { elevation: 4 },
        }),
    },
    redemptionButtonGradient: {
        flex: 1,
        paddingHorizontal: getResponsiveValue(16, 18, 20, 22),
        alignItems: 'center',
        justifyContent: 'center',
        gap: getResponsiveValue(8, 10, 12, 14),
    },
    redemptionButtonText: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: "#fff",
        fontWeight: "700",
        textAlign: "center",
        lineHeight: getResponsiveValue(14, 16, 18, 20),
    },
    redemptionBadgeContainer: {
        position: "absolute",
        top: getResponsiveValue(-8, -9, -10, -11),
        right: getResponsiveValue(-8, -9, -10, -11),
        zIndex: 10,
    },
    redemptionBadge: {
        minWidth: getResponsiveValue(24, 26, 28, 30),
        height: getResponsiveValue(24, 26, 28, 30),
        borderRadius: getResponsiveValue(12, 13, 14, 15),
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: getResponsiveValue(6, 7, 8, 9),
        borderWidth: getResponsiveValue(2.5, 3, 3.5, 4),
        borderColor: "#fff",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: { elevation: 6 },
        }),
    },
    redemptionBadgeText: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        fontWeight: "900",
        color: "#fff",
        textAlign: "center",
        letterSpacing: -0.3,
    },
    pointsGradient: {
        flex: 1,
        padding: getResponsiveValue(20, 24, 28, 32),
        justifyContent: 'center',
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
            android: { elevation: 4 },
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
            android: { elevation: 3 },
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
            android: { elevation: 4 },
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
            android: { elevation: 4 },
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
            android: { elevation: 8 },
        }),
    },
    checkoutButton: {
        marginBottom: getResponsiveValue(38, 30, 27, 21),
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
    // ── Dialog styles ─────────────────────────────────────────────
    dialogFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20,
    },
    dialogCancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
    },
    dialogCancelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    dialogDestructiveButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#EF4444',
    },
    dialogConfirmButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#EF4444',
    },
    dialogActionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
});