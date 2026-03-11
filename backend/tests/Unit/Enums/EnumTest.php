<?php

namespace Tests\Unit\Enums;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Enums\ClaimStatus;
use App\Enums\ConsentStatus;
use App\Enums\ConsentType;
use App\Enums\DeviceConnectionStatus;
use App\Enums\DeviceType;
use App\Enums\GoalPeriod;
use App\Enums\GoalStatus;
use App\Enums\GoalType;
use App\Enums\MetricSource;
use App\Enums\MetricType;
use PHPUnit\Framework\TestCase;

class EnumTest extends TestCase
{
    // --- AppointmentStatus ---

    public function test_appointment_status_has_scheduled_case(): void
    {
        $this->assertEquals('SCHEDULED', AppointmentStatus::SCHEDULED->value);
    }

    public function test_appointment_status_has_completed_case(): void
    {
        $this->assertEquals('COMPLETED', AppointmentStatus::COMPLETED->value);
    }

    public function test_appointment_status_has_cancelled_case(): void
    {
        $this->assertEquals('CANCELLED', AppointmentStatus::CANCELLED->value);
    }

    public function test_appointment_status_has_exactly_three_cases(): void
    {
        $this->assertCount(3, AppointmentStatus::cases());
    }

    // --- AppointmentType ---

    public function test_appointment_type_has_in_person_case(): void
    {
        $this->assertEquals('IN_PERSON', AppointmentType::IN_PERSON->value);
    }

    public function test_appointment_type_has_telemedicine_case(): void
    {
        $this->assertEquals('TELEMEDICINE', AppointmentType::TELEMEDICINE->value);
    }

    public function test_appointment_type_has_exactly_two_cases(): void
    {
        $this->assertCount(2, AppointmentType::cases());
    }

    // --- ClaimStatus ---

    public function test_claim_status_has_draft_case(): void
    {
        $this->assertEquals('DRAFT', ClaimStatus::DRAFT->value);
    }

    public function test_claim_status_has_submitted_case(): void
    {
        $this->assertEquals('SUBMITTED', ClaimStatus::SUBMITTED->value);
    }

    public function test_claim_status_has_under_review_case(): void
    {
        $this->assertEquals('UNDER_REVIEW', ClaimStatus::UNDER_REVIEW->value);
    }

    public function test_claim_status_has_additional_info_required_case(): void
    {
        $this->assertEquals('ADDITIONAL_INFO_REQUIRED', ClaimStatus::ADDITIONAL_INFO_REQUIRED->value);
    }

    public function test_claim_status_has_approved_case(): void
    {
        $this->assertEquals('APPROVED', ClaimStatus::APPROVED->value);
    }

    public function test_claim_status_has_denied_case(): void
    {
        $this->assertEquals('DENIED', ClaimStatus::DENIED->value);
    }

    public function test_claim_status_has_processing_case(): void
    {
        $this->assertEquals('PROCESSING', ClaimStatus::PROCESSING->value);
    }

    public function test_claim_status_has_completed_case(): void
    {
        $this->assertEquals('COMPLETED', ClaimStatus::COMPLETED->value);
    }

    public function test_claim_status_has_cancelled_case(): void
    {
        $this->assertEquals('CANCELLED', ClaimStatus::CANCELLED->value);
    }

    public function test_claim_status_has_exactly_nine_cases(): void
    {
        $this->assertCount(9, ClaimStatus::cases());
    }

    // --- ConsentStatus ---

    public function test_consent_status_has_active_case(): void
    {
        $this->assertEquals('ACTIVE', ConsentStatus::ACTIVE->value);
    }

    public function test_consent_status_has_revoked_case(): void
    {
        $this->assertEquals('REVOKED', ConsentStatus::REVOKED->value);
    }

    public function test_consent_status_has_expired_case(): void
    {
        $this->assertEquals('EXPIRED', ConsentStatus::EXPIRED->value);
    }

    public function test_consent_status_has_exactly_three_cases(): void
    {
        $this->assertCount(3, ConsentStatus::cases());
    }

    // --- ConsentType ---

    public function test_consent_type_has_data_processing_case(): void
    {
        $this->assertEquals('DATA_PROCESSING', ConsentType::DATA_PROCESSING->value);
    }

    public function test_consent_type_has_health_data_sharing_case(): void
    {
        $this->assertEquals('HEALTH_DATA_SHARING', ConsentType::HEALTH_DATA_SHARING->value);
    }

    public function test_consent_type_has_marketing_case(): void
    {
        $this->assertEquals('MARKETING', ConsentType::MARKETING->value);
    }

    public function test_consent_type_has_research_case(): void
    {
        $this->assertEquals('RESEARCH', ConsentType::RESEARCH->value);
    }

