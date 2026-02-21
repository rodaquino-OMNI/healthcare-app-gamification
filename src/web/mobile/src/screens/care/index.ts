import React from 'react'; // S1: Standard import statement.

// IE1: Importing AppointmentBooking component.
import AppointmentBooking from './AppointmentBooking';
// IE1: Importing AppointmentDetail component.
import AppointmentDetail from './AppointmentDetail';
// IE1: Importing Dashboard component.
import Dashboard from './Dashboard';
// IE1: Importing MedicationTrackingScreen component.
import MedicationTrackingScreen from './MedicationTracking';
// IE1: Importing ProviderSearchScreen component.
import ProviderSearchScreen from './ProviderSearch';
// IE1: Importing SymptomChecker component.
import SymptomChecker from './SymptomChecker';
// IE1: Importing Telemedicine component.
import Telemedicine from './Telemedicine';
// IE1: Importing TreatmentPlanScreen component.
import TreatmentPlanScreen from './TreatmentPlan';
// IE1: Importing consultation flow screen components.
import DoctorSearchScreen from './DoctorSearch';
import DoctorFiltersScreen from './DoctorFilters';
import DoctorProfileScreen from './DoctorProfile';
import DoctorAvailabilityScreen from './DoctorAvailability';
import BookingScheduleScreen from './BookingSchedule';
import BookingConfirmationScreen from './BookingConfirmation';
import WaitingRoomScreen from './WaitingRoom';

// IE3: Be generous about your exports so long as it doesn't create a security risk.
export {
  AppointmentBooking, // LD1: Exporting AppointmentBooking component.
  AppointmentDetail, // LD1: Exporting AppointmentDetail component.
  Dashboard, // LD1: Exporting Dashboard component.
  MedicationTrackingScreen, // LD1: Exporting MedicationTrackingScreen component.
  ProviderSearchScreen, // LD1: Exporting ProviderSearchScreen component.
  SymptomChecker, // LD1: Exporting SymptomChecker component.
  Telemedicine, // LD1: Exporting Telemedicine component.
  TreatmentPlanScreen, // LD1: Exporting TreatmentPlanScreen component.
  DoctorSearchScreen,
  DoctorFiltersScreen,
  DoctorProfileScreen,
  DoctorAvailabilityScreen,
  BookingScheduleScreen,
  BookingConfirmationScreen,
  WaitingRoomScreen,
};