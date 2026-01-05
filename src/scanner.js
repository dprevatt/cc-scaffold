import fs from 'fs/promises';
import path from 'path';

/**
 * Quick file-based project detection for --scan flag.
 * Does NOT invoke Claude - just pattern matching.
 */
export async function scanProject(projectPath = process.cwd()) {
  const detected = {
    name: path.basename(projectPath),
    languages: [],
    frameworks: [],
    databases: [],
    architecture: [],
    projectType: 'general',
    techStack: [],
    hasTests: false,
    hasDocker: false,
    hasCI: false,
    hasApi: false,
    existingClaude: false,
    existingClaudeComponents: {
      skills: [],
      agents: [],
      hooks: [],
    },
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DETECT LANGUAGES & FRAMEWORKS
  // ─────────────────────────────────────────────────────────────────────────

  // Node.js / JavaScript / TypeScript
  if (await fileExists(projectPath, 'package.json')) {
    detected.languages.push('javascript');
    detected.techStack.push('nodejs');

    const pkg = await readJson(projectPath, 'package.json');
    detected.name = pkg.name || detected.name;

    // Detect frameworks from dependencies
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    if (allDeps['@angular/core']) {
      detected.frameworks.push('angular');
      detected.techStack.push('angular');
      detected.projectType = 'angular-frontend';
    }
    if (allDeps['next']) {
      detected.frameworks.push('nextjs');
      detected.techStack.push('nextjs');
      detected.projectType = 'react-nextjs';
    }
    if (allDeps['react'] && !allDeps['next']) {
      detected.frameworks.push('react');
      detected.techStack.push('react');
      detected.projectType = 'react-nextjs';
    }
    if (allDeps['vue']) {
      detected.frameworks.push('vue');
      detected.techStack.push('vue');
      detected.projectType = 'general';
    }
    if (allDeps['express'] || allDeps['fastify'] || allDeps['koa'] || allDeps['hapi']) {
      detected.frameworks.push('node-api');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
    if (allDeps['typescript']) {
      detected.languages.push('typescript');
      detected.techStack.push('typescript');
    }
    if (allDeps['@nestjs/core']) {
      detected.frameworks.push('nestjs');
      detected.techStack.push('nestjs');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }

    // Detect test frameworks
    if (allDeps['jest'] || allDeps['mocha'] || allDeps['vitest'] || allDeps['ava']) {
      detected.hasTests = true;
    }

    // Detect database libraries
    if (allDeps['pg'] || allDeps['postgres']) {
      detected.databases.push('postgresql');
      detected.techStack.push('sql');
    }
    if (allDeps['mysql'] || allDeps['mysql2']) {
      detected.databases.push('mysql');
      detected.techStack.push('sql');
    }
    if (allDeps['mongodb'] || allDeps['mongoose']) {
      detected.databases.push('mongodb');
      detected.techStack.push('nosql');
    }
    if (allDeps['redis'] || allDeps['ioredis']) {
      detected.databases.push('redis');
    }
    if (allDeps['prisma'] || allDeps['@prisma/client']) {
      detected.frameworks.push('prisma');
    }
    if (allDeps['typeorm']) {
      detected.frameworks.push('typeorm');
    }
    if (allDeps['sequelize']) {
      detected.frameworks.push('sequelize');
    }
  }

  // .NET / C#
  const csprojFiles = await glob(projectPath, '**/*.csproj');
  if (csprojFiles.length > 0) {
    detected.languages.push('csharp');
    detected.techStack.push('dotnet');

    // Read csproj files to detect more details
    for (const csproj of csprojFiles.slice(0, 5)) {
      const content = await readFile(projectPath, csproj);

      if (content.includes('Microsoft.EntityFrameworkCore')) {
        if (!detected.frameworks.includes('ef-core')) {
          detected.frameworks.push('ef-core');
          detected.techStack.push('ef-core');
        }
      }
      if (content.includes('Microsoft.AspNetCore')) {
        if (!detected.frameworks.includes('aspnet')) {
          detected.frameworks.push('aspnet');
          detected.projectType = 'api-service';
          detected.hasApi = true;
        }
      }
      if (content.includes('xunit') || content.includes('NUnit') || content.includes('MSTest')) {
        detected.hasTests = true;
      }
      if (content.includes('Blazor')) {
        detected.frameworks.push('blazor');
      }
    }

    // Check for solution file to determine if it's a larger project
    const slnFiles = await glob(projectPath, '*.sln');
    if (slnFiles.length > 0 && csprojFiles.length > 3) {
      detected.projectType = 'dotnet-clean-arch';
    }
  }

  // Python
  if (await fileExists(projectPath, 'requirements.txt') ||
      await fileExists(projectPath, 'pyproject.toml') ||
      await fileExists(projectPath, 'setup.py') ||
      await fileExists(projectPath, 'Pipfile')) {
    detected.languages.push('python');
    detected.techStack.push('python');

    // Check for frameworks
    const reqContent = await readFile(projectPath, 'requirements.txt').catch(() => '');
    const pyprojectContent = await readFile(projectPath, 'pyproject.toml').catch(() => '');
    const combined = reqContent + pyprojectContent;

    if (combined.includes('fastapi') || combined.includes('FastAPI')) {
      detected.frameworks.push('fastapi');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
    if (combined.includes('django') || combined.includes('Django')) {
      detected.frameworks.push('django');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
    if (combined.includes('flask') || combined.includes('Flask')) {
      detected.frameworks.push('flask');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
    if (combined.includes('pytest')) {
      detected.hasTests = true;
    }
    if (combined.includes('sqlalchemy') || combined.includes('SQLAlchemy')) {
      detected.frameworks.push('sqlalchemy');
    }
  }

  // Go
  if (await fileExists(projectPath, 'go.mod')) {
    detected.languages.push('go');
    detected.techStack.push('go');

    const goModContent = await readFile(projectPath, 'go.mod').catch(() => '');

    if (goModContent.includes('gin-gonic')) {
      detected.frameworks.push('gin');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
    if (goModContent.includes('echo')) {
      detected.frameworks.push('echo');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
    if (goModContent.includes('fiber')) {
      detected.frameworks.push('fiber');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
  }

  // Rust
  if (await fileExists(projectPath, 'Cargo.toml')) {
    detected.languages.push('rust');
    detected.techStack.push('rust');

    const cargoContent = await readFile(projectPath, 'Cargo.toml').catch(() => '');

    if (cargoContent.includes('actix-web')) {
      detected.frameworks.push('actix');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
    if (cargoContent.includes('axum')) {
      detected.frameworks.push('axum');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
  }

  // Java
  if (await fileExists(projectPath, 'pom.xml') || await fileExists(projectPath, 'build.gradle')) {
    detected.languages.push('java');
    detected.techStack.push('java');

    const pomContent = await readFile(projectPath, 'pom.xml').catch(() => '');
    const gradleContent = await readFile(projectPath, 'build.gradle').catch(() => '');
    const combined = pomContent + gradleContent;

    if (combined.includes('spring-boot') || combined.includes('org.springframework.boot')) {
      detected.frameworks.push('spring-boot');
      detected.projectType = 'api-service';
      detected.hasApi = true;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DETECT ARCHITECTURE PATTERNS
  // ─────────────────────────────────────────────────────────────────────────

  // Clean Architecture
  if ((await dirExists(projectPath, 'src/Domain') && await dirExists(projectPath, 'src/Application')) ||
      (await dirExists(projectPath, 'Domain') && await dirExists(projectPath, 'Application')) ||
      (await dirExists(projectPath, 'src/Core') && await dirExists(projectPath, 'src/Infrastructure'))) {
    detected.architecture.push('clean-architecture');
    if (detected.techStack.includes('dotnet')) {
      detected.projectType = 'dotnet-clean-arch';
    }
  }

  // Vertical Slice
  if (await dirExists(projectPath, 'src/Features') || await dirExists(projectPath, 'Features')) {
    detected.architecture.push('vertical-slice');
  }

  // CQRS (look for Commands/Queries folders or MediatR)
  if (await dirExists(projectPath, 'src/Application/Commands') ||
      await dirExists(projectPath, 'src/Application/Queries') ||
      await dirExists(projectPath, 'Commands') ||
      await dirExists(projectPath, 'Queries')) {
    detected.architecture.push('cqrs');
  }

  // Repository Pattern
  if (await dirExists(projectPath, 'src/Repositories') ||
      await dirExists(projectPath, 'Repositories') ||
      await dirExists(projectPath, 'src/Infrastructure/Repositories')) {
    detected.architecture.push('repository-pattern');
  }

  // Microservices
  if (await dirExists(projectPath, 'services') ||
      await fileExists(projectPath, 'docker-compose.yml')) {
    const dockerContent = await readFile(projectPath, 'docker-compose.yml').catch(() => '');
    if (dockerContent.includes('services:') && (dockerContent.match(/services:/g) || []).length > 3) {
      detected.architecture.push('microservices');
    }
  }

  // Monorepo
  if (await fileExists(projectPath, 'pnpm-workspace.yaml') ||
      await fileExists(projectPath, 'lerna.json') ||
      await fileExists(projectPath, 'nx.json') ||
      await dirExists(projectPath, 'packages') ||
      await dirExists(projectPath, 'apps')) {
    detected.projectType = 'monorepo';
  }

  // CLI Tool
  if (await fileExists(projectPath, 'package.json')) {
    const pkg = await readJson(projectPath, 'package.json').catch(() => ({}));
    if (pkg.bin || (pkg.keywords && pkg.keywords.includes('cli'))) {
      detected.projectType = 'cli-tool';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DETECT INFRASTRUCTURE
  // ─────────────────────────────────────────────────────────────────────────

  // Docker
  if (await fileExists(projectPath, 'Dockerfile') ||
      await fileExists(projectPath, 'docker-compose.yml') ||
      await fileExists(projectPath, 'docker-compose.yaml') ||
      await fileExists(projectPath, '.dockerignore')) {
    detected.hasDocker = true;
    detected.techStack.push('docker');
  }

  // Kubernetes
  if (await dirExists(projectPath, 'k8s') ||
      await dirExists(projectPath, 'kubernetes') ||
      await dirExists(projectPath, 'helm')) {
    detected.techStack.push('kubernetes');
  }

  // CI/CD
  if (await dirExists(projectPath, '.github/workflows') ||
      await fileExists(projectPath, '.gitlab-ci.yml') ||
      await fileExists(projectPath, 'azure-pipelines.yml') ||
      await fileExists(projectPath, 'Jenkinsfile') ||
      await fileExists(projectPath, '.circleci/config.yml')) {
    detected.hasCI = true;
  }

  // Databases (look for connection strings, migrations, etc.)
  const configFiles = await glob(projectPath, '**/*.{json,yaml,yml,env,config}', 30);
  for (const file of configFiles) {
    const content = await readFile(projectPath, file).catch(() => '');
    if (content.includes('postgres') || content.includes('PostgreSQL') || content.includes('5432')) {
      if (!detected.databases.includes('postgresql')) {
        detected.databases.push('postgresql');
        if (!detected.techStack.includes('sql')) detected.techStack.push('sql');
      }
    }
    if (content.includes('SqlServer') || content.includes('MSSQL') || content.includes('1433')) {
      if (!detected.databases.includes('sqlserver')) {
        detected.databases.push('sqlserver');
        if (!detected.techStack.includes('sql')) detected.techStack.push('sql');
      }
    }
    if (content.includes('mongodb') || content.includes('MongoDB') || content.includes('27017')) {
      if (!detected.databases.includes('mongodb')) {
        detected.databases.push('mongodb');
        if (!detected.techStack.includes('nosql')) detected.techStack.push('nosql');
      }
    }
    if (content.includes('mysql') || content.includes('MySQL') || content.includes('3306')) {
      if (!detected.databases.includes('mysql')) {
        detected.databases.push('mysql');
        if (!detected.techStack.includes('sql')) detected.techStack.push('sql');
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DETECT EXISTING .claude/ CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────

  if (await dirExists(projectPath, '.claude')) {
    detected.existingClaude = true;

    // List existing skills
    const skillsDir = path.join(projectPath, '.claude', 'skills');
    if (await dirExists(projectPath, '.claude/skills')) {
      try {
        const skillDirs = await fs.readdir(skillsDir);
        for (const d of skillDirs) {
          const stat = await fs.stat(path.join(skillsDir, d)).catch(() => null);
          if (stat?.isDirectory()) {
            detected.existingClaudeComponents.skills.push(d);
          }
        }
      } catch {
        // Directory might not exist or be accessible
      }
    }

    // List existing agents
    const agentsDir = path.join(projectPath, '.claude', 'agents');
    if (await dirExists(projectPath, '.claude/agents')) {
      try {
        const agentFiles = await fs.readdir(agentsDir);
        detected.existingClaudeComponents.agents = agentFiles
          .filter(f => f.endsWith('.md'))
          .map(f => f.replace('.md', ''));
      } catch {
        // Directory might not exist or be accessible
      }
    }

    // List existing hooks
    const hooksDir = path.join(projectPath, '.claude', 'hooks');
    if (await dirExists(projectPath, '.claude/hooks')) {
      try {
        const hookFiles = await fs.readdir(hooksDir);
        detected.existingClaudeComponents.hooks = hookFiles
          .filter(f => f.endsWith('.sh'))
          .map(f => f.replace('.sh', ''));
      } catch {
        // Directory might not exist or be accessible
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DEDUPLICATE ARRAYS
  // ─────────────────────────────────────────────────────────────────────────

  detected.languages = [...new Set(detected.languages)];
  detected.frameworks = [...new Set(detected.frameworks)];
  detected.databases = [...new Set(detected.databases)];
  detected.architecture = [...new Set(detected.architecture)];
  detected.techStack = [...new Set(detected.techStack)];

  return detected;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

async function fileExists(basePath, relativePath) {
  try {
    await fs.access(path.join(basePath, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function dirExists(basePath, relativePath) {
  try {
    const stat = await fs.stat(path.join(basePath, relativePath));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function readFile(basePath, relativePath) {
  return fs.readFile(path.join(basePath, relativePath), 'utf-8');
}

async function readJson(basePath, relativePath) {
  const content = await readFile(basePath, relativePath);
  return JSON.parse(content);
}

async function glob(basePath, pattern, limit = 100) {
  try {
    const { glob: fastGlob } = await import('fast-glob');
    const results = await fastGlob(pattern, {
      cwd: basePath,
      ignore: [
        'node_modules/**',
        '.git/**',
        'dist/**',
        'build/**',
        'coverage/**',
        'bin/**',
        'obj/**',
        '.next/**',
        '.nuxt/**',
        'vendor/**',
        '__pycache__/**',
      ],
      onlyFiles: true,
    });
    return results.slice(0, limit);
  } catch {
    // Fallback if fast-glob not available
    return [];
  }
}

/**
 * Format scan results for display
 */
export function formatScanResults(scan) {
  const lines = [];

  lines.push(`Project: ${scan.name}`);
  lines.push(`Type: ${scan.projectType}`);

  if (scan.languages.length > 0) {
    lines.push(`Languages: ${scan.languages.join(', ')}`);
  }

  if (scan.frameworks.length > 0) {
    lines.push(`Frameworks: ${scan.frameworks.join(', ')}`);
  }

  if (scan.databases.length > 0) {
    lines.push(`Databases: ${scan.databases.join(', ')}`);
  }

  if (scan.architecture.length > 0) {
    lines.push(`Architecture: ${scan.architecture.join(', ')}`);
  }

  const features = [];
  if (scan.hasTests) features.push('Tests');
  if (scan.hasDocker) features.push('Docker');
  if (scan.hasCI) features.push('CI/CD');
  if (scan.hasApi) features.push('API');
  if (features.length > 0) {
    lines.push(`Features: ${features.join(', ')}`);
  }

  if (scan.existingClaude) {
    lines.push('');
    lines.push('Existing .claude/ configuration:');
    if (scan.existingClaudeComponents.skills.length > 0) {
      lines.push(`  Skills: ${scan.existingClaudeComponents.skills.join(', ')}`);
    }
    if (scan.existingClaudeComponents.agents.length > 0) {
      lines.push(`  Agents: ${scan.existingClaudeComponents.agents.join(', ')}`);
    }
    if (scan.existingClaudeComponents.hooks.length > 0) {
      lines.push(`  Hooks: ${scan.existingClaudeComponents.hooks.join(', ')}`);
    }
  }

  return lines.join('\n');
}
