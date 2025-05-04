# Code Citations

This document contains references and attributions for third-party code used in this project.

## React Native Components - Animated Progress Bar

Source: <https://github.com/example/react-native-progress>
License: MIT License
Usage: Modified for use in the gamification module

```javascript
// Original code from react-native-progress, modified for custom animations
const AnimatedProgress = ({ progress, color }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [progress]);
  
  return (
    <View>
      <Animated.View 
        style={{ 
          width: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%']
          }),
          backgroundColor: color,
          height: 8,
          borderRadius: 4
        }}
      />
    </View>
  );
};
```markdown

## Authentication Service - JWT Helper Functions

Source: <https://github.com/auth0/node-jsonwebtoken>
License: MIT License
Usage: Adapted for our authentication service

```typescript
// Adapted from jsonwebtoken library examples
import jwt from 'jsonwebtoken';

export function generateToken(userId: string, userRole: string): string {
  return jwt.sign(
    { 
      sub: userId,
      role: userRole,
      iss: 'healthcare-super-app'
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```markdown

## Health Service - Data Visualization Utilities

Source: <https://github.com/d3/d3>
License: ISC License
Usage: Customized for health metrics visualization

```typescript
// Based on D3.js scaling functions
export function calculateMetricScale(
  values: number[], 
  minRange: number, 
  maxRange: number
): (value: number) => number {
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  return (value: number) => {
    // Handle edge cases
    if (maxValue === minValue) return (minRange + maxRange) / 2;
    
    // Linear scaling 
    return (
      ((value - minValue) / (maxValue - minValue)) * (maxRange - minRange) + minRange
    );
  };
}
```markdown

## Gamification Engine - Achievement System

Source: <https://github.com/mozilla/OpenBadges>
License: Mozilla Public License 2.0
Usage: Inspired our achievement badge system

```typescript
// Achievement verification system inspired by OpenBadges
export class AchievementVerifier {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly achievementDefinitions: AchievementDefinition[]
  ) {}

  async verifyAchievement(
    userId: string,
    achievementId: string
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    const definition = this.achievementDefinitions.find(
      d => d.id === achievementId
    );
    
    if (!user || !definition) return false;
    
    // Apply verification criteria
    return definition.criteria.every(criterion => 
      this.meetsCriterion(user, criterion)
    );
  }
  
  private meetsCriterion(user: User, criterion: AchievementCriterion): boolean {
    // Implementation details...
    return true; // Simplified for example
  }
}
```markdown

## Care Journey - Telemedicine Connection Handler

Source: <https://github.com/jitsi/lib-jitsi-meet>
License: Apache License 2.0
Usage: Modified for our telemedicine service

```javascript
// Based on Jitsi connection handling patterns
class TelemedicineSession {
  constructor(roomId) {
    this.connection = null;
    this.room = null;
    this.roomId = roomId;
    this.participants = [];
    this.localTracks = [];
  }
  
  async connect() {
    try {
      this.connection = new JitsiConnection(APP_ID, this.roomId);
      await this.connection.connect();
      
      this.room = this.connection.initJitsiConference();
      this.room.on('participantJoined', this.handleParticipantJoined);
      this.room.on('participantLeft', this.handleParticipantLeft);
      
      await this.room.join();
      
      // Initialize local tracks
      this.localTracks = await createLocalTracks();
      this.localTracks.forEach(track => this.room.addTrack(track));
      
      return true;
    } catch (error) {
      console.error('Failed to connect to telemedicine session:', error);
      return false;
    }
  }
  
  // Additional methods...
}
```markdown

## Plan Journey - Insurance API Integration

Source: <https://github.com/healthcare-apis/insurance-client>
License: MIT License
Usage: Adapted for our insurance integration

```typescript
// Adapted from healthcare-apis/insurance-client examples
export class InsuranceApiClient {
  private baseUrl: string;
  private apiKey: string;
  
  constructor(config: InsuranceApiConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
  }
  
  async getPatientCoverage(patientId: string): Promise<Coverage> {
    const response = await fetch(
      `${this.baseUrl}/patients/${patientId}/coverage`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Coverage fetch failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async submitClaim(claim: ClaimData): Promise<ClaimSubmissionResult> {
    const response = await fetch(
      `${this.baseUrl}/claims`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claim),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Claim submission failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```markdown

## Design System - Color Accessibility Functions

Source: <https://github.com/gaearon/contrast-ratio>
License: MIT License
Usage: Incorporated into our design system

```javascript
// Color contrast utility based on gaearon/contrast-ratio
export function getContrastRatio(foreground, background) {
  const luminance1 = getLuminance(foreground);
  const luminance2 = getLuminance(background);
  
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(hexColor) {
  // Convert hex to rgb
  const r = parseInt(hexColor.substr(1, 2), 16) / 255;
  const g = parseInt(hexColor.substr(3, 2), 16) / 255;
  const b = parseInt(hexColor.substr(5, 2), 16) / 255;
  
  // Calculate luminance
  const rgb = [r, g, b].map(val => {
    return val <= 0.03928
      ? val / 12.92
      : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
```markdown

## API Gateway - Request Rate Limiting

Source: <https://github.com/nfriedly/express-rate-limit>
License: MIT License
Usage: Customized for our API Gateway

```javascript
// Based on express-rate-limit implementation
function createRateLimiter(options) {
  const {
    windowMs = 60 * 1000, // 1 minute by default
    maxRequests = 100,    // 100 requests per windowMs by default
    message = 'Too many requests, please try again later.',
    statusCode = 429,     // Too Many Requests
    keyGenerator = (req) => req.ip,
    skip = () => false
  } = options;
  
  const store = new Map();
  
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now - value.timestamp > windowMs) {
        store.delete(key);
      }
    }
  }, windowMs);
  
  cleanup.unref();
  
  return function rateLimit(req, res, next) {
    if (skip(req)) return next();
    
    const key = keyGenerator(req);
    const now = Date.now();
    
    if (!store.has(key)) {
      store.set(key, {
        count: 1,
        timestamp: now
      });
      return next();
    }
    
    const record = store.get(key);
    
    if (now - record.timestamp > windowMs) {
      // Reset if the window has passed
      record.count = 1;
      record.timestamp = now;
      return next();
    }
    
    record.count += 1;
    
    if (record.count > maxRequests) {
      return res.status(statusCode).json({
        message,
        retryAfter: Math.ceil((windowMs - (now - record.timestamp)) / 1000)
      });
    }
    
    return next();
  };
}
```markdown