    public function test_consent_type_has_telemedicine_case(): void
    {
        $this->assertEquals('TELEMEDICINE', ConsentType::TELEMEDICINE->value);
    }

    public function test_consent_type_has_third_party_sharing_case(): void
    {
        $this->assertEquals('THIRD_PARTY_SHARING', ConsentType::THIRD_PARTY_SHARING->value);
    }

    public function test_consent_type_has_exactly_six_cases(): void
    {
        $this->assertCount(6, ConsentType::cases());
    }

    // --- DeviceConnectionStatus ---

    public function test_device_connection_status_has_connected_case(): void
    {
        $this->assertEquals('CONNECTED', DeviceConnectionStatus::CONNECTED->value);
    }

    public function test_device_connection_status_has_disconnected_case(): void
    {
        $this->assertEquals('DISCONNECTED', DeviceConnectionStatus::DISCONNECTED->value);
    }

    public function test_device_connection_status_has_expired_case(): void
    {
        $this->assertEquals('EXPIRED', DeviceConnectionStatus::EXPIRED->value);
    }

    public function test_device_connection_status_has_pending_case(): void
    {
        $this->assertEquals('PENDING', DeviceConnectionStatus::PENDING->value);
    }

    public function test_device_connection_status_has_failed_case(): void
    {
        $this->assertEquals('FAILED', DeviceConnectionStatus::FAILED->value);
    }

    public function test_device_connection_status_has_exactly_five_cases(): void
    {
        $this->assertCount(5, DeviceConnectionStatus::cases());
    }

    // --- DeviceType ---

    public function test_device_type_has_fitbit_case(): void
    {
        $this->assertEquals('FITBIT', DeviceType::FITBIT->value);
    }

    public function test_device_type_has_apple_health_case(): void
    {
        $this->assertEquals('APPLE_HEALTH', DeviceType::APPLE_HEALTH->value);
    }

    public function test_device_type_has_google_fit_case(): void
    {
        $this->assertEquals('GOOGLE_FIT', DeviceType::GOOGLE_FIT->value);
    }

    public function test_device_type_has_samsung_health_case(): void
    {
        $this->assertEquals('SAMSUNG_HEALTH', DeviceType::SAMSUNG_HEALTH->value);
    }

    public function test_device_type_has_garmin_case(): void
    {
        $this->assertEquals('GARMIN', DeviceType::GARMIN->value);
    }

    public function test_device_type_has_exactly_five_cases(): void
    {
        $this->assertCount(5, DeviceType::cases());
    }

    // --- GoalPeriod ---

    public function test_goal_period_has_daily_case(): void
    {
        $this->assertEquals('DAILY', GoalPeriod::DAILY->value);
    }

    public function test_goal_period_has_weekly_case(): void
    {
        $this->assertEquals('WEEKLY', GoalPeriod::WEEKLY->value);
    }

    public function test_goal_period_has_monthly_case(): void
    {
        $this->assertEquals('MONTHLY', GoalPeriod::MONTHLY->value);
    }

    public function test_goal_period_has_custom_case(): void
    {
        $this->assertEquals('CUSTOM', GoalPeriod::CUSTOM->value);
    }

    public function test_goal_period_has_exactly_four_cases(): void
    {
        $this->assertCount(4, GoalPeriod::cases());
    }

    // --- GoalStatus ---

    public function test_goal_status_has_active_case(): void
    {
        $this->assertEquals('ACTIVE', GoalStatus::ACTIVE->value);
    }

    public function test_goal_status_has_completed_case(): void
    {
        $this->assertEquals('COMPLETED', GoalStatus::COMPLETED->value);
    }

    public function test_goal_status_has_abandoned_case(): void
    {
        $this->assertEquals('ABANDONED', GoalStatus::ABANDONED->value);
    }

    public function test_goal_status_has_exactly_three_cases(): void
    {
        $this->assertCount(3, GoalStatus::cases());
    }

    // --- GoalType ---

    public function test_goal_type_has_steps_case(): void
    {
        $this->assertEquals('STEPS', GoalType::STEPS->value);
    }

    public function test_goal_type_has_sleep_case(): void
    {
        $this->assertEquals('SLEEP', GoalType::SLEEP->value);
    }

    public function test_goal_type_has_water_case(): void
    {
        $this->assertEquals('WATER', GoalType::WATER->value);
    }

    public function test_goal_type_has_weight_case(): void
    {
        $this->assertEquals('WEIGHT', GoalType::WEIGHT->value);
    }

    public function test_goal_type_has_exercise_case(): void
    {
        $this->assertEquals('EXERCISE', GoalType::EXERCISE->value);
    }

