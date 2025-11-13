import { Modal, StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar, ScrollView, Alert } from 'react-native'
import React, { useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import QRCode from 'react-native-qrcode-svg'
import * as MediaLibrary from 'expo-media-library'
import ViewShot from 'react-native-view-shot'
import QrDownloadTemplate from '../components/QrDownloadTemplate'

const { width, height } = Dimensions.get('window')

const isSmallDevice = width < 375
const isMediumDevice = width >= 375 && width < 768
const isTablet = width >= 768 && width < 1024
const isLargeTablet = width >= 1024

const getResponsiveValue = (small, medium, tablet, large) => {
  if (isSmallDevice) return small
  if (isMediumDevice) return medium
  if (isTablet) return tablet
  return large
}

export default function QrRedemption({ visible, onClose, qrCode, transactionId }) {
  const viewShotRef = useRef()

  const handleDownloadQR = async () => {
    if (!viewShotRef.current) return

    try {
      // Capture the QR template view
      const uri = await viewShotRef.current.capture()

      // Request permission to access gallery
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(uri)
        await MediaLibrary.createAlbumAsync('QR Codes', asset, false)
        Alert.alert('Saved!', 'QR code saved to your gallery.')
      } else {
        Alert.alert('Permission denied', 'Cannot save QR to gallery')
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'Failed to save QR code')
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.85)" barStyle="light-content" />
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="checkmark-circle"
                  size={getResponsiveValue(24, 26, 28, 30)}
                  color="#22C55E"
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>Payment Successful</Text>
                <Text style={styles.modalSubtitle}>Ready for redemption</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={getResponsiveValue(24, 26, 28, 30)}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Hidden ViewShot for Download - Uses QrDownloadTemplate */}
            <View style={styles.hiddenDownloadContainer}>
              <ViewShot
                ref={viewShotRef}
                options={{
                  format: 'png',
                  quality: 1.0,
                  result: 'tmpfile'
                }}
              >
                <QrDownloadTemplate
                  qrCode={qrCode}
                  transactionId={transactionId}
                />
              </ViewShot>
            </View>

            {/* Visible QR Display Section */}
            <View style={styles.qrSection}>
              <Text style={styles.sectionTitle}>Show this code at the station</Text>

              <View style={styles.qrContainer}>
                <View style={styles.qrWrapper}>
                  {qrCode ? (
                    <QRCode
                      value={qrCode}
                      size={getResponsiveValue(200, 240, 280, 320)}
                      backgroundColor="#FFFFFF"
                      color="#1E293B"
                    />
                  ) : (
                    <View style={styles.qrPlaceholder}>
                      <Ionicons
                        name="qr-code-outline"
                        size={getResponsiveValue(200, 240, 280, 320)}
                        color="#E2E8F0"
                      />
                    </View>
                  )}
                </View>

                {/* Corner Decorations */}
                <View style={[styles.cornerDecoration, styles.topLeft]} />
                <View style={[styles.cornerDecoration, styles.topRight]} />
                <View style={[styles.cornerDecoration, styles.bottomLeft]} />
                <View style={[styles.cornerDecoration, styles.bottomRight]} />
              </View>

              {/* Transaction Details Card */}
              <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Transaction ID</Text>
                  <Text style={styles.detailValue}>{transactionId || 'N/A'}</Text>
                </View>

                {qrCode && (
                  <View style={[styles.detailRow, styles.detailRowBorder]}>
                    <Text style={styles.detailLabel}>QR Code</Text>
                    <Text style={styles.qrCodeValue} numberOfLines={1} ellipsizeMode="middle">
                      {qrCode}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.qrSection}>
              <View style={styles.instructionsCard}>
                <View style={styles.instructionsHeader}>
                  <Ionicons
                    name="information-circle"
                    size={getResponsiveValue(20, 22, 24, 26)}
                    color="#3B82F6"
                  />
                  <Text style={styles.instructionsTitle}>How to Redeem</Text>
                </View>
                <View style={styles.instructionsList}>
                  <View style={styles.instructionItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      Show this QR code to the station staff
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      Wait for verification and approval
                    </Text>
                  </View>
                  <View style={styles.instructionItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <Text style={styles.instructionText}>
                      Collect your redeemed items
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons - Fixed at Bottom */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={handleDownloadQR}
              activeOpacity={0.7}
            >
              <Ionicons
                name="download-outline"
                size={getResponsiveValue(20, 22, 24, 26)}
                color="#475569"
              />
              <Text style={styles.downloadButtonText}>Download QR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>Done</Text>
              <Ionicons
                name="checkmark"
                size={getResponsiveValue(20, 22, 24, 26)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.92,
    maxWidth: 480,
    maxHeight: height * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveValue(20, 24, 28, 32),
    overflow: 'hidden',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getResponsiveValue(20, 22, 24, 26),
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveValue(12, 14, 16, 18),
    flex: 1,
  },
  iconCircle: {
    width: getResponsiveValue(40, 44, 48, 52),
    height: getResponsiveValue(40, 44, 48, 52),
    borderRadius: getResponsiveValue(20, 22, 24, 26),
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: getResponsiveValue(16, 18, 20, 22),
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    width: getResponsiveValue(36, 38, 40, 42),
    height: getResponsiveValue(36, 38, 40, 42),
    borderRadius: getResponsiveValue(18, 19, 20, 21),
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  hiddenDownloadContainer: {
    position: 'absolute',
    left: -9999,
    top: -9999,
  },
  qrSection: {
    padding: getResponsiveValue(20, 24, 28, 32),
  },
  sectionTitle: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    fontWeight: '600',
    color: '#334155',
    marginBottom: getResponsiveValue(16, 18, 20, 22),
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsiveValue(20, 24, 28, 32),
    position: 'relative',
  },
  qrWrapper: {
    padding: getResponsiveValue(20, 24, 28, 32),
    backgroundColor: '#FFFFFF',
    borderRadius: getResponsiveValue(16, 18, 20, 22),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerDecoration: {
    position: 'absolute',
    width: getResponsiveValue(20, 22, 24, 26),
    height: getResponsiveValue(20, 22, 24, 26),
    borderColor: '#EF4444',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  detailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    padding: getResponsiveValue(16, 18, 20, 22),
    marginBottom: getResponsiveValue(16, 18, 20, 22),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getResponsiveValue(8, 9, 10, 11),
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: getResponsiveValue(8, 9, 10, 11),
  },
  detailLabel: {
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#1E293B',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  qrCodeValue: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: '#475569',
    fontWeight: '600',
    fontFamily: 'monospace',
    maxWidth: '60%',
  },
  instructionsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    padding: getResponsiveValue(16, 18, 20, 22),
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getResponsiveValue(8, 9, 10, 11),
    marginBottom: getResponsiveValue(12, 14, 16, 18),
  },
  instructionsTitle: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    fontWeight: '600',
    color: '#1E40AF',
  },
  instructionsList: {
    gap: getResponsiveValue(10, 11, 12, 13),
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: getResponsiveValue(10, 11, 12, 13),
  },
  stepNumber: {
    width: getResponsiveValue(22, 24, 26, 28),
    height: getResponsiveValue(22, 24, 26, 28),
    borderRadius: getResponsiveValue(11, 12, 13, 14),
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: getResponsiveValue(12, 13, 14, 15),
    color: '#334155',
    lineHeight: getResponsiveValue(18, 20, 22, 24),
  },
  actionButtons: {
    flexDirection: 'row',
    gap: getResponsiveValue(12, 14, 16, 18),
    paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
    paddingVertical: getResponsiveValue(16, 18, 20, 22),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getResponsiveValue(8, 9, 10, 11),
    paddingVertical: getResponsiveValue(14, 16, 18, 20),
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  downloadButtonText: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    fontWeight: '600',
    color: '#475569',
  },
  doneButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getResponsiveValue(8, 9, 10, 11),
    paddingVertical: getResponsiveValue(14, 16, 18, 20),
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    backgroundColor: '#EF4444',
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  doneButtonText: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});