import { View, ImageBackground, StyleSheet, Text, Dimensions, Image, Animated, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../../context/ThemeContext'
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL, processResponse } from '../../config';
import DatePicker from 'react-native-neat-date-picker';
import { NotificationContext } from '../../context/ActivityNotif';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size) => (SCREEN_WIDTH / 375) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Responsive breakpoints
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeDevice = SCREEN_WIDTH >= 768;

export default function ActivityScreen({ navigation }) {
    const { userInfo, userDetails } = useContext(AuthContext);
    const { styles } = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState('This Month');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    const getUserTransactions = async (startDate, endDate) => {
        try {
            setIsLoading(true);
            await fetch(`${BASE_URL}customer/activity?date_start=${startDate}&date_end=${endDate}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                }
            }).then(processResponse).then((res) => {
                const { statusCode, data } = res;
                if (statusCode === 200) {
                    const grouped = groupByDate(data.result);
                    setGroupedTransactions(grouped);
                } else {
                    setGroupedTransactions([]);
                }
            }).catch(error => {
                console.error(error);
                setGroupedTransactions([]);
            }).finally(() => {
                setIsLoading(false);
            });
        } catch (error) {
            console.error(error);
            setGroupedTransactions([]);
            setIsLoading(false);
        }
    };

    const getGroupLabel = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const toDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        const today = toDateOnly(now);
        const yesterday = toDateOnly(new Date(now.setDate(now.getDate() - 1)));
        const target = toDateOnly(date);

        if (target.getTime() === today.getTime()) return "Today";
        if (target.getTime() === yesterday.getTime()) return "Yesterday";

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return target.toLocaleDateString(undefined, options);
    };

    const groupByDate = (transactions) => {
        if (!transactions || transactions.length === 0) return [];

        const groupedMap = {};
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        transactions.forEach((item) => {
            const dateKey = new Date(item.date).toISOString().split('T')[0];
            if (!groupedMap[dateKey]) groupedMap[dateKey] = [];
            groupedMap[dateKey].push(item);
        });

        Object.keys(groupedMap).forEach(date => {
            groupedMap[date].sort((a, b) => {
                return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
            });
        });

        const sortedDates = Object.keys(groupedMap).sort((a, b) => {
            if (a === todayStr) return -1;
            if (b === todayStr) return 1;
            return new Date(b) - new Date(a);
        });

        return sortedDates.map((dateStr, index) => ({
            date_id: index,
            date: getGroupLabel(dateStr),
            items: groupedMap[dateStr],
        }));
    };

    const formatDateTime = (dateStr, timeStr) => {
        const [year, month, day] = dateStr.split('-');
        const [hour, minute] = timeStr.split(':');

        const date = new Date(year, month - 1, day, hour, minute);

        const options = {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        return date.toLocaleString(undefined, options);
    };

    useEffect(() => {
        getUserTransactions();
    }, []);

    const { notifCount } = useContext(NotificationContext);

    useEffect(() => {
        if (notifCount > 0) {
            getUserTransactions();
        }
    }, [notifCount]);

    return (
        <>
            <DatePicker
                isVisible={showDatePicker}
                mode={'range'}
                colorOptions={{
                    headerColor: '#fe0002',
                    weekDaysColor: '#fe0002',
                    selectedDateBackgroundColor: '#fe0002',
                    confirmButtonColor: '#fe0002',
                }}
                onCancel={() => { setShowDatePicker(false); }}
                onConfirm={(e) => {
                    setShowDatePicker(false);
                    setSelectedRange(`${e.startDateString} - ${e.endDateString}`);
                    getUserTransactions(e.startDateString, e.endDateString);
                }}
            />
            <View style={custom_styles.container}>
                <Animated.View style={{ opacity: headerOpacity }}>
                    <ImageBackground
                        resizeMode='stretch'
                        source={require('../../../assets/mygas-header.jpeg')}
                        style={custom_styles.top_bar}
                    >
                        <LinearGradient
                            colors={['rgb(249, 250, 141)', 'transparent']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1.4 }}
                            style={custom_styles.gradient}
                        />
                        <Image
                            source={require("../../../assets/mygas_logo.png")}
                            style={custom_styles.logo}
                        />
                        <Navbar
                            hideBack
                            onProfilePress={() => console.log("Profile tapped")}
                            onNotifPress={() => console.log("Notifications tapped")}
                        />
                    </ImageBackground>
                </Animated.View>

                <Animated.View style={[custom_styles.contentContainer, { opacity: fadeAnim }]}>
                    <View style={custom_styles.headerSection}>
                        <Text style={custom_styles.title}>Activity</Text>
                        <Text style={custom_styles.subtitle}>Track your MyGas points history</Text>
                    </View>

                    {isLoading ? (
                        <View style={custom_styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fe0002" />
                            <Text style={custom_styles.loadingText}>Loading transactions...</Text>
                        </View>
                    ) : (
                        <Animated.ScrollView
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                            scrollEventThrottle={16}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={custom_styles.scrollContent}
                        >
                            <View style={custom_styles.filterCard}>
                                <View style={custom_styles.filterRow}>
                                    <Text style={custom_styles.filterLabel}>Filter by Date</Text>
                                    <TouchableOpacity
                                        style={custom_styles.filterBtn}
                                        onPress={() => { setShowDatePicker(true); }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={custom_styles.filterBtnText}>
                                            {selectedRange}
                                        </Text>
                                        <Text style={custom_styles.filterIcon}>📅</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {groupedTransactions && groupedTransactions.length > 0 ? (
                                groupedTransactions.map((group, index) => (
                                    <View key={index} style={custom_styles.dateGroup}>
                                        <View style={custom_styles.dateHeader}>
                                            <View style={custom_styles.dateBadge}>
                                                <Text style={custom_styles.dateText}>{group.date}</Text>
                                            </View>
                                            <View style={custom_styles.dateLine} />
                                        </View>

                                        {[...group.items].reverse().map((item, ind) => (
                                            <View key={ind} style={custom_styles.transactionCard}>
                                                <View style={custom_styles.cardHeader}>
                                                    <View style={custom_styles.iconWrapper}>
                                                        <Image
                                                            source={require('../../../assets/mygas_logo.png')}
                                                            style={custom_styles.stationIcon}
                                                        />
                                                    </View>
                                                    <View style={custom_styles.headerInfo}>
                                                        <Text style={custom_styles.stationName} numberOfLines={1}>
                                                            {item.station_name}
                                                        </Text>
                                                        <Text style={custom_styles.dateTime} numberOfLines={1}>
                                                            {formatDateTime(item.date, item.time)}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={custom_styles.cardDivider} />

                                                <View style={custom_styles.cardBody}>
                                                    <View style={custom_styles.infoRow}>
                                                        <Text style={custom_styles.infoLabel}>Transaction</Text>
                                                        <Text style={custom_styles.infoValue} numberOfLines={1}>
                                                            {item.transaction_number}
                                                        </Text>
                                                    </View>
                                                    <View style={custom_styles.infoRow}>
                                                        <Text style={custom_styles.infoLabel}>Service</Text>
                                                        <Text style={custom_styles.infoValue} numberOfLines={1}>
                                                            {item.service}
                                                        </Text>
                                                    </View>
                                                    <View style={custom_styles.infoRow}>
                                                        <Text style={custom_styles.infoLabel}>Amount</Text>
                                                        <Text style={custom_styles.amountValue}>
                                                            ₱{parseFloat(item.amount).toFixed(2)}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={[
                                                    custom_styles.pointsBadge,
                                                    { backgroundColor: item.service === 'Cash Redeem' ? '#FFE5E5' : '#FFF8E1' }
                                                ]}>
                                                    <Text style={[
                                                        custom_styles.pointsValue,
                                                        { color: item.service === 'Cash Redeem' ? '#D32F2F' : '#F57C00' }
                                                    ]}>
                                                        {item.service === 'Cash Redeem' ? '-' : '+'}{item.points}
                                                    </Text>
                                                    <Text style={custom_styles.pointsText}>
                                                        {item.service === 'Cash Redeem' ? 'redeemed' : 'earned'}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ))
                            ) : (
                                <View style={custom_styles.emptyState}>
                                    <View style={custom_styles.emptyIcon}>
                                        <Text style={custom_styles.emptyIconText}>📊</Text>
                                    </View>
                                    <Text style={custom_styles.emptyTitle}>No Activity Yet</Text>
                                    <Text style={custom_styles.emptySubtitle}>
                                        Your transaction history will appear here
                                    </Text>
                                </View>
                            )}
                            <View style={{ height: verticalScale(100) }} />
                        </Animated.ScrollView>
                    )}
                </Animated.View>
            </View>
        </>
    )
}

const custom_styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    top_bar: {
        height: verticalScale(150),
        width: '100%',
        position: 'relative',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    logo: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [
            { translateX: -moderateScale(32.5) },
            { translateY: -moderateScale(32.5) }
        ],
        width: moderateScale(65),
        height: moderateScale(65),
        resizeMode: "contain",
        zIndex: 2,
    },
    contentContainer: {
        flex: 1,
        marginTop: verticalScale(-30),
        backgroundColor: '#F8F9FA',
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        paddingTop: verticalScale(24),
    },
    headerSection: {
        paddingHorizontal: scale(20),
        marginBottom: verticalScale(20),
    },
    title: {
        fontSize: moderateScale(32),
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: verticalScale(4),
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: moderateScale(15),
        color: '#6B7280',
        fontWeight: '500',
    },
    filterCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: scale(20),
        borderRadius: moderateScale(16),
        padding: scale(16),
        marginBottom: verticalScale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    filterRow: {
        flexDirection: isSmallDevice ? 'column' : 'row',
        alignItems: isSmallDevice ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isSmallDevice ? verticalScale(12) : 0,
    },
    filterLabel: {
        fontSize: moderateScale(14),
        color: '#6B7280',
        fontWeight: '600',
    },
    filterBtn: {
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(12),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterBtnText: {
        fontSize: moderateScale(14),
        color: '#1F2937',
        fontWeight: '600',
    },
    filterIcon: {
        fontSize: moderateScale(16),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(80),
    },
    loadingText: {
        marginTop: verticalScale(16),
        fontSize: moderateScale(15),
        color: '#6B7280',
        fontWeight: '500',
    },
    scrollContent: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(20),
    },
    dateGroup: {
        marginBottom: verticalScale(24),
    },
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    dateBadge: {
        backgroundColor: '#1F2937',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(20),
    },
    dateText: {
        fontSize: moderateScale(13),
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
        marginLeft: scale(12),
    },
    transactionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: moderateScale(20),
        padding: scale(20),
        marginBottom: verticalScale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    iconWrapper: {
        width: moderateScale(48),
        height: moderateScale(48),
        borderRadius: moderateScale(12),
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    stationIcon: {
        width: moderateScale(28),
        height: moderateScale(28),
        resizeMode: 'contain',
    },
    headerInfo: {
        flex: 1,
    },
    stationName: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: verticalScale(2),
    },
    dateTime: {
        fontSize: moderateScale(13),
        color: '#6B7280',
        fontWeight: '500',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: verticalScale(16),
    },
    cardBody: {
        gap: verticalScale(12),
        marginBottom: verticalScale(16),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: moderateScale(13),
        color: '#6B7280',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: moderateScale(13),
        color: '#1F2937',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
        marginLeft: scale(8),
    },
    amountValue: {
        fontSize: moderateScale(16),
        color: '#1A1A1A',
        fontWeight: '800',
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        borderRadius: moderateScale(12),
        gap: scale(8),
    },
    pointsValue: {
        fontSize: moderateScale(20),
        fontWeight: '800',
    },
    pointsText: {
        fontSize: moderateScale(13),
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(80),
    },
    emptyIcon: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    emptyIconText: {
        fontSize: moderateScale(40),
    },
    emptyTitle: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: verticalScale(8),
    },
    emptySubtitle: {
        fontSize: moderateScale(14),
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: scale(40),
    },
});