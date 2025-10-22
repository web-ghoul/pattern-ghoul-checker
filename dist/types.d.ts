export interface TranslationIssue {
    file: string;
    line: number;
    column: number;
    key: string;
    issue: string;
}
export interface CheckResult {
    totalFiles: number;
    filesWithIssues: number;
    totalTranslations: number;
    successCount: number;
    failCount: number;
    issues: TranslationIssue[];
}
