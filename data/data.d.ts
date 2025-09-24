export interface AssessmentData {
    session_id: string;
    accuracy: number;
    assessmentResultId: string;
    assessment_id: string;
    bodyCompositionData?: {
        AGR: string;
        Age?: string;
        BFC: string;
        BMI: string;
        BMR: string;
        FM: string;
        FMI: string;
        HeightM?: string;
        LM: string;
        LMI: string;
        M_Age: string;
        WHGR: string;
        WHR: string;
    };
    exercises: Exercise[];
    finalPainScore: string;
    gender: string;
    height: number;
    initialPainScore: number;
    initialVAS: number;
    isLandmarksUploaded: boolean;
    laterPainScore: string;
    reportLink: string;
    reportsDataId: string;
    timeElapsed: number;
    timestamp: number;
    vitalsMap: VitalsMap;
    weight: number;
}
export interface Exercise {
    analysisList?: string[];
    analysisScore?: number;
    assignReps: number;
    correctReps: number;
    id: number;
    name: string;
    setList: SetList[];
    side: string;
    tipsList?: string[];
    totalReps: number;
    totalSets: number;
    variationId: string;
    variationName: string;
}
export interface SetList {
    additionalFields: AdditionalField[];
    correctReps: number;
    incorrectReps: number;
    isSkipped: boolean;
    time: number;
    totalReps: number;
}
export interface AdditionalField {
    fieldName: string;
    fieldText: string;
    fieldUnit: string;
    fieldValue: string;
    shouldDisplay: boolean;
}
export interface VitalsMap {
    api_key: string;
    employee_id: string;
    entry_time: string;
    health_risk_score: number;
    metadata: {
        cardiovascular: {
            cardiac_out: number;
            map: number;
            prq: number;
        };
        fps: number;
        glucose_info: {
            diabetes_control_score: number;
            hba1c: number;
            status: string;
        };
        heart_scores: {
            HRMax: number;
            HRR: string;
            THRR: string;
            heart_utilized: string;
            pNN50_per: number;
            rmssd: number;
            sdnn: number;
            stress_index: number;
            zone_details: {
                highZoneRange: number;
                lowZoneRange: string;
                zone: string;
            };
        };
        physiological_scores: {
            bloodvolume: string;
            bmi: string;
            bodyfat: string;
            cal_carb: string;
            cal_fat: string;
            dob: string;
            gender: string;
            height: string;
            intensity: string;
            tbw: string;
            tbwp: string;
            vo2max: string;
            weight: string;
        };
    };
    posture: string;
    scan_completion_time: string;
    scan_id: string;
    statusCode: number;
    vitals: {
        bp_dia: number;
        bp_sys: number;
        heart_rate: number;
        oxy_sat_prcnt: number;
        resp_rate: number;
    };
    wellness_score: number;
    user_id?: string;
}
export declare const assessmentData: AssessmentData[];
export declare function getAssessmentBySessionId(sessionId: string): AssessmentData | undefined;
export declare function getAllAssessments(): AssessmentData[];
export declare function getAssessmentsByType(assessmentId: string): AssessmentData[];
//# sourceMappingURL=data.d.ts.map