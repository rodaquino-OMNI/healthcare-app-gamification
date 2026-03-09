import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
// AgoraRendererView — stub for web build (React Native only)
const AgoraRendererView = (_props: {
    uid?: number;
    style?: React.CSSProperties;
    canvas?: { uid: number; renderMode?: number; mirrorMode?: number };
}): null => null;
// useJourney — stub for web build
const useJourney = (): { journey: 'care' } => ({ journey: 'care' as const });

import {
    VideoContainer,
    LocalVideoContainer,
    RemoteVideoContainer,
    ControlsContainer,
    CallButton,
    StatusIndicator,
    ProviderInfoContainer,
    ConnectionQualityIndicator,
} from './VideoConsultation.styles';
import { Box } from '../../primitives/Box/Box';
import { Icon } from '../../primitives/Icon/Icon';
import { Text } from '../../primitives/Text/Text';
import { colors } from '../../tokens/colors';
import { sizing } from '../../tokens/sizing';

/**
 * VideoConsultation component for the Care Now journey
 *
 * This component provides the user interface for telemedicine video consultations,
 * including video feeds, call controls, and status indicators.
 */
const VideoConsultation: React.FC = () => {
    // Get route parameters, navigation, and journey context
    const route = useRoute();
    const navigation = useNavigation();
    const { journey: _journey } = useJourney();

    // Extract consultation parameters from route
    const params = (route.params || {}) as {
        sessionId?: string;
        channelName?: string;
        token?: string;
        providerId?: string;
        providerName?: string;
        providerSpecialty?: string;
        providerAvatar?: string;
    };
    const {
        sessionId,
        channelName,
        token,
        providerId: _providerId,
        providerName = 'Dr. Silva',
        providerSpecialty = 'Cardiologista',
        providerAvatar,
    } = params;

    // Video call state
    const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
    const [audioMuted, setAudioMuted] = useState(false);
    const [remoteVideoConnected, setRemoteVideoConnected] = useState(false);
    const [remoteUid, setRemoteUid] = useState<number | null>(null);
    const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'disconnected'>(
        'connecting'
    );
    const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');

    // Provider information state
    const [provider, _setProvider] = useState({
        name: providerName,
        specialty: providerSpecialty,
        avatar: providerAvatar,
    });

    // Call duration tracking
    const [sessionDuration, setSessionDuration] = useState(0);
    const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Reference to Agora engine instance
    const engineRef = useRef<any>(null);

    // Initialize video call session
    useEffect(() => {
        // Initialize Agora RTC engine and join the channel
        const initializeAgoraEngine = (): (() => void) | undefined => {
            try {
                // This would initialize the actual Agora RTC engine in production
                // and join the channel using the provided token and channel name

                // Set call status to connecting
                setCallStatus('connecting');

                // Simulate connection process for demonstration
                const connectionTimeout = setTimeout(() => {
                    setCallStatus('connected');
                    setRemoteVideoConnected(true);
                    setRemoteUid(1001); // Simulate remote user joining
                }, 2000);

                return () => clearTimeout(connectionTimeout);
            } catch (error) {
                console.error('Failed to initialize Agora engine:', error);
                setCallStatus('disconnected');
                return undefined;
            }
        };

        // Start session timer
        sessionTimerRef.current = setInterval(() => {
            setSessionDuration((prev) => prev + 1);
        }, 1000);

        // Simulate connection quality changes periodically
        const qualityInterval = setInterval(() => {
            const qualities = ['excellent', 'good', 'fair', 'poor'] as const;
            // Weighted towards better quality
            const weights = [0.4, 0.3, 0.2, 0.1];
            const random = Math.random();
            let cumulativeWeight = 0;
            let selectedIndex = 0;

            for (let i = 0; i < weights.length; i++) {
                cumulativeWeight += weights[i];
                if (random <= cumulativeWeight) {
                    selectedIndex = i;
                    break;
                }
            }

            setConnectionQuality(qualities[selectedIndex]);
        }, 10000);

        // Initialize Agora engine and join channel
        void initializeAgoraEngine();

        // Cleanup on component unmount
        return () => {
            // Clear intervals
            if (sessionTimerRef.current) {
                clearInterval(sessionTimerRef.current);
            }
            clearInterval(qualityInterval);

            // In a production implementation, this would leave the channel and clean up the Agora engine
            if (engineRef.current) {
                // engineRef.current.leaveChannel();
                // engineRef.current.destroy();
            }
        };
    }, [sessionId, channelName, token]);

    // Format the session duration as mm:ss
    const formatDuration = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, []);

    // Toggle local video
    const toggleVideo = useCallback((): void => {
        // In a production implementation, this would call the Agora SDK to enable/disable video
        // engineRef.current?.muteLocalVideoStream(!localVideoEnabled);
        setLocalVideoEnabled((prev) => !prev);
    }, [localVideoEnabled]);

    // Toggle audio mute
    const toggleAudio = useCallback((): void => {
        // In a production implementation, this would call the Agora SDK to mute/unmute audio
        // engineRef.current?.muteLocalAudioStream(!audioMuted);
        setAudioMuted((prev) => !prev);
    }, [audioMuted]);

    // End the call
    const endCall = useCallback((): void => {
        // In a production implementation, this would leave the channel and clean up resources
        // engineRef.current?.leaveChannel();

        // Navigate back or to call summary
        navigation.goBack();
    }, [navigation]);

    return (
        <VideoContainer>
            {/* Connection status indicator */}
            <StatusIndicator status={callStatus}>
                {callStatus === 'connecting' && 'Conectando...'}
                {callStatus === 'connected' && 'Conectado'}
                {callStatus === 'reconnecting' && 'Reconectando...'}
                {callStatus === 'disconnected' && 'Desconectado'}
            </StatusIndicator>

            {/* Provider information */}
            <ProviderInfoContainer>
                {provider.avatar && <img src={provider.avatar} alt={provider.name} />}
                <div>
                    <Text fontWeight="medium" color="white">
                        {provider.name}
                    </Text>
                    <Text fontSize="sm" color="white">
                        {provider.specialty}
                    </Text>
                    <Text fontSize="xs" color="white">
                        Duração: {formatDuration(sessionDuration)}
                    </Text>
                </div>
            </ProviderInfoContainer>

            {/* Remote video (provider's camera) */}
            <RemoteVideoContainer>
                {remoteVideoConnected && remoteUid ? (
                    // In a production implementation, this would display the remote video stream
                    <AgoraRendererView
                        style={{ width: '100%', height: '100%' }}
                        canvas={{
                            uid: remoteUid,
                            renderMode: 1, // FIT mode
                            mirrorMode: 0, // No mirroring for remote view
                        }}
                    />
                ) : (
                    // Waiting for provider to join
                    <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                        <Icon name="doctor" size={sizing.component.xl} color={colors.neutral.white} />
                        <Text color="white" fontSize="lg" marginTop="md">
                            {callStatus === 'connecting' ? 'Aguardando médico...' : 'Médico desconectado'}
                        </Text>
                    </Box>
                )}
            </RemoteVideoContainer>

            {/* Local video (user's camera) */}
            {localVideoEnabled && (
                <LocalVideoContainer>
                    <AgoraRendererView
                        style={{ width: '100%', height: '100%' }}
                        canvas={{
                            uid: 0, // Local user has uid 0
                            renderMode: 1, // FIT mode
                            mirrorMode: 1, // Mirror mode for local view (selfie mode)
                        }}
                    />
                </LocalVideoContainer>
            )}

            {/* Connection quality indicator */}
            <ConnectionQualityIndicator quality={connectionQuality}>
                <div className="bars">
                    <div className="bar bar-1"></div>
                    <div className="bar bar-2"></div>
                    <div className="bar bar-3"></div>
                    <div className="bar bar-4"></div>
                </div>
                {connectionQuality === 'excellent' && 'Excelente'}
                {connectionQuality === 'good' && 'Boa'}
                {connectionQuality === 'fair' && 'Média'}
                {connectionQuality === 'poor' && 'Ruim'}
            </ConnectionQualityIndicator>

            {/* Call control buttons */}
            <ControlsContainer>
                {/* Audio mute/unmute button */}
                <CallButton
                    variant={audioMuted ? 'muted' : 'unmuted'}
                    onClick={toggleAudio}
                    aria-label={audioMuted ? 'Ativar microfone' : 'Desativar microfone'}
                >
                    <Icon
                        name={audioMuted ? 'error' : 'info'} // These would be proper mic icons in production
                        color="white"
                        size={sizing.icon.md}
                        aria-hidden={true}
                    />
                </CallButton>

                {/* Video enable/disable button */}
                <CallButton
                    variant={localVideoEnabled ? 'unmuted' : 'muted'}
                    onClick={toggleVideo}
                    aria-label={localVideoEnabled ? 'Desativar câmera' : 'Ativar câmera'}
                >
                    <Icon
                        name={localVideoEnabled ? 'video' : 'error'} // These would be proper camera icons in production
                        color="white"
                        size={sizing.icon.md}
                        aria-hidden={true}
                    />
                </CallButton>

                {/* End call button */}
                <CallButton variant="danger" onClick={endCall} aria-label="Encerrar chamada">
                    <Icon name="close" color="white" size={sizing.icon.md} aria-hidden={true} />
                </CallButton>
            </ControlsContainer>
        </VideoContainer>
    );
};

export default VideoConsultation;
