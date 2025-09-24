export interface FieldMapping {
    fieldName: string;
    displayName: string;
    unit?: string;
    dataPath: string;
    classification?: ClassificationRule;
    shouldDisplay: boolean;
}
export interface ClassificationRule {
    ranges: {
        min: number;
        max: number;
        label: string;
        color: string;
    }[];
    defaultLabel: string;
    defaultColor: string;
}
export interface SectionConfig {
    sectionName: string;
    fields: FieldMapping[];
    displayOrder: number;
}
export interface AssessmentTypeConfig {
    assessmentId: string;
    assessmentName: string;
    sections: SectionConfig[];
    templateFile: string;
    description: string;
}
export declare const CLASSIFICATION_RANGES: {
    accuracy: {
        ranges: {
            min: number;
            max: number;
            label: string;
            color: string;
        }[];
        defaultLabel: string;
        defaultColor: string;
    };
    heartRate: {
        ranges: {
            min: number;
            max: number;
            label: string;
            color: string;
        }[];
        defaultLabel: string;
        defaultColor: string;
    };
    bloodPressure: {
        ranges: {
            min: number;
            max: number;
            label: string;
            color: string;
        }[];
        defaultLabel: string;
        defaultColor: string;
    };
    bmi: {
        ranges: {
            min: number;
            max: number;
            label: string;
            color: string;
        }[];
        defaultLabel: string;
        defaultColor: string;
    };
    wellnessScore: {
        ranges: {
            min: number;
            max: number;
            label: string;
            color: string;
        }[];
        defaultLabel: string;
        defaultColor: string;
    };
};
export declare const ASSESSMENT_CONFIGS: AssessmentTypeConfig[];
export declare function getAssessmentConfig(assessmentId: string): AssessmentTypeConfig | undefined;
export declare function getAllAssessmentConfigs(): AssessmentTypeConfig[];
export declare function getClassificationForValue(fieldName: string, value: number): {
    label: string;
    color: string;
};
export declare function extractValueFromPath(data: any, path: string): any;
//# sourceMappingURL=assessmentConfig.d.ts.map