import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Animated
} from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";
import { PointsDetailContext } from "../../context/PointsDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashUserDetails from "./components/FlashUserDetails";
import GetStationsLists from "../../service/Stations";
import GuestRewardsComponent from "../../components/guest/GuestRewardsComponent";
import GuestBanner from "../../components/guest/GuestBanner";
import {
  GreetingCardSkeleton,
  PointsCardSkeleton,
  RewardCardSkeleton,
  SkeletonBox,
  StatsCardSkeleton,
} from "../../components/HomeComponents";
import { useHomeData } from "../../hooks/HomeHooks";
import PointsCard from "../../components/PointsCard";
import GreetingCard from "../../components/GreetingCard";
import StatsSection from "../../components/StatsSection";
import PromoBanner from "../../components/PromoBanner";
import ProductsSection from "../../components/ProductsSection";

export default function HomeScreen({ navigation }) {
  const { userInfo, userDetails } = useContext(AuthContext);
  const { rewards, refreshPoints } = useContext(PointsDetailContext);
  const {
    rewardsInfo, setRewardsInfo,
    refreshing, setRefreshing,
    isLoading, setIsLoading,
    showFlashDetails, setShowFlashDetails,
    stationCount, setStationCount,
    products, setProducts,
    giftScale, giftRotate,
    pinY, clockRotate,
    glowScale,
    ripple1Scale, ripple1Opacity,
    ripple2Scale, ripple2Opacity,
    restartAnimations
  } = useHomeData();

  const scrollY = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const giftRotateDeg = giftRotate.interpolate({ inputRange: [-6, 6], outputRange: ["-6deg", "6deg"] });
  const clockDeg = clockRotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0.8], extrapolate: "clamp" });
  const cardContainerTranslateY = scrollY.interpolate({ inputRange: [-50, 0, 50], outputRange: [20, 0, -20], extrapolate: "clamp" });

  useEffect(() => {
    AsyncStorage.getItem("card_login").then((value) => {
      if (value === "true" || value === "1") setShowFlashDetails(true);
    });
  }, []);

  const fetchRewards = async () => {
    const rez = await GetStationsLists(userInfo.token, "");
    setStationCount(rez.data.length);
    const res = await fetch(`${BASE_URL}customer/get-rewards`, {
      method: "GET",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${userInfo.token}` },
    }).then(processResponse);
    setRewardsInfo(res.data.result);
  };

  const getAllProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}customer/product-catalog`, {
        method: "GET",
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${userInfo?.token}` },
      }).then(processResponse);
      setProducts(res.statusCode === 200 || res.statusCode === 201 ? res.data.result : []);
    } catch (error) {
      console.error("getAllProducts error:", error);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchRewards(), refreshPoints?.()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Animated.sequence([
      Animated.timing(cardScale, { toValue: 0.95, duration: 200, useNativeDriver: true }),
      Animated.timing(cardScale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    try {
      await loadAllData();
    } finally {
      setRefreshing(false);
      restartAnimations();
    }
  };

  useEffect(() => {
    loadAllData();
    getAllProducts();
  }, []);

  return (
    <>
      <FlashUserDetails
        visible={showFlashDetails}
        onClose={() => {
          setShowFlashDetails(false);
          AsyncStorage.removeItem("card_login");
        }}
      />

      <View style={{ position: "relative", flex: 1, backgroundColor: "#F8F9FA" }}>
        {/* Header */}
        {/* <Animated.View style={{ opacity: headerOpacity }}>
          <ImageBackground
            resizeMode="stretch"
            source={require("../../../assets/mygas-header.jpeg")}
            style={styles.top_bar}
          >
            <LinearGradient
              colors={["rgba(249, 250, 141, 0.9)", "transparent"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1.4 }}
              style={StyleSheet.absoluteFill}
            />
            <Image source={require("../../../assets/mygas_logo.png")} style={styles.logo} />
            <View style={{ position: "absolute", right: 0, top: 0 }}>
              <Navbar hideBack />
            </View>
          </ImageBackground>
        </Animated.View> */}

        {/* Content */}
        <Animated.View style={[styles.cardContainer, { transform: [{ translateY: cardContainerTranslateY }] }]}>
          <Animated.ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{ paddingBottom: 100 }}
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
                tintColor="#E0B820"
                colors={["#E0B820"]}
                progressViewOffset={60}
              />
            }
          >
            {isLoading ? (
              <>
                <GreetingCardSkeleton />
                <PointsCardSkeleton />
                <StatsCardSkeleton />
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                    <View>
                      <SkeletonBox width={120} height={20} style={{ marginBottom: 4 }} />
                      <SkeletonBox width={160} height={13} />
                    </View>
                    <SkeletonBox width={80} height={36} style={{ borderRadius: 20 }} />
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                    <RewardCardSkeleton />
                    <View style={{ width: 16 }} />
                    <RewardCardSkeleton />
                  </ScrollView>
                </View>
                <View style={[styles.promoBannerSkeleton, { backgroundColor: "#E1E9EE" }]}>
                  <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
                    <SkeletonBox width={40} height={40} style={{ borderRadius: 20 }} />
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <SkeletonBox width={140} height={18} style={{ marginBottom: 6 }} />
                      <SkeletonBox width={200} height={13} />
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <GreetingCard userDetails={userDetails} navigation={navigation} />

                {userInfo?.is_guest == 1 && <GuestBanner />}

                <PointsCard userDetails={userDetails} rewards={rewards} cardScale={cardScale} />

                <StatsSection
                  rewardsInfo={rewardsInfo}
                  stationCount={stationCount}
                  giftScale={giftScale}
                  giftRotateDeg={giftRotateDeg}
                  ripple1Scale={ripple1Scale}
                  ripple1Opacity={ripple1Opacity}
                  ripple2Scale={ripple2Scale}
                  ripple2Opacity={ripple2Opacity}
                  pinY={pinY}
                  glowScale={glowScale}
                  clockDeg={clockDeg}
                />

                <PromoBanner />

                {userInfo?.is_guest == 1 ? (
                  <GuestRewardsComponent />
                ) : (
                  <ProductsSection products={products} />
                )}
              </>
            )}
          </Animated.ScrollView>
        </Animated.View>

        <View style={{ height: "5%" }} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: -30,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "relative",
    zIndex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  promoBannerSkeleton: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
  },
});