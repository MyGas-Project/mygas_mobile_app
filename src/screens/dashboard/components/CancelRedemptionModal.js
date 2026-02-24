import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { BASE_URL, processResponse } from '../../../config'
import { AuthContext } from '../../../context/AuthContext'

const PREDEFINED_REASONS = [
    "Wrong item selected",
    "Changed my mind",
    "Ordered by mistake",
    "Found a better deal",
    "Taking too long",
    "Duplicate order",
    "Other",
]

function InfoRow({ label, value }) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value ?? '—'}</Text>
        </View>
    )
}

export default function CancelRedemptionModal({ visible, onClose, transactionData }) {
    const { userInfo } = useContext(AuthContext)
    const [reason, setReason] = useState('')
    const [selectedReason, setSelectedReason] = useState(null)

    const handleSelectReason = (item) => {
        setSelectedReason(item)
        setReason(item === 'Other' ? '' : item)
    }

    const handleConfirm = async () => {
        if (!reason.trim()) return
        console.log(transactionData)
        try {
            const response = await fetch(`${BASE_URL}customer/cancel-transaction`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    reference_number: transactionData.id,
                    reason: reason
                })
            });

            const res = await processResponse(response);
            const { statusCode, data } = res;

            console.log("cancel response: ", res);
            if (statusCode === 200) {
                // Alert("Success", "Redemption cancelled successfully");
                handleClose?.();
            }
        } catch (error) {
            console.error(error)
            // Alert("Error", "Failed to cancel redemption");
            throw error;
        }
    }

    const handleClose = () => {
        setReason('')
        setSelectedReason(null)
        onClose?.()
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        try {
            return new Date(dateStr).toLocaleString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            })
        } catch {
            return dateStr
        }
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={handleClose}
            animationType="slide"
            transparent
        >
            <View style={styles.overlay}>
                <View style={styles.sheet}>

                    {/* Scrollable body */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.iconWrap}>
                                <Text style={styles.icon}>✕</Text>
                            </View>
                            <Text style={styles.title}>Cancel Redemption</Text>
                            <Text style={styles.subtitle}>
                                Please let us know why you're cancelling this redemption.
                            </Text>
                        </View>

                        {/* Transaction Details Card */}
                        <View style={styles.transactionCard}>
                            <View style={styles.transactionCardHeader}>
                                <Text style={styles.transactionCardTitle}>Transaction Details</Text>
                                <View style={styles.transactionBadge}>
                                    <Text style={styles.transactionBadgeText}>#{transactionData?.id ?? '—'}</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <InfoRow label="Station" value={transactionData?.station_name} />
                            <View style={styles.infoGrid}>
                                <View style={styles.infoGridItem}>
                                    <Text style={styles.infoGridLabel}>Points</Text>
                                    <Text style={styles.infoGridValue}>{transactionData?.total_points ?? '—'}</Text>
                                </View>
                                <View style={styles.infoGridDivider} />
                                <View style={styles.infoGridItem}>
                                    <Text style={styles.infoGridLabel}>Items</Text>
                                    <Text style={styles.infoGridValue}>{transactionData?.items_count ?? '—'}</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <InfoRow label="Created" value={formatDate(transactionData?.created_at)} />
                        </View>

                        {/* Items List */}
                        {transactionData?.items?.length > 0 && (
                            <View style={styles.itemsSection}>
                                <Text style={styles.label}>Items</Text>
                                <ScrollView
                                    style={[
                                        styles.itemsScroll,
                                        transactionData.items.length > 5 && styles.itemsScrollConstrained,
                                    ]}
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={transactionData.items.length > 5}
                                >
                                    {transactionData.items.map((item, index) => (
                                        <View
                                            key={item.id ?? index}
                                            style={[
                                                styles.itemRow,
                                                index === transactionData.items.length - 1 && { borderBottomWidth: 0 },
                                            ]}
                                        >
                                            <View style={styles.itemQtyBadge}>
                                                <Text style={styles.itemQtyText}>x{item.quantity}</Text>
                                            </View>
                                            <Text style={styles.itemName} numberOfLines={1}>
                                                {item.inventory?.name ?? '—'}
                                            </Text>
                                            <Text style={styles.itemPoints}>{item.total_points} pts</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Reason Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Reason</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Describe your reason..."
                                placeholderTextColor="#9CA3AF"
                                value={reason}
                                onChangeText={(text) => {
                                    setReason(text)
                                    setSelectedReason('Other')
                                }}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Predefined Reasons */}
                        <Text style={styles.label}>Quick select</Text>
                        <View style={styles.chipContainer}>
                            {PREDEFINED_REASONS.map((item) => {
                                const active = selectedReason === item
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        style={[styles.chip, active && styles.chipActive]}
                                        onPress={() => handleSelectReason(item)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>

                    {/* Actions pinned at bottom */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.btnSecondary} onPress={handleClose} activeOpacity={0.8}>
                            <Text style={styles.btnSecondaryText}>Keep Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnPrimary, !reason.trim() && styles.btnDisabled]}
                            onPress={handleConfirm}
                            activeOpacity={0.8}
                            disabled={!reason.trim()}
                        >
                            <Text style={styles.btnPrimaryText}>Confirm Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 10,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    icon: {
        fontSize: 18,
        color: '#DC2626',
        fontWeight: '700',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 18,
    },
    transactionCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 14,
    },
    transactionCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    transactionCardTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    transactionBadge: {
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    transactionBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#DC2626',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 13,
        color: '#111827',
        fontWeight: '600',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 12,
    },
    infoGrid: {
        flexDirection: 'row',
        marginVertical: 6,
    },
    infoGridItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoGridDivider: {
        width: 8,
    },
    infoGridLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 1,
    },
    infoGridValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    itemsSection: {
        marginBottom: 14,
    },
    itemsScroll: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    itemsScrollConstrained: {
        maxHeight: 160,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        gap: 10,
    },
    itemQtyBadge: {
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 30,
        alignItems: 'center',
    },
    itemQtyText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#374151',
    },
    itemName: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        color: '#111827',
    },
    itemPoints: {
        fontSize: 13,
        fontWeight: '700',
        color: '#DC2626',
    },
    inputGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 14,
        color: '#111827',
        minHeight: 80,
        backgroundColor: '#F9FAFB',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 6,
        paddingBottom: 4,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    chipActive: {
        borderColor: '#DC2626',
        backgroundColor: '#FEE2E2',
    },
    chipText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#DC2626',
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 24,
        paddingTop: 14,
        paddingBottom: 28,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    btnSecondary: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    btnSecondaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    btnPrimary: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 12,
        backgroundColor: '#DC2626',
        alignItems: 'center',
    },
    btnDisabled: {
        backgroundColor: '#FCA5A5',
    },
    btnPrimaryText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});