    public function test_goal_type_has_heart_rate_case(): void
    {
        $this->assertEquals('HEART_RATE', GoalType::HEART_RATE->value);
    }

    public function test_goal_type_has_blood_pressure_case(): void
    {
        $this->assertEquals('BLOOD_PRESSURE', GoalType::BLOOD_PRESSURE->value);
    }

    public function test_goal_type_has_blood_glucose_case(): void
    {
        $this->assertEquals('BLOOD_GLUCOSE', GoalType::BLOOD_GLUCOSE->value);
    }

    public function test_goal_type_has_custom_case(): void
    {
        $this->assertEquals('CUSTOM', GoalType::CUSTOM->value);
    }

    public function test_goal_type_has_exactly_nine_cases(): void
    {
        $this->assertCount(9, GoalType::cases());
    }

    // --- MetricSource ---

    public function test_metric_source_has_user_input_case(): void
    {
        $this->assertEquals('USER_INPUT', MetricSource::USER_INPUT->value);
    }

    public function test_metric_source_has_google_fit_case(): void
    {
        $this->assertEquals('GOOGLE_FIT', MetricSource::GOOGLE_FIT->value);
    }

    public function test_metric_source_has_health_kit_case(): void
    {
        $this->assertEquals('HEALTH_KIT', MetricSource::HEALTH_KIT->value);
    }

    public function test_metric_source_has_external_lab_case(): void
    {
        $this->assertEquals('EXTERNAL_LAB', MetricSource::EXTERNAL_LAB->value);
    }

    public function test_metric_source_has_connected_device_case(): void
    {
        $this->assertEquals('CONNECTED_DEVICE', MetricSource::CONNECTED_DEVICE->value);
    }

    public function test_metric_source_has_calculated_case(): void
    {
        $this->assertEquals('CALCULATED', MetricSource::CALCULATED->value);
    }

    public function test_metric_source_has_exactly_six_cases(): void
    {
        $this->assertCount(6, MetricSource::cases());
    }

    // --- MetricType ---

    public function test_metric_type_has_steps_case(): void
    {
        $this->assertEquals('STEPS', MetricType::STEPS->value);
    }

    public function test_metric_type_has_heart_rate_case(): void
    {
        $this->assertEquals('HEART_RATE', MetricType::HEART_RATE->value);
    }

    public function test_metric_type_has_weight_case(): void
    {
        $this->assertEquals('WEIGHT', MetricType::WEIGHT->value);
    }

    public function test_metric_type_has_blood_pressure_systolic_case(): void
    {
        $this->assertEquals('BLOOD_PRESSURE_SYSTOLIC', MetricType::BLOOD_PRESSURE_SYSTOLIC->value);
    }

    public function test_metric_type_has_blood_pressure_diastolic_case(): void
    {
        $this->assertEquals('BLOOD_PRESSURE_DIASTOLIC', MetricType::BLOOD_PRESSURE_DIASTOLIC->value);
    }

    public function test_metric_type_has_blood_glucose_case(): void
    {
        $this->assertEquals('BLOOD_GLUCOSE', MetricType::BLOOD_GLUCOSE->value);
    }

    public function test_metric_type_has_sleep_case(): void
    {
        $this->assertEquals('SLEEP', MetricType::SLEEP->value);
    }

    public function test_metric_type_has_oxygen_saturation_case(): void
    {
        $this->assertEquals('OXYGEN_SATURATION', MetricType::OXYGEN_SATURATION->value);
    }

    public function test_metric_type_has_body_temperature_case(): void
    {
        $this->assertEquals('BODY_TEMPERATURE', MetricType::BODY_TEMPERATURE->value);
    }

    public function test_metric_type_has_respiratory_rate_case(): void
    {
        $this->assertEquals('RESPIRATORY_RATE', MetricType::RESPIRATORY_RATE->value);
    }

    public function test_metric_type_has_calories_case(): void
    {
        $this->assertEquals('CALORIES', MetricType::CALORIES->value);
    }

    public function test_metric_type_has_distance_case(): void
    {
        $this->assertEquals('DISTANCE', MetricType::DISTANCE->value);
    }

    public function test_metric_type_has_floors_case(): void
    {
        $this->assertEquals('FLOORS', MetricType::FLOORS->value);
    }

    public function test_metric_type_has_activity_case(): void
    {
        $this->assertEquals('ACTIVITY', MetricType::ACTIVITY->value);
    }

    public function test_metric_type_has_unknown_case(): void
    {
        $this->assertEquals('UNKNOWN', MetricType::UNKNOWN->value);
    }

    public function test_metric_type_has_exactly_fifteen_cases(): void
    {
        $this->assertCount(15, MetricType::cases());
    }
}
