import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking
} from 'react-native';
import {
  Sparkles,
  Send,
  ArrowLeft,
  Trash2,
  MapPin,
  CalendarCheck,
  Package,
  PhoneCall,
  Shield,
  HelpCircle,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Navigation
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';
import { useNavigation as useCampusNavigation } from '../context/NavigationContext';
import { getAllSelectableLocations } from '../services/mapEngine/locationService';

const INITIAL_MESSAGE = {
  id: 'init_1',
  sender: 'ai',
  text: `👋 Hello! I am the **BIT Smart Campus AI Assistant**, powered by the official campus knowledge base.\n\nYou can ask me anything about:\n• 🗺️ **Navigation & Roads:** Finding buildings, labs, gates, and Dijkstra paths\n• 🔬 **Academic Labs:** AI Lab with GPU clusters, Wind Tunnel, HPC\n• 📅 **Booking Policies:** 15-min grace periods, QR passes, cancellation rules\n• 💻 **Asset Hub:** MacBook Pro M3, Meta Quest 3 VR, DJI Mavic Drone\n• 🚨 **Safety & Emergency:** 24/7 SOS, Medical Clinic, ambulance hotline`,
  sources: [
    {
      id: 'src_init',
      title: 'BIT Smart Campus Knowledge Base Index',
      sourceFile: 'campus_knowledge_base',
      category: 'System'
    }
  ],
  suggestedActions: [
    { type: 'navigate', label: 'Explore Campus Map', destination: 'Map' }
  ],
  suggestedFollowUps: [
    'Where is the AI Lab located?',
    'What are the hostel curfew hours?',
    'What is the booking grace period?'
  ],
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export const ChatbotScreen = ({ route, navigation }) => {
  const initialQuery = route?.params?.initialQuery || '';
  const { sourceBuilding, setSourceBuilding, setDestBuilding, calculateRoute, navMode } = useCampusNavigation();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const [expandedSourceId, setExpandedSourceId] = useState(null);
  const scrollViewRef = useRef(null);
  const lastPresetDestinationRef = useRef(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      const prompts = await apiService.getChatSuggestedPrompts();
      setSuggestedPrompts(prompts);
    };
    loadSuggestions();

    // If navigated with an initial query, fire it automatically
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    // Check if user is answering affirmatively to explore reaching the destination
    const isAffirmative = /^(yes|sure|explore|yeah|yep|yup|ok|okay|how to reach|how to go|take me there|navigate|directions|lets go|let's go|show route|open map)/i.test(query);
    if (isAffirmative && lastPresetDestinationRef.current) {
      const dest = lastPresetDestinationRef.current;
      const userMsg = {
        id: 'usr_' + Date.now(),
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: `🗺️ **Navigation Launched!** Opening turn-by-turn route to **${dest.name}**...`,
        sources: [],
        suggestedActions: [
          { type: 'navigate', label: `🚀 Launch Navigation to ${dest.name}`, destination: dest.id, placeName: dest.name }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setInputQuery('');
      setTimeout(() => {
        handleAction({ type: 'navigate', destination: dest.id, placeName: dest.name });
      }, 500);
      return;
    }

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      // Build conversation history for multi-turn context
      const history = messages.slice(-4).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text
      }));

      const res = await apiService.sendChatMessage(query, history);

      // Automatically preset location as destination in NavigationContext
      const allLocs = getAllSelectableLocations();
      const navAction = res.suggestedActions?.find(a => a.type === 'navigate');
      const targetCode = res.targetLocation?.destination || navAction?.destination;
      const targetName = res.targetLocation?.name || navAction?.placeName;

      if (targetCode || targetName) {
        const targetStr = String(targetCode || '').toLowerCase();
        const nameStr = String(targetName || '').toLowerCase();
        let matched = allLocs.find(l =>
          (targetStr && l.id && String(l.id).toLowerCase() === targetStr) ||
          (targetStr && l.code && String(l.code).toLowerCase() === targetStr) ||
          (nameStr && l.name && l.name.toLowerCase().includes(nameStr)) ||
          (nameStr && l.roomOnlyName && l.roomOnlyName.toLowerCase().includes(nameStr))
        );

        if (!matched && targetStr) {
          if (targetStr.includes('ai') || targetStr.includes('sf')) matched = allLocs.find(l => l.id === 'sf-block-labs');
          else if (targetStr.includes('ib')) matched = allLocs.find(l => l.id === 'ib-block');
          else if (targetStr.includes('lib')) matched = allLocs.find(l => l.id === 'library');
          else if (targetStr.includes('medic')) matched = allLocs.find(l => l.id === 'medical-centre');
          else if (targetStr.includes('canteen') || targetStr.includes('caf')) matched = allLocs.find(l => l.id === 'canteen');
          else if (targetStr.includes('hostel')) matched = allLocs.find(l => l.id?.includes('hostel'));
          else if (targetStr.includes('audi')) matched = allLocs.find(l => l.id === 'auditorium');
          else if (targetStr.includes('mech')) matched = allLocs.find(l => l.id === 'mechanical-block');
          else if (targetStr.includes('aero')) matched = allLocs.find(l => l.id === 'aero-block');
        }

        if (matched) {
          setDestBuilding(matched);
          const start = sourceBuilding || allLocs.find(l => l.id === 'main-gate') || allLocs[0];
          if (calculateRoute) {
            calculateRoute(start, matched, navMode);
          }
          lastPresetDestinationRef.current = matched;
        }
      }

      const aiMsg = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: res.answer,
        targetLocation: res.targetLocation,
        sources: res.sources || [],
        suggestedActions: res.suggestedActions || [],
        suggestedFollowUps: res.suggestedFollowUps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg = {
        id: 'ai_err_' + Date.now(),
        sender: 'ai',
        text: 'Sorry, I encountered an issue accessing the knowledge base. Please try asking again or reach out to the Campus Desk at Ext 6000.',
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleAction = (action) => {
    if (!action) return;
    if (action.type === 'navigate') {
      const allLocs = getAllSelectableLocations();
      const rawTarget = action.destination || action.target || 'sf-block-labs';
      const targetStr = String(rawTarget).toLowerCase();

      // Match destination against calibrated road network
      let matched = allLocs.find(
        (l) => (l.id && String(l.id).toLowerCase() === targetStr) ||
               (l.code && String(l.code).toLowerCase() === targetStr) ||
               (l.roomId && String(l.roomId).toLowerCase() === targetStr) ||
               (l.name && l.name.toLowerCase().includes(targetStr)) ||
               (l.roomOnlyName && l.roomOnlyName.toLowerCase().includes(targetStr))
      );

      if (!matched) {
        if (targetStr.includes('sf') || targetStr.includes('ai') || targetStr.includes('computer')) {
          matched = allLocs.find(l => l.id === 'sf-block-labs') || allLocs[1];
        } else if (targetStr.includes('ib') || targetStr.includes('institution')) {
          matched = allLocs.find(l => l.id === 'ib-block') || allLocs[1];
        } else if (targetStr.includes('mech')) {
          matched = allLocs.find(l => l.id === 'mechanical-block') || allLocs[1];
        } else if (targetStr.includes('aero')) {
          matched = allLocs.find(l => l.id === 'aero-block') || allLocs[1];
        } else if (targetStr.includes('lib') || targetStr.includes('learning')) {
          matched = allLocs.find(l => l.id === 'library') || allLocs[1];
        } else if (targetStr.includes('audi') || targetStr.includes('vedha')) {
          matched = allLocs.find(l => l.id === 'auditorium') || allLocs[1];
        } else if (targetStr.includes('medic') || targetStr.includes('doctor') || targetStr.includes('clinic')) {
          matched = allLocs.find(l => l.id === 'medical-centre') || allLocs[1];
        } else if (targetStr.includes('caf') || targetStr.includes('canteen') || targetStr.includes('food')) {
          matched = allLocs.find(l => l.id === 'canteen') || allLocs[1];
        } else if (targetStr.includes('hostel')) {
          matched = allLocs.find(l => l.id?.includes('hostel')) || allLocs[1];
        } else {
          matched = allLocs.find(l => l.id === 'sf-block-labs') || allLocs[1];
        }
      }

      const start = sourceBuilding || allLocs.find(l => l.id === 'main-gate') || allLocs[0];
      if (matched) {
        setDestBuilding(matched);
        if (calculateRoute) {
          calculateRoute(start, matched, navMode);
        }
      }

      // Direct redirect to turn-by-turn Navigation Screen with preset destination
      navigation.navigate('Navigation', {
        destCode: matched?.id || rawTarget,
        destination: matched?.name || rawTarget
      });
    } else if (action.type === 'book') {
      navigation.navigate('MainTabs', { screen: 'Bookings' });
    } else if (action.type === 'emergency') {
      Linking.openURL(`tel:${action.phone || '6000'}`).catch(() => {});
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  const toggleSourceExpand = (sourceId) => {
    setExpandedSourceId((prev) => (prev === sourceId ? null : sourceId));
  };

  // Render text with simple bold and bullet styling
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const isHeader = line.trim().startsWith('#');
      
      // Clean up markdown markers for presentation
      let displayLine = line.replace(/^#+\s*/, '');
      
      // Highlight bold parts
      const parts = displayLine.split(/(\*\*.*?\*\*|`.*?`)/g);

      return (
        <Text
          key={idx}
          style={[
            styles.messageText,
            isBullet && styles.bulletLine,
            isHeader && styles.headerLine
          ]}
        >
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <Text key={pIdx} style={styles.boldText}>
                  {part.slice(2, -2)}
                </Text>
              );
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <Text key={pIdx} style={styles.codePill}>
                  {` ${part.slice(1, -1)} `}
                </Text>
              );
            }
            return part;
          })}
        </Text>
      );
    });
  };

  const MainWrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const wrapperProps = Platform.OS === 'ios' 
    ? { behavior: 'padding', style: styles.keyboardContainer }
    : { style: styles.keyboardContainer };

  return (
    <SafeAreaView style={styles.safeArea}>
      <MainWrapper {...wrapperProps}>
        {/* Chatbot Top Header */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <ArrowLeft size={18} color={colors.primary} />
            </TouchableOpacity>
            
            <View style={styles.avatarBadge}>
              <Sparkles size={16} color={colors.primary} />
            </View>

            <View>
              <View style={styles.titleRow}>
                <Text style={styles.headerTitle}>Campus AI Assistant</Text>
                <Badge variant="primary" size="sm">RAG</Badge>
              </View>
              <Text style={styles.headerSubtitle}>Grounded in Campus Knowledge Base</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearChat}
            title="Clear conversation"
          >
            <Trash2 size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Quick Suggestion Pills */}
        <View style={styles.suggestedBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedContent}
          >
            {suggestedPrompts.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.promptPill}
                onPress={() => handleSendMessage(p.label)}
                disabled={loading}
              >
                <Sparkles size={11} color={colors.primary} />
                <Text style={styles.promptPillText}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Thread */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          onContentSizeChange={() => {
            if (scrollViewRef.current && typeof scrollViewRef.current.scrollToEnd === 'function') {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            if (isUser) {
              return (
                <View key={msg.id} style={styles.userMessageRow}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userMessageText}>{msg.text}</Text>
                    <Text style={styles.userTimestamp}>{msg.timestamp}</Text>
                  </View>
                </View>
              );
            }

            return (
              <View key={msg.id} style={styles.aiMessageRow}>
                <View style={styles.aiAvatar}>
                  <Sparkles size={14} color={colors.primary} />
                </View>

                <View style={styles.aiBubbleContainer}>
                  <GlassCard style={styles.aiBubble} glow>
                    {renderFormattedText(msg.text)}

                    {/* Sources Citation Section */}
                    {msg.sources && msg.sources.length > 0 && (
                      <View style={styles.sourcesSection}>
                        <Text style={styles.sourcesHeader}>
                          <FileText size={11} color={colors.primary} /> KNOWLEDGE SOURCES:
                        </Text>
                        <View style={styles.sourcesTagsWrap}>
                          {msg.sources.map((src, sIdx) => {
                            const isExpanded = expandedSourceId === `${msg.id}_${sIdx}`;
                            return (
                              <View key={sIdx} style={styles.sourceTagBlock}>
                                <TouchableOpacity
                                  style={styles.sourceTag}
                                  onPress={() => toggleSourceExpand(`${msg.id}_${sIdx}`)}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.sourceTagText} numberOfLines={1}>
                                    📄 {src.sourceFile || src.title}
                                  </Text>
                                  {src.snippet ? (
                                    isExpanded ? (
                                      <ChevronUp size={11} color={colors.primary} />
                                    ) : (
                                      <ChevronDown size={11} color={colors.textMuted} />
                                    )
                                  ) : null}
                                </TouchableOpacity>

                                {isExpanded && src.snippet && (
                                  <View style={styles.sourceSnippetBox}>
                                    <Text style={styles.sourceSnippetTitle}>
                                      {src.title} ({src.category})
                                    </Text>
                                    <Text style={styles.sourceSnippetText}>
                                      "{src.snippet}"
                                    </Text>
                                  </View>
                                )}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    {/* Dedicated Explore Destination Card if Navigation Target Detected */}
                    {(() => {
                      const navAct = msg.suggestedActions?.find(a => a.type === 'navigate');
                      if (!navAct) return null;
                      const placeTitle = navAct.placeName || msg.targetLocation?.name || navAct.destination;
                      return (
                        <View style={styles.exploreBanner}>
                          <View style={styles.exploreBannerHeader}>
                            <View style={styles.exploreBadgeIcon}>
                              <Navigation size={14} color="#070B14" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.explorePretitle}>📍 DESTINATION PRESET ON MAP</Text>
                              <Text style={styles.explorePlaceTitle} numberOfLines={1}>{placeTitle}</Text>
                            </View>
                          </View>
                          <Text style={styles.explorePromptText}>
                            Destination is set! Would you like to explore how to reach there?
                          </Text>
                          <TouchableOpacity
                            style={styles.exploreActionBtn}
                            onPress={() => handleAction(navAct)}
                            activeOpacity={0.85}
                          >
                            <Navigation size={14} color="#070B14" />
                            <Text style={styles.exploreActionBtnText}>Explore Route Now ↗</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })()}

                    {/* Other Action Buttons (Bookings, Emergency) */}
                    {msg.suggestedActions && msg.suggestedActions.filter(a => a.type !== 'navigate').length > 0 && (
                      <View style={styles.actionsRow}>
                        {msg.suggestedActions.filter(a => a.type !== 'navigate').map((act, aIdx) => (
                          <TouchableOpacity
                            key={aIdx}
                            style={styles.actionBtn}
                            onPress={() => handleAction(act)}
                          >
                            {act.type === 'book' && <CalendarCheck size={13} color={colors.white} />}
                            {act.type === 'emergency' && <Shield size={13} color={colors.danger} />}
                            <Text style={styles.actionBtnText}>{act.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {/* Follow-up Question Chips */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <View style={styles.followUpsWrap}>
                        <Text style={styles.followUpsHeading}>Suggested Follow-Ups:</Text>
                        {msg.suggestedFollowUps.map((q, qIdx) => (
                          <TouchableOpacity
                            key={qIdx}
                            style={styles.followUpChip}
                            onPress={() => handleSendMessage(q)}
                            disabled={loading}
                          >
                            <Text style={styles.followUpChipText}>↳ {q}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    <Text style={styles.aiTimestamp}>{msg.timestamp}</Text>
                  </GlassCard>
                </View>
              </View>
            );
          })}

          {/* Typing / Loading Indicator */}
          {loading && (
            <View style={styles.loadingRow}>
              <View style={styles.aiAvatar}>
                <Sparkles size={14} color={colors.primary} />
              </View>
              <GlassCard style={styles.loadingCard}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Synthesizing from campus knowledge base...</Text>
              </GlassCard>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask anything about buildings, labs, curfews, rules..."
            placeholderTextColor={colors.textMuted}
            value={inputQuery}
            onChangeText={setInputQuery}
            onSubmitEditing={() => handleSendMessage()}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputQuery.trim() || loading) && styles.sendButtonDisabled]}
            onPress={() => handleSendMessage()}
            disabled={!inputQuery.trim() || loading}
          >
            <Send size={16} color={inputQuery.trim() && !loading ? colors.white : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </MainWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
    maxHeight: Platform.OS === 'web' ? '100vh' : undefined,
    backgroundColor: colors.background,
    overflow: 'hidden'
  },
  keyboardContainer: {
    flex: 1,
    height: '100%',
    minHeight: 0,
    overflow: 'hidden'
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)',
    backgroundColor: 'rgba(7, 11, 20, 0.96)'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: colors.cardBorderGlow,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1
  },
  clearButton: {
    padding: 8
  },
  suggestedBar: {
    backgroundColor: 'rgba(11, 15, 25, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
    paddingVertical: 8
  },
  suggestedContent: {
    paddingHorizontal: 16,
    gap: 8
  },
  promptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)'
  },
  promptPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },
  messagesContainer: {
    flex: 1,
    minHeight: 0,
    ...(Platform.OS === 'web' ? { overflowY: 'auto' } : {})
  },
  messagesContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 24,
    flexGrow: 1
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  userBubble: {
    maxWidth: '82%',
    backgroundColor: colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)'
  },
  userMessageText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18
  },
  userTimestamp: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'flex-end',
    marginTop: 4
  },
  aiMessageRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start'
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  aiBubbleContainer: {
    flex: 1
  },
  aiBubble: {
    padding: 14,
    borderRadius: 16,
    borderBottomLeftRadius: 4
  },
  messageText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4
  },
  boldText: {
    fontWeight: '800',
    color: colors.text
  },
  codePill: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: colors.primary,
    fontWeight: '700'
  },
  bulletLine: {
    marginLeft: 4
  },
  headerLine: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 4,
    marginBottom: 6
  },
  sourcesSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)'
  },
  sourcesHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 6
  },
  sourcesTagsWrap: {
    gap: 6
  },
  sourceTagBlock: {
    width: '100%'
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)'
  },
  sourceTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
    marginRight: 6
  },
  sourceSnippetBox: {
    backgroundColor: 'rgba(11, 15, 25, 0.85)',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary
  },
  sourceSnippetTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2
  },
  sourceSnippetText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 14
  },
  exploreBanner: {
    marginTop: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(6, 182, 212, 0.45)',
    padding: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 4px 20px rgba(6, 182, 212, 0.2)' }
      : { elevation: 3 })
  },
  exploreBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  exploreBadgeIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  explorePretitle: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 0.8
  },
  explorePlaceTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text
  },
  explorePromptText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    lineHeight: 16
  },
  exploreActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 2px 10px rgba(6, 182, 212, 0.4)' }
      : { elevation: 3 })
  },
  exploreActionBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#070B14'
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.25)',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white
  },
  followUpsWrap: {
    marginTop: 12,
    gap: 6
  },
  followUpsHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted
  },
  followUpChip: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  followUpChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary
  },
  aiTimestamp: {
    fontSize: 9,
    color: colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 8
  },
  loadingRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14
  },
  loadingText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(7, 11, 20, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
    gap: 10,
    flexShrink: 0,
    zIndex: 20
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 13
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryGlow
  },
  sendButtonDisabled: {
    backgroundColor: colors.cardBgLight,
    borderColor: 'transparent'
  }
});
