import React, { useState, useMemo, useContext, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../context/AuthContext';
import { PointsDetailContext } from '../../../context/PointsDetails';
import { BASE_URL, processResponse } from '../../../config';
import GetStationsLists from '../../../service/Stations';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeTablet = width >= 1024;

const getResponsiveValue = (small, medium, tablet, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  if (isTablet) return tablet;
  return large;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const StationCard = ({ station, isSelected, onSelect }) => {
  const isAvailable = station.is_active === 1;
  const hasCoordinates = station.station_lat && station.station_long;

  return (
    <TouchableOpacity
      style={[
        styles.stationCard,
        station.is_caravan === 1 && styles.stationCardCaravan,
        isSelected && styles.stationCardSelected,
        !isAvailable && styles.stationCardDisabled,
      ]}
      onPress={() => isAvailable && onSelect(station)}
      disabled={!isAvailable}
      activeOpacity={0.7}
    >
      {/* Nearest Badge */}
      {station.isNearest && (
        <View style={styles.nearestBadge}>
          <Ionicons name="location" size={12} color="#fff" />
          <Text style={styles.nearestBadgeText}>NEAREST</Text>
        </View>
      )}

      {/* Caravan Badge */}
      {station.is_caravan === 1 && (
        <View style={styles.caravanBadge}>
          <Ionicons name="car" size={12} color="#fff" />
          <Text style={styles.caravanBadgeText}>CARAVAN</Text>
        </View>
      )}

      {/* Selection Radio */}
      <View style={styles.stationCardHeader}>
        <View style={[
          styles.radioButton,
          isSelected && styles.radioButtonSelected,
          !isAvailable && styles.radioButtonDisabled,
        ]}>
          {isSelected && (
            <View style={styles.radioButtonInner} />
          )}
        </View>

        <View style={styles.stationInfo}>
          <Text style={[
            styles.stationName,
            !isAvailable && styles.stationNameDisabled,
          ]} numberOfLines={1}>
            {station.station_name}
          </Text>
          {station.distance !== null && (
            <View style={styles.distanceContainer}>
              <Ionicons name="navigate" size={14} color="#6B7280" />
              <Text style={styles.distanceText}>
                {station.distance.toFixed(1)} km away
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Address */}
      <Text style={[
        styles.stationAddress,
        !isAvailable && styles.stationAddressDisabled,
      ]} numberOfLines={2}>
        {station.is_caravan === 1 ? station.description : station.station_address}
      </Text>

      {/* Stock Status */}
      <View style={styles.stockContainer}>
          <View style={[
            styles.stockBadge,
            isAvailable ? styles.stockBadgeAvailable : styles.stockBadgeOut,
          ]}>
            <Ionicons
              name={isAvailable ? "checkmark-circle" : "close-circle"}
              size={14}
              color="#fff"
            />
            <Text style={styles.stockBadgeText}>
              {isAvailable ? "Station Open" : "Station Closed"}
            </Text>
          </View>

        {!hasCoordinates && station.is_caravan !== 1 && (
          <View style={styles.noLocationBadge}>
            <Ionicons name="alert-circle" size={12} color="#F97316" />
            <Text style={styles.noLocationText}>No location</Text>
          </View>
        )}
      </View>

      {/* Additional Info */}
      <View style={styles.additionalInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="barcode-outline" size={14} color="#9CA3AF" />
          <Text style={styles.infoText}>{station.serial_number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SpecificStation({ visible, onClose, onConfirm, onClear, productId = "", clearStationAction }) {
  const { userInfo, userDetails, userLocation } = useContext(AuthContext);
  const [stationLists, setStationLists] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const abortControllerRef = useRef(null);

  const processedStations = useMemo(() => {
    if (!stationLists.length) return [];

    const userLat = userLocation?.latitude;
    const userLon = userLocation?.longitude;

    let stations = stationLists.map(station => {
      let distance = null;

      if (userLat && userLon && station.station_lat && station.station_long) {
        distance = calculateDistance(
          userLat,
          userLon,
          station.station_lat,
          station.station_long
        );
      }

      return {
        ...station,
        distance,
      };
    });

    // Mark nearest station
    const stationsWithDistance = stations.filter(s => s.distance !== null);
    if (stationsWithDistance.length > 0) {
      const nearest = stationsWithDistance.reduce((prev, curr) =>
        prev.distance < curr.distance ? prev : curr
      );
      stations = stations.map(s => ({
        ...s,
        isNearest: s.id === nearest.id,
      }));
    }

    return stations;
  }, [stationLists, userLocation]);

  const sortedStations = useMemo(() => {
    let stations = [...processedStations];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      stations = stations.filter(station =>
        station.station_name.toLowerCase().includes(query) ||
        station.station_address.toLowerCase().includes(query) ||
        station.serial_number.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'distance') {
      stations.sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    } else if (sortBy === 'name') {
      stations.sort((a, b) =>
        a.station_name.localeCompare(b.station_name)
      );
    }

    // Pin caravan stations to the top
    return stations.sort((a, b) => (b.is_caravan === 1 ? 1 : 0) - (a.is_caravan === 1 ? 1 : 0));

  }, [processedStations, sortBy, searchQuery]);

  const availableStationsCount = useMemo(() => {
    return stationLists.filter(s => s.is_active === 1).length;
  }, [stationLists]);

  const getStationLists = useCallback(async () => {
    try {
      setLoading(true);
      const result = await GetStationsLists(userInfo.token, searchQuery, productId);

      if (result.success) {
        setLoading(false);
        setStationLists(result.data);
      } else {
        console.log("Failed to fetch stations:", result.message || result.error);
      }
    } catch (error) {
      console.log("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  }, [userInfo.token, searchQuery, productId]);

  useEffect(() => {
    if (visible) {
      getStationLists();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [visible, getStationLists]);

  const handleConfirm = () => {
    if (selectedStation) {
      onConfirm({
        station: selectedStation,
      });
      setSearchQuery('');
      onClose();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
      setSearchQuery('');
      if (clearStationAction == true) {
        setSelectedStation(null);
      }
      onClose();
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  useEffect(() => {
    const loadCachedStation = async () => {
      try {
        const cachedStationSelected = await AsyncStorage.getItem("stationSelected");
        if (cachedStationSelected) {
          const stationSelected = JSON.parse(cachedStationSelected);
          setSelectedStation(stationSelected);
        } else {
          setSelectedStation(null);
        }
      } catch (error) {
        console.error("Error loading cached station:", error);
        setSelectedStation(null);
      }
    };

    if (visible) {
      loadCachedStation();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerDragIndicator} />
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Ionicons name="location" size={24} color="#EF4444" />
                <View>
                  <Text style={styles.modalTitle}>Select Station</Text>
                  <Text style={styles.modalSubtitle}>
                    Choose where to redeem your reward
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Box */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search stations by name, address, or code..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.sortContainer}>
            <View style={styles.sortInfo}>
              <Ionicons name="storefront" size={16} color="#6B7280" />
              <Text style={styles.sortInfoText}>
                {availableStationsCount} stations available
              </Text>
            </View>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'distance' && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy('distance')}
              >
                <Ionicons
                  name="navigate"
                  size={14}
                  color={sortBy === 'distance' ? '#fff' : '#6B7280'}
                />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === 'distance' && styles.sortButtonTextActive,
                ]}>
                  Nearest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'name' && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy('name')}
              >
                <Ionicons
                  name="list"
                  size={14}
                  color={sortBy === 'name' ? '#fff' : '#6B7280'}
                />
                <Text style={[
                  styles.sortButtonText,
                  sortBy === 'name' && styles.sortButtonTextActive,
                ]}>
                  Name
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stations List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EF4444" />
              <Text style={styles.loadingText}>Loading stations...</Text>
            </View>
          ) : sortedStations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No stations found' : 'No stations available'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try a different search term' : 'Please try again later'}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.stationsScroll}
              contentContainerStyle={styles.stationsContent}
              showsVerticalScrollIndicator={false}
            >
              {sortedStations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  isSelected={selectedStation?.id === station.id}
                  onSelect={setSelectedStation}
                />
              ))}
            </ScrollView>
          )}

          {/* Footer */}
          <View style={styles.modalFooter}>
            {selectedStation ? (
              <View style={styles.selectedStationInfo}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.selectedStationText} numberOfLines={1}>
                  {selectedStation.station_name}
                </Text>
              </View>
            ) : (
              <Text style={styles.selectPrompt}>
                Please select a station to continue
              </Text>
            )}

            <View style={styles.footerButtons}>
              {/* Clear Station Button */}
              {onClear && (
                <TouchableOpacity
                  style={styles.clearStationButton}
                  onPress={handleClear}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                  <Text style={styles.clearStationText}>Clear</Text>
                </TouchableOpacity>
              )}

              {/* Confirm Button */}
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !selectedStation && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!selectedStation}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={!selectedStation ? ['#D1D5DB', '#9CA3AF'] : ['#EF4444', '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.confirmGradient}
                >
                  <Ionicons name="location" size={20} color="#fff" />
                  <Text style={styles.confirmText}>
                    Set Station
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: getResponsiveValue(24, 28, 32, 36),
    borderTopRightRadius: getResponsiveValue(24, 28, 32, 36),
    height: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  modalHeader: {
    paddingTop: getResponsiveValue(12, 14, 16, 18),
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    paddingBottom: getResponsiveValue(16, 18, 20, 22),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerDragIndicator: {
    width: getResponsiveValue(40, 45, 50, 55),
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: getResponsiveValue(16, 18, 20, 22),
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveValue(12, 14, 16, 18),
    flex: 1,
  },
  modalTitle: {
    fontSize: getResponsiveValue(20, 22, 24, 26),
    fontWeight: '800',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    paddingVertical: getResponsiveValue(12, 14, 16, 18),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    paddingHorizontal: getResponsiveValue(14, 16, 18, 20),
    paddingVertical: Platform.OS === 'ios' ? getResponsiveValue(12, 14, 16, 18) : getResponsiveValue(8, 10, 12, 14),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: getResponsiveValue(14, 15, 16, 17),
    color: '#111827',
    fontWeight: '500',
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  clearButton: {
    padding: 4,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    paddingVertical: getResponsiveValue(16, 18, 20, 22),
  },
  sortInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortInfoText: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#6B7280',
    fontWeight: '600',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: getResponsiveValue(10, 12, 14, 16),
    paddingVertical: getResponsiveValue(6, 7, 8, 9),
    borderRadius: getResponsiveValue(8, 9, 10, 11),
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  sortButtonText: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: '#6B7280',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    color: '#6B7280',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: getResponsiveValue(16, 17, 18, 19),
    color: '#374151',
    fontWeight: '700',
  },
  emptySubtext: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#9CA3AF',
  },
  stationsScroll: {
    flex: 1,
  },
  stationsContent: {
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    paddingBottom: getResponsiveValue(20, 24, 28, 32),
    gap: getResponsiveValue(12, 14, 16, 18),
  },
  stationCard: {
    backgroundColor: '#fff',
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    padding: getResponsiveValue(16, 18, 20, 22),
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
    marginBottom: getResponsiveValue(12, 14, 16, 18),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  stationCardSelected: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  stationCardDisabled: {
    opacity: 0.5,
  },
  nearestBadge: {
    position: 'absolute',
    top: getResponsiveValue(12, 14, 16, 18),
    right: getResponsiveValue(12, 14, 16, 18),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
    paddingVertical: getResponsiveValue(4, 5, 6, 7),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
  },
  nearestBadgeText: {
    color: '#fff',
    fontSize: getResponsiveValue(9, 10, 11, 12),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stationCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: getResponsiveValue(12, 14, 16, 18),
    marginBottom: getResponsiveValue(12, 14, 16, 18),
  },
  radioButton: {
    width: getResponsiveValue(22, 24, 26, 28),
    height: getResponsiveValue(22, 24, 26, 28),
    borderRadius: getResponsiveValue(11, 12, 13, 14),
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioButtonSelected: {
    borderColor: '#EF4444',
  },
  radioButtonDisabled: {
    borderColor: '#E5E7EB',
  },
  radioButtonInner: {
    width: getResponsiveValue(12, 13, 14, 15),
    height: getResponsiveValue(12, 13, 14, 15),
    borderRadius: getResponsiveValue(6, 6.5, 7, 7.5),
    backgroundColor: '#EF4444',
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: getResponsiveValue(15, 16, 17, 18),
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stationNameDisabled: {
    color: '#9CA3AF',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: '#6B7280',
    fontWeight: '600',
  },
  stationAddress: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#6B7280',
    lineHeight: getResponsiveValue(18, 20, 22, 24),
    marginBottom: getResponsiveValue(12, 14, 16, 18),
  },
  stationAddressDisabled: {
    color: '#9CA3AF',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: getResponsiveValue(12, 14, 16, 18),
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
    paddingVertical: getResponsiveValue(4, 5, 6, 7),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
  },
  stockBadgeAvailable: {
    backgroundColor: '#10B981',
  },
  stockBadgeOut: {
    backgroundColor: '#6B7280',
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: getResponsiveValue(11, 12, 13, 14),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  noLocationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: getResponsiveValue(6, 7, 8, 9),
    paddingVertical: getResponsiveValue(2, 3, 4, 5),
    backgroundColor: '#FFF7ED',
    borderRadius: getResponsiveValue(4, 5, 6, 7),
  },
  noLocationText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
    color: '#F97316',
    fontWeight: '600',
  },
  additionalInfo: {
    gap: getResponsiveValue(6, 7, 8, 9),
    paddingTop: getResponsiveValue(12, 14, 16, 18),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: '#9CA3AF',
    fontWeight: '500',
  },
  modalFooter: {
    padding: getResponsiveValue(20, 24, 28, 32),
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: getResponsiveValue(12, 14, 16, 18),
  },
  selectedStationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: getResponsiveValue(12, 14, 16, 18),
    paddingVertical: getResponsiveValue(10, 12, 14, 16),
    borderRadius: getResponsiveValue(10, 12, 14, 16),
  },
  selectedStationText: {
    flex: 1,
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#059669',
    fontWeight: '700',
  },
  selectPrompt: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: getResponsiveValue(10, 12, 14, 16),
  },
  clearStationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: getResponsiveValue(16, 18, 20, 22),
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    borderRadius: getResponsiveValue(14, 16, 18, 20),
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#FEE2E2',
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  clearStationText: {
    fontSize: getResponsiveValue(15, 16, 17, 18),
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: 0.3,
  },
  confirmButton: {
    flex: 1,
    borderRadius: getResponsiveValue(14, 16, 18, 20),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveValue(16, 18, 20, 22),
    gap: getResponsiveValue(10, 12, 14, 16),
  },
  confirmText: {
    fontSize: getResponsiveValue(17, 18, 19, 20),
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  caravanBadge: {
    position: 'absolute',
    top: getResponsiveValue(12, 14, 16, 18),
    right: getResponsiveValue(12, 14, 16, 18),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: getResponsiveValue(8, 10, 12, 14),
    paddingVertical: getResponsiveValue(4, 5, 6, 7),
    borderRadius: getResponsiveValue(6, 7, 8, 9),
  },
  caravanBadgeText: {
    color: '#fff',
    fontSize: getResponsiveValue(9, 10, 11, 12),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stationCardCaravan: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    ...Platform.select({
      ios: {
        shadowColor: '#F59E0B',
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});