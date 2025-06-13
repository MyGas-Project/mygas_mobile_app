import { View, Image, StyleSheet, ImageBackground, ScrollView, Text, Dimensions, FlatList } from 'react-native';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function HomeScreen({navigation}) {
    const {styles} = useTheme();
    const DATA = [
        {
          id: '1',
          title: 'Oil Change',
          description: 'We offer high-quality oil change services with top-brand oils to ensure the best performance of your engine.',
        },
        {
          id: '2',
          title: 'Tire Replacement',
          description: 'Our tire replacement service offers a variety of tire brands and types, ensuring safety and comfort on the road.',
        },
        {
          id: '3',
          title: 'Brake Service',
          description: 'Get your brakes inspected and replaced by our experienced technicians to ensure your safety.',
        },
        {
          id: '4',
          title: 'Battery Replacement',
          description: 'We provide battery replacement services with high-performance, long-lasting batteries to keep your vehicle running smoothly.',
        },
      ];
      
      const REWARDS_DATA = [
        {
          id: '1',
          title: 'Free Car Wash',
          description: 'Exchange your loyalty points for a free car wash and keep your vehicle looking pristine!',
        },
        {
          id: '2',
          title: 'Discount on Services',
          description: 'Use your points for discounts on future services, such as oil changes, tire replacements, and more.',
        },
        {
          id: '3',
          title: 'Gift Voucher',
          description: 'Redeem your points for a gift voucher to use on services or products from our store.',
        },
        {
          id: '4',
          title: 'Fuel Discount',
          description: 'Save on fuel by using your points to receive a discount on premium gasoline or diesel.',
        },
    ];
    const Item = ({title}) => (
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.tabScreen}>
            <ImageBackground resizeMode='stretch' source={require('../../../assets/mygas-header.jpeg')} style={styles.top_bar}>
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.5)']}
                    style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
                />
                {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
            </ImageBackground>
            <ScrollView style={{flex:1, width: '100%'}}>
                <View style={styles.greetingsContainer}>
                    <View>
                        <Text style={[styles.text, styles.text_sm]}>Good Day,</Text>
                        <Text style={[styles.text, styles.text_lg, styles.text_semibold]}>Juan Dela Cruz</Text>
                    </View>
                    <View>
                        <Image source={require('../../../assets/qr-code.png')} style={{width: 25, height: 25}}/>
                    </View>
                </View>
                <View style={{alignItems: 'center', marginVertical: 20}}>
                    <View style={{backgroundColor: 'red', borderRadius: 10, width: width - 40, height: (width - 40) /2, elevation: 5, position: 'relative'}}>
                        <LinearGradient
                            colors={['transparent', 'rgba(255,255,1,0.8)']}
                            style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, borderRadius: 10}}
                        />
                    </View>
                </View>
                <View style={{paddingHorizontal: 20}}>
                    <Text style={[styles.text, styles.text_md, styles.text_bold]}>SERVICES</Text>
                    <Text>We provide best offer services</Text>
                    <FlatList
                        style={{marginTop: 10, padding: 10}}
                        data={DATA}
                        renderItem={({ item }) => (
                            <View style={custom_styles.card}>
                                {/* Grey background placeholder for cover photo */}
                                <View style={custom_styles.coverImagePlaceholder}></View>
                                <View style={custom_styles.content}>
                                    <Text style={custom_styles.title}>{item.title}</Text>
                                    <Text style={custom_styles.description}>
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        ItemSeparatorComponent={() => <View style={{width: 10}} />}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={{padding: 20}}>
                    <Text style={[styles.text, styles.text_md, styles.text_bold]}>REWARDS</Text>
                    <FlatList
                        style={{marginTop: 10, padding: 10}}
                        data={REWARDS_DATA}
                        renderItem={({ item }) => (
                            <View style={custom_styles.card}>
                                <View style={custom_styles.coverImagePlaceholder}></View>
                                <View style={custom_styles.content}>
                                    <Text style={custom_styles.title}>{item.title}</Text>
                                    <Text style={custom_styles.description}>
                                        {item.description}
                                    </Text>
                                </View>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        ItemSeparatorComponent={() => <View style={{width: 10}} />}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ScrollView>
            <View style={{height: 70}}></View>
        </View>
    )
}
const custom_styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      width: 300,
      borderRadius: 12,
      marginBottom: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      overflow: 'hidden',
    },
    coverImagePlaceholder: {
      width: '100%',
      height: 200,
      backgroundColor: '#D3D3D3'
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: '#555',
      lineHeight: 20,
    },
});