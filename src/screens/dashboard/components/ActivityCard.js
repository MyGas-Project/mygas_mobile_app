import { View, ImageBackground, StyleSheet, FlatList, Text, Dimensions, Image, Animated, ScrollView, VirtualizedList } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'

export default function ActivityCard({ item, index }) {
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
    return (
        <View key={index} style={custom_styles.itemCard}>
            <View style={custom_styles.leftCol}>
                <View style={custom_styles.logoContainer}>
                    <Image source={require('../../../../assets/mygas_logo.png')} style={custom_styles.logoSmall} />
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
                    <Text style={custom_styles.points}>+{item.points}</Text>
                    <Text style={custom_styles.pointsLabel}>points earned</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})