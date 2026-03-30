import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    Animated,
    ScrollView,
    Platform,
    RefreshControl
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL, processResponse } from '../../config';
import DatePicker from 'react-native-neat-date-picker';
import { NotificationContext } from '../../context/ActivityNotif';

// HeroUI Native imports
import {
    Card,
    Chip,
    Button,
    Separator,
    Spinner,
} from 'heroui-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const responsive = (mobile, tablet = mobile) => (isTablet ? tablet : mobile);

export default function ActivityScreen({ navigation }) {
    const { userInfo } = useContext(AuthContext);
    const scrollY = useRef(new Animated.Value(0)).current;

    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState('This Month');
    const [isLoading, setIsLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const cardContainerTranslateY = scrollY.interpolate({ inputRange: [-50, 0, 50], outputRange: [20, 0, -20], extrapolate: "clamp" });

    const getUserTransactions = async (startDate, endDate) => {
        try {
            setIsLoading(true);
            await fetch(
                `${BASE_URL}customer/activity?date_start=${startDate}&date_end=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            )
                .then(processResponse)
                .then((res) => {
                    const { statusCode, data } = res;
                    if (statusCode === 200) {
                        setGroupedTransactions(groupByDate(data.result));
                    } else {
                        setGroupedTransactions([]);
                    }
                })
                .catch(() => setGroupedTransactions([]))
                .finally(() => setIsLoading(false));
        } catch {
            setGroupedTransactions([]);
            setIsLoading(false);
        }
    };

    const getGroupLabel = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const toDateOnly = (d) =>
            new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const today = toDateOnly(now);
        const yesterday = toDateOnly(
            new Date(now.setDate(now.getDate() - 1))
        );
        const target = toDateOnly(date);
        if (target.getTime() === today.getTime()) return 'Today';
        if (target.getTime() === yesterday.getTime()) return 'Yesterday';
        return target.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const groupByDate = (transactions) => {
        if (!transactions || transactions.length === 0) return [];
        const groupedMap = {};
        const todayStr = new Date().toISOString().split('T')[0];

        transactions.forEach((item) => {
            const dateKey = new Date(item.date).toISOString().split('T')[0];
            if (!groupedMap[dateKey]) groupedMap[dateKey] = [];
            groupedMap[dateKey].push(item);
        });

        Object.keys(groupedMap).forEach((date) => {
            groupedMap[date].sort(
                (a, b) =>
                    new Date(b.datetime).getTime() -
                    new Date(a.datetime).getTime()
            );
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
        if (notifCount > 0) getUserTransactions();
    }, [notifCount]);

    // Derives HeroUI Chip color/variant for the points badge
    const getPointsChipProps = (service, points) => {
        if (service === 'Cash Redeem') {
            return { color: 'danger', variant: 'soft', label: 'redeemed', prefix: '' };
        }
        if (service === 'Adjustment') {
            const isCredit = parseFloat(points) >= 0;
            return {
                color: isCredit ? 'accent' : 'danger',
                variant: 'soft',
                label: isCredit ? 'credit' : 'debit',
                prefix: isCredit ? '+' : '',
            };
        }
        return { color: 'warning', variant: 'soft', label: 'earned', prefix: '+' };
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await getUserTransactions();
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <>
            <DatePicker
                isVisible={showDatePicker}
                mode="range"
                colorOptions={{
                    headerColor: '#fe0002',
                    weekDaysColor: '#fe0002',
                    selectedDateBackgroundColor: '#fe0002',
                    confirmButtonColor: '#fe0002',
                }}
                onCancel={() => setShowDatePicker(false)}
                onConfirm={(e) => {
                    setShowDatePicker(false);
                    setSelectedRange(
                        `${e.startDateString} – ${e.endDateString}`
                    );
                    getUserTransactions(e.startDateString, e.endDateString);
                }}
            />

            <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
                <Animated.View style={[styles.cardContainer, { transform: [{ translateY: cardContainerTranslateY }] }]}>
                    <Animated.ScrollView
                        style={{ flex: 1, width: '100%' }}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#fe0002"
                                colors={["#fe0002"]}
                            />
                        }
                    >
                        {/* ── Page Header ── */}
                        <View style={styles.headerSection}>
                            <Text style={styles.title}>Activity</Text>
                            <Text style={styles.subtitle}>
                                Track your MyGas points history
                            </Text>
                        </View>

                        {/* ── Filter Card ── */}
                        <Card style={styles.filterCard}>
                            <Card.Body>
                                <View style={styles.filterRow}>
                                    <Text style={styles.filterLabel}>
                                        Filter by Date
                                    </Text>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onPress={() => setShowDatePicker(true)}
                                        feedbackVariant="scale-highlight"
                                        style={styles.filterBtn}
                                    >
                                        <Button.Label
                                            numberOfLines={1}
                                            style={styles.filterBtnText}
                                        >
                                            {selectedRange}
                                        </Button.Label>
                                        <Text style={styles.calendarIcon}>📅</Text>
                                    </Button>
                                </View>
                            </Card.Body>
                        </Card>

                        {/* ── Content ── */}
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <Spinner size="lg" color="#fe0002" />
                                <Text style={styles.loadingText}>
                                    Loading transactions…
                                </Text>
                            </View>
                        ) : groupedTransactions.length > 0 ? (
                            groupedTransactions.map((group, index) => (
                                <View key={index} style={styles.dateGroup}>

                                    {/* Date header row */}
                                    <View style={styles.dateHeader}>
                                        <Chip
                                            variant="primary"
                                            color="default"
                                            size="sm"
                                            animation="disable-all"
                                        >
                                            <Chip.Label style={styles.dateChipLabel}>
                                                {group.date}
                                            </Chip.Label>
                                        </Chip>
                                        <View style={styles.dateLine} />
                                    </View>

                                    {/* Transaction cards */}
                                    {[...group.items].reverse().map((item, ind) => {
                                        const chipProps = getPointsChipProps(
                                            item.service,
                                            item.points
                                        );

                                        return (
                                            <Card
                                                key={ind}
                                                variant="default"
                                                style={styles.transactionCard}
                                            >
                                                {/* Card Header — station + time */}
                                                <Card.Header style={styles.cardHeaderRow}>
                                                    <View style={styles.iconWrapper}>
                                                        <Image
                                                            source={require('../../../assets/mygas_logo.png')}
                                                            style={styles.stationIcon}
                                                        />
                                                    </View>
                                                    <View style={styles.headerInfo}>
                                                        <Text
                                                            style={styles.stationName}
                                                            numberOfLines={1}
                                                        >
                                                            {item.service === 'Adjustment'
                                                                ? 'MyGas Credit/Debit Memo'
                                                                : item.station_name}
                                                        </Text>
                                                        <Text
                                                            style={styles.dateTime}
                                                            numberOfLines={1}
                                                        >
                                                            {formatDateTime(
                                                                item.date,
                                                                item.time
                                                            )}
                                                        </Text>
                                                    </View>
                                                </Card.Header>

                                                <Separator className="my-2" />

                                                {/* Card Body — transaction details */}
                                                <Card.Body style={styles.cardBodyGap}>
                                                    <View style={styles.infoRow}>
                                                        <Text style={styles.infoLabel}>
                                                            Transaction
                                                        </Text>
                                                        <Text
                                                            style={styles.infoValue}
                                                            numberOfLines={1}
                                                        >
                                                            {item.transaction_number}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.infoRow}>
                                                        <Text style={styles.infoLabel}>
                                                            Service
                                                        </Text>
                                                        <Text
                                                            style={styles.infoValue}
                                                            numberOfLines={1}
                                                        >
                                                            {item.service}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.infoRow}>
                                                        <Text style={styles.infoLabel}>
                                                            Points Amount
                                                        </Text>
                                                        {/* <Text style={styles.amountValue}>
                                                            {parseFloat(
                                                                item.amount
                                                            ).toFixed(2)}
                                                        </Text> */}
                                                        <Chip
                                                            variant={chipProps.variant}
                                                            color={chipProps.color}
                                                            size="md"
                                                            animation="disable-all"
                                                            style={styles.pointsChip}
                                                        >
                                                            <Chip.Label
                                                                style={styles.pointsValue}
                                                            >
                                                                {chipProps.prefix}
                                                                {item.points}
                                                            </Chip.Label>
                                                            <Chip.Label
                                                                style={styles.pointsUnit}
                                                            >
                                                                {chipProps.label}
                                                            </Chip.Label>
                                                        </Chip>
                                                    </View>
                                                </Card.Body>

                                                {/* Card Footer — points badge */}
                                                {/* <Card.Footer style={styles.cardFooter}>
                                                    <Chip
                                                        variant={chipProps.variant}
                                                        color={chipProps.color}
                                                        size="md"
                                                        animation="disable-all"
                                                        style={styles.pointsChip}
                                                    >
                                                        <Chip.Label
                                                            style={styles.pointsValue}
                                                        >
                                                            {chipProps.prefix}
                                                            {item.points}
                                                        </Chip.Label>
                                                        <Chip.Label
                                                            style={styles.pointsUnit}
                                                        >
                                                            {chipProps.label}
                                                        </Chip.Label>
                                                    </Chip>
                                                </Card.Footer> */}
                                            </Card>
                                        );
                                    })}
                                </View>
                            ))
                        ) : (
                            /* ── Empty State ── */
                            <View style={styles.emptyState}>
                                <View style={styles.emptyIconCircle}>
                                    <Text style={styles.emptyIconText}>📊</Text>
                                </View>
                                <Text style={styles.emptyTitle}>No Activity Yet</Text>
                                <Text style={styles.emptySubtitle}>
                                    Your transaction history will appear here
                                </Text>
                            </View>
                        )}
                    </Animated.ScrollView>
                </Animated.View>

                <View style={{ height: '5%' }} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        overflow: 'hidden',
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: -30,
        backgroundColor: '#F8F9FA',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
    },
    scrollContent: {
        paddingHorizontal: responsive(16, 20),
        paddingTop: responsive(24, 28),
        paddingBottom: 100,
    },

    // Header
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

    // Filter
    filterCard: {
        marginBottom: 20,
        borderRadius: 16,
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
        maxWidth: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    filterBtnText: {
        fontSize: 13,
        fontWeight: '600',
        flexShrink: 1,
    },
    calendarIcon: {
        fontSize: 15,
    },

    // Loading
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        gap: 16,
    },
    loadingText: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '500',
    },

    // Date group
    dateGroup: {
        marginBottom: 24,
    },
    dateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    dateChipLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },

    // Transaction card
    transactionCard: {
        marginBottom: 12,
        borderRadius: 16,
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
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
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

    // Card body
    cardBodyGap: {
        gap: 10,
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

    // Points badge (chip)
    cardFooter: {
        alignItems: 'flex-start',
    },
    pointsChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
        flexDirection: 'row',
        gap: 6,
    },
    pointsValue: {
        fontSize: 16,
        fontWeight: '800',
    },
    pointsUnit: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        opacity: 0.7,
    },

    // Empty state
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIconCircle: {
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