import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';
export class TranslationChecker {
    constructor() {
        this.issues = [];
        this.successCount = 0;
        this.failCount = 0;
        this.totalTranslations = 0;
        this.filesChecked = new Set();
    }
    async checkProject(projectPath = process.cwd()) {
        console.log(`Checking project at: ${projectPath}\n`);
        try {
            // Use simple patterns that work on all platforms
            const patterns = [
                'src/**/*.ts',
                'src/**/*.tsx',
                'src/**/*.js',
                'src/**/*.jsx'
            ];
            let allFiles = [];
            for (const pattern of patterns) {
                console.log(`Searching with pattern: ${pattern}`);
                const files = await glob(pattern, {
                    cwd: projectPath,
                    absolute: true,
                    nodir: true,
                    windowsPathsNoEscape: true
                });
                console.log(`  Found ${files.length} files`);
                allFiles = allFiles.concat(files);
            }
            // Remove duplicates
            allFiles = [...new Set(allFiles)];
            console.log(`\nTotal unique files found: ${allFiles.length}\n`);
            if (allFiles.length === 0) {
                console.log('⚠️  No files found. Make sure you have a "src" directory.');
                console.log('Current working directory:', process.cwd());
                console.log('Project path:', projectPath);
                console.log('\nTrying to list src directory...');
                const srcPath = path.join(projectPath, 'src');
                if (fs.existsSync(srcPath)) {
                    console.log('✓ src directory exists');
                    const contents = fs.readdirSync(srcPath);
                    console.log('Contents:', contents.slice(0, 10));
                }
                else {
                    console.log('✗ src directory does not exist');
                }
                console.log();
            }
            for (const file of allFiles) {
                await this.checkFile(file);
            }
        }
        catch (error) {
            console.error('Error during file search:', error);
        }
        return {
            totalFiles: this.filesChecked.size,
            filesWithIssues: new Set(this.issues.map(i => i.file)).size,
            totalTranslations: this.totalTranslations,
            successCount: this.successCount,
            failCount: this.failCount,
            issues: this.issues
        };
    }
    async checkFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            // Check if file uses useTranslation hook
            if (!this.hasUseTranslation(content)) {
                return;
            }
            this.filesChecked.add(filePath);
            const relativePath = path.relative(process.cwd(), filePath);
            console.log(`✓ Checking: ${relativePath}`);
            const lines = content.split('\n');
            // Find all t() function calls
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                this.checkLineForTranslations(line, i + 1, filePath);
            }
        }
        catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
        }
    }
    hasUseTranslation(content) {
        return /useTranslation/.test(content);
    }
    checkLineForTranslations(line, lineNumber, filePath) {
        // Enhanced regex to match various t() call patterns
        const tFunctionRegex = /\bt\s*\(\s*["'`]([^"'`]+)["'`]\s*(?:,\s*(\{[^}]*\}))?/g;
        let match;
        while ((match = tFunctionRegex.exec(line)) !== null) {
            this.totalTranslations++;
            const key = match[1];
            const options = match[2] || '';
            const column = match.index + 1;
            // Check if there's a defaultValue in the options
            if (!options || !options.includes('defaultValue')) {
                this.failCount++;
                this.issues.push({
                    file: filePath,
                    line: lineNumber,
                    column,
                    key,
                    issue: 'Missing defaultValue for translation'
                });
            }
            else {
                // Check if defaultValue contains Arabic characters
                const defaultValueMatch = /defaultValue\s*:\s*["'`]([^"'`]+)["'`]/.exec(options);
                if (defaultValueMatch) {
                    const defaultValue = defaultValueMatch[1];
                    const hasArabic = /[\u0600-\u06FF]/.test(defaultValue);
                    if (!hasArabic) {
                        this.failCount++;
                        this.issues.push({
                            file: filePath,
                            line: lineNumber,
                            column,
                            key,
                            issue: 'defaultValue does not contain Arabic text'
                        });
                    }
                    else {
                        this.successCount++;
                    }
                }
                else {
                    this.failCount++;
                    this.issues.push({
                        file: filePath,
                        line: lineNumber,
                        column,
                        key,
                        issue: 'defaultValue format is invalid'
                    });
                }
            }
        }
    }
}
