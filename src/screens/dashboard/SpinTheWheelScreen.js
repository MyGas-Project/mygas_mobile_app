import React, { useContext, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Easing,
    Dimensions,
    StatusBar,
    ScrollView,
    Alert,
} from "react-native";
import Svg, { G, Path, Circle, Polygon, Rect, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const scale = (size) => {
    if (isSmallDevice) return size * 0.9;
    if (isMediumDevice) return size;
    return size * 1.05;
};

// Where the "View Reward" button goes.
const VIEW_REWARD_ROUTE = "Redemption";

// ─── Wheel geometry ───────────────────────────────────────────────────────
const SIZE = 300; // SVG viewBox
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 140;
const LABEL_INSET = 12;
const TEXT_R = R * 0.62;
const HUB_CLEAR = 38;

const WHEEL_SIZE = Math.min(SCREEN_WIDTH - scale(90), 320);
const RIM = 14;
const RIM_RING = 3;
const OUTER_SIZE = WHEEL_SIZE + RIM * 2;
const HUB_SIZE = scale(66);
const BULBS = 16;
const BULB_SIZE = 7;

const SPIN_DURATION = 5000;
const FULL_SPINS = 6;

const FALLBACK_COLORS = ["#E0B820", "#3A2E00", "#F5D45E", "#8A6D00"];

const BULB_POSITIONS = Array.from({ length: BULBS }, (_, i) => {
    const a = ((i * 360) / BULBS) * (Math.PI / 180);
    const r = (WHEEL_SIZE / 2 + RIM_RING + OUTER_SIZE / 2) / 2;
    return {
        left: OUTER_SIZE / 2 + r * Math.cos(a) - BULB_SIZE / 2,
        top: OUTER_SIZE / 2 + r * Math.sin(a) - BULB_SIZE / 2,
    };
});

const CONFETTI = [
    { top: "4%", left: "5%", w: 12, h: 5, rot: "35deg", color: "#E02424" },
    { top: "14%", left: "1%", w: 12, h: 5, rot: "-30deg", color: "#F5A623" },
    { top: "32%", left: "4%", w: 10, h: 5, rot: "20deg", color: "#F5D45E" },
    { top: "58%", left: "1%", w: 10, h: 5, rot: "-20deg", color: "#F5A623" },
    { top: "82%", left: "5%", w: 12, h: 5, rot: "40deg", color: "#E02424" },
    { top: "2%", left: "92%", w: 10, h: 5, rot: "-40deg", color: "#E02424" },
    { top: "12%", left: "95%", w: 12, h: 5, rot: "30deg", color: "#F5D45E" },
    { top: "36%", left: "94%", w: 10, h: 5, rot: "-25deg", color: "#F5A623" },
    { top: "60%", left: "96%", w: 12, h: 5, rot: "25deg", color: "#E02424" },
    { top: "84%", left: "92%", w: 10, h: 5, rot: "-35deg", color: "#F5D45E" },
];

const polar = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180;
    return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)];
};

// Dark text on light slices, white text on dark slices.
function textColorFor(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return "#111827";
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#111827" : "#FFFFFF";
}

function GiftGlyph({ cx, cy, color }) {
    return (
        <G stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <Rect x={cx - 7} y={cy - 1} width={14} height={9} rx={1.5} />
            <Rect x={cx - 8.5} y={cy - 4.5} width={17} height={3.5} rx={1.5} />
            <Path d={`M ${cx} ${cy - 4.5} L ${cx} ${cy + 8}`} />
            <Path d={`M ${cx} ${cy - 4.5} C ${cx - 1} ${cy - 10} ${cx - 8} ${cy - 10} ${cx - 5} ${cy - 4.5}`} />
            <Path d={`M ${cx} ${cy - 4.5} C ${cx + 1} ${cy - 10} ${cx + 8} ${cy - 10} ${cx + 5} ${cy - 4.5}`} />
        </G>
    );
}

function normalizeSegments(raw) {
    return (Array.isArray(raw) ? raw : []).map((s, i) => ({
        id: s?.id ?? i, // React key only
        serverId: s?.id ?? null, // real id from the API, if present
        label: String(s?.label ?? s?.name ?? "").trim() || `Prize ${i + 1}`,
        color: s?.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    }));
}

