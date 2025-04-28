import React from 'react';
import Link from 'next/link';

export default function Gamification() {
  const gamificationFeatures = [
    {
      id: 1,
      title: "Achievement Badges",
      description: "Users earn virtual badges for reaching health milestones like walking 10,000 steps, completing health assessments, or attending medical appointments.",
      category: "Rewards",
      journeys: ["Health", "Care", "Plan"]
    },
    {
      id: 2,
      title: "Health Streak System",
      description: "Encourages consistent healthy behaviors by tracking daily streaks of activity, medication adherence, or symptom logging.",
      category: "Engagement",
      journeys: ["Health", "Care"]
    },
    {
      id: 3,
      title: "Challenge Missions",
      description: "Time-limited health challenges that users can join to compete with themselves or others, such as a 30-day fitness challenge or a hydration challenge.",
      category: "Social",
      journeys: ["Health"]
    },
    {
      id: 4,
      title: "Points & Levels",
      description: "Users earn XP points for health-positive actions, advancing through levels that unlock new features and benefits.",
      category: "Progression",
      journeys: ["Health", "Care", "Plan"]
    },
    {
      id: 5,
      title: "Reward Marketplace",
      description: "Points can be redeemed for real-world rewards like premium content, discounts on health services, or wellness products.",
      category: "Rewards",
      journeys: ["Plan"]
    }
  ];

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      color: '#333'
    }}>
      <Link href="/" style={{ 
        display: 'inline-block',
        marginBottom: '1rem',
        color: '#0070f3',
        textDecoration: 'none'
      }}>
        ← Back to Home
      </Link>
      
      <h1 style={{ color: '#0070f3', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem' }}>
        Gamification Features
      </h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        The AUSTA SuperApp integrates gamification elements across all user journeys to increase 
        engagement and motivation for health-positive behaviors. These features work together to create
        a rewarding experience while helping users achieve their health goals.
      </p>
      
      <div style={{ marginTop: '2rem' }}>
        {gamificationFeatures.map(feature => (
          <div key={feature.id} style={{ 
            marginBottom: '1.5rem', 
            padding: '1.5rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '5px',
            border: '1px solid #eaeaea'
          }}>
            <h3 style={{ color: '#0070f3', marginTop: 0 }}>{feature.title}</h3>
            <p style={{ marginBottom: '1rem' }}>{feature.description}</p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ 
                backgroundColor: '#e6f7ff', 
                color: '#0070f3',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.85rem'
              }}>
                {feature.category}
              </span>
            </div>
            <div>
              <strong>Applied to journeys: </strong>
              {feature.journeys.map((journey, index) => (
                <span key={index} style={{ 
                  display: 'inline-block',
                  margin: '0 5px',
                  backgroundColor: 
                    journey === 'Health' ? '#e6ffed' : 
                    journey === 'Care' ? '#ffedf2' : '#f0f7ff',
                  color: 
                    journey === 'Health' ? '#28a745' : 
                    journey === 'Care' ? '#dc3545' : '#0070f3',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}>
                  {journey}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}