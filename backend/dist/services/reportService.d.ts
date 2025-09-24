export interface ReportResult {
    reportPath: string;
    downloadUrl: string;
}
export interface ProcessedField {
    fieldName: string;
    displayName: string;
    value: any;
    unit?: string;
    classification?: {
        label: string;
        color: string;
    };
    shouldDisplay: boolean;
}
export interface ProcessedSection {
    sectionName: string;
    fields: ProcessedField[];
}
export interface ProcessedReport {
    assessmentId: string;
    assessmentName: string;
    sections: ProcessedSection[];
    generatedAt: string;
}
export declare function generateReport(sessionId: string): Promise<ReportResult>;
//# sourceMappingURL=reportService.d.ts.map