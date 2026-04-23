import React, { useState, useMemo, useCallback, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";
import { PointsDetailContext } from "../../context/PointsDetails";
import { BASE_URL, processResponse } from "../../config";
import SpecificStation from "./redemption/SpecificStation";
import SpecificProduct from "./redemption/SpecificProduct";
import CartComponent from "../../components/CartComponent";
import { useFocusEffect } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { clearAllCartItems, getUniqueCartCount } from "../../lib/CartCountHelper";
import { useRedemption } from "../../hooks/RedemptionHooks";
import { formatPromoDate } from "../../service/DateFormat";
import { getCardWidth, getColumnCount, getResponsiveValue } from "../../service/RedemptionServices";
import { Dialog } from "heroui-native";

const { width, height } = Dimensions.get("window");

const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeTablet = width >= 1024;

const getCategories = (products) => {
  const categories = new Set(products.map(p => p.category).filter(Boolean));
  return ["All", ...Array.from(categories).sort()];
};

// Enhanced Product Card Component
const ProductCard = React.memo(({ product, userPoints, onProductPress, cardWidth }) => {
  const canAfford = userPoints >= product.points;
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;

  const promoDateText = useMemo(() => {
    if (!product.isWeeklyPromo || !product.promoStartDate || !product.promoEndDate) {
      return "";
    }

    const startDate = formatPromoDate(product.promoStartDate);
    const endDate = formatPromoDate(product.promoEndDate);

    if (startDate === endDate) {
      return startDate;
    }
    return `${startDate} - ${endDate}`;
  }, [product.isWeeklyPromo, product.promoStartDate, product.promoEndDate]);

  return (
    <TouchableOpacity
      style={[
        styles.productCard,
        { width: cardWidth },
        (!canAfford || isOutOfStock) && styles.productCardDisabled,
      ]}
      activeOpacity={0.7}
      onPress={() => (canAfford && !isOutOfStock) && onProductPress(product)}
      disabled={!canAfford || isOutOfStock}
    >
      <View style={styles.imageContainer}>
        <Image
          source={product.image ? { uri: product.image } : require("../../../assets/mygas.jpg")}
          style={styles.productImage}
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.imageGradient}
        />

        {isLowStock && (
          <View style={[styles.stockBadge, styles.lowStockBadge]}>
            <Ionicons name="alert-circle" size={12} color="#fff" />
            <Text style={styles.stockBadgeText}>{product.quantity} left</Text>
          </View>
        )}

        {isOutOfStock && (
          <View style={[styles.stockBadge, styles.outOfStockBadge]}>
            <Text style={styles.stockBadgeText}>Sold Out</Text>
          </View>
        )}

        {product.isWeeklyPromo && (
          <View style={styles.promoBadge}>
            <Ionicons name="flash" size={10} color="#fff" />
            <Text style={styles.promoBadgeText}>PROMO</Text>
          </View>
        )}
      </View>

      <View style={styles.productContent}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>

        {product.isWeeklyPromo && promoDateText && (
          <View style={styles.promoDateContainer}>
            <Ionicons name="calendar-outline" size={12} color="#8B5CF6" />
            <Text style={styles.promoDateText}>{promoDateText}</Text>
          </View>
        )}

        {product.isWeeklyPromo && product.promoDescription && (
          <View style={styles.promoDescriptionContainer}>
            <Text style={styles.promoDescriptionText} numberOfLines={1}>
              {product.promoDescription}
            </Text>
          </View>
        )}

        <View style={styles.productFooter}>
          <View style={styles.pointsContainer}>
            <Image
              source={require("../../../assets/my.png")}
              style={styles.miniIcon}
            />

            {product.isWeeklyPromo && product.originalPoints ? (
              <View style={styles.priceContainer}>
                <Text style={styles.originalPoints}>{product.originalPoints}</Text>
                <Text style={styles.productPoints}>{product.points}</Text>
              </View>
            ) : (
              <Text style={styles.productPoints}>{product.points}</Text>
            )}

            <Text style={styles.pointsLabel}>pts</Text>

            {product.isWeeklyPromo && product.originalPoints && product.originalPoints > product.points && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  -{Math.round(((product.originalPoints - product.points) / product.originalPoints) * 100)}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function RedemptionScreen({ navigation }) {
  const { userInfo, userDetails } = useContext(AuthContext);
  const { rewards, refreshPoints, redemptionCount, getRedemptionCount } = useContext(PointsDetailContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all",
    stockStatus: "all",
    promoOnly: false,
  });
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationFilterProduct, setStationFilterProduct] = useState(null);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0.8], extrapolate: "clamp" });

  const [isClearStationDialogOpen, setIsClearStationDialogOpen] = useState(false);

  const pendingStationRef = useRef(null);

  const refreshCartCount = useCallback(async () => {
    try {
      const count = await getUniqueCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Error refreshing cart count:", error);
      setCartCount(0);
    }
  }, []);

  const incrementCartCount = async () => {
    try {
      const count = await getUniqueCartCount();
      setCartCount(count);
      setCartUpdateTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Error incrementing cart count:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshCartCount();
      getRedemptionCount();
    }, [refreshCartCount])
  );

  const userPoints = rewards.points || 0;
  const cardWidth = useMemo(() => getCardWidth(), []);

  const getAllProducts = async (station) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}customer/get-products?station_id=${station?.id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const res = await processResponse(response);
      const { statusCode, data } = res;
      if (statusCode === 200) {
        const transformedProducts = data.data.inventories.map((item) => ({
          id: item.inventory_id,
          name: item.name,
          description: item.description || "No description available",
          points: item.promo_points || item.points || 0,
          originalPoints: item.promo_points ? item.points : null,
          image: item.image_path,
          category: "Products",
          quantity: parseFloat(item.total_quantity) || 0,
          isWeeklyPromo: item.is_weekly_promo === 1 && item.promo_points !== null,
          promoDescription: item.promo_descriptions,
          promoStartDate: item.promo_start_date,
          promoEndDate: item.promo_end_date,
          sellingPrice: item.unit_cost,
          stationNames: item.station_names,
          stationId: item.station_id,
        }));

        setProducts(transformedProducts);
      } else {
        setProducts([]);
        // console.error("Failed to fetch products:", data);
      }
    } catch (error) {
      console.error("getAllProducts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const searchMatch = searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      let priceMatch = true;
      if (filters.priceRange === "under1000") {
        priceMatch = product.points < 1000;
      } else if (filters.priceRange === "1000to2500") {
        priceMatch = product.points >= 1000 && product.points <= 2500;
      } else if (filters.priceRange === "over2500") {
        priceMatch = product.points > 2500;
      }

      let stockMatch = true;
      if (filters.stockStatus === "inStock") {
        stockMatch = product.quantity > 5;
      } else if (filters.stockStatus === "lowStock") {
        stockMatch = product.quantity > 0 && product.quantity <= 5;
      }

      const promoMatch = !filters.promoOnly || product.isWeeklyPromo;

      return categoryMatch && searchMatch && priceMatch && stockMatch && promoMatch;
    });
  }, [products, selectedCategory, searchQuery, filters]);

  const promoProducts = useMemo(() => {
    return products.filter(p => p.isWeeklyPromo);
  }, [products]);

  const categories = useMemo(() => getCategories(products), [products]);

  const handleShowStationModal = useCallback((product = null) => {
    setStationFilterProduct(product);
    setShowStationModal(true);
  }, []);

  const handleStationModalClose = useCallback(() => {
    setShowStationModal(false);
    setStationFilterProduct(null);
  }, []);

  const handleProductPress = useCallback((product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      priceRange: "all",
      stockStatus: "all",
      promoOnly: false,
    });
  }, []);

  const handleClearStation = useCallback(async () => {
    const count = await getUniqueCartCount();

    if (count > 0) {
      // No pending station — dialog confirm will just clear
      pendingStationRef.current = null;
      setIsClearStationDialogOpen(true);
    } else {
      // No cart, safe to clear immediately
      await AsyncStorage.removeItem("stationSelected");
      setSelectedStation(null);
      getAllProducts();
    }
  }, []);

  const handleStationConfirm = useCallback(async (data) => {
    const count = await getUniqueCartCount();

    if (count > 0) {
      // Store the new station so the dialog confirm can use it
      pendingStationRef.current = data.station;
      setIsClearStationDialogOpen(true);
    } else {
      // No cart, switch station directly
      await AsyncStorage.setItem("stationSelected", JSON.stringify(data.station));
      setSelectedStation(data.station);
      getAllProducts(data.station);
    }
  }, []);

  const handleConfirmClearStation = useCallback(async () => {
    setIsClearStationDialogOpen(false);

    try {
      const response = await fetch(`${BASE_URL}customer/remove-all-cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ bar_code: userDetails.bar_code }),
      });

      const res = await processResponse(response);
      const { statusCode } = res;

      // Always clear local cart regardless of API result
      await AsyncStorage.removeItem("carts");
      await clearAllCartItems();
      setCartCount(0);

      if (pendingStationRef.current) {
        // Switching to a new station
        await AsyncStorage.setItem("stationSelected", JSON.stringify(pendingStationRef.current));
        setSelectedStation(pendingStationRef.current);
        getAllProducts(pendingStationRef.current);
        pendingStationRef.current = null;
      } else {
        // Just clearing the station
        await AsyncStorage.removeItem("stationSelected");
        setSelectedStation(null);
        getAllProducts();
      }
    } catch (error) {
      console.error("Error confirming station change:", error);
      // Still attempt to reset locally on error
      pendingStationRef.current = null;
    }
  }, [userInfo.token, userDetails.bar_code]);

  const handleCancelClearStation = useCallback(() => {
    setIsClearStationDialogOpen(false);
    pendingStationRef.current = null;
  }, []);

  const hasActiveFilters = useMemo(() => {
    return filters.priceRange !== "all" ||
      filters.stockStatus !== "all" ||
      filters.promoOnly;
  }, [filters]);

  const renderProductItem = useCallback(({ item }) => (
    <ProductCard
      product={item}
      userPoints={userPoints}
      onProductPress={handleProductPress}
      cardWidth={cardWidth}
    />
  ), [userPoints, handleProductPress, cardWidth]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  useEffect(() => {
    const loadCachedStation = async () => {
      try {
        const cachedStationSelected = await AsyncStorage.getItem("stationSelected");
        if (cachedStationSelected) {
          const stationSelected = JSON.parse(cachedStationSelected);
          setSelectedStation(stationSelected);
          getAllProducts(stationSelected);
        } else {
          getAllProducts();
          setLoading(false);
        }
        await refreshCartCount();
      } catch (error) {
        console.error("Error loading cached station:", error);
        setLoading(false);
      }
    };

    loadCachedStation();
    getRedemptionCount();
  }, []);

  return (
    <View style={styles.container}>

      {/* Single confirmation dialog for both clear-station and change-station flows */}
      <Dialog isOpen={isClearStationDialogOpen} onOpenChange={setIsClearStationDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            {/* <Dialog.Close onPress={handleCancelClearStation} /> */}
            <Dialog.Title>
              {pendingStationRef.current ? "Change Station?" : "Clear Station?"}
            </Dialog.Title>
            <Dialog.Description>
              {pendingStationRef.current
                ? `Switching to "${pendingStationRef.current.station_name}" will clear all items in your cart. Do you want to proceed?`
                : "Clearing your station will also remove all items in your cart. Do you want to proceed?"}
            </Dialog.Description>
            <View style={styles.dialogFooter}>
              <TouchableOpacity
                style={styles.dialogCancelButton}
                onPress={handleCancelClearStation}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogConfirmButton}
                onPress={handleConfirmClearStation}
              >
                <Text style={styles.dialogConfirmText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <View style={styles.cardContainer}>
        <Animated.ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.contentContainer}>
            {/* Low Points Alert */}
            {userPoints < 10 && (
              <View style={styles.lowPointsAlert}>
                <LinearGradient
                  colors={["#FEE2E2", "#FECACA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.lowPointsGradient}
                >
                  <Ionicons name="warning" size={18} color="#DC2626" />
                  <Text style={styles.lowPointsText}>You have low points</Text>
                </LinearGradient>
              </View>
            )}

            <View style={styles.pointsCardContainer}>
              <View style={styles.pointsCard}>
                <LinearGradient
                  colors={["#FEF3C7", "#FDE68A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pointsGradient}
                >
                  <View style={styles.pointsContent}>
                    <View>
                      <Text style={styles.pointsTitle}>Available Points</Text>
                      <View style={styles.pointsValueContainer}>
                        <Image
                          source={require("../../../assets/my.png")}
                          style={styles.pointsIcon}
                        />
                        <Text style={styles.pointsValue}>{userPoints.toLocaleString()}</Text>
                      </View>
                    </View>
                    <View style={styles.pointsIconContainer}>
                      <Ionicons name="wallet" size={32} color="#F59E0B" />
                    </View>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.myRedemptionButtonWrapper}>
                {redemptionCount > 0 && (
                  <View style={styles.redemptionBadgeContainer}>
                    <LinearGradient
                      colors={["#FBBF24", "#F59E0B"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.redemptionBadge}
                    >
                      <Text style={styles.redemptionBadgeText}>
                        {redemptionCount > 99 ? '99+' : redemptionCount}
                      </Text>
                    </LinearGradient>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.myRedemptionButton}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("RedemptionTransactionScreens")}
                >
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.myRedemptionGradient}
                  >
                    <Ionicons name="gift" size={24} color="#fff" />
                    <Text style={styles.myRedemptionText}>My Redemption</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.stationSelectionCard}
              onPress={() => setShowStationModal(true)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={selectedStation ? ["#FEE2E2", "#FEF2F2"] : ["#F3F4F6", "#F9FAFB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.stationSelectionGradient}
              >
                <View style={styles.stationSelectionContent}>
                  <View style={[
                    styles.stationIconContainer,
                    selectedStation && styles.stationIconContainerActive
                  ]}>
                    <Ionicons
                      name="location"
                      size={24}
                      color={selectedStation ? "#EF4444" : "#9CA3AF"}
                    />
                  </View>
                  <View style={styles.stationTextContainer}>
                    <Text style={styles.stationLabel}>Redemption Station</Text>
                    {selectedStation ? (
                      <View style={styles.selectedStationInfo}>
                        <Text style={styles.selectedStationName} numberOfLines={1}>
                          {selectedStation.station_name}
                        </Text>
                        <View style={styles.selectedStationBadgesRow}>
                          <View style={styles.selectedStationBadge}>
                            <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                            <Text style={styles.selectedStationBadgeText}>Selected</Text>
                          </View>
                          {selectedStation.is_caravan === 1 && (
                            <View style={styles.selectedCaravanBadge}>
                              <Ionicons name="car" size={12} color="#F59E0B" />
                              <Text style={styles.selectedCaravanBadgeText}>Caravan</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.stationPlaceholder}>
                        Tap to select your preferred station
                      </Text>
                    )}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={selectedStation ? "#EF4444" : "#9CA3AF"}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.productsSection}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>All Rewards</Text>
                  <Text style={styles.sectionSubtitle}>
                    Browse and redeem exciting rewards
                  </Text>
                </View>
                <View style={styles.productCountBadge}>
                  <Text style={styles.productCountText}>
                    {filteredProducts.length} items
                  </Text>
                </View>
              </View>

              <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search rewards..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery !== "" && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
                  onPress={() => setShowFilters(true)}
                >
                  <Ionicons
                    name="options"
                    size={20}
                    color={hasActiveFilters ? "#fff" : "#374151"}
                  />
                  {hasActiveFilters && (
                    <View style={styles.filterDot} />
                  )}
                </TouchableOpacity>
              </View>

              {hasActiveFilters && (
                <View style={styles.activeFiltersContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.activeFiltersScroll}
                  >
                    {filters.priceRange !== "all" && (
                      <View style={styles.activeFilterChip}>
                        <Text style={styles.activeFilterText}>
                          {filters.priceRange === "under1000" && "Under 1,000 pts"}
                          {filters.priceRange === "1000to2500" && "1,000-2,500 pts"}
                          {filters.priceRange === "over2500" && "Over 2,500 pts"}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setFilters({ ...filters, priceRange: "all" })}
                        >
                          <Ionicons name="close" size={14} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    )}

                    {filters.stockStatus !== "all" && (
                      <View style={styles.activeFilterChip}>
                        <Text style={styles.activeFilterText}>
                          {filters.stockStatus === "inStock" && "In Stock"}
                          {filters.stockStatus === "lowStock" && "Low Stock"}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setFilters({ ...filters, stockStatus: "all" })}
                        >
                          <Ionicons name="close" size={14} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    )}

                    {filters.promoOnly && (
                      <View style={styles.activeFilterChip}>
                        <Text style={styles.activeFilterText}>Promo Items</Text>
                        <TouchableOpacity
                          onPress={() => setFilters({ ...filters, promoOnly: false })}
                        >
                          <Ionicons name="close" size={14} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.clearFiltersButton}
                      onPress={clearFilters}
                    >
                      <Text style={styles.clearFiltersText}>Clear All</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContainer}
              >
                {categories.map((category) => {
                  const categoryCount = products.filter(p =>
                    category === "All" || p.category === category
                  ).length;

                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        selectedCategory === category && styles.categoryChipActive,
                      ]}
                      onPress={() => setSelectedCategory(category)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          selectedCategory === category && styles.categoryChipTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                      <View style={[
                        styles.categoryCountBadge,
                        selectedCategory === category && styles.categoryCountBadgeActive
                      ]}>
                        <Text style={[
                          styles.categoryCountText,
                          selectedCategory === category && styles.categoryCountTextActive
                        ]}>
                          {categoryCount}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#EF4444" />
                  <Text style={styles.loadingText}>Loading products...</Text>
                </View>
              ) : filteredProducts.length === 0 ? (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="gift-outline" size={64} color="#D1D5DB" />
                  </View>
                  <Text style={styles.emptyTitle}>No Rewards Available</Text>
                  <Text style={styles.emptySubtitle}>
                    Check back soon for exciting new rewards!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredProducts}
                  renderItem={renderProductItem}
                  keyExtractor={keyExtractor}
                  numColumns={getColumnCount()}
                  scrollEnabled={false}
                  columnWrapperStyle={styles.productRow}
                  contentContainerStyle={styles.productsGrid}
                />
              )}
            </View>
          </View>
        </Animated.ScrollView>
      </View>

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Rewards</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.filterOptions}>
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "under1000", label: "Under 1,000 pts" },
                    { value: "1000to2500", label: "1,000 - 2,500 pts" },
                    { value: "over2500", label: "Over 2,500 pts" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        filters.priceRange === option.value && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilters({ ...filters, priceRange: option.value })}
                    >
                      <View style={[
                        styles.radioButton,
                        filters.priceRange === option.value && styles.radioButtonActive,
                      ]}>
                        {filters.priceRange === option.value && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={[
                        styles.filterOptionText,
                        filters.priceRange === option.value && styles.filterOptionTextActive,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Stock Status</Text>
                <View style={styles.filterOptions}>
                  {[
                    { value: "all", label: "All Items" },
                    { value: "inStock", label: "In Stock" },
                    { value: "lowStock", label: "Low Stock" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        filters.stockStatus === option.value && styles.filterOptionActive,
                      ]}
                      onPress={() => setFilters({ ...filters, stockStatus: option.value })}
                    >
                      <View style={[
                        styles.radioButton,
                        filters.stockStatus === option.value && styles.radioButtonActive,
                      ]}>
                        {filters.stockStatus === option.value && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={[
                        styles.filterOptionText,
                        filters.stockStatus === option.value && styles.filterOptionTextActive,
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Special Offers</Text>
                <TouchableOpacity
                  style={[
                    styles.toggleOption,
                    filters.promoOnly && styles.toggleOptionActive,
                  ]}
                  onPress={() => setFilters({ ...filters, promoOnly: !filters.promoOnly })}
                >
                  <View style={styles.toggleContent}>
                    <Ionicons
                      name="flash"
                      size={20}
                      color={filters.promoOnly ? "#8B5CF6" : "#9CA3AF"}
                    />
                    <Text style={[
                      styles.toggleText,
                      filters.promoOnly && styles.toggleTextActive,
                    ]}>
                      Show Promo Items Only
                    </Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    filters.promoOnly && styles.checkboxActive,
                  ]}>
                    {filters.promoOnly && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CartComponent cartCount={cartCount} />

      <SpecificProduct
        visible={showProductModal}
        product={selectedProduct}
        onClose={() => {
          setShowProductModal(false);
          setSelectedProduct(null);
        }}
        onCartUpdated={incrementCartCount}
        userPoints={userPoints}
        selectedStation={selectedStation}
        onShowStationModal={handleShowStationModal}
        cartUpdateTrigger={cartUpdateTrigger}
      />

      {/* clearStationAction prop removed — no longer needed */}
      <SpecificStation
        visible={showStationModal}
        onClose={handleStationModalClose}
        onConfirm={handleStationConfirm}
        onClear={handleClearStation}
        productId={stationFilterProduct?.id || ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
    marginTop: -30,
  },
  header: {
    height: getResponsiveValue(140, 160, 190, 210),
    width: "100%",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [
      { translateX: getResponsiveValue(-35, -45, -55, -65) },
      { translateY: getResponsiveValue(-35, -45, -55, -65) }
    ],
    width: getResponsiveValue(65, 75, 90, 110),
    height: getResponsiveValue(65, 75, 90, 110),
    resizeMode: "contain",
    zIndex: 2,
  },
  scrollContainer: {
    flex: 1,
    marginTop: -25,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: getResponsiveValue(40, 50, 60, 70),
  },
  contentContainer: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: getResponsiveValue(16, 20, 28, 36),
    paddingTop: getResponsiveValue(24, 28, 32, 36),
  },
  pointsCardContainer: {
    flexDirection: "row",
    gap: getResponsiveValue(12, 14, 16, 18),
    marginBottom: getResponsiveValue(16, 18, 20, 22),
    alignItems: "stretch",
  },
  pointsCard: {
    flex: 1,
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  myRedemptionButtonWrapper: {
    position: 'relative',
    width: getResponsiveValue(100, 110, 120, 130),
  },
  myRedemptionButton: {
    flex: 1,
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  myRedemptionGradient: {
    flex: 1,
    paddingVertical: getResponsiveValue(12, 14, 16, 18),
    paddingHorizontal: getResponsiveValue(10, 12, 14, 16),
    alignItems: "center",
    justifyContent: "center",
    gap: getResponsiveValue(4, 6, 8, 10),
  },
  myRedemptionText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: getResponsiveValue(12, 14, 16, 18),
  },
  redemptionBadgeContainer: {
    position: "absolute",
    top: getResponsiveValue(-8, -9, -10, -11),
    right: getResponsiveValue(-8, -9, -10, -11),
    zIndex: 10,
  },
  redemptionBadge: {
    minWidth: getResponsiveValue(24, 26, 28, 30),
    height: getResponsiveValue(24, 26, 28, 30),
    borderRadius: getResponsiveValue(12, 13, 14, 15),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: getResponsiveValue(6, 7, 8, 9),
    borderWidth: getResponsiveValue(2.5, 3, 3.5, 4),
    borderColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: { elevation: 6 },
    }),
  },
  redemptionBadgeText: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  pointsGradient: {
    padding: getResponsiveValue(14, 16, 18, 20),
  },
  pointsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: getResponsiveValue(8, 10, 12, 14),
  },
  pointsTitle: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: "#92400E",
    fontWeight: "600",
    marginBottom: getResponsiveValue(4, 6, 8, 10),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pointsValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(6, 8, 10, 12),
  },
  pointsIcon: {
    width: getResponsiveValue(18, 20, 24, 28),
    height: getResponsiveValue(18, 20, 24, 28),
    resizeMode: "contain",
  },
  pointsValue: {
    fontSize: getResponsiveValue(22, 24, 28, 32),
    fontWeight: "800",
    color: "#92400E",
    letterSpacing: -0.5,
  },
  pointsIconContainer: {
    width: getResponsiveValue(40, 44, 48, 52),
    height: getResponsiveValue(40, 44, 48, 52),
    borderRadius: getResponsiveValue(20, 22, 24, 26),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  stationSelectionCard: {
    borderRadius: getResponsiveValue(16, 18, 20, 22),
    overflow: "hidden",
    marginBottom: getResponsiveValue(20, 24, 28, 32),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  stationSelectionGradient: {
    padding: getResponsiveValue(18, 20, 22, 24),
  },
  stationSelectionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(14, 16, 18, 20),
  },
  stationIconContainer: {
    width: getResponsiveValue(48, 52, 56, 60),
    height: getResponsiveValue(48, 52, 56, 60),
    borderRadius: getResponsiveValue(24, 26, 28, 30),
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  stationIconContainerActive: {
    backgroundColor: "#FEE2E2",
  },
  stationTextContainer: {
    flex: 1,
  },
  stationLabel: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectedStationInfo: {
    flexDirection: "column",   // stack name on top, badges below
    alignItems: "flex-start",
    gap: 4,
  },
  selectedStationName: {
    fontSize: getResponsiveValue(15, 16, 17, 18),
    fontWeight: "700",
    color: "#111827",
    width: "100%",             // take full width so it doesn't wrap early
  },
  selectedStationBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectedStationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectedStationBadgeText: {
    fontSize: 10,
    color: "#059669",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  stationPlaceholder: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    color: "#9CA3AF",
    fontWeight: "500",
    fontStyle: "italic",
  },
  productsSection: {
    marginBottom: getResponsiveValue(80, 24, 28, 32),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getResponsiveValue(20, 24, 28, 32),
  },
  sectionTitle: {
    fontSize: getResponsiveValue(22, 24, 26, 28),
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: "#6B7280",
    lineHeight: getResponsiveValue(18, 20, 22, 24),
  },
  productCountBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
    paddingVertical: getResponsiveValue(6, 8, 10, 12),
    borderRadius: getResponsiveValue(8, 10, 12, 14),
  },
  productCountText: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: "#DC2626",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    gap: getResponsiveValue(10, 12, 14, 16),
    marginBottom: getResponsiveValue(16, 20, 24, 28),
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    paddingHorizontal: getResponsiveValue(14, 16, 18, 20),
    paddingVertical: getResponsiveValue(12, 14, 16, 18),
    gap: getResponsiveValue(10, 12, 14, 16),
    borderWidth: 2,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: getResponsiveValue(14, 15, 16, 17),
    color: "#111827",
    padding: 0,
  },
  filterButton: {
    width: getResponsiveValue(48, 52, 56, 60),
    height: getResponsiveValue(48, 52, 56, 60),
    backgroundColor: "#fff",
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  filterButtonActive: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  filterDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FBBF24",
  },
  activeFiltersContainer: {
    marginBottom: getResponsiveValue(16, 20, 24, 28),
  },
  activeFiltersScroll: {
    gap: getResponsiveValue(8, 10, 12, 14),
    paddingRight: getResponsiveValue(16, 20, 24, 28),
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
    paddingVertical: getResponsiveValue(8, 10, 12, 14),
    borderRadius: getResponsiveValue(8, 10, 12, 14),
    gap: 8,
  },
  activeFilterText: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: "#374151",
    fontWeight: "600",
  },
  clearFiltersButton: {
    paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
    paddingVertical: getResponsiveValue(8, 10, 12, 14),
    borderRadius: getResponsiveValue(8, 10, 12, 14),
    backgroundColor: "#FEE2E2",
  },
  clearFiltersText: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: "#DC2626",
    fontWeight: "600",
  },
  categoriesScroll: {
    marginBottom: getResponsiveValue(20, 24, 28, 32),
  },
  categoriesContainer: {
    paddingRight: getResponsiveValue(16, 20, 24, 28),
    gap: getResponsiveValue(10, 12, 14, 16),
  },
  categoryChip: {
    paddingHorizontal: getResponsiveValue(16, 18, 20, 22),
    paddingVertical: getResponsiveValue(10, 12, 14, 16),
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    backgroundColor: "#fff",
    marginRight: getResponsiveValue(10, 12, 14, 16),
    borderWidth: 2,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryChipActive: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  categoryChipText: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: "#6B7280",
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  categoryCountBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: getResponsiveValue(6, 7, 8, 9),
    paddingVertical: getResponsiveValue(2, 3, 4, 5),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
    minWidth: getResponsiveValue(20, 22, 24, 26),
    alignItems: "center",
  },
  categoryCountBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  categoryCountText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
    color: "#6B7280",
    fontWeight: "700",
  },
  categoryCountTextActive: {
    color: "#fff",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: getResponsiveValue(60, 70, 80, 90),
    gap: getResponsiveValue(16, 18, 20, 22),
  },
  loadingText: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    color: "#6B7280",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: getResponsiveValue(60, 70, 80, 90),
  },
  emptyIconContainer: {
    width: getResponsiveValue(100, 110, 120, 130),
    height: getResponsiveValue(100, 110, 120, 130),
    borderRadius: getResponsiveValue(50, 55, 60, 65),
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: getResponsiveValue(20, 24, 28, 32),
  },
  emptyTitle: {
    fontSize: getResponsiveValue(18, 20, 22, 24),
    fontWeight: "700",
    color: "#374151",
    marginBottom: getResponsiveValue(8, 10, 12, 14),
  },
  emptySubtitle: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: "#9CA3AF",
    textAlign: "center",
  },
  productsGrid: {
    paddingBottom: getResponsiveValue(20, 24, 28, 32),
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: getResponsiveValue(16, 20, 24, 28),
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: getResponsiveValue(16, 18, 20, 22),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  productCardDisabled: {
    opacity: 0.6,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: getResponsiveValue(120, 140, 160, 180),
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#F9FAFB",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  stockBadge: {
    position: "absolute",
    top: getResponsiveValue(8, 10, 12, 14),
    right: getResponsiveValue(8, 10, 12, 14),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
    paddingVertical: getResponsiveValue(4, 5, 6, 7),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
    gap: 4,
  },
  lowStockBadge: {
    backgroundColor: "#F97316",
  },
  outOfStockBadge: {
    backgroundColor: "#6B7280",
  },
  stockBadgeText: {
    color: "#fff",
    fontSize: getResponsiveValue(10, 11, 12, 13),
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  promoBadge: {
    position: "absolute",
    top: getResponsiveValue(8, 10, 12, 14),
    left: getResponsiveValue(8, 10, 12, 14),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
    paddingVertical: getResponsiveValue(4, 5, 6, 7),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
    gap: 3,
  },
  promoBadgeText: {
    color: "#fff",
    fontSize: getResponsiveValue(9, 10, 11, 12),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  productContent: {
    padding: getResponsiveValue(12, 14, 16, 18),
  },
  productName: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    fontWeight: "700",
    color: "#111827",
    marginBottom: getResponsiveValue(6, 7, 8, 9),
    minHeight: getResponsiveValue(36, 40, 44, 48),
    lineHeight: getResponsiveValue(18, 20, 22, 24),
  },
  productDescription: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: "#6B7280",
    marginBottom: getResponsiveValue(8, 10, 12, 14),
    minHeight: getResponsiveValue(32, 36, 40, 44),
    lineHeight: getResponsiveValue(16, 18, 20, 22),
  },
  promoDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
    paddingVertical: getResponsiveValue(4, 5, 6, 7),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
    marginBottom: getResponsiveValue(8, 10, 12, 14),
    gap: 4,
    alignSelf: "flex-start",
  },
  promoDateText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
    color: "#8B5CF6",
    fontWeight: "600",
  },
  promoDescriptionContainer: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
    paddingVertical: getResponsiveValue(6, 7, 8, 9),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
    marginBottom: getResponsiveValue(8, 10, 12, 14),
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  promoDescriptionText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
    color: "#92400E",
    fontWeight: "600",
    fontStyle: "italic",
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: getResponsiveValue(12, 14, 16, 18),
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: getResponsiveValue(12, 14, 16, 18),
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(4, 5, 6, 7),
    flex: 1,
    flexWrap: "wrap",
  },
  miniIcon: {
    width: getResponsiveValue(18, 20, 22, 24),
    height: getResponsiveValue(18, 20, 22, 24),
    resizeMode: "contain",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(6, 7, 8, 9),
  },
  originalPoints: {
    fontSize: getResponsiveValue(13, 15, 17, 19),
    fontWeight: "600",
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  productPoints: {
    fontSize: getResponsiveValue(17, 19, 21, 23),
    fontWeight: "800",
    color: "#F59E0B",
  },
  pointsLabel: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: "#9CA3AF",
    fontWeight: "600",
  },
  discountBadge: {
    backgroundColor: "#DC2626",
    paddingHorizontal: getResponsiveValue(6, 7, 8, 9),
    paddingVertical: getResponsiveValue(2, 3, 4, 5),
    borderRadius: getResponsiveValue(4, 5, 6, 7),
    marginLeft: getResponsiveValue(4, 5, 6, 7),
  },
  discountText: {
    color: "#fff",
    fontSize: getResponsiveValue(9, 10, 11, 12),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: getResponsiveValue(24, 28, 32, 36),
    borderTopRightRadius: getResponsiveValue(24, 28, 32, 36),
    maxHeight: "80%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    paddingVertical: getResponsiveValue(20, 24, 28, 32),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: getResponsiveValue(20, 22, 24, 26),
    fontWeight: "700",
    color: "#111827",
  },
  modalBody: {
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    paddingTop: getResponsiveValue(20, 24, 28, 32),
  },
  filterSection: {
    marginBottom: getResponsiveValue(28, 32, 36, 40),
  },
  filterSectionTitle: {
    fontSize: getResponsiveValue(16, 17, 18, 19),
    fontWeight: "700",
    color: "#111827",
    marginBottom: getResponsiveValue(14, 16, 18, 20),
  },
  filterOptions: {
    gap: getResponsiveValue(10, 12, 14, 16),
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: getResponsiveValue(14, 16, 18, 20),
    backgroundColor: "#F9FAFB",
    borderRadius: getResponsiveValue(10, 12, 14, 16),
    borderWidth: 2,
    borderColor: "#E5E7EB",
    gap: getResponsiveValue(12, 14, 16, 18),
  },
  filterOptionActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
  },
  radioButton: {
    width: getResponsiveValue(20, 22, 24, 26),
    height: getResponsiveValue(20, 22, 24, 26),
    borderRadius: getResponsiveValue(10, 11, 12, 13),
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonActive: {
    borderColor: "#EF4444",
  },
  radioButtonInner: {
    width: getResponsiveValue(10, 11, 12, 13),
    height: getResponsiveValue(10, 11, 12, 13),
    borderRadius: getResponsiveValue(5, 5.5, 6, 6.5),
    backgroundColor: "#EF4444",
  },
  filterOptionText: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    color: "#6B7280",
    fontWeight: "600",
  },
  filterOptionTextActive: {
    color: "#111827",
  },
  toggleOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: getResponsiveValue(14, 16, 18, 20),
    backgroundColor: "#F9FAFB",
    borderRadius: getResponsiveValue(10, 12, 14, 16),
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  toggleOptionActive: {
    backgroundColor: "#F5F3FF",
    borderColor: "#8B5CF6",
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(12, 14, 16, 18),
  },
  toggleText: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    color: "#6B7280",
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#111827",
  },
  checkbox: {
    width: getResponsiveValue(24, 26, 28, 30),
    height: getResponsiveValue(24, 26, 28, 30),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  modalFooter: {
    flexDirection: "row",
    gap: getResponsiveValue(12, 14, 16, 18),
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    paddingVertical: getResponsiveValue(20, 24, 28, 32),
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  clearButton: {
    flex: 1,
    paddingVertical: getResponsiveValue(14, 16, 18, 20),
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: getResponsiveValue(15, 16, 17, 18),
    fontWeight: "700",
    color: "#374151",
  },
  applyButton: {
    flex: 1,
    paddingVertical: getResponsiveValue(14, 16, 18, 20),
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    backgroundColor: "#EF4444",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: getResponsiveValue(15, 16, 17, 18),
    fontWeight: "700",
    color: "#fff",
  },
  lowPointsAlert: {
    marginBottom: getResponsiveValue(12, 14, 16, 18),
    borderRadius: getResponsiveValue(10, 12, 14, 16),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#DC2626",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  lowPointsGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: getResponsiveValue(14, 16, 18, 20),
    paddingVertical: getResponsiveValue(10, 12, 14, 16),
    gap: getResponsiveValue(10, 12, 14, 16),
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },
  lowPointsText: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: "#991B1B",
    fontWeight: "700",
    flex: 1,
  },
  dialogFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  dialogCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  dialogCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  dialogConfirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#EF4444",
  },
  dialogConfirmText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  selectedCaravanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedCaravanBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
});