/**
 * English (US) translations for the AUSTA SuperApp
 * @version 1.0.0
 */

const translations = {
  common: {
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
      next: 'Next',
      back: 'Back',
      ok: 'OK',
      confirm: 'Confirm',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      view_all: 'View all'
    },
    validation: {
      required: 'This field is required',
      email: 'Invalid email',
      minLength: 'Minimum {{count}} characters',
      maxLength: 'Maximum {{count}} characters',
      number: 'Must be a valid number',
      positive: 'Must be a positive number',
      date: 'Invalid date',
      cpf: 'Invalid CPF',
      phone: 'Invalid phone number'
    },
    errors: {
      default: 'An unexpected error occurred. Please try again.',
      network: 'No internet connection.',
      timeout: 'Request timeout exceeded.',
      unauthorized: 'You are not authorized to access this resource.',
      notFound: 'Resource not found.',
      server: 'Server error. Please try again later.'
    },
    success: {
      saved: 'Saved successfully!',
      deleted: 'Deleted successfully!',
      added: 'Added successfully!'
    },
    labels: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      date: 'Date',
      time: 'Time',
      amount: 'Amount',
      description: 'Description',
      notes: 'Notes',
      search: 'Search',
      select: 'Select',
      optional: '(Optional)'
    },
    placeholders: {
      search: 'Type to search...',
      select: 'Select an option'
    },
    tooltips: {
      required: 'This field is required'
    }
  },
  journeys: {
    health: {
      title: 'My Health',
      metrics: {
        heartRate: 'Heart Rate',
        bloodPressure: 'Blood Pressure',
        bloodGlucose: 'Blood Glucose',
        steps: 'Steps',
        sleep: 'Sleep',
        weight: 'Weight',
        temperature: 'Temperature',
        oxygenSaturation: 'Oxygen Saturation'
      },
      goals: {
        daily: 'Daily Goal',
        weekly: 'Weekly Goal',
        monthly: 'Monthly Goal',
        progress: 'Progress: {{value}}%',
        setGoal: 'Set Goal',
        steps: 'Daily Steps',
        sleep: 'Hours of Sleep',
        water: 'Water Intake (liters)',
        calories: 'Calories Burned'
      },
      history: {
        title: 'Medical History',
        empty: 'No medical events recorded.',
        filters: {
          all: 'All',
          appointments: 'Appointments',
          medications: 'Medications',
          labTests: 'Lab Tests',
          procedures: 'Procedures'
        }
      },
      devices: {
        title: 'Connected Devices',
        connectNew: 'Connect New Device',
        lastSync: 'Last sync: {{time}}'
      },
      insights: {
        title: 'Health Insights',
        empty: 'No insights available at the moment.'
      }
    },
    care: {
      title: 'Care Now',
      appointments: {
        book: 'Book Appointment',
        upcoming: 'Upcoming Appointments',
        past: 'Past Appointments',
        details: 'Appointment Details',
        empty: 'No appointments scheduled.',
        confirm: 'Confirm Appointment',
        cancel: 'Cancel Appointment',
        reschedule: 'Reschedule Appointment',
        reason: 'Reason for Appointment',
        type: 'Appointment Type',
        location: 'Location',
        provider: 'Provider',
        date: 'Date',
        time: 'Time',
        notes: 'Notes',
        telemedicine: 'Telemedicine',
        inPerson: 'In Person',
        any: 'Any',
        noProviders: 'No providers available for the selected criteria.'
      },
      telemedicine: {
        start: 'Start Telemedicine',
        connecting: 'Connecting...',
        connected: 'Connected with Dr. {{name}}',
        end: 'End Telemedicine',
        waiting: 'Waiting for the provider...',
        error: 'Error connecting. Please try again.',
        noProviders: 'No providers available for telemedicine.'
      },
      medications: {
        title: 'Medications',
        add: 'Add Medication',
        name: 'Medication Name',
        dosage: 'Dosage',
        frequency: 'Frequency',
        startDate: 'Start Date',
        endDate: 'End Date',
        instructions: 'Instructions',
        empty: 'No medications registered.',
        trackDose: 'Track Dose Taken',
        refill: 'Request Refill',
        reminder: 'Medication Reminder'
      },
      symptomChecker: {
        title: 'Symptom Checker',
        start: 'Start Check',
        selectSymptoms: 'Select your symptoms',
        noSymptoms: 'No symptoms selected.',
        results: 'Results',
        recommendations: 'Recommendations',
        selfCare: 'Self-Care',
        bookAppointment: 'Book Appointment',
        emergency: 'Seek Emergency Help'
      },
      treatmentPlans: {
        title: 'Treatment Plans',
        empty: 'No active treatment plans.',
        tasks: 'Tasks',
        progress: 'Progress',
        startDate: 'Start Date',
        endDate: 'End Date',
        description: 'Plan Description'
      }
    },
    plan: {
      title: 'My Plan & Benefits',
      coverage: {
        title: 'Coverage',
        details: 'Coverage Details',
        limits: 'Limits and Deductibles',
        network: 'In-Network Providers',
        empty: 'No coverage information available.'
      },
      digitalCard: {
        title: 'Digital Insurance Card',
        share: 'Share Insurance Card',
        download: 'Download Insurance Card'
      },
      claims: {
        title: 'Reimbursements',
        submit: 'Submit Claim',
        history: 'Claim History',
        empty: 'No reimbursement requests found.',
        status: {
          pending: 'Pending',
          approved: 'Approved',
          denied: 'Denied',
          moreInfo: 'Additional Information Required',
          processing: 'Processing',
          submitted: 'Submitted'
        },
        details: 'Claim Details',
        uploadDocument: 'Upload Document',
        claimType: 'Claim Type',
        dateOfService: 'Date of Service',
        providerName: 'Provider Name',
        amountPaid: 'Amount Paid',
        description: 'Service Description',
        trackingNumber: 'Tracking Number',
        estimatedDate: 'Estimated Date',
        paymentDetails: 'Payment Details',
        appeal: 'Appeal'
      },
      costSimulator: {
        title: 'Cost Simulator',
        procedure: 'Procedure',
        estimate: 'Estimated Cost',
        noResults: 'No procedures found.'
      },
      benefits: {
        title: 'Benefits',
        empty: 'No benefits available.',
        usage: 'Usage',
        limit: 'Limit',
        description: 'Benefit Description'
      }
    },
    gamification: {
      level: 'Level {{level}}',
      xp: '{{value}} XP',
      achievements: {
        unlocked: 'Achievement Unlocked!',
        progress: 'Progress: {{value}}/{{total}}',
        reward: 'Reward: {{reward}}',
        empty: 'No achievements unlocked.'
      },
      quests: {
        active: 'Active Quests',
        completed: 'Completed Quests',
        new: 'New Quest Available!',
        empty: 'No active quests.'
      },
      rewards: {
        empty: 'No rewards available.'
      },
      leaderboard: {
        title: 'Ranking',
        rank: 'Rank',
        user: 'User',
        score: 'Score'
      }
    },
    auth: {
      login: {
        title: 'Login',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot your password?',
        register: 'Create account'
      },
      register: {
        title: 'Create Account',
        name: 'Full Name',
        email: 'Email',
        cpf: 'CPF',
        phone: 'Phone',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        terms: 'I agree to the Terms of Service and Privacy Policy.',
        login: 'Already have an account?'
      },
      forgotPassword: {
        title: 'Recover Password',
        email: 'Email',
        sendCode: 'Send Verification Code'
      },
      mfa: {
        title: 'Security Verification',
        code: 'Verification Code',
        resendCode: 'Resend Code'
      }
    },
    profile: {
      title: 'Profile',
      edit: 'Edit Profile',
      settings: 'Settings',
      notifications: 'Notifications',
      security: 'Security',
      help: 'Help',
      logout: 'Logout'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      notifications: 'Notifications',
      privacy: 'Privacy',
      about: 'About'
    },
    notifications: {
      title: 'Notifications',
      empty: 'No notifications.',
      markAllRead: 'Mark All as Read'
    }
  }
};

export default translations;