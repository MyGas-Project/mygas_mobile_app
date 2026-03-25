import { View, ImageBackground, StyleSheet, Text, Dimensions, Image, Animated, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../../context/ThemeContext'
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL, processResponse } from '../../config';
import DatePicker from 'react-native-neat-date-picker';
import { NotificationContext } from '../../context/ActivityNotif';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const isTablet = SCREEN_WIDTH >= 768;
const MAX_CONTENT_WIDTH = 500;

const responsive = (mobile, tablet = mobile) => isTablet ? tablet : mobile;

export default function ActivityScreen({ navigation }) {
    const { userInfo, userDetails } = useContext(AuthContext);
    const { styles } = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;

    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState('This Month');
    const [isLoading, setIsLoading] = useState(true);

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
            groupedMap[date].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
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
        return date.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
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
                onCancel={() => setShowDatePicker(false)}
                onConfirm={(e) => {
                    setShowDatePicker(false);
                    setSelectedRange(`${e.startDateString} - ${e.endDateString}`);
                    getUserTransactions(e.startDateString, e.endDateString);
                }}
            />

            <View style={custom_styles.container}>
                <View style={custom_styles.cardContainer}>
                    <Animated.ScrollView
                        style={{ flex: 1, width: '100%' }}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                    >
                        <View style={custom_styles.contentContainer}>

                            {/* Page Header */}
                            <View style={custom_styles.headerSection}>
                                <Text style={custom_styles.title}>Activity</Text>
                                <Text style={custom_styles.subtitle}>Track your MyGas points history</Text>
                            </View>

                            {/* Filter Card */}
                            <View style={custom_styles.filterCard}>
                                <View style={custom_styles.filterRow}>
                                    <Text style={custom_styles.filterLabel}>Filter by Date</Text>
                                    <TouchableOpacity
                                        style={custom_styles.filterBtn}
                                        onPress={() => setShowDatePicker(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={custom_styles.filterBtnText} numberOfLines={1}>
                                            {selectedRange}
                                        </Text>
                                        <Text style={custom_styles.filterIcon}>📅</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Content */}
                            {isLoading ? (
                                <View style={custom_styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#fe0002" />
                                    <Text style={custom_styles.loadingText}>Loading transactions...</Text>
                                </View>
                            ) : groupedTransactions && groupedTransactions.length > 0 ? (
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
                                                            {item.service === 'Adjustment' ? 'MyGas Credit/Debit Memo' : item.station_name}
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
                                                    {
                                                        backgroundColor:
                                                            item.service === 'Cash Redeem' ? '#FFE5E5' :
                                                                item.service === 'Adjustment' ? '#E3F2FD' :
                                                                    '#FFF8E1'
                                                    }
                                                ]}>
                                                    <Text style={[
                                                        custom_styles.pointsValue,
                                                        {
                                                            color:
                                                                item.service === 'Cash Redeem' ? '#D32F2F' :
                                                                    item.service === 'Adjustment'
                                                                        ? (parseFloat(item.points) >= 0 ? '#1976D2' : '#D32F2F')
                                                                        : '#F57C00'
                                                        }
                                                    ]}>
                                                        {item.service === 'Cash Redeem' || parseFloat(item.points) < 0 ? '' : '+'}{item.points}
                                                    </Text>
                                                    <Text style={custom_styles.pointsText}>
                                                        {item.service === 'Cash Redeem' ? 'redeemed' :
                                                            item.service === 'Adjustment'
                                                                ? (parseFloat(item.points) >= 0 ? 'credit' : 'debit')
                                                                : 'earned'}
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

                        </View>
                    </Animated.ScrollView>
                </View>

            </View>
        </>
    );
}

const custom_styles = StyleSheet.create({

    // Same as RedemptionScreen container
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },

    // Identical to RedemptionScreen's cardContainer
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: -30,
        backgroundColor: '#F8F9FA',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden', // KEY — keeps corners clipped during scroll
        position: 'relative',
        zIndex: 1,
    },

    // Identical to RedemptionScreen's contentContainer (no borderTopRadius)
    contentContainer: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: responsive(16, 20),
        paddingTop: responsive(24, 28),
        width: '100%',
    },

    headerSection: {
        marginBottom: 20,
    },
    title: {
        fontSize: responsive(28, 32),
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: responsive(14, 15),
        color: '#6B7280',
        fontWeight: '500',
    },
    filterCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
        flex: 1,
    },
    filterBtn: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        maxWidth: '60%',
    },
    filterBtnText: {
        fontSize: 13,
        color: '#1F2937',
        fontWeight: '600',
        flexShrink: 1,
    },
    filterIcon: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },
    dateGroup: {
        marginBottom: 24,
    },
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    dateBadge: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    dateText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
        marginLeft: 12,
    },
    transactionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
            },
            android: { elevation: 3 },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stationIcon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    headerInfo: {
        flex: 1,
    },
    stationName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    dateTime: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    cardBody: {
        gap: 10,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 13,
        color: '#1F2937',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
        marginLeft: 8,
    },
    amountValue: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '800',
    },
    pointsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 8,
    },
    pointsValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    pointsText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyIconText: {
        fontSize: 35,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});