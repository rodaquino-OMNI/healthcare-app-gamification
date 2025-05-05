#!/usr/bin/env node

/**
 * Test script for validating cross-service communication with gamification engine
 * 
 * This script simulates events from different journeys and verifies that the
 * gamification engine processes them correctly by checking for XP changes.
 */

const axios = require('axios');

// Configuration
const API_URL = process.env.GAMIFICATION_API || 'http://localhost:3005';
const TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

// Simulated events from different journeys
const events = [
  {
    type: 'STEPS_RECORDED',
    journey: 'health',
    data: { steps: 10000, date: new Date().toISOString().split('T')[0] }
  },
  {
    type: 'APPOINTMENT_BOOKED',
    journey: 'care',
    data: { 
      providerId: 'doctor-123', 
      speciality: 'cardiology', 
      date: new Date(Date.now() + 86400000).toISOString()
    }
  },
  {
    type: 'CLAIM_SUBMITTED',
    journey: 'plan',
    data: { 
      claimId: 'claim-123', 
      amount: 500.00, 
      serviceDate: new Date().toISOString().split('T')[0],
      docCount: 3
    }
  }
];

// Function to get user profile
async function getUserProfile() {
  try {
    const response = await axios.get(`${API_URL}/api/profiles/${TEST_USER_ID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return null;
  }
}

// Function to send an event
async function sendEvent(event) {
  const payload = {
    ...event,
    userId: TEST_USER_ID,
    timestamp: new Date().toISOString(),
    metadata: { source: 'test-script' }
  };
  
  try {
    const response = await axios.post(`${API_URL}/api/events`, payload);
    return true;
  } catch (error) {
    console.error(`Error sending event ${event.type}:`, error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Starting cross-service communication test with gamification engine');
  
  // Get initial profile
  console.log('📊 Fetching initial user profile...');
  const initialProfile = await getUserProfile();
  
  if (!initialProfile) {
    console.error('❌ Could not fetch initial profile. Aborting tests.');
    return;
  }
  
  console.log(`✅ Initial profile retrieved - Level: ${initialProfile.level}, XP: ${initialProfile.xp}`);
  
  // Process each event
  for (const event of events) {
    console.log(`\n📤 Sending ${event.type} event from ${event.journey} journey...`);
    
    const success = await sendEvent(event);
    if (!success) {
      console.error(`❌ Failed to send ${event.type} event`);
      continue;
    }
    
    console.log('✅ Event sent successfully');
    
    // Wait for event processing
    console.log('⏳ Waiting for event processing (2 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for profile updates
    const updatedProfile = await getUserProfile();
    if (!updatedProfile) {
      console.error('❌ Could not fetch updated profile');
      continue;
    }
    
    // Check if XP increased
    if (updatedProfile.xp > initialProfile.xp) {
      console.log(`✅ XP increased from ${initialProfile.xp} to ${updatedProfile.xp}`);
      initialProfile.xp = updatedProfile.xp;
      initialProfile.level = updatedProfile.level;
    } else {
      console.log(`⚠️ No XP change detected for ${event.type} event`);
    }
    
    // Check for new achievements
    if (updatedProfile.achievements?.length > initialProfile.achievements?.length) {
      const newCount = updatedProfile.achievements.length - initialProfile.achievements.length;
      console.log(`🏆 Unlocked ${newCount} new achievement(s)!`);
      
      // Display the new achievements
      const newAchievements = updatedProfile.achievements.slice(-newCount);
      newAchievements.forEach(ach => {
        console.log(`   - "${ach.title}" (${ach.journey} journey) +${ach.xpReward} XP`);
      });
    }
  }
  
  // Final results
  const finalProfile = await getUserProfile();
  if (finalProfile) {
    console.log('\n📊 Final profile status:');
    console.log(`   Level: ${finalProfile.level}`);
    console.log(`   XP: ${finalProfile.xp}`);
    console.log(`   Achievements: ${finalProfile.achievements?.length || 0}`);
    
    const xpGained = finalProfile.xp - initialProfile.xp;
    console.log(`\n🎮 Test result: ${xpGained > 0 ? 'SUCCESS! 🎉' : 'PARTIAL SUCCESS'}`);
    console.log(`   Gained ${xpGained} XP from test events`);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});