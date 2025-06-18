import { View, ImageBackground, StyleSheet, FlatList, Text, Dimensions, Image, Animated, ScrollView } from 'react-native'
import React, { useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../../context/ThemeContext'
<<<<<<< HEAD
import Navbar from '../../components/Navbar'
=======
import Navbar from '../../components/Navbar';
>>>>>>> 9a93d1aa38fc4c0d643e2a9a84b460b374dfab90

export default function ActivityScreen() {
    const {styles} = useTheme();
    const scrollY = useRef(new Animated.Value(0)).current;
    const cardContainerTranslateY = scrollY.interpolate({
        inputRange: [-50, 0, 50],
        outputRange: [20, 0, -20],
        extrapolate: 'clamp',
    });
    const transactions = [
        {
          id: '1',
          group: 'Today',
          station: 'MyGas Toril 1',
          transactionNo: '0000000123',
          datetime: '01/23/2025, 11:00AM',
          service: 'Fuel-Diesel',
          amount: 1000,
          points: 1.00,
        },
        {
          id: '2',
          group: 'Last 7 Days',
          station: 'MyGas Buhangin',
          transactionNo: '0000000456',
          datetime: '01/15/2025, 08:00PM',
          service: 'Fuel-Diesel',
          amount: 500,
          points: 0.50,
        },
        {
          id: '3',
          group: 'Last 7 Days',
          station: 'MyGas Cabantian',
          transactionNo: '0000000789',
          datetime: '01/05/2025, 09:00AM',
          service: 'Oil',
          amount: 1000,
          points: 0.25,
        },
    ];
    const groups = ['Today', 'Last 7 Days'];

    return (
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
                    onProfilePress={() => console.log("Profile tapped")}
                    onNotifPress={() => console.log("Notifications tapped")}
                />
                <Navbar
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
                        <View style={custom_styles.sortBtn}>
                            <Text style={custom_styles.sortBtnText}>January 2025 <Text style={{fontSize: 13, color: '#888'}}>▼</Text></Text>
                        </View>
                    </View>
                    {groups.map(group => (
                        <View key={group}>
                            <Text style={custom_styles.sectionHeader}>{group}</Text>
                            {transactions.filter(t => t.group === group).map(item => (
                                <View key={item.id} style={custom_styles.itemCard}>
                                    <View style={custom_styles.leftCol}>
                                        <View style={custom_styles.logoContainer}>
                                            <Image source={require('../../../assets/mygas_logo.png')} style={custom_styles.logoSmall} />
                                        </View>
                                        <View style={custom_styles.textBlock}>
                                            <Text style={custom_styles.stationName}>{item.station}</Text>
                                            <Text style={custom_styles.detail}>Transaction No.: {item.transactionNo}</Text>
                                            <Text style={custom_styles.detail}>Date/Time: {item.datetime}</Text>
                                            <View style={custom_styles.serviceRow}>
                                                <Text style={custom_styles.serviceLabel}>Service: </Text>
                                                <Text style={custom_styles.serviceValue}>{item.service}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={custom_styles.rightCol}>
                                        <Text style={custom_styles.amount}>PHP {item.amount}</Text>
                                        <View style={custom_styles.pointsBlock}>
                                            <Text style={custom_styles.points}>+{item.points.toFixed(2)}</Text>
                                            <Text style={custom_styles.pointsLabel}>points earned</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                    <View style={{ height: 50 }} />
                </Animated.ScrollView>
            </Animated.View>
        </View>
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
      color: '#FFB300',
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
    points: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFB300',
        textAlign: 'right',
        marginTop: 0,
        marginBottom: 0,
    },
    pointsLabel: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
        marginTop: -2,
    },
});
