import { View, ImageBackground, StyleSheet, FlatList, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useTheme } from '../../context/ThemeContext'

export default function ActivityScreen() {
    const {styles} = useTheme();
    const transactions = [
        {
          id: 'TXN-00123',
          date: '2025-05-04',
          type: 'Premium Gasoline',
          amount: 1200,
          points: 60,
          station: 'Mygas Station 1'
        },
        {
          id: 'TXN-00124',
          date: '2025-05-03',
          type: 'Diesel',
          amount: 800,
          points: 40,
          station: 'Mygas Station 2'
        }
    ];
    return (
        <View style={styles.tabScreen}>
            <ImageBackground resizeMode='stretch' source={require('../../../assets/mygas-header.jpeg')} style={styles.top_bar}>
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.5)']}
                    style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
                />
            </ImageBackground>
            <View style={{flex: 1, width: '100%'}}>
                <View style={{width: '100%', paddingTop: 16, paddingHorizontal: 16}}>
                    <Text style={[styles.text, styles.text_md, styles.text_bold, styles.text_primary]}>Recent Transactions</Text>
                </View>
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={custom_styles.item}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                              <Text style={custom_styles.stationName}>{item.station}</Text>
                              <Text style={custom_styles.id}>{item.id}</Text>
                              <Text style={custom_styles.date}>{new Date(item.date).toDateString()}</Text>
                              <Text style={custom_styles.type}>{item.type}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={custom_styles.amount}>₱{item.amount.toFixed(2)}</Text>
                              <Text style={custom_styles.points}>+{item.points} pts</Text>
                            </View>
                          </View>
                        </View>
                    )}
                    contentContainerStyle={{padding:16}}
                />
            </View>
            <View style={{height: 70}}></View>
        </View>
    )
}
const custom_styles = StyleSheet.create({
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 12,
      color: '#fe0002', // Primary color
    },
    item: {
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      borderLeftWidth: 5,
      borderLeftColor: '#fe0002', // Primary color
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
      color: '#fe0002', // Primary color for type
      marginTop: 4,
    },
    amount: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#10B981',
      marginTop: 4,
    },
    points: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#ffcc00', // Accent color for points
      marginTop: 4,
    },
    stationName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fe0002',
        marginBottom: 4,
    },
});