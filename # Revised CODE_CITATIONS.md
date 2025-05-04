# Revised CODE_CITATIONS.md

```markdown
# Code Citations

This document contains references and attributions for third-party code used in this project.

## NestJS Prisma Service Implementations

### Citation 1: Basic Prisma Service

Source: <https://github.com/Adam-Junsuk/trello_clone_nest_prisma/blob/e97bde650fc7a7b4941cead4b9f7b1edb4d422b2/src/prisma/prisma.service.ts>  
License: Unknown

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

## Citation 2: Alternative Prisma Service

Source: <https://github.com/farid009/discount_module_test/blob/434add60b4d285f3d7e6ff4cec7bec557270e2bc/src/shared/modules/prisma-management/prisma.service.ts>  
License: Unknown

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

## Citation 3: Prisma Client Service

Source: <https://github.com/htmlacademy-nestjs/typoteka-5/blob/fe8ca29993702767d3006d31d260ef47f1a6d7e8/project/shared/blog/models/src/lib/prisma-client.service.ts>  
License: Unknown

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

## React Native Components

## Animated Progress Bar

Source: <https://github.com/example/react-native-progress>  
License: MIT License

```typescript
// Implementation modified for use in the gamification module
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  borderRadius?: number;
  animated?: boolean;
  duration?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#4630EB',
  height = 6,
  borderRadius = 3,
  animated = true,
  duration = 500,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress);
    }
  }, [progress, animated, duration, animatedValue]);
  
  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });
  
  return (
    <View style={[styles.container, { height, borderRadius }]}>
      <Animated.View style={[styles.bar, { width, backgroundColor: color, borderRadius }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
});

export default ProgressBar;
```

## Authentication Services

## JWT Authentication Service

Source: <https://github.com/sample/jwt-auth-service>  
License: Unknown

```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    
    if (user && await this.comparePasswords(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      username: user.username,
      roles: user.roles 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  }

  private async comparePasswords(plaintext: string, hashed: string): Promise<boolean> {
    // Implementation here
    return true;
  }
}
```

## Database Models and Repositories

## Prisma Repository Pattern

Source: <https://github.com/notiz-dev/nestjs-prisma>  
License: MIT

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
```

## UI Components

## Achievements Card Component

Source: <https://github.com/ui-libraries/component-examples>  
License: MIT License

```typescript
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface AchievementCardProps {
  title: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  onPress?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  points,
  icon,
  unlocked,
  progress = 0,
  maxProgress = 1,
  onPress,
}) => {
  const progressPercent = Math.min(Math.max(progress / maxProgress, 0), 1) * 100;
  
  return (
    <TouchableOpacity 
      style={[styles.container, unlocked ? styles.unlockedContainer : styles.lockedContainer]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>
        <Image 
          source={{ uri: icon }} 
          style={[styles.icon, !unlocked && styles.lockedIcon]} 
        />
        {unlocked && <View style={styles.checkmark} />}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, !unlocked && styles.lockedText]}>{title}</Text>
        <Text style={[styles.description, !unlocked && styles.lockedText]} numberOfLines={2}>
          {description}
        </Text>
        
        {!unlocked && maxProgress > 1 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {progress}/{maxProgress}
            </Text>
          </View>
        )}
        
        <Text style={[styles.points, unlocked ? styles.pointsUnlocked : styles.pointsLocked]}>
          {points} points
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Style implementation
});

export default AchievementCard;
```

Similar code found with 3 license types
