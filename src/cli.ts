#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { TranslationChecker } from './checker.js';
import { Reporter } from './reporter.js';

async function main() {
    let projectPath = process.argv[2] || process.cwd();

    console.log('🔧 Debug Info:');
    console.log(`   Node version: ${process.version}`);
    console.log(`   Current working directory: ${process.cwd()}`);
    console.log(`   Project path: ${projectPath}`);

    if (!process.argv[2]) {
        const srcPath = path.join(process.cwd(), 'src');
        if (fs.existsSync(srcPath)) {
            console.log('   📁 Found src directory\n');
            projectPath = process.cwd();
        } else {
            console.log('   ⚠️  No src directory found\n');
        }
    }

    console.log(`🔍 Checking translations in: ${projectPath}\n`);

    const checker = new TranslationChecker();
    const result = await checker.checkProject(projectPath);

    Reporter.printResults(result);
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});