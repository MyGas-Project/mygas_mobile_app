import React, { useState, useMemo, useCallback, useContext, useEffect } from "react";
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

const { width, height } = Dimensions.get("window");

// Enhanced responsive breakpoints
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeTablet = width >= 1024;

// Responsive helper functions
const getResponsiveValue = (small, medium, tablet, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  if (isTablet) return tablet;
  return large;
};

const getColumnCount = () => {
  if (isSmallDevice) return 2;
  if (isMediumDevice) return 2;
  if (isTablet) return 3;
  return 4;
};

const getCardWidth = () => {
  const columns = getColumnCount();
  const padding = getResponsiveValue(16, 20, 28, 36);
  const spacing = getResponsiveValue(12, 16, 20, 24);
  return (width - padding * 2 - spacing * (columns - 1)) / columns;
};

// Format date helper
const formatPromoDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    return "";
  }
};

// Dynamic categories based on products
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
          source={product.image ? { uri: product.image } : require("../../../assets/my.png")}
          style={styles.productImage}
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.imageGradient}
        />

        {/* Stock Badge */}
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

        {/* Promo Badge */}
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

        {/* Promo Date Display */}
        {product.isWeeklyPromo && promoDateText && (
          <View style={styles.promoDateContainer}>
            <Ionicons name="calendar-outline" size={12} color="#8B5CF6" />
            <Text style={styles.promoDateText}>{promoDateText}</Text>
          </View>
        )}

        {/* Promo Description */}
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

            {/* Show promo pricing if it's a weekly promo */}
            {product.isWeeklyPromo && product.originalPoints ? (
              <View style={styles.priceContainer}>
                <Text style={styles.originalPoints}>{product.originalPoints}</Text>
                <Text style={styles.productPoints}>{product.points}</Text>
              </View>
            ) : (
              <Text style={styles.productPoints}>{product.points}</Text>
            )}

            <Text style={styles.pointsLabel}>pts</Text>

            {/* Promo discount badge */}
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
  const { rewards } = useContext(PointsDetailContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all", // all, under1000, 1000to2500, over2500
    stockStatus: "all", // all, inStock, lowStock
    promoOnly: false,
  });
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStationModal, setShowStationModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationFilterProduct, setStationFilterProduct] = useState(null);

  // Function to refresh cart count
  const refreshCartCount = useCallback(async () => {
    try {
      const storedCount = await AsyncStorage.getItem("cartCount");
      const count = storedCount ? parseInt(storedCount, 10) : 0;
      setCartCount(count);
    } catch (error) {
      console.error("Error refreshing cart count:", error);
      setCartCount(0);
    }
  }, []);

  const incrementCartCount = async () => {
    try {
      const storedCount = await AsyncStorage.getItem("cartCount");
      const currentCount = storedCount ? parseInt(storedCount, 10) : 0;
      const newCount = currentCount + 1;
      await AsyncStorage.setItem("cartCount", newCount.toString());
      setCartCount(newCount);
    } catch (error) {
      console.error("Error incrementing cart count:", error);
    }
  };

  // Refresh cart count whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshCartCount();
    }, [refreshCartCount])
  );

  // User points
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
      // console.log("getAllProducts: ", data.data);
      if (statusCode === 200) {
        // Transform API data to match the expected format
        const transformedProducts = data.data.inventories.map((item) => ({
          id: item.inventory_id,
          name: item.name,
          description: item.description || "No description available",
          points: item.promo_points || item.points || 0,
          originalPoints: item.promo_points ? item.points : null,
          image: item.image_path,
          category: "Products", // You can add category logic here if available from API
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
      // Category filter
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;

      // Search filter
      const searchMatch = searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Price range filter
      let priceMatch = true;
      if (filters.priceRange === "under1000") {
        priceMatch = product.points < 1000;
      } else if (filters.priceRange === "1000to2500") {
        priceMatch = product.points >= 1000 && product.points <= 2500;
      } else if (filters.priceRange === "over2500") {
        priceMatch = product.points > 2500;
      }

      // Stock status filter
      let stockMatch = true;
      if (filters.stockStatus === "inStock") {
        stockMatch = product.quantity > 5;
      } else if (filters.stockStatus === "lowStock") {
        stockMatch = product.quantity > 0 && product.quantity <= 5;
      }

      // Promo filter
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
    try {
      // Clear the cached station from AsyncStorage
      await AsyncStorage.removeItem("stationSelected");

      // Clear the local state
      setSelectedStation(null);
      // setProducts([]);
      setLoading(false);
      getAllProducts();

      console.log("Station cleared successfully");
    } catch (error) {
      console.error("Error clearing station:", error);
    }
  }, []);

  const hasActiveFilters = useMemo(() => {
    return filters.priceRange !== "all" ||
      filters.stockStatus !== "all" ||
      filters.promoOnly;
  }, [filters]);

  const handleStationConfirm = useCallback(async (data) => {
    await AsyncStorage.setItem("stationSelected", JSON.stringify(data.station));
    setSelectedStation(data.station);
    getAllProducts(data.station);
  }, []);

  const renderProductItem = useCallback(({ item }) => (
    <ProductCard
      product={item}
      userPoints={userPoints}
      onProductPress={handleProductPress}
      cardWidth={cardWidth}
    />
  ), [userPoints, handleProductPress, cardWidth]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // Load cached station on mount
  useEffect(() => {
    const loadCachedStation = async () => {
      try {
        const cachedStationSelected = await AsyncStorage.getItem("stationSelected");
        if (cachedStationSelected) {
          const stationSelected = JSON.parse(cachedStationSelected);
          setSelectedStation(stationSelected);
          getAllProducts(stationSelected);
        } else {
          // No cached station, just stop loading
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
  }, []);
  // console.log(cartCount);

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.header}
      >

        <LinearGradient
          colors={["rgba(249, 250, 141, 0.95)", "rgba(249, 250, 141, 0.7)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.headerGradient}
        />

        <Image
          source={require("../../../assets/mygas_logo.png")}
          style={styles.logo}
        />
        <View style={{ position: "absolute", right: 0, top: 0 }}>
          <Navbar hideBack />
        </View>
      </ImageBackground>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Enhanced Points Display */}
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

          {/* Station Selection Section */}
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
                      <View style={styles.selectedStationBadge}>
                        <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                        <Text style={styles.selectedStationBadgeText}>Selected</Text>
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

          {/* Products Section */}
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

            {/* Search Bar */}
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

            {/* Active Filters Display */}
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

            {/* Enhanced Category Tabs */}
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

            {/* Products Grid */}
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
      </ScrollView>

      {/* Filter Modal */}
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
              {/* Price Range Filter */}
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

              {/* Stock Status Filter */}
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

              {/* Promo Filter */}
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
      />

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
    borderTopLeftRadius: getResponsiveValue(24, 28, 32, 36),
    borderTopRightRadius: getResponsiveValue(24, 28, 32, 36),
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
    borderRadius: getResponsiveValue(16, 20, 24, 28),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  myRedemptionButton: {
    borderRadius: getResponsiveValue(16, 20, 24, 28),
    overflow: "hidden",
    width: getResponsiveValue(110, 120, 130, 140),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  myRedemptionGradient: {
    flex: 1,
    paddingVertical: getResponsiveValue(16, 18, 20, 22),
    paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
    alignItems: "center",
    justifyContent: "center",
    gap: getResponsiveValue(6, 8, 10, 12),
  },
  myRedemptionText: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    lineHeight: getResponsiveValue(14, 16, 18, 20),
  },
  pointsGradient: {
    padding: getResponsiveValue(20, 24, 28, 32),
  },
  pointsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: getResponsiveValue(12, 14, 16, 18),
  },
  pointsTitle: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: "#92400E",
    fontWeight: "600",
    marginBottom: getResponsiveValue(8, 10, 12, 14),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pointsValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(8, 10, 12, 14),
  },
  pointsIcon: {
    width: getResponsiveValue(20, 32, 36, 40),
    height: getResponsiveValue(20, 32, 36, 40),
    resizeMode: "contain",
  },
  pointsValue: {
    fontSize: getResponsiveValue(18, 32, 36, 40),
    fontWeight: "800",
    color: "#92400E",
    letterSpacing: -1,
  },
  pointsIconContainer: {
    width: getResponsiveValue(25, 64, 72, 80),
    height: getResponsiveValue(25, 64, 72, 80),
    borderRadius: getResponsiveValue(28, 32, 36, 40),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  stationSelectionCard: {
    borderRadius: getResponsiveValue(16, 20, 24, 28),
    marginBottom: getResponsiveValue(20, 24, 28, 32),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  selectedStationName: {
    fontSize: getResponsiveValue(15, 16, 17, 18),
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  selectedStationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: getResponsiveValue(8, 9, 10, 11),
    paddingVertical: getResponsiveValue(3, 4, 5, 6),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
  },
  selectedStationBadgeText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
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
      android: {
        elevation: 2,
      },
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
      android: {
        elevation: 2,
      },
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
      android: {
        elevation: 3,
      },
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
      android: {
        elevation: 8,
      },
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
});