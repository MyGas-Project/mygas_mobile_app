import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import QrRedemption from '../redemption/QrRedemption';
import QrDownloadTemplate from './QrDownloadTemplate';

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

export default function TransactionDetailsPopup({ navigation, route }) {
    const [showQR, setShowQR] = useState(false);
    const downloadViewShotRef = useRef();
    const transaction = route?.params?.transaction;
    console.log(transaction);
    if (!transaction) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Transaction not found</Text>
            </SafeAreaView>
        );
    }

    const handleDownloadQR = async () => {
        if (!downloadViewShotRef.current) return;

        try {
            const uri = await downloadViewShotRef.current.capture();
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                const asset = await MediaLibrary.createAssetAsync(uri);
                await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
                Alert.alert('Success!', 'QR code has been saved to your gallery.');
            } else {
                Alert.alert('Permission Denied', 'Cannot save QR code to gallery without permission.');
            }
        } catch (err) {
            console.error('Download error:', err);
            Alert.alert('Error', 'Failed to save QR code. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ready':
                return '#4CAF50';
            case 'claimed':
                return '#2196F3';
            default:
                return '#999';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ready':
                return 'Ready to Claim';
            case 'claimed':
                return 'Claimed';
            default:
                return status;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Hidden ViewShot for Download */}
            <View style={styles.hiddenDownloadContainer}>
                <ViewShot
                    ref={downloadViewShotRef}
                    options={{
                        format: 'png',
                        quality: 1.0,
                        result: 'tmpfile'
                    }}
                >
                    <QrDownloadTemplate
                        qrCode={transaction.qr_code}
                        transactionId={transaction.id}
                    />
                </ViewShot>
            </View>

            {/* Header */}
            <LinearGradient
                colors={['#FF0000', '#CC0000']}
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="arrow-back"
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transaction Details</Text>
                <View style={styles.headerSpacer} />
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* QR Code Section - NOW AT TOP */}
                {transaction.status === 'ready' && (
                    <View style={styles.qrSection}>
                        {/* Small Status Badge */}
                        <View style={styles.statusBadgeContainer}>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(transaction.status) },
                                ]}
                            >
                                <Ionicons
                                    name="time-outline"
                                    size={16}
                                    color="#fff"
                                />
                                <Text style={styles.statusBadgeText}>
                                    {getStatusText(transaction.status)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.qrCard}>
                            <Text style={styles.qrTitle}>Show QR Code at Station</Text>

                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={transaction.qr_code}
                                    size={getResponsiveValue(180, 200, 220, 240)}
                                />
                            </View>

                            <Text style={styles.qrCodeText}>{transaction.qr_code}</Text>

                            <Text style={styles.qrInstruction}>
                                Present this code to the staff to claim your items
                            </Text>

                            {/* Large Action Buttons */}
                            <View style={styles.qrButtonContainer}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    activeOpacity={0.8}
                                    onPress={() => setShowQR(true)}
                                >
                                    <Ionicons
                                        name="expand-outline"
                                        size={24}
                                        color="#fff"
                                    />
                                    <Text style={styles.actionButtonText}>View Fullscreen</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.downloadButton}
                                    activeOpacity={0.8}
                                    onPress={handleDownloadQR}
                                >
                                    <Ionicons
                                        name="download-outline"
                                        size={24}
                                        color="#FF0000"
                                    />
                                    <Text style={styles.downloadButtonText}>Save to Photos</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Claimed Status Display */}
                {transaction.status === 'claimed' && (
                    <View style={styles.claimedSection}>
                        <View style={styles.claimedBadge}>
                            <Ionicons
                                name="checkmark-circle"
                                size={48}
                                color="#4CAF50"
                            />
                            <Text style={styles.claimedTitle}>Items Claimed</Text>
                            <Text style={styles.claimedDate}>
                                {formatDate(transaction.claimed_at)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Total Points - Prominent Display */}
                <View style={styles.pointsCard}>
                    <Text style={styles.pointsLabel}>Total Points Redeemed</Text>
                    <View style={styles.pointsValueContainer}>
                        <Image
                            source={require('../../../../assets/my.png')}
                            style={styles.pointsIcon}
                        />
                        <Text style={styles.pointsValue}>
                            {transaction.total_points}
                        </Text>
                    </View>
                </View>

                {/* Items Section - Simplified */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="gift"
                            size={24}
                            color="#FF0000"
                        />
                        <Text style={styles.sectionTitle}>
                            Your Items ({transaction.items_count})
                        </Text>
                    </View>

                    {transaction.items.map((item, index) => (
                        <View key={item.id} style={styles.itemCard}>
                            <View style={styles.itemContent}>
                                <View style={styles.itemIconBox}>
                                    <Ionicons
                                        name="gift-outline"
                                        size={32}
                                        color="#FF0000"
                                    />
                                </View>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>
                                        {item.inventory.name}
                                    </Text>
                                    <Text style={styles.itemDescription}>
                                        {item.inventory.description}
                                    </Text>
                                    <View style={styles.itemFooter}>
                                        <View style={styles.itemQty}>
                                            <Text style={styles.qtyLabel}>Quantity:</Text>
                                            <Text style={styles.qtyValue}>{item.quantity}</Text>
                                        </View>
                                        <View style={styles.itemPoints}>
                                            <Image
                                                source={require('../../../../assets/my.png')}
                                                style={styles.itemPointsIcon}
                                            />
                                            <Text style={styles.itemPointsValue}>
                                                {item.total_points} pts
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Station Info - Clean Design */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="location"
                            size={24}
                            color="#FF0000"
                        />
                        <Text style={styles.sectionTitle}>Station Location</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.stationName}>{transaction.station_name}</Text>
                        <Text style={styles.stationAddress}>
                            {transaction.station_address}
                        </Text>
                    </View>
                </View>

                {/* Transaction Info - Clean Design */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="document-text"
                            size={24}
                            color="#FF0000"
                        />
                        <Text style={styles.sectionTitle}>Transaction Details</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Reference Number</Text>
                            <Text style={styles.infoValue}>{transaction.id}</Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date</Text>
                            <Text style={styles.infoValue}>
                                {formatDate(transaction.created_at)}
                            </Text>
                        </View>
                        <View style={styles.infoDivider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Time</Text>
                            <Text style={styles.infoValue}>
                                {formatTime(transaction.created_at)}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* QR Redemption Modal */}
            <QrRedemption
                visible={showQR}
                onClose={() => setShowQR(false)}
                qrCode={transaction.qr_code}
                transactionId={transaction.id}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    hiddenDownloadContainer: {
        position: 'absolute',
        left: -9999,
        top: -9999,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        paddingTop: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },
    headerSpacer: {
        width: 44,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },

    // QR Section Styles (Now at top)
    qrSection: {
        marginBottom: 24,
    },
    statusBadgeContainer: {
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    qrCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    qrTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 24,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    qrContainer: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#FF0000',
        marginBottom: 20,
    },
    qrCodeText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FF0000',
        marginBottom: 16,
        letterSpacing: 2,
    },
    qrInstruction: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    qrButtonContainer: {
        width: '100%',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#FF0000',
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 24,
        elevation: 2,
        shadowColor: '#FF0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    actionButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderWidth: 2.5,
        borderColor: '#FF0000',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    downloadButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#FF0000',
        letterSpacing: 0.3,
    },

    // Claimed Status
    claimedSection: {
        marginBottom: 24,
    },
    claimedBadge: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
        elevation: 2,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    claimedTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4CAF50',
        marginTop: 16,
        marginBottom: 8,
    },
    claimedDate: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },

    // Points Card
    pointsCard: {
        backgroundColor: '#FFF8E1',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#f39c12',
        elevation: 2,
        shadowColor: '#f39c12',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        alignItems: 'center',
    },
    pointsLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pointsValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    pointsIcon: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    pointsValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#f39c12',
        letterSpacing: 0.5,
    },

    // Section Styles
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: 0.3,
    },

    // Item Card
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    itemContent: {
        flexDirection: 'row',
        gap: 16,
    },
    itemIconBox: {
        width: 64,
        height: 64,
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    itemInfo: {
        flex: 1,
        gap: 8,
    },
    itemName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: 0.2,
    },
    itemDescription: {
        fontSize: 15,
        color: '#666',
        lineHeight: 21,
    },
    itemFooter: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 8,
    },
    itemQty: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    qtyLabel: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    qtyValue: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '700',
    },
    itemPoints: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    itemPointsIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    itemPointsValue: {
        fontSize: 16,
        color: '#f39c12',
        fontWeight: '700',
    },

    // Info Card
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    stationName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    stationAddress: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '700',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
    infoDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    errorText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 60,
        fontWeight: '500',
    },
});