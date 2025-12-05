import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Platform,
    StatusBar,
    Animated,
    ActivityIndicator
} from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import { AUTH_URL, BASE_URL, processResponse } from '../../../config';
import { AuthContext } from '../../../context/AuthContext';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isTablet = width >= 768;
const isSmallDevice = width < 375;

// Responsive font scaling
const scale = (size) => {
    const baseWidth = 375;
    const scale = width / baseWidth;
    const newSize = size * scale;
    return Math.round(newSize);
};

const FlashUserDetails = ({ visible, onClose }) => {
    const { userInfo } = useContext(AuthContext);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));
    const [dragY] = useState(new Animated.Value(0));
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserdetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${AUTH_URL}pop-user-details/${userInfo.user_id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                }
            });

            const res = await processResponse(response);
            const { statusCode, data } = res;

            if (data?.data) {
                setUserData(data.data);
            }
            console.log("from flash: ", data);
        } catch (error) {
            console.log('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            getUserdetails();

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    const closeModal = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(dragY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => onClose?.());
    };

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: dragY } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const { translationY, velocityY } = event.nativeEvent;

            // If dragged down more than 100px or fast swipe down
            if (translationY > 100 || velocityY > 500) {
                closeModal();
            } else {
                // Snap back to original position
                Animated.spring(dragY, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }).start();
            }
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    // Get full name
    const getFullName = () => {
        if (!userData) return 'Loading...';
        const { first_name, middle_name, last_name } = userData;
        return `${first_name || ''} ${middle_name || ''} ${last_name || ''}`.trim();
    };

    // Get initials for avatar
    const getInitials = () => {
        if (!userData) return '...';
        const { first_name, last_name } = userData;
        return `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase();
    };

    // Format phone number
    const formatPhoneNumber = (phone) => {
        if (!phone) return 'N/A';
        // Format as +63 XXX XXX XXXX
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            return `+63 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
        }
        return phone;
    };

    const InfoRow = ({ iconName, label, value }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={isTablet ? 22 : 20} color="#E0B820" />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || 'N/A'}</Text>
            </View>
        </View>
    );

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={closeModal}
            statusBarTranslucent
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.View
                    style={[
                        styles.modalOverlay,
                        { opacity: fadeAnim }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.dismissArea}
                        activeOpacity={1}
                        onPress={closeModal}
                    />

                    <PanGestureHandler
                        onGestureEvent={onGestureEvent}
                        onHandlerStateChange={onHandlerStateChange}
                        activeOffsetY={[-10, 10]}
                    >
                        <Animated.View
                            style={[
                                styles.modalContent,
                                isTablet && styles.modalContentTablet,
                                {
                                    transform: [
                                        { translateY: Animated.add(slideAnim, dragY) }
                                    ],
                                    opacity: fadeAnim
                                }
                            ]}
                        >
                            {/* Header */}
                            <View style={styles.modalHeader}>
                                <View style={styles.dragIndicator} />
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={closeModal}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close" size={20} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#E0B820" />
                                    <Text style={styles.loadingText}>Loading profile...</Text>
                                </View>
                            ) : (
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.scrollContent}
                                >
                                    {/* Helper Notice */}
                                    <View style={styles.helperNotice}>
                                        <Ionicons name="information-circle" size={20} color="#E0B820" />
                                        <Text style={styles.helperText}>
                                            Please save this information. Keep your phone number and member barcode safe for future transactions.
                                        </Text>
                                    </View>

                                    {/* Profile Section */}
                                    <View style={styles.profileSection}>
                                        <View style={styles.avatarContainer}>
                                            <View style={styles.avatar}>
                                                <Text style={styles.avatarText}>
                                                    {getInitials()}
                                                </Text>
                                            </View>
                                            <View style={styles.tierBadge}>
                                                <Ionicons name="star" size={isTablet ? 20 : 18} color="#FFF" />
                                            </View>
                                        </View>
                                        <Text style={styles.userName}>{getFullName()}</Text>
                                        <Text style={styles.userTier}>{userData?.station_name || 'Member'}</Text>
                                    </View>

                                    {/* User Information */}
                                    <View style={styles.infoSection}>
                                        <Text style={styles.sectionTitle}>Personal Information</Text>

                                        <InfoRow
                                            iconName="mail"
                                            label="Email Address"
                                            value={userData?.email || 'Not provided'}
                                        />
                                        <InfoRow
                                            iconName="call"
                                            label="Phone Number"
                                            value={formatPhoneNumber(userData?.phone_number)}
                                        />
                                        <InfoRow
                                            iconName="location"
                                            label="Address"
                                            value={userData?.address || 'Not provided'}
                                        />
                                        <InfoRow
                                            iconName="calendar"
                                            label="Birth Date"
                                            value={userData?.birth_date ? new Date(userData.birth_date).toLocaleDateString() : 'N/A'}
                                        />
                                        <InfoRow
                                            iconName="male-female"
                                            label="Gender"
                                            value={userData?.gender || 'N/A'}
                                        />
                                        <InfoRow
                                            iconName="people"
                                            label="Civil Status"
                                            value={userData?.civil_status || 'N/A'}
                                        />
                                        <InfoRow
                                            iconName="business"
                                            label="Station"
                                            value={userData?.station_name || 'N/A'}
                                        />
                                        <InfoRow
                                            iconName="time"
                                            label="Member Since"
                                            value={formatDate(userData?.created_at)}
                                        />
                                        <InfoRow
                                            iconName="pulse"
                                            label="Last Active"
                                            value={userData?.last_active ? new Date(userData.last_active).toLocaleString() : 'N/A'}
                                        />
                                    </View>

                                    {/* Barcode Section */}
                                    <View style={styles.barcodeSection}>
                                        <Text style={styles.sectionTitle}>Member Barcode</Text>
                                        <View style={styles.barcodeCard}>
                                            <QRCode
                                                value={userData?.bar_code || 'N/A'}
                                                size={100}
                                                color="#000"
                                                backgroundColor="#fff"
                                            />
                                            <Text style={styles.barcodeNumber}>
                                                {userData?.bar_code || 'N/A'}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Action Buttons */}
                                    {/* <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.primaryButton]}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.primaryButtonText}>Edit Profile</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.actionButton, styles.secondaryButton]}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.secondaryButtonText}>View History</Text>
                                        </TouchableOpacity>
                                    </View> */}
                                </ScrollView>
                            )}
                        </Animated.View>
                    </PanGestureHandler>
                </Animated.View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: scale(14),
        color: '#666',
    },
    openButton: {
        backgroundColor: '#E0B820',
        paddingHorizontal: isTablet ? 40 : 32,
        paddingVertical: isTablet ? 18 : 16,
        borderRadius: 28,
        elevation: 4,
        shadowColor: '#E0B820',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    openButtonText: {
        color: '#000',
        fontSize: isTablet ? scale(16) : scale(15),
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: height * 0.9,
        width: '100%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 20,
            },
        }),
    },
    modalContentTablet: {
        maxHeight: height * 0.85,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 600,
        borderRadius: 30,
        marginBottom: 20,
    },
    modalHeader: {
        paddingTop: 12,
        paddingBottom: 8,
        alignItems: 'center',
        position: 'relative',
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#E1E9EE',
        borderRadius: 2,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeIcon: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: isTablet ? 32 : 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    helperNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF9E6',
        padding: isTablet ? 16 : 14,
        borderRadius: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#E0B820',
        gap: 12,
    },
    helperText: {
        flex: 1,
        fontSize: isTablet ? scale(13) : scale(12),
        color: '#666',
        lineHeight: isTablet ? 20 : 18,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: isTablet ? 32 : 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: isTablet ? 110 : 90,
        height: isTablet ? 110 : 90,
        borderRadius: isTablet ? 55 : 45,
        backgroundColor: '#FFD93D',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    avatarText: {
        fontSize: isTablet ? scale(32) : scale(28),
        fontWeight: 'bold',
        color: '#000',
    },
    tierBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: isTablet ? 36 : 32,
        height: isTablet ? 36 : 32,
        borderRadius: isTablet ? 18 : 16,
        backgroundColor: '#E0B820',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    tierIcon: {
        fontSize: isTablet ? 18 : 16,
    },
    userName: {
        fontSize: isTablet ? scale(22) : scale(20),
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 4,
    },
    userTier: {
        fontSize: isTablet ? scale(14) : scale(13),
        color: '#E0B820',
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: isTablet ? 16 : 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        padding: isTablet ? 20 : 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E1E9EE',
    },
    statCardTablet: {
        padding: 24,
        borderRadius: 20,
    },
    statIcon: {
        width: isTablet ? 52 : 44,
        height: isTablet ? 52 : 44,
        borderRadius: isTablet ? 26 : 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statEmoji: {
        fontSize: isTablet ? 24 : 20,
    },
    statValue: {
        fontSize: isTablet ? scale(20) : scale(18),
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: isTablet ? scale(12) : scale(11),
        color: '#999',
    },
    infoSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: isTablet ? scale(17) : scale(16),
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 16,
        paddingLeft: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: isTablet ? 18 : 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    iconContainer: {
        width: isTablet ? 44 : 40,
        height: isTablet ? 44 : 40,
        borderRadius: isTablet ? 22 : 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: isTablet ? 20 : 18,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: isTablet ? scale(12) : scale(11),
        color: '#999',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: isTablet ? scale(14) : scale(13),
        color: '#222',
        fontWeight: '600',
    },
    barcodeSection: {
        marginBottom: 24,
    },
    barcodeCard: {
        backgroundColor: '#F8F9FA',
        padding: isTablet ? 28 : 24,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E1E9EE',
    },
    barcodeStripes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: isTablet ? 70 : 60,
        marginBottom: 12,
        gap: 3,
    },
    barcodeStripe: {
        height: '100%',
        backgroundColor: '#000',
    },
    barcodeNumber: {
        fontSize: isTablet ? scale(15) : scale(14),
        fontWeight: '600',
        color: '#666',
        letterSpacing: 2,
        marginTop: 12,
    },
    actionButtons: {
        flexDirection: isTablet ? 'row' : 'column',
        gap: 12,
        marginTop: 8,
    },
    actionButton: {
        flex: isTablet ? 1 : undefined,
        paddingVertical: isTablet ? 18 : 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#E0B820',
        ...Platform.select({
            ios: {
                shadowColor: '#E0B820',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    primaryButtonText: {
        fontSize: isTablet ? scale(15) : scale(14),
        fontWeight: '700',
        color: '#000',
    },
    secondaryButton: {
        backgroundColor: '#F8F9FA',
        borderWidth: 2,
        borderColor: '#E1E9EE',
    },
    secondaryButtonText: {
        fontSize: isTablet ? scale(15) : scale(14),
        fontWeight: '600',
        color: '#666',
    },
});

export default FlashUserDetails;