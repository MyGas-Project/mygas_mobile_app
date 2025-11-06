import React from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';

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
    const transaction = route?.params?.transaction;
    // console.log(transaction);

    if (!transaction) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Transaction not found</Text>
            </SafeAreaView>
        );
    }

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
                        size={getResponsiveValue(24, 26, 28, 30)}
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
                {/* Status Card */}
                <View style={styles.statusCard}>
                    <View
                        style={[
                            styles.statusBadgeLarge,
                            { backgroundColor: getStatusColor(transaction.status) },
                        ]}
                    >
                        <Ionicons
                            name={
                                transaction.status === 'ready'
                                    ? 'time-outline'
                                    : 'checkmark-circle-outline'
                            }
                            size={getResponsiveValue(24, 28, 32, 36)}
                            color="#fff"
                        />
                        <Text style={styles.statusTextLarge}>
                            {getStatusText(transaction.status)}
                        </Text>
                    </View>
                </View>

                {/* Transaction Info Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons
                            name="document-text-outline"
                            size={getResponsiveValue(20, 22, 24, 26)}
                            color="#FF0000"
                        />
                        <Text style={styles.cardTitle}>Transaction Information</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Reference Number</Text>
                        <Text style={styles.infoValue}>{transaction.id}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>
                            {formatDate(transaction.created_at)}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Time</Text>
                        <Text style={styles.infoValue}>
                            {formatTime(transaction.created_at)}
                        </Text>
                    </View>

                    {transaction.claimed_at && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Claimed On</Text>
                                <Text style={[styles.infoValue, { color: '#4CAF50' }]}>
                                    {formatDate(transaction.claimed_at)}
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Station Info Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons
                            name="business-outline"
                            size={getResponsiveValue(20, 22, 24, 26)}
                            color="#FF0000"
                        />
                        <Text style={styles.cardTitle}>Station Details</Text>
                    </View>

                    <View style={styles.stationInfo}>
                        <Text style={styles.stationName}>{transaction.station_name}</Text>
                        <Text style={styles.stationAddress}>
                            {transaction.station_address}
                        </Text>
                    </View>
                </View>

                {/* Items Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons
                            name="cube-outline"
                            size={getResponsiveValue(20, 22, 24, 26)}
                            color="#FF0000"
                        />
                        <Text style={styles.cardTitle}>
                            Items ({transaction.items_count})
                        </Text>
                    </View>

                    {transaction.items.map((item, index) => (
                        <View key={item.id}>
                            {index > 0 && <View style={styles.divider} />}
                            <View style={styles.itemRow}>
                                <View style={styles.itemIconContainer}>
                                    <Ionicons
                                        name="gift-outline"
                                        size={getResponsiveValue(24, 28, 32, 36)}
                                        color="#FF0000"
                                    />
                                </View>
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>
                                        {item.inventory.name}
                                    </Text>
                                    <Text style={styles.itemDescription}>
                                        {item.inventory.description}
                                    </Text>
                                    <View style={styles.itemMeta}>
                                        <View style={styles.metaItem}>
                                            <Text style={styles.metaLabel}>Qty:</Text>
                                            <Text style={styles.metaValue}>
                                                {item.quantity}
                                            </Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Image
                                                source={require('../../../../assets/my.png')}
                                                style={styles.pointsIconSmall}
                                            />
                                            <Text style={styles.metaValuePoints}>
                                                {item.total_points} pts
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Total Points Card */}
                <View style={styles.totalCard}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Points</Text>
                        <View style={styles.totalValueContainer}>
                            <Image
                                source={require('../../../../assets/my.png')}
                                style={styles.pointsIconLarge}
                            />
                            <Text style={styles.totalValue}>
                                {transaction.total_points}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* QR Code Section (only for ready status) */}
                {transaction.status === 'ready' && (
                    <View style={styles.qrCard}>
                        <View style={styles.qrHeader}>
                            <Ionicons
                                name="qr-code"
                                size={getResponsiveValue(28, 32, 36, 40)}
                                color="#FF0000"
                            />
                            <Text style={styles.qrTitle}>QR Code</Text>
                        </View>

                        <View style={styles.qrPlaceholder}>
                            {/* <Ionicons
                                name="qr-code-outline"
                                size={getResponsiveValue(120, 140, 160, 180)}
                                color="#FF0000"
                            /> */}
                            <QRCode 
                                value={transaction.qr_code}
                                size={getResponsiveValue(120, 140, 160, 180)}
                            />
                            <Text style={styles.qrCode}>{transaction.qr_code}</Text>
                        </View>

                        <Text style={styles.qrInstruction}>
                            Show this QR code at the station to claim your items
                        </Text>
                    </View>
                )}

                {/* Action Buttons */}
                {transaction.status === 'ready' && (
                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.8}
                        onPress={() => {
                            // Navigate to QR scanner or show full QR
                            console.log('Show full QR code');
                        }}
                    >
                        <Ionicons
                            name="qr-code-outline"
                            size={getResponsiveValue(20, 22, 24, 26)}
                            color="#fff"
                        />
                        <Text style={styles.primaryButtonText}>Show Full QR Code</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: getResponsiveValue(20, 18, 20, 22),
        paddingHorizontal: getResponsiveValue(15, 20, 24, 28),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        paddingTop: 25
    },
    backButton: {
        padding: getResponsiveValue(4, 6, 8, 10),
    },
    headerTitle: {
        fontSize: getResponsiveValue(18, 20, 22, 24),
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSpacer: {
        width: getResponsiveValue(32, 36, 40, 44),
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: getResponsiveValue(16, 20, 24, 28),
        paddingBottom: getResponsiveValue(32, 40, 48, 56),
    },
    statusCard: {
        alignItems: 'center',
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    statusBadgeLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(10, 12, 14, 16),
        paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
        paddingVertical: getResponsiveValue(12, 14, 16, 18),
        borderRadius: getResponsiveValue(20, 24, 28, 32),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statusTextLarge: {
        fontSize: getResponsiveValue(16, 18, 20, 22),
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: getResponsiveValue(12, 16, 18, 20),
        padding: getResponsiveValue(16, 20, 24, 28),
        marginBottom: getResponsiveValue(16, 20, 24, 28),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(8, 10, 12, 14),
        marginBottom: getResponsiveValue(16, 18, 20, 22),
    },
    cardTitle: {
        fontSize: getResponsiveValue(16, 18, 20, 22),
        fontWeight: 'bold',
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: getResponsiveValue(8, 10, 12, 14),
    },
    infoLabel: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#333',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    stationInfo: {
        gap: getResponsiveValue(6, 8, 10, 12),
    },
    stationName: {
        fontSize: getResponsiveValue(16, 18, 20, 22),
        fontWeight: '600',
        color: '#333',
    },
    stationAddress: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#666',
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    itemRow: {
        flexDirection: 'row',
        gap: getResponsiveValue(12, 14, 16, 18),
        paddingVertical: getResponsiveValue(12, 14, 16, 18),
    },
    itemIconContainer: {
        width: getResponsiveValue(48, 56, 64, 72),
        height: getResponsiveValue(48, 56, 64, 72),
        backgroundColor: '#fff5f5',
        borderRadius: getResponsiveValue(10, 12, 14, 16),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ffe0e0',
    },
    itemDetails: {
        flex: 1,
        gap: getResponsiveValue(4, 6, 8, 10),
    },
    itemName: {
        fontSize: getResponsiveValue(14, 16, 18, 20),
        fontWeight: '600',
        color: '#333',
    },
    itemDescription: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#666',
        lineHeight: getResponsiveValue(16, 18, 20, 22),
    },
    itemMeta: {
        flexDirection: 'row',
        gap: getResponsiveValue(16, 18, 20, 22),
        marginTop: getResponsiveValue(4, 6, 8, 10),
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(4, 5, 6, 7),
    },
    metaLabel: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: '#999',
        fontWeight: '500',
    },
    metaValue: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#333',
        fontWeight: '600',
    },
    metaValuePoints: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#f39c12',
        fontWeight: '700',
    },
    pointsIconSmall: {
        width: getResponsiveValue(14, 16, 18, 20),
        height: getResponsiveValue(14, 16, 18, 20),
        resizeMode: 'contain',
    },
    totalCard: {
        backgroundColor: '#fff',
        borderRadius: getResponsiveValue(12, 16, 18, 20),
        padding: getResponsiveValue(20, 24, 28, 32),
        marginBottom: getResponsiveValue(16, 20, 24, 28),
        borderWidth: 2,
        borderColor: '#f39c12',
        elevation: 3,
        shadowColor: '#f39c12',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: getResponsiveValue(16, 18, 20, 22),
        fontWeight: 'bold',
        color: '#333',
    },
    totalValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(8, 10, 12, 14),
    },
    totalValue: {
        fontSize: getResponsiveValue(24, 28, 32, 36),
        fontWeight: 'bold',
        color: '#f39c12',
    },
    pointsIconLarge: {
        width: getResponsiveValue(24, 28, 32, 36),
        height: getResponsiveValue(24, 28, 32, 36),
        resizeMode: 'contain',
    },
    qrCard: {
        backgroundColor: '#fff',
        borderRadius: getResponsiveValue(12, 16, 18, 20),
        padding: getResponsiveValue(20, 24, 28, 32),
        marginBottom: getResponsiveValue(16, 20, 24, 28),
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF0000',
        borderStyle: 'dashed',
    },
    qrHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(10, 12, 14, 16),
        marginBottom: getResponsiveValue(20, 24, 28, 32),
    },
    qrTitle: {
        fontSize: getResponsiveValue(18, 20, 22, 24),
        fontWeight: 'bold',
        color: '#FF0000',
    },
    qrPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: getResponsiveValue(20, 24, 28, 32),
        backgroundColor: '#fff5f5',
        borderRadius: getResponsiveValue(12, 16, 18, 20),
        marginBottom: getResponsiveValue(16, 18, 20, 22),
        borderWidth: 1,
        borderColor: '#ffe0e0',
    },
    qrCode: {
        fontSize: getResponsiveValue(14, 16, 18, 20),
        fontWeight: '600',
        color: '#FF0000',
        marginTop: getResponsiveValue(12, 14, 16, 18),
        letterSpacing: 1,
    },
    qrInstruction: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: '#666',
        textAlign: 'center',
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: getResponsiveValue(10, 12, 14, 16),
        backgroundColor: '#FF0000',
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        paddingVertical: getResponsiveValue(14, 16, 18, 20),
        paddingHorizontal: getResponsiveValue(24, 28, 32, 36),
        elevation: 3,
        shadowColor: '#FF0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    primaryButtonText: {
        fontSize: getResponsiveValue(14, 16, 18, 20),
        fontWeight: 'bold',
        color: '#fff',
    },
    errorText: {
        fontSize: getResponsiveValue(16, 18, 20, 22),
        color: '#999',
        textAlign: 'center',
        marginTop: getResponsiveValue(40, 50, 60, 70),
    },
});