// The server picks the winner (weights + max_wins) and records the claim.
async function requestSpin(campaign, token) {
    const res = await fetch(`${BASE_URL}customer/spin-the-wheel`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaign_id: campaign.id }),

    }).then(processResponse);

    const body = res?.data;

    console.log("Spin Response:", JSON.stringify(body, null, 2));

    if (!body?.success) {
        throw new Error(body?.reason?.message || body?.message || "Failed to spin the wheel.");
    }
    return body.data ?? {};
}

// The server returns the winner in `data.segment`. The campaigns list has no
// segment ids yet, so this falls back to matching on the label.
function findWinnerIndex(segments, result) {
    const won = result?.segment;
    if (!won) return -1;

    if (won.id != null) {
        const i = segments.findIndex((s) => s.serverId != null && String(s.serverId) === String(won.id));
        if (i >= 0) return i;
    }
    if (won.label) {
        const target = String(won.label).trim().toLowerCase();
        return segments.findIndex((s) => s.label.toLowerCase() === target);
    }
    return -1;
}

export default function SpinTheWheelScreen({ navigation, route }) {
    const { userInfo } = useContext(AuthContext);
    const campaign = route.params?.campaign ?? null;
    const segments = useMemo(() => normalizeSegments(campaign?.segments), [campaign]);
    const n = segments.length;
    const step = n > 0 ? 360 / n : 0;

    const fontSize = n <= 4 ? 14 : n <= 6 ? 12 : n <= 8 ? 11 : n <= 12 ? 9 : 8;
    const tangential = n <= 6; // few slices: horizontal labels. Many slices: radial labels.
    const chord = n >= 2 ? 2 * TEXT_R * Math.sin(Math.PI / n) : 2 * TEXT_R;
    const maxLabelChars = tangential
        ? Math.max(6, Math.floor((chord * 0.88) / (fontSize * 0.6)))
        : Math.max(5, Math.floor((R - LABEL_INSET - HUB_CLEAR) / (fontSize * 0.6)));

    const [spinning, setSpinning] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const [winner, setWinner] = useState(null);

    const rotation = useRef(new Animated.Value(0)).current;
    const rotationRef = useRef(0);
    const confetti = useRef(new Animated.Value(0)).current;

    const rotate = rotation.interpolate({
        inputRange: [0, 360],
        outputRange: ["0deg", "360deg"],
    });
    const confettiScale = confetti.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

    const remaining = campaign?.remaining_claims ?? 0;
    const canSpin = remaining > 0 && n > 0 && !hasSpun;
    const spinsLabel =
        remaining <= 0 ? "No spins left" : remaining === 1 ? "One spin available" : `${remaining} spins available`;

    const spinTo = (index) =>
        new Promise((resolve) => {
            // Slice i is centred i * step degrees clockwise from 12 o'clock
            const mid = index * step;
            // Land somewhere inside the slice, not always dead centre
            const jitter = (Math.random() - 0.5) * step * 0.6;
            const targetMod = (((360 - mid - jitter) % 360) + 360) % 360;

            const current = rotationRef.current;
            const delta = (((targetMod - (current % 360)) % 360) + 360) % 360;
            const final = current + FULL_SPINS * 360 + delta;
            rotationRef.current = final;

            Animated.timing(rotation, {
                toValue: final,
                duration: SPIN_DURATION,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start(() => resolve());
        });

    const handleSpin = async () => {
        if (!canSpin || spinning) return;
        setSpinning(true);
        try {
            const result = await requestSpin(campaign, userInfo?.token);
            const index = findWinnerIndex(segments, result);
            if (index < 0) {
                throw new Error("Your spin was recorded, but we couldn't show the prize. Please check your rewards.");
            }

            await spinTo(index);
            setWinner(segments[index]);
            setHasSpun(true);
            Animated.spring(confetti, { toValue: 1, friction: 6, useNativeDriver: true }).start();
        } catch (error) {
            console.error("Spin error:", error);
            Alert.alert("Spin failed", error?.message || "Something went wrong. Please try again.");
        } finally {
            setSpinning(false);
        }
    };

    const handleViewReward = () => navigation.navigate(VIEW_REWARD_ROUTE);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.mainContent}>
                <View style={styles.backgroundLayer} pointerEvents="none">
                    <LinearGradient
                        colors={["#FFF6D6", "#FBFAF3", "#F8F9FA"]}
                        locations={[0, 0.35, 1]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.bgCircleTop} />
                    <View style={styles.bgCircleBottom} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Title */}
                    <View style={styles.headerSection}>
                        <Text style={styles.sectionTitle} numberOfLines={2}>
                            {campaign?.name ?? "Spin the Wheel"}
                        </Text>
                        <View style={styles.titleUnderline} />
                        <Text style={styles.subtitle}>
                            {hasSpun ? "Here's what you got!" : "Tap spin and try your luck ✨"}
                        </Text>
                    </View>

                    {n === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="alert-circle-outline" size={64} color="#CCC" />
                            <Text style={styles.emptyText}>This wheel isn't ready yet</Text>
                            <Text style={styles.emptySubtext}>No prizes have been set up.</Text>
                        </View>
                    ) : (
                        <>
                            {/* Wheel */}
                            <View style={styles.wheelArea}>
                                <View style={styles.wheelOuter}>
                                    {/* Gold rim */}
                                    <LinearGradient
                                        colors={["#F8E08A", "#D4A017", "#F5D45E", "#B8860B"]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.rimGradient}
                                    />
                                    <View style={styles.rimInner} />
                                    {BULB_POSITIONS.map((p, i) => (
                                        <View key={i} style={[styles.bulb, { left: p.left, top: p.top }]} />
                                    ))}

                                    {/* Rotating wheel */}
                                    <Animated.View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE, transform: [{ rotate }] }}>
                                        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                                            {segments.map((s, i) => {
                                                const mid = -90 + i * step; // slice 0 is centred on 12 o'clock
                                                const start = mid - step / 2;
                                                const end = mid + step / 2;
                                                const [x1, y1] = polar(start, R);
                                                const [x2, y2] = polar(end, R);
                                                const textColor = textColorFor(s.color);
                                                const label =
                                                    s.label.length > maxLabelChars
                                                        ? `${s.label.slice(0, maxLabelChars - 1)}…`
                                                        : s.label;

                                                const rad = (mid * Math.PI) / 180;
                                                const lower = Math.sin(rad) > 0.01; // lower half: flip so text stays upright
                                                const flip = Math.cos(rad) < 0; // radial labels: left half reads left-to-right
                                                const textY = (lower ? CY + TEXT_R : CY - TEXT_R) + fontSize * 0.35;

                                                return (
                                                    <G key={String(s.id)}>
                                                        {n === 1 ? (
                                                            <Circle cx={CX} cy={CY} r={R} fill={s.color} stroke="#FFFFFF" strokeWidth="2" />
                                                        ) : (
                                                            <Path
                                                                d={`M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${step > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
                                                                fill={s.color}
                                                                stroke="#FFFFFF"
                                                                strokeWidth="2"
                                                            />
                                                        )}

                                                        {tangential ? (
                                                            <G rotation={lower ? mid - 90 : mid + 90} origin={`${CX}, ${CY}`}>
                                                                <GiftGlyph cx={CX} cy={textY - fontSize - 6} color={textColor} />
                                                                <SvgText
                                                                    x={CX}
                                                                    y={textY}
                                                                    textAnchor="middle"
                                                                    fontSize={fontSize}
                                                                    fontWeight="700"
                                                                    fill={textColor}
                                                                >
                                                                    {label}
                                                                </SvgText>
                                                            </G>
                                                        ) : (
                                                            <G rotation={flip ? mid + 180 : mid} origin={`${CX}, ${CY}`}>
                                                                <SvgText
                                                                    x={flip ? CX - (R - LABEL_INSET) : CX + (R - LABEL_INSET)}
                                                                    y={CY + fontSize * 0.35}
                                                                    textAnchor={flip ? "start" : "end"}
                                                                    fontSize={fontSize}
                                                                    fontWeight="700"
                                                                    fill={textColor}
                                                                >
                                                                    {label}
                                                                </SvgText>
                                                            </G>
                                                        )}
                                                    </G>
                                                );
                                            })}
                                        </Svg>
                                    </Animated.View>

                                    {/* Pointer */}
                                    <View style={styles.pointer} pointerEvents="none">
                                        <Svg width={34} height={40} viewBox="0 0 34 40">
                                            <Polygon points="1,1 33,1 17,38" fill="#E02424" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                                        </Svg>
                                    </View>

                                    {/* Centre SPIN button */}
                                    <TouchableOpacity
                                        style={[styles.hub, !canSpin && styles.hubDisabled]}
                                        onPress={handleSpin}
                                        disabled={!canSpin || spinning}
                                        activeOpacity={0.85}
                                    >
                                        <LinearGradient colors={["#FFE27A", "#E0B820"]} style={styles.hubInner}>
                                            {spinning ? (
                                                <ActivityIndicator size="small" color="#CC0400" />
                                            ) : (
                                                <>
                                                    <Svg width={22} height={9} viewBox="0 0 22 9">
                                                        <Path d="M3 8 L1 3 M11 7 L11 1 M19 8 L21 3" stroke="#CC0400" strokeWidth="2" strokeLinecap="round" />
                                                    </Svg>
                                                    <Text style={styles.hubText}>SPIN</Text>
                                                </>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>

                                {/* Confetti (after a win) */}
                                <Animated.View
                                    pointerEvents="none"
                                    style={[
                                        StyleSheet.absoluteFill,
                                        { opacity: confetti, transform: [{ scale: confettiScale }] },
                                    ]}
                                >
                                    {CONFETTI.map((c, i) => (
                                        <View
                                            key={i}
                                            style={{
                                                position: "absolute",
                                                top: c.top,
                                                left: c.left,
                                                width: c.w,
                                                height: c.h,
                                                backgroundColor: c.color,
                                                transform: [{ rotate: c.rot }],
                                            }}
                                        />
                                    ))}
                                </Animated.View>
                            </View>

                            {hasSpun && winner ? (
                                <>
                                    {/* Result */}
                                    <View style={styles.resultCard}>
                                        <Text style={styles.resultEmoji}>🎉</Text>
                                        <View style={styles.resultRow}>
                                            <View style={styles.resultLine} />
                                            <Text style={styles.resultLabel}>You won</Text>
                                            <View style={styles.resultLine} />
                                        </View>
                                        <Text style={styles.resultPrize} numberOfLines={2}>
                                            {winner.label}
                                        </Text>
                                    </View>

                                    <View style={styles.actionWrap}>
                                        <TouchableOpacity activeOpacity={0.85} onPress={handleViewReward} style={styles.ctaWrap}>
                                            <LinearGradient
                                                colors={["#5A4300", "#3A2E00"]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={styles.cta}
                                            >
                                                <Text style={styles.ctaText}>View Reward</Text>
                                                <Ionicons name="chevron-forward" size={scale(20)} color="#FFF" style={styles.ctaChevron} />
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.actionWrap}>
                                    <TouchableOpacity
                                        activeOpacity={0.85}
                                        onPress={handleSpin}
                                        disabled={!canSpin || spinning}
                                        style={[styles.ctaWrap, !canSpin && styles.ctaDisabled]}
                                    >
                                        <LinearGradient
                                            colors={["#5A4300", "#3A2E00"]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.cta}
                                        >
                                            {spinning ? (
                                                <ActivityIndicator size="small" color="#F5D45E" />
                                            ) : (
                                                <>
                                                    <Text style={styles.ctaText}>SPIN NOW</Text>
                                                    <Ionicons name="chevron-forward" size={scale(20)} color="#FFF" style={styles.ctaChevron} />
                                                </>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <View style={styles.hintRow}>
                                        <Ionicons name="time-outline" size={scale(16)} color="#666" />
                                        <Text style={styles.hintText}>{spinsLabel}</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    mainContent: {
        flex: 1,
        marginTop: -30,
        backgroundColor: "#F8F9FA",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: "relative",
        zIndex: 1,
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
    },
    bgCircleTop: {
        position: "absolute",
        top: -scale(70),
        right: -scale(60),
        width: scale(220),
        height: scale(220),
        borderRadius: scale(110),
        backgroundColor: "rgba(224,184,32,0.14)",
    },
    bgCircleBottom: {
        position: "absolute",
        bottom: scale(120),
        left: -scale(90),
        width: scale(200),
        height: scale(200),
        borderRadius: scale(100),
        backgroundColor: "rgba(224,184,32,0.08)",
    },
    scrollContent: {
        paddingBottom: 100,
    },
    headerSection: {
        alignItems: "center",
        paddingHorizontal: scale(20),
        paddingTop: scale(24),
        paddingBottom: scale(8),
    },
    sectionTitle: {
        fontSize: scale(24),
        fontWeight: "800",
        color: "#2B1B00",
        letterSpacing: -0.5,
        textAlign: "center",
    },
    titleUnderline: {
        width: scale(60),
        height: 3,
        backgroundColor: "#E0B820",
        borderRadius: 2,
        marginTop: scale(8),
        marginBottom: scale(12),
    },
    subtitle: {
        fontSize: scale(14),
        textAlign: "center",
        color: "#555",
        lineHeight: scale(20),
    },

    // ── Wheel ──
    wheelArea: {
        width: "100%",
        alignItems: "center",
        marginTop: scale(26),
        paddingTop: scale(10),
    },
    wheelOuter: {
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        borderRadius: OUTER_SIZE / 2,
        backgroundColor: "#C9970C",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#8A6D00",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 14,
        elevation: 8,
    },
    rimGradient: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: OUTER_SIZE / 2,
    },
    rimInner: {
        position: "absolute",
        width: WHEEL_SIZE + RIM_RING * 2,
        height: WHEEL_SIZE + RIM_RING * 2,
        borderRadius: (WHEEL_SIZE + RIM_RING * 2) / 2,
        borderWidth: RIM_RING,
        borderColor: "#8A6D00",
    },
    bulb: {
        position: "absolute",
        width: BULB_SIZE,
        height: BULB_SIZE,
        borderRadius: BULB_SIZE / 2,
        backgroundColor: "#FFF8D6",
        shadowColor: "#FFFFFF",
        shadowOpacity: 0.9,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 0 },
    },
    pointer: {
        position: "absolute",
        top: -scale(14),
        alignSelf: "center",
        zIndex: 5,
    },
    hub: {
        position: "absolute",
        width: HUB_SIZE,
        height: HUB_SIZE,
        borderRadius: HUB_SIZE / 2,
        shadowColor: "#3A2E00",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 6,
    },
    hubDisabled: {
        opacity: 0.7,
    },
    hubInner: {
        width: "100%",
        height: "100%",
        borderRadius: HUB_SIZE / 2,
        borderWidth: 3,
        borderColor: "#B8860B",
        alignItems: "center",
        justifyContent: "center",
    },
    hubText: {
        fontSize: scale(15),
        fontWeight: "900",
        color: "#CC0400",
        letterSpacing: 0.5,
        marginTop: 1,
    },

    // ── Result ──
    resultCard: {
        alignItems: "center",
        marginHorizontal: scale(20),
        marginTop: scale(22),
        paddingVertical: scale(14),
        paddingHorizontal: scale(16),
        backgroundColor: "#FFFDF3",
        borderRadius: scale(16),
        borderWidth: 2,
        borderColor: "#E0B820",
    },
    resultEmoji: {
        fontSize: scale(26),
    },
    resultRow: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "stretch",
        marginTop: scale(2),
    },
    resultLine: {
        flex: 1,
        height: 1.5,
        backgroundColor: "#E0B820",
        opacity: 0.7,
        marginHorizontal: scale(10),
    },
    resultLabel: {
        fontSize: scale(16),
        fontWeight: "600",
        color: "#2B1B00",
    },
    resultPrize: {
        fontSize: scale(30),
        fontWeight: "800",
        color: "#D0021B",
        marginTop: scale(2),
        textAlign: "center",
    },

    // ── Buttons ──
    actionWrap: {
        paddingHorizontal: scale(20),
        marginTop: scale(20),
    },
    ctaWrap: {
        borderRadius: scale(14),
        shadowColor: "#3A2E00",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    ctaDisabled: {
        opacity: 0.45,
    },
    cta: {
        height: scale(54),
        borderRadius: scale(14),
        borderWidth: 1.5,
        borderColor: "#E0B820",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    ctaText: {
        fontSize: scale(18),
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    ctaChevron: {
        position: "absolute",
        right: scale(18),
    },
    hintRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: scale(14),
    },
    hintText: {
        fontSize: scale(14),
        color: "#555",
    },

    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: scale(60),
    },
    emptyText: {
        fontSize: scale(18),
        fontWeight: "600",
        color: "#666",
        marginTop: scale(16),
    },
    emptySubtext: {
        fontSize: scale(14),
        color: "#999",
        marginTop: scale(8),
    },
});