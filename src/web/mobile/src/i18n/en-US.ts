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
      },
      medication: {
        calendar: { title: 'Medication Calendar', weekView: 'Week View', monthView: 'View Monthly', today: 'Today', noSchedule: 'No doses scheduled for this day' },
        empty: { title: 'No Medications', subtitle: 'Start tracking by adding your first medication', addFirst: 'Add Medication' },
        addConfirmation: { title: 'Medication Added!', subtitle: 'Your medication has been saved successfully', setupReminders: 'Set Up Reminders', backToList: 'Back to Medications' },
        doseTaken: { title: 'Log Dose', timestamp: 'Time', notes: 'Notes', notesPlaceholder: 'Any notes...', sideEffects: 'Side effects?', confirm: 'Confirm Dose Taken' },
        doseMissed: { title: 'Missed Dose', reason: 'Reason', forgot: 'Forgot', sideEffectsReason: 'Side effects', ranOut: 'Ran out', other: 'Other', reschedule: 'Reschedule', skipDose: 'Skip This Dose', takeNow: 'Take Now' },
        edit: { title: 'Edit Medication', saveChanges: 'Save Changes' },
        deleteConfirm: { title: 'Delete Medication?', warning: 'This will remove all dose history and reminders. This action cannot be undone.', confirm: 'Delete', cancel: 'Cancel' },
        adherence: { title: 'Treatment Adherence', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', rate: 'Adherence Rate', shareReport: 'Share Report' },
        monthlyReport: { title: 'Monthly Report', summary: 'Summary', totalDoses: 'Total Doses', taken: 'Taken', missed: 'Missed', exportPdf: 'Export PDF', share: 'Share' },
        refillReminder: { title: 'Refill Reminder', daysRemaining: '{{count}} days remaining', findPharmacy: 'Find Pharmacy', orderOnline: 'Order Online', snooze: 'Snooze Reminder' },
        drugInteraction: { title: 'Drug Interaction', severity: 'Severity', minor: 'Minor', moderate: 'Moderate', severe: 'Severe', talkToDoctor: 'Talk to Your Doctor', dismiss: 'Dismiss' },
        sideEffectsLog: { title: 'Side Effects Log', empty: 'No side effects recorded', addNew: 'Report New' },
        sideEffectForm: { title: 'Report Side Effect', effectType: 'Effect Type', severity: 'Severity', mild: 'Mild', moderate: 'Moderate', severe: 'Severe', date: 'Date', notes: 'Notes', submit: 'Submit Report', nausea: 'Nausea', headache: 'Headache', dizziness: 'Dizziness', fatigue: 'Fatigue', insomnia: 'Insomnia', rash: 'Rash', other: 'Other' },
        pharmacyLocator: { title: 'Find Pharmacy', searchPlaceholder: 'Search pharmacy...', getDirections: 'Get Directions', call: 'Call', open: 'Open', closed: 'Closed', mapPlaceholder: 'Map View' },
        prescriptionPhoto: { title: 'Prescription Photo', takePhoto: 'Take Photo', chooseGallery: 'Choose from Gallery', tips: 'Tips for a good photo', tip1: 'Use good lighting', tip2: 'Place on flat surface', tip3: 'Make sure all text is visible', skipManual: 'Skip - Enter Manually' },
        ocrReview: { title: 'Review Prescription Data', confidence: 'Confidence', high: 'High', medium: 'Medium', low: 'Low', confirmAdd: 'Confirm & Add', retakePhoto: 'Retake Photo', medicationName: 'Medication Name', dosage: 'Dosage', frequency: 'Frequency', doctor: 'Doctor', date: 'Date' },
        shareCaregiver: { title: 'Share with Caregiver', activeMeds: '{{count}} active medications', shareLink: 'Share via Link', shareEmail: 'Share via Email', shareWhatsapp: 'Share via WhatsApp', permissionsInfo: 'The caregiver will be able to see medication names, schedules, and adherence', manageAccess: 'Manage Access' },
        caregiverAccess: { title: 'Caregiver Access', viewOnly: 'View Only', fullAccess: 'Full Access', revokeAccess: 'Revoke Access', addNew: 'Add New Caregiver', empty: 'No caregivers added' },
        export: { title: 'Export Medications', format: 'Format', pdf: 'PDF', csv: 'CSV', print: 'Print', scope: 'Scope', allMedications: 'All Medications', activeOnly: 'Active Only', dateRange: 'Date Range', preview: 'Preview', exportBtn: 'Export', shareBtn: 'Share' }
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
        emergency: 'Seek Emergency Help',
        bodyMapBack: {
          title: 'Body Map — Back View',
          subtitle: 'Tap on the back areas where you feel symptoms.',
          flipToFront: 'Flip to Front',
          selectedAreas: 'Selected areas ({{count}})',
          continue: 'Continue',
          back: 'Back'
        },
        headDetail: {
          title: 'Head Detail',
          subtitle: 'Select the specific head region where you feel symptoms.',
          backToBodyMap: 'Back to Body Map',
          selectedRegions: 'Selected regions ({{count}})',
          scalp: 'Scalp', forehead: 'Forehead', templesLeft: 'Left Temple', templesRight: 'Right Temple',
          eyes: 'Eyes', nose: 'Nose', ears: 'Ears', jaw: 'Jaw', throat: 'Throat', backOfHead: 'Back of Head'
        },
        photoUpload: {
          title: 'Upload Symptom Photo',
          subtitle: 'Take a photo or select from gallery to help with analysis.',
          takePhoto: 'Take Photo',
          chooseGallery: 'Choose from Gallery',
          photosCount: '{{count}} of 5 photos',
          skip: 'Skip',
          continue: 'Continue',
          remove: 'Remove',
          maxPhotos: 'Maximum of 5 photos reached'
        },
        medicalHistory: {
          title: 'Medical History',
          subtitle: 'Select relevant conditions from your medical history.',
          conditions: 'Conditions',
          surgeries: 'Surgeries',
          allergies: 'Allergies',
          addNew: 'Add new condition',
          addButton: 'Add',
          relevant: 'Relevant',
          continue: 'Continue',
          back: 'Back'
        },
        medicationContext: {
          title: 'Current Medications',
          subtitle: 'Mark the medications you are currently taking.',
          currentlyTaking: 'Currently taking',
          addMedication: 'Add medication',
          addButton: 'Add',
          activeCount: '{{count}} active medications',
          continue: 'Continue',
          back: 'Back'
        },
        vitals: {
          title: 'Vital Signs',
          subtitle: 'Enter your current vital signs (all optional).',
          temperature: 'Temperature (°C)',
          bloodPressure: 'Blood Pressure (mmHg)',
          systolic: 'Systolic',
          diastolic: 'Diastolic',
          heartRate: 'Heart Rate (bpm)',
          oxygenSaturation: 'Oxygen Saturation (%)',
          skip: 'Skip',
          continue: 'Continue',
          back: 'Back',
          invalidRange: 'Value out of valid range'
        },
        analyzing: {
          title: 'Analyzing Symptoms',
          step1: 'Analyzing symptoms...',
          step2: 'Checking medical database...',
          step3: 'Comparing patterns...',
          step4: 'Generating results...',
          pleaseWait: 'Please wait while we analyze your symptoms.'
        },
        conditionsList: {
          title: 'Possible Conditions',
          subtitle: 'Based on your symptoms, these are the most likely conditions.',
          riskAssessment: 'Overall Risk Assessment',
          matchProbability: 'Match probability',
          tapForDetails: 'Tap for details',
          viewSelfCare: 'View Self-Care',
          bookAppointment: 'Book Appointment',
          lowRisk: 'Low Risk',
          moderateRisk: 'Moderate Risk',
          highRisk: 'High Risk'
        },
        conditionDetail: {
          title: 'Condition Details',
          overview: 'Overview',
          commonCauses: 'Common Causes',
          treatmentOptions: 'Treatment Options',
          whenToWorry: 'When to Seek Medical Help',
          prevention: 'Prevention',
          learnMore: 'Learn More',
          back: 'Back',
          bookAppointment: 'Book Appointment',
          matchConfidence: 'Match confidence'
        },
        selfCareScreen: {
          title: 'Self-Care Instructions',
          restRecovery: 'Rest & Recovery',
          hydration: 'Hydration',
          otcMedications: 'OTC Medications',
          monitoring: 'Monitoring',
          whenToSeekHelp: 'When to Seek Help',
          setFollowUp: 'Set Follow-Up Reminder',
          saveReport: 'Save Report',
          back: 'Back'
        },
        emergencyWarning: {
          title: 'WARNING — EMERGENCY',
          doNotWait: 'DO NOT WAIT',
          callSamu: 'Call 192 (SAMU)',
          callEmergency: 'Call Emergency',
          nearestER: 'Nearest Emergency Room',
          warningSymptoms: 'Warning Signs',
          disclaimer: 'If you are in immediate danger, call emergency services right away.',
          understand: 'I understand, go back'
        },
        bookAppointmentScreen: {
          title: 'Book Appointment',
          subtitle: 'Based on your symptoms, we recommend seeing a doctor.',
          suggestedSpecialty: 'Suggested Specialty',
          bookNow: 'Book Now',
          viewDoctors: 'View Available Doctors',
          maybeLater: 'Maybe Later'
        },
        erLocator: {
          title: 'Nearest Emergency Rooms',
          subtitle: 'Find the nearest emergency room.',
          call: 'Call',
          directions: 'Directions',
          distance: '{{distance}} km',
          waitTime: 'Wait: {{time}} min',
          emergencyCall: 'Emergency: 192'
        },
        saveReport: {
          title: 'Save Report',
          subtitle: 'Save a summary of your symptom check.',
          saveAsPDF: 'Save as PDF',
          saveToRecords: 'Save to Health Records',
          shareReport: 'Share Report',
          saved: 'Report saved successfully',
          back: 'Back'
        },
        shareReport: {
          title: 'Share Report',
          subtitle: 'Share the symptom report.',
          shareEmail: 'Share via Email',
          shareWhatsApp: 'Share via WhatsApp',
          printReport: 'Print Report',
          shareWithDoctor: 'Share with Doctor',
          reportPreview: 'Report Preview',
          back: 'Back'
        },
        history: {
          title: 'Check History',
          subtitle: 'Your previous symptom checks.',
          filterAll: 'All',
          filter7Days: '7 Days',
          filter30Days: '30 Days',
          filter90Days: '90 Days',
          empty: 'No previous checks found.',
          topCondition: 'Top condition'
        },
        historyDetail: {
          title: 'Check Details',
          date: 'Date',
          symptoms: 'Symptoms',
          regions: 'Regions',
          severity: 'Severity',
          conditions: 'Conditions',
          recommendations: 'Recommendations',
          compare: 'Compare with Another Check',
          rateAccuracy: 'Rate Accuracy',
          shareReport: 'Share Report'
        },
        accuracyRating: {
          title: 'Rate Accuracy',
          question: 'Was the diagnosis accurate?',
          veryAccurate: 'Very Accurate',
          somewhatAccurate: 'Somewhat Accurate',
          notAccurate: 'Not Accurate',
          feedbackPlaceholder: 'Additional comments (optional)',
          submit: 'Submit Feedback',
          thankYou: 'Thank you for your feedback!'
        },
        followUp: {
          title: 'Follow-Up Reminder',
          subtitle: 'Set a reminder to check on your symptoms.',
          timing: 'When to check again',
          tomorrow: 'Tomorrow',
          threeDays: 'In 3 days',
          oneWeek: 'In 1 week',
          twoWeeks: 'In 2 weeks',
          custom: 'Custom',
          symptomsToWatch: 'Symptoms to Watch',
          warningSigns: 'Warning Signs',
          setReminder: 'Set Reminder',
          reminderSet: 'Reminder set successfully'
        },
        diary: {
          title: 'Symptom Diary',
          subtitle: 'Log your symptoms daily.',
          addEntry: 'Add Entry',
          symptomLabel: 'Symptom',
          severityLabel: 'Severity',
          notesLabel: 'Notes',
          notesPlaceholder: 'Additional notes...',
          save: 'Save',
          cancel: 'Cancel',
          trend: 'Trend',
          improving: 'Improving',
          stable: 'Stable',
          worsening: 'Worsening'
        },
        comparison: {
          title: 'Compare Checks',
          subtitle: 'Compare two symptom checks side by side.',
          check1: 'Check 1',
          check2: 'Check 2',
          severityChange: 'Severity Change',
          improved: 'Improved',
          worsened: 'Worsened',
          same: 'Same',
          newSymptom: 'New',
          resolved: 'Resolved',
          conclusion: 'Conclusion'
        }
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
      about: 'About',
      editProfile: 'Edit Profile',
      personalInfo: {
        title: 'Personal Information',
        fullName: 'Full Name',
        dateOfBirth: 'Date of Birth',
        gender: 'Gender',
        bloodType: 'Blood Type',
        cpf: 'CPF',
        save: 'Save',
        cancel: 'Cancel',
        changePhoto: 'Change photo',
        genderOptions: { male: 'Male', female: 'Female', other: 'Other', preferNotToSay: 'Prefer not to say' }
      },
      changePassword: {
        title: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        strength: { weak: 'Weak', medium: 'Medium', strong: 'Strong' },
        save: 'Change Password',
        success: 'Password changed successfully!',
        error: 'Error changing password.',
        validation: { minLength: 'Minimum 8 characters', uppercase: 'Must contain uppercase letter', match: 'Passwords do not match' }
      },
      twoFactor: {
        title: 'Two-Factor Authentication',
        enabled: 'Enabled',
        disabled: 'Disabled',
        method: 'Verification Method',
        sms: 'SMS',
        authenticator: 'Authenticator App',
        phone: 'Phone',
        changeNumber: 'Change number',
        qrInstructions: 'Scan the QR code with your authenticator app',
        disable: 'Disable 2FA',
        disableConfirm: 'Are you sure you want to disable two-factor authentication?'
      },
      biometric: {
        title: 'Biometric Authentication',
        faceId: 'Face ID',
        fingerprint: 'Fingerprint',
        available: 'Available on this device',
        notAvailable: 'Not available on this device',
        info: 'Biometric authentication adds an extra layer of security to your login.'
      },
      dataExport: {
        title: 'Export Data',
        info: 'Under LGPD, you have the right to request a copy of your personal data.',
        categories: { profile: 'Profile Data', health: 'Health Records', appointments: 'Appointments', medications: 'Medications', claims: 'Claims' },
        format: { json: 'JSON', pdf: 'PDF' },
        request: 'Request Export',
        status: { pending: 'Pending', processing: 'Processing', ready: 'Ready for Download' },
        lastExport: 'Last export'
      },
      deleteAccount: {
        title: 'Delete Account',
        warning: 'This action is permanent and cannot be undone.',
        consequences: {
          healthData: 'All your health records will be deleted',
          plan: 'Your health plan will be canceled',
          leaderboard: 'You will be removed from rankings',
          achievements: 'All achievements and XP will be lost',
          irreversible: 'This action cannot be undone'
        },
        understand: 'I understand this action is permanent and irreversible',
        proceed: 'Proceed to Confirmation',
        goBack: 'Go Back'
      },
      deleteConfirm: {
        title: 'Final Confirmation',
        waitMessage: 'Wait {{seconds}} seconds',
        typeToConfirm: 'Type DELETE to confirm',
        confirmWord: 'DELETE',
        deleteForever: 'Delete My Account Permanently',
        cancel: 'Cancel'
      },
      languageSelect: {
        title: 'Language',
        portuguese: 'Portugues (Brasil)',
        english: 'English (US)',
        spanish: 'Espanol',
        preview: 'Preview',
        save: 'Save'
      },
      themeSelect: {
        title: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System (Auto)',
        preview: 'Preview'
      },
      accessibility: {
        title: 'Accessibility',
        fontSize: 'Font Size',
        fontSizes: { small: 'S', medium: 'M', large: 'L', extraLarge: 'XL' },
        highContrast: 'High Contrast',
        reducedMotion: 'Reduced Motion',
        screenReaderInfo: 'This app is compatible with VoiceOver (iOS) and TalkBack (Android).',
        preview: 'Sample text for preview'
      },
      connectedDevices: {
        title: 'Connected Devices',
        pairNew: 'Pair New Device',
        unpair: 'Disconnect',
        lastSync: 'Last sync',
        connected: 'Connected',
        disconnected: 'Disconnected',
        empty: 'No devices connected.',
        confirmUnpair: 'Do you want to disconnect this device?'
      },
      healthPlan: {
        title: 'Health Plan Details',
        planName: 'Plan Name',
        planNumber: 'Plan Number',
        type: 'Type',
        validity: 'Validity',
        memberName: 'Member Name',
        memberNumber: 'Card Number',
        ansRegistration: 'ANS Registration',
        viewCard: 'View Digital Card',
        viewDocs: 'View Documents'
      },
      insuranceDocs: {
        title: 'Plan Documents',
        filters: { all: 'All', cards: 'Cards', guides: 'Guides', policies: 'Policies' },
        download: 'Download',
        view: 'View',
        empty: 'No documents available.'
      },
      dependents: {
        title: 'Dependents',
        addDependent: 'Add Dependent',
        edit: 'Edit',
        remove: 'Remove',
        relationship: 'Relationship',
        dob: 'Date of Birth',
        cpf: 'CPF',
        empty: 'No dependents registered.',
        confirmRemove: 'Do you want to remove this dependent?'
      },
      addDependent: {
        title: 'Add Dependent',
        fullName: 'Full Name',
        dateOfBirth: 'Date of Birth',
        cpf: 'CPF',
        relationship: 'Relationship',
        relationshipOptions: { spouse: 'Spouse', child: 'Child', father: 'Father', mother: 'Mother', other: 'Other' },
        save: 'Save',
        cancel: 'Cancel'
      },
      emergencyContacts: {
        title: 'Emergency Contacts',
        addContact: 'Add Contact',
        name: 'Name',
        phone: 'Phone',
        relationship: 'Relationship',
        priority: 'Priority',
        edit: 'Edit',
        delete: 'Delete',
        empty: 'No emergency contacts registered.'
      },
      addresses: {
        title: 'Addresses',
        addAddress: 'Add Address',
        primary: 'Primary',
        edit: 'Edit',
        delete: 'Delete',
        empty: 'No addresses registered.',
        labels: { home: 'Home', work: 'Work', other: 'Other' }
      },
      addAddress: {
        title: 'Add Address',
        label: 'Type',
        cep: 'ZIP Code',
        street: 'Street',
        number: 'Number',
        complement: 'Complement',
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'State',
        setPrimary: 'Set as primary address',
        save: 'Save',
        cancel: 'Cancel',
        cepLoading: 'Looking up address...'
      },
      terms: {
        title: 'Terms of Service',
        lastUpdated: 'Last updated'
      },
      privacyPolicy: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated',
        exportLink: 'Export my data',
        deleteLink: 'Delete my account'
      },
      aboutApp: {
        title: 'About the App',
        version: 'Version',
        build: 'Build',
        environment: 'Environment',
        credits: 'Credits',
        licenses: 'Open Source Licenses',
        rateApp: 'Rate this App',
        copyright: 'AUSTA Health. All rights reserved.'
      },
      logout: {
        title: 'Sign Out',
        sessionInfo: 'Connected since',
        device: 'Device',
        warning: 'Signing out will end your session and remove cached data.',
        signOut: 'Sign Out',
        cancel: 'Cancel'
      },
      feedback: {
        title: 'Rate the App',
        rating: 'Your Rating',
        ratingLabels: { terrible: 'Terrible', bad: 'Bad', average: 'Average', good: 'Good', excellent: 'Excellent' },
        category: 'Category',
        categoryOptions: { bug: 'Bug', suggestion: 'Suggestion', compliment: 'Compliment', other: 'Other' },
        comment: 'Comment',
        charCount: '{{count}}/500',
        submit: 'Submit Feedback',
        rateOnStore: 'Rate on App Store'
      },
      sections: {
        account: 'Account',
        security: 'Security',
        notifications: 'Notifications',
        privacy: 'Privacy',
        healthPlan: 'Health Plan',
        devices: 'Devices',
        preferences: 'Preferences',
        help: 'Help',
        data: 'Data',
        app: 'App'
      }
    },
    help: {
      home: {
        title: 'Help Center',
        search: 'Search',
        searchPlaceholder: 'How can we help?',
        categories: { faq: 'Frequently Asked Questions', contact: 'Contact Us', report: 'Report a Problem', terms: 'Terms of Service', privacy: 'Privacy Policy', about: 'About the App' },
        quickLinks: 'Quick Links'
      },
      faq: {
        title: 'Frequently Asked Questions',
        noResults: 'No results found.'
      },
      faqDetail: {
        title: 'Details',
        wasHelpful: 'Was this article helpful?',
        yes: 'Yes',
        no: 'No',
        thankYou: 'Thank you for your feedback!',
        relatedArticles: 'Related Articles',
        contactSupport: 'Contact Support'
      },
      contact: {
        title: 'Contact Us',
        chat: 'Live Chat',
        chatDescription: 'Chat with our support team',
        chatOnline: 'Online',
        startChat: 'Start Chat',
        phone: 'Phone',
        phoneNumber: '0800 123 4567',
        phoneHours: 'Mon-Fri, 8AM to 8PM',
        call: 'Call',
        email: 'Email',
        emailAddress: 'suporte@austa.com.br',
        emailResponse: 'Response within 24h',
        sendEmail: 'Send Email',
        operatingHours: 'Operating Hours'
      },
      chat: {
        title: 'Live Chat',
        placeholder: 'Type your message...',
        send: 'Send',
        typing: 'Typing...',
        online: 'Online'
      },
      report: {
        title: 'Report a Problem',
        category: 'Category',
        categoryOptions: { bug: 'Bug', crash: 'Crash', performance: 'Performance', visual: 'Visual', other: 'Other' },
        description: 'Problem Description',
        stepsToReproduce: 'Steps to Reproduce',
        attachScreenshot: 'Attach Screenshot',
        deviceInfo: 'Device Information',
        submit: 'Submit Report'
      }
    },
    notifications: {
      title: 'Notifications',
      empty: 'No notifications.',
      markAllRead: 'Mark All as Read'
    }
  }
};

export default translations;