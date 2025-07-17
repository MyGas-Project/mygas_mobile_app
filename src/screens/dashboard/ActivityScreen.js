import { View, ImageBackground, StyleSheet, FlatList, Text, Dimensions, Image, Animated, ScrollView, VirtualizedList, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../../context/ThemeContext'
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL, processResponse } from '../../config';
import DatePicker from 'react-native-neat-date-picker';
// import ActivityCard from './components/ActivityCard';

export default function ActivityScreen() {
    const { userInfo, userDetails } = useContext(AuthContext);
    const { styles } = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;
    const cardContainerTranslateY = scrollY.interpolate({
        inputRange: [-50, 0, 50],
        outputRange: [20, 0, -20],
        extrapolate: 'clamp',
    });
    const [groupedTransactions, setGroupedTransactions] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false)

    const getUserTransactions = (startDate, endDate) => {
        try {
            fetch(`${BASE_URL}customer/activity?date_start=${startDate}&date_end=${endDate}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                }
            }).then(processResponse).then((res) => {
                const { statusCode, data } = res;
                // console.log(data);
                if (statusCode === 200) {
                    const grouped = groupByDate(data.result);
                    setGroupedTransactions(grouped);
                    // console.info(data.result);
                }
            });
        } catch (error) {
            console.error(error);
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
        const groupedMap = {};

        // Group using raw date string
        transactions.forEach((item) => {
            if (!groupedMap[item.date]) {
                groupedMap[item.date] = [];
            }
            groupedMap[item.date].push(item);
        });

        // Sort the dates in descending order
        const sortedDates = Object.keys(groupedMap).sort((a, b) => new Date(b) - new Date(a));

        // Convert to labeled groups
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
            year: 'numeric',
            month: 'short', // 3-letter month
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };

        return date.toLocaleString(undefined, options); // uses device locale
    };

    useEffect(() => {
        getUserTransactions();
        // console.info(groupedTransactions);
    }, []);

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
                    // setStartDate(e.startDateString);
                    // setEndDate(e.endDateString);
                    setShowDatePicker(false);
                    getUserTransactions(e.startDateString, e.endDateString);
                }}
            />
            <View style={{ flex: 1, backgroundColor: '#E5E5E5' }}>
                <ImageBackground resizeMode='stretch' source={require('../../../assets/mygas-header.jpeg')} style={custom_styles.top_bar}>
                    <LinearGradient
                        colors={['rgb(249, 250, 141)', 'transparent']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1.4 }}
                        style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
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
                <Animated.View
                    style={[
                        custom_styles.outerContainer,
                        { transform: [{ translateY: cardContainerTranslateY }] }
                    ]}
                >
                    <Animated.ScrollView
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={custom_styles.headerContainer}>
                            <Text style={custom_styles.title}>MyGas Points Activity</Text>
                        </View>
                        <View style={custom_styles.sortRow}>
                            <Text style={custom_styles.sortLabel}>Sort Transactions By</Text>
                            {/* <View style={custom_styles.sortBtn}> 
                            <Text style={custom_styles.sortBtnText}>January 2025 <Text style={{ fontSize: 13, color: '#888' }}>▼</Text></Text>
                        </View> */}
                            <TouchableOpacity style={custom_styles.sortBtn} onPress={() => { setShowDatePicker(true); }}>
                                <Text style={custom_styles.sortBtnText}>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}<Text style={{ fontSize: 13, color: '#888' }}>▼</Text></Text>
                            </TouchableOpacity>
                        </View>
                        {groupedTransactions.length > 0 ? (
                            groupedTransactions.map((group, index) => (
                                <View key={index}>
                                    <Text style={custom_styles.sectionHeader}>{group.date}</Text>
                                    {group.items.map((item, ind) => (
                                        // <VirtualizedList
                                        //     initialNumToRender={5}
                                        //     renderItem={({ item, index }) => <ActivityCard item={item} index={ind} />}
                                        //     keyExtractor={(item, index) => index.toString()}
                                        //     data={item}
                                        //     getItemCount={(data) => data.length}
                                        // />
                                        <View key={ind} style={custom_styles.itemCard}>
                                            <View style={custom_styles.leftCol}>
                                                <View style={custom_styles.logoContainer}>
                                                    <Image source={require('../../../assets/mygas_logo.png')} style={custom_styles.logoSmall} />
                                                </View>
                                                <View style={custom_styles.textBlock}>
                                                    <Text style={custom_styles.stationName}>{item.station_name}</Text>
                                                    <Text style={custom_styles.detail}>Transaction No.: {item.transaction_number}</Text>
                                                    <Text style={custom_styles.detail}>Date/Time: {formatDateTime(item.date, item.time)}</Text>
                                                    <View style={custom_styles.serviceRow}>
                                                        <Text style={custom_styles.serviceLabel}>Service: </Text>
                                                        <Text style={custom_styles.serviceValue}>{item.service}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={custom_styles.rightCol}>
                                                <Text style={custom_styles.amount}>PHP {item.amount}</Text>
                                                <View style={custom_styles.pointsBlock}>
                                                    <Text style={[custom_styles.points, { color: item.service === 'Cash Redeem' ? 'red' : '#FFB300' }]}>
                                                        {item.service === 'Cash Redeem' ? '-' : '+'}{item.points}
                                                    </Text>
                                                    <Text style={custom_styles.pointsLabel}>{item.service == 'Cash Redeem' ? 'points redeemed' : 'points earned'}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ))
                        ) : (
                            <View style={custom_styles.noTransactionsContainer}>
                                <Text style={custom_styles.noTransactionsText}>No transactions found</Text>
                            </View>
                        )}
                        <View style={{ height: 50 }} />
                    </Animated.ScrollView>
                </Animated.View>
            </View>
        </>
    )
}

const custom_styles = StyleSheet.create({
    top_bar: {
        height: 150,
        width: '100%',
        position: 'relative',
    },
    logo: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -40 }, { translateY: -40 }],
        width: 65,
        height: 65,
        resizeMode: "contain",
        zIndex: 2,
    },
    outerContainer: {
        flex: 1,
        paddingHorizontal: 16,
        alignItems: "center",
        marginTop: -20,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'relative',
        zIndex: 1
    },
    headerContainer: {
        alignItems: "center",
        width: "100%",
        paddingTop: 20,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8
    },
    subtitle: {
        fontSize: 12,
        textAlign: "center",
        color: "#777",
        marginBottom: 20
    },
    item: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: '#fe0002',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    id: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    type: {
        fontSize: 14,
        color: '#fe0002',
        marginTop: 4,
    },
    amount: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 8,
        marginTop: -4,
    },
    points: {
        fontSize: 17,
        fontWeight: 'bold',
        // color: '#FFB300',
        textAlign: 'right',
        marginTop: 8,
        marginBottom: 0,
    },
    pointsLabel: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
        marginTop: -2,
    },
    stationName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 2,
        textAlign: 'left',
    },
    logoSmall: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
        marginRight: 14,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 0,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        minHeight: 80,
        width: '100%',
        marginHorizontal: 0,
    },
    detail: {
        fontSize: 13,
        color: '#111',
        fontWeight: 'normal',
        marginBottom: 0,
        textAlign: 'left',
        lineHeight: 17,
    },
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 8,
        marginHorizontal: 2,
    },
    sortLabel: {
        fontSize: 15,
        color: '#444',
    },
    sortBtn: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 22,
        paddingVertical: 12,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    sortBtnText: {
        fontSize: 15,
        color: '#222',
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 10,
        marginLeft: 2,
    },
    leftCol: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        alignItems: 'flex-start',
    },
    textBlock: {
        flex: 1,
        minWidth: 0,
        justifyContent: 'center',
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
    },
    serviceLabel: {
        fontWeight: 'normal',
        color: '#111',
        fontSize: 14,
    },
    serviceValue: {
        fontWeight: 'normal',
        color: '#111',
        fontSize: 14,
    },
    rightCol: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        minWidth: 100,
        marginLeft: 28,
        flex: 0,
    },
    pointsBlock: {
        alignItems: 'flex-end',
        marginTop: 56,
    },
});