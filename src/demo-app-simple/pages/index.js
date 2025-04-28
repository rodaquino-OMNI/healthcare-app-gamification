import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      color: '#333'
    }}>
      <h1 style={{ color: '#0070f3', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem' }}>
        AUSTA SuperApp - Demo
      </h1>
      
      <h2 style={{ marginTop: '2rem' }}>Healthcare SuperApp with Gamification</h2>
      
      <div style={{ marginTop: '1.5rem' }}>
        <h3>Main User Journeys:</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>
            <strong>My Health (Minha Saúde)</strong> - Health metrics dashboard, medical history, goals tracking
          </li>
          <li>
            <strong>Care Now (Cuidar-me Agora)</strong> - Symptom checker, appointments, telemedicine
          </li>
          <li>
            <strong>My Plan & Benefits (Meu Plano & Benefícios)</strong> - Coverage information, claims, cost simulator
          </li>
        </ul>
      </div>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#f0f7ff', 
        borderRadius: '5px',
        border: '1px solid #cce5ff'
      }}>
        <h3 style={{ color: '#0070f3', marginTop: 0 }}>Gamification Features</h3>
        <ul style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          <li>Achievement badges and notifications</li>
          <li>Progress tracking for health goals</li>
          <li>XP and level system</li>
          <li>Rewards for completing actions</li>
        </ul>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/gamification" style={{ 
            display: 'inline-block',
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            View Gamification Details
          </Link>
          <Link href="/quests" style={{ 
            display: 'inline-block',
            backgroundColor: 'white',
            color: '#0070f3',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            border: '1px solid #0070f3'
          }}>
            Explore Quests & Challenges
          </Link>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Technical Architecture:</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li>Frontend: Next.js (Web) and React Native (Mobile)</li>
          <li>Backend: NestJS Microservices</li>
          <li>Database: PostgreSQL with Prisma ORM</li>
          <li>Message Broker: Kafka for event-driven architecture</li>
          <li>Caching: Redis for performance optimization</li>
        </ul>
      </div>
    </div>
  );
}