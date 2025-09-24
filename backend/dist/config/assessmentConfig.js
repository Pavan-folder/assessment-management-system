"use strict";
// Assessment Management System - Configuration System
// This file contains all configuration for different assessment types
// This system enables maximum flexibility without code changes
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASSESSMENT_CONFIGS = exports.CLASSIFICATION_RANGES = void 0;
exports.getAssessmentConfig = getAssessmentConfig;
exports.getAllAssessmentConfigs = getAllAssessmentConfigs;
exports.getClassificationForValue = getClassificationForValue;
exports.extractValueFromPath = extractValueFromPath;
// Field classification ranges for different metrics
exports.CLASSIFICATION_RANGES = {
    accuracy: {
        ranges: [
            { min: 0, max: 20, label: "Poor", color: "#ef4444" },
            { min: 21, max: 40, label: "Below Average", color: "#f97316" },
            { min: 41, max: 60, label: "Average", color: "#eab308" },
            { min: 61, max: 80, label: "Good", color: "#22c55e" },
            { min: 81, max: 100, label: "Excellent", color: "#16a34a" }
        ],
        defaultLabel: "Unknown",
        defaultColor: "#6b7280"
    },
    heartRate: {
        ranges: [
            { min: 0, max: 60, label: "Low", color: "#3b82f6" },
            { min: 61, max: 100, label: "Normal", color: "#22c55e" },
            { min: 101, max: 120, label: "Elevated", color: "#eab308" },
            { min: 121, max: 200, label: "High", color: "#ef4444" }
        ],
        defaultLabel: "Unknown",
        defaultColor: "#6b7280"
    },
    bloodPressure: {
        ranges: [
            { min: 0, max: 90, label: "Low", color: "#3b82f6" },
            { min: 91, max: 120, label: "Normal", color: "#22c55e" },
            { min: 121, max: 140, label: "Elevated", color: "#eab308" },
            { min: 141, max: 200, label: "High", color: "#ef4444" }
        ],
        defaultLabel: "Unknown",
        defaultColor: "#6b7280"
    },
    bmi: {
        ranges: [
            { min: 0, max: 18.5, label: "Underweight", color: "#3b82f6" },
            { min: 18.5, max: 24.9, label: "Normal", color: "#22c55e" },
            { min: 25, max: 29.9, label: "Overweight", color: "#eab308" },
            { min: 30, max: 100, label: "Obese", color: "#ef4444" }
        ],
        defaultLabel: "Unknown",
        defaultColor: "#6b7280"
    },
    wellnessScore: {
        ranges: [
            { min: 0, max: 30, label: "Poor", color: "#ef4444" },
            { min: 31, max: 50, label: "Below Average", color: "#f97316" },
            { min: 51, max: 70, label: "Average", color: "#eab308" },
            { min: 71, max: 85, label: "Good", color: "#22c55e" },
            { min: 86, max: 100, label: "Excellent", color: "#16a34a" }
        ],
        defaultLabel: "Unknown",
        defaultColor: "#6b7280"
    }
};
// Assessment type configurations
exports.ASSESSMENT_CONFIGS = [
    {
        assessmentId: "as_hr_02",
        assessmentName: "Health & Fitness Assessment",
        description: "Comprehensive health and fitness evaluation including body composition, cardiovascular health, and physical performance metrics.",
        templateFile: "health-fitness-report.html",
        sections: [
            {
                sectionName: "Key Body Vitals",
                displayOrder: 1,
                fields: [
                    {
                        fieldName: "overallHealthScore",
                        displayName: "Overall Health Score",
                        unit: "%",
                        dataPath: "accuracy",
                        classification: exports.CLASSIFICATION_RANGES.accuracy,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "heartRate",
                        displayName: "Heart Rate",
                        unit: "bpm",
                        dataPath: "vitalsMap.vitals.heart_rate",
                        classification: exports.CLASSIFICATION_RANGES.heartRate,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "bloodPressureSystolic",
                        displayName: "Blood Pressure (Systolic)",
                        unit: "mmHg",
                        dataPath: "vitalsMap.vitals.bp_sys",
                        classification: exports.CLASSIFICATION_RANGES.bloodPressure,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "bloodPressureDiastolic",
                        displayName: "Blood Pressure (Diastolic)",
                        unit: "mmHg",
                        dataPath: "vitalsMap.vitals.bp_dia",
                        classification: exports.CLASSIFICATION_RANGES.bloodPressure,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "oxygenSaturation",
                        displayName: "Oxygen Saturation",
                        unit: "%",
                        dataPath: "vitalsMap.vitals.oxy_sat_prcnt",
                        shouldDisplay: true
                    }
                ]
            },
            {
                sectionName: "Heart Health",
                displayOrder: 2,
                fields: [
                    {
                        fieldName: "heartRateVariability",
                        displayName: "Heart Rate Variability (RMSSD)",
                        unit: "ms",
                        dataPath: "vitalsMap.metadata.heart_scores.rmssd",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "stressIndex",
                        displayName: "Stress Index",
                        dataPath: "vitalsMap.metadata.heart_scores.stress_index",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "heartUtilization",
                        displayName: "Heart Utilization",
                        unit: "%",
                        dataPath: "vitalsMap.metadata.heart_scores.heart_utilized",
                        shouldDisplay: true
                    }
                ]
            },
            {
                sectionName: "Stress Level",
                displayOrder: 3,
                fields: [
                    {
                        fieldName: "pnn50",
                        displayName: "PNN50",
                        unit: "%",
                        dataPath: "vitalsMap.metadata.heart_scores.pNN50_per",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "sdnn",
                        displayName: "SDNN",
                        unit: "ms",
                        dataPath: "vitalsMap.metadata.heart_scores.sdnn",
                        shouldDisplay: true
                    }
                ]
            },
            {
                sectionName: "Fitness Levels",
                displayOrder: 4,
                fields: [
                    {
                        fieldName: "cardiovascularEndurance",
                        displayName: "Cardiovascular Endurance",
                        unit: "seconds",
                        dataPath: "exercises.find(ex => ex.id === 235).setList[0].time",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "squatPerformance",
                        displayName: "Squat Performance",
                        unit: "reps",
                        dataPath: "exercises.find(ex => ex.id === 259).correctReps",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "flexibility",
                        displayName: "Flexibility",
                        unit: "cm",
                        dataPath: "exercises.find(ex => ex.id === 281).setList[0].additionalFields.find(field => field.fieldName === 'Distance').fieldValue",
                        shouldDisplay: true
                    }
                ]
            },
            {
                sectionName: "Posture Analysis",
                displayOrder: 5,
                fields: [
                    {
                        fieldName: "postureScore",
                        displayName: "Posture Score",
                        unit: "%",
                        dataPath: "exercises.find(ex => ex.id === 73).analysisScore",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "posture",
                        displayName: "Current Posture",
                        dataPath: "vitalsMap.posture",
                        shouldDisplay: true
                    }
                ]
            },
            {
                sectionName: "Body Composition",
                displayOrder: 6,
                fields: [
                    {
                        fieldName: "bmi",
                        displayName: "Body Mass Index (BMI)",
                        dataPath: "bodyCompositionData.BMI",
                        classification: exports.CLASSIFICATION_RANGES.bmi,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "bodyFat",
                        displayName: "Body Fat",
                        unit: "%",
                        dataPath: "vitalsMap.metadata.physiological_scores.bodyfat",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "leanMass",
                        displayName: "Lean Body Mass",
                        unit: "kg",
                        dataPath: "bodyCompositionData.LM",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "metabolicAge",
                        displayName: "Metabolic Age",
                        unit: "years",
                        dataPath: "bodyCompositionData.M_Age",
                        shouldDisplay: true
                    }
                ]
            }
        ]
    },
    {
        assessmentId: "as_card_01",
        assessmentName: "Cardiac Assessment",
        description: "Focused cardiac health evaluation with emphasis on cardiovascular metrics and heart function.",
        templateFile: "cardiac-assessment-report.html",
        sections: [
            {
                sectionName: "Key Body Vitals",
                displayOrder: 1,
                fields: [
                    {
                        fieldName: "overallHealthScore",
                        displayName: "Overall Health Score",
                        unit: "%",
                        dataPath: "accuracy",
                        classification: exports.CLASSIFICATION_RANGES.accuracy,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "heartRate",
                        displayName: "Heart Rate",
                        unit: "bpm",
                        dataPath: "vitalsMap.vitals.heart_rate",
                        classification: exports.CLASSIFICATION_RANGES.heartRate,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "bloodPressureSystolic",
                        displayName: "Blood Pressure (Systolic)",
                        unit: "mmHg",
                        dataPath: "vitalsMap.vitals.bp_sys",
                        classification: exports.CLASSIFICATION_RANGES.bloodPressure,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "bloodPressureDiastolic",
                        displayName: "Blood Pressure (Diastolic)",
                        unit: "mmHg",
                        dataPath: "vitalsMap.vitals.bp_dia",
                        classification: exports.CLASSIFICATION_RANGES.bloodPressure,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "oxygenSaturation",
                        displayName: "Oxygen Saturation",
                        unit: "%",
                        dataPath: "vitalsMap.vitals.oxy_sat_prcnt",
                        shouldDisplay: true
                    }
                ]
            },
            {
                sectionName: "Cardiovascular Endurance",
                displayOrder: 2,
                fields: [
                    {
                        fieldName: "cardiacOutput",
                        displayName: "Cardiac Output",
                        unit: "L/min",
                        dataPath: "vitalsMap.metadata.cardiovascular.cardiac_out",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "meanArterialPressure",
                        displayName: "Mean Arterial Pressure",
                        unit: "mmHg",
                        dataPath: "vitalsMap.metadata.cardiovascular.map",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "peripheralResistance",
                        displayName: "Peripheral Resistance",
                        dataPath: "vitalsMap.metadata.cardiovascular.prq",
                        shouldDisplay: true
                    }
                ]
            },
            {
                sectionName: "Body Composition",
                displayOrder: 3,
                fields: [
                    {
                        fieldName: "bmi",
                        displayName: "Body Mass Index (BMI)",
                        dataPath: "bodyCompositionData.BMI",
                        classification: exports.CLASSIFICATION_RANGES.bmi,
                        shouldDisplay: true
                    },
                    {
                        fieldName: "bodyFat",
                        displayName: "Body Fat",
                        unit: "%",
                        dataPath: "vitalsMap.metadata.physiological_scores.bodyfat",
                        shouldDisplay: true
                    },
                    {
                        fieldName: "leanMass",
                        displayName: "Lean Body Mass",
                        unit: "kg",
                        dataPath: "bodyCompositionData.LM",
                        shouldDisplay: true
                    }
                ]
            }
        ]
    }
];
// Helper functions for configuration system
function getAssessmentConfig(assessmentId) {
    return exports.ASSESSMENT_CONFIGS.find(config => config.assessmentId === assessmentId);
}
function getAllAssessmentConfigs() {
    return exports.ASSESSMENT_CONFIGS;
}
function getClassificationForValue(fieldName, value) {
    const classification = exports.CLASSIFICATION_RANGES[fieldName];
    if (!classification) {
        return { label: "Unknown", color: "#6b7280" };
    }
    const range = classification.ranges.find(r => value >= r.min && value <= r.max);
    if (range) {
        return { label: range.label, color: range.color };
    }
    return { label: classification.defaultLabel, color: classification.defaultColor };
}
// Function to extract value from assessment data using JSON path
function extractValueFromPath(data, path) {
    try {
        const keys = path.split('.');
        let current = data;
        for (const key of keys) {
            if (key.includes('find(')) {
                // Handle array find operations like "exercises.find(ex => ex.id === 235)"
                const match = key.match(/find\((\w+)\s*=>\s*\1\.(\w+)\s*===\s*(\d+)\)/);
                if (match) {
                    const [, arrayName, property, targetValue] = match;
                    if (current[arrayName] && Array.isArray(current[arrayName])) {
                        const found = current[arrayName].find((item) => item[property] === parseInt(targetValue));
                        if (found) {
                            current = found;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
            else {
                if (current && current[key] !== undefined) {
                    current = current[key];
                }
                else {
                    return null;
                }
            }
        }
        return current;
    }
    catch (error) {
        console.error(`Error extracting value from path "${path}":`, error);
        return null;
    }
}
//# sourceMappingURL=assessmentConfig.js.map