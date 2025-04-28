import React from 'react';
import Link from 'next/link';

export default function Quests() {
  const activeQuests = [
    {
      id: 'q1',
      title: "Step Master",
      description: "Complete 10,000 steps in a single day",
      journey: "Health",
      progress: 65,
      xpReward: 100,
      deadline: "2025-05-05"
    },
    {
      id: 'q2',
      title: "Medication Adherence",
      description: "Take all prescribed medications on time for 7 consecutive days",
      journey: "Care",
      progress: 43,
      xpReward: 150,
      deadline: "2025-05-10"
    },
    {
      id: 'q3',
      title: "Health Check Pioneer",
      description: "Complete your annual preventive health check",
      journey: "Plan",
      progress: 10,
      xpReward: 200,
      deadline: "2025-06-15"
    }
  ];

  const availableQuests = [
    {
      id: 'q4',
      title: "Hydration Hero",
      description: "Log 8 glasses of water daily for 5 consecutive days",
      journey: "Health",
      difficulty: "Easy",
      xpReward: 75
    },
    {
      id: 'q5',
      title: "Sleep Cycle Master",
      description: "Maintain a consistent sleep schedule for one week",
      journey: "Health",
      difficulty: "Medium",
      xpReward: 125
    },
    {
      id: 'q6',
      title: "Nutrition Tracker",
      description: "Log your meals for 10 consecutive days",
      journey: "Health",
      difficulty: "Medium",
      xpReward: 100
    }
  ];

  const getProgressColor = (progress) => {
    if (progress < 30) return '#ff4d4f';
    if (progress < 70) return '#faad14';
    return '#52c41a';
  };

  const getJourneyColor = (journey) => {
    switch (journey) {
      case 'Health': return { bg: '#e6ffed', text: '#28a745' };
      case 'Care': return { bg: '#ffedf2', text: '#dc3545' };
      case 'Plan': return { bg: '#f0f7ff', text: '#0070f3' };
      default: return { bg: '#f0f0f0', text: '#333333' };
    }
  };

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
        Quests & Challenges
      </h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
        Quests are time-limited challenges that encourage healthy behaviors and help users earn 
        rewards while improving their health outcomes. Complete quests to earn XP and unlock achievements.
      </p>
      
      <h2 style={{ marginTop: '2rem', color: '#555' }}>Active Quests</h2>
      <div style={{ marginTop: '1rem' }}>
        {activeQuests.map(quest => {
          const journeyStyle = getJourneyColor(quest.journey);
          return (
            <div key={quest.id} style={{ 
              marginBottom: '1.5rem', 
              padding: '1.5rem',
              backgroundColor: '#fff',
              borderRadius: '5px',
              border: '1px solid #eaeaea',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#333', marginTop: 0 }}>{quest.title}</h3>
                <span style={{ 
                  backgroundColor: journeyStyle.bg, 
                  color: journeyStyle.text,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.85rem'
                }}>
                  {quest.journey}
                </span>
              </div>
              
              <p style={{ marginBottom: '1rem' }}>{quest.description}</p>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Progress: {quest.progress}%</span>
                  <span>{quest.xpReward} XP Reward</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${quest.progress}%`, 
                    backgroundColor: getProgressColor(quest.progress),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>Deadline: {quest.deadline}</span>
                <button style={{ 
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  Update Progress
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <h2 style={{ marginTop: '3rem', color: '#555' }}>Available Quests</h2>
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {availableQuests.map(quest => {
          const journeyStyle = getJourneyColor(quest.journey);
          return (
            <div key={quest.id} style={{ 
              padding: '1.2rem',
              backgroundColor: '#fff',
              borderRadius: '5px',
              border: '1px solid #eaeaea'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ color: '#333', marginTop: 0, fontSize: '1.1rem' }}>{quest.title}</h3>
                <span style={{ 
                  backgroundColor: journeyStyle.bg, 
                  color: journeyStyle.text,
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {quest.journey}
                </span>
              </div>
              
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>{quest.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#888', marginRight: '10px' }}>
                    {quest.difficulty}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {quest.xpReward} XP
                  </span>
                </div>
                <button style={{ 
                  backgroundColor: '#f0f7ff',
                  color: '#0070f3',
                  border: '1px solid #0070f3',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  Start Quest
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}