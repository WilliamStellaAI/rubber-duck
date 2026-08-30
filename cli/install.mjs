#!/usr/bin/env node
/**
 * rubber-duck installer — copy rubber-duck rule + rubber-duck-* skills into agent dirs.
 *
 *   npx rubber-duck --tool cursor|codex|trae|codebuddy|workbuddy|all
 *                   [--scope user|project] [--project <path>] [--dry-run] [--force]
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HOME = os.homedir();

const MARKER_START = '<!-- rubber-duck:start -->';
const MARKER_END = '<!-- rubber-duck:end -->';

function printHelp() {
  console.log(`rubber-duck — 安装：1 条总路由 rule + 全部 skills

用法:
  npx rubber-duck --tool <name> [--scope user|project] [--project <path>] [--dry-run] [--force]

工具:
  cursor       Cursor（~/.cursor 或项目 .cursor）
  codex        Codex（AGENTS.md + .agents/skills；用户级兼写 ~/.codex/skills）
  trae         Trae（~/.trae 或项目 .trae）
  codebuddy    CodeBuddy（~/.codebuddy 或项目 .codebuddy）
  workbuddy    WorkBuddy（~/.workbuddy 或项目 .workbuddy）
  all          对本机已检测到的工具全部安装

范围:
  user         用户级（默认）
  project      项目级（默认当前目录，可用 --project）

示例:
  npx rubber-duck --tool cursor
  npx rubber-duck --tool codex --scope project
  npx rubber-duck --tool all --dry-run
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args[0] === 'install') args.shift();

  const out = {
    tool: null,
    scope: 'user',
    dryRun: false,
    force: false,
    help: false,
    projectRoot: process.cwd(),
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-h' || a === '--help') out.help = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--force') out.force = true;
    else if (a === '--tool') out.tool = args[++i];
    else if (a === '--scope') out.scope = args[++i];
    else if (a === '--project') out.projectRoot = path.resolve(args[++i]);
    else if (a.startsWith('--tool=')) out.tool = a.slice('--tool='.length);
    else if (a.startsWith('--scope=')) out.scope = a.slice('--scope='.length);
    else if (a.startsWith('--project=')) out.projectRoot = path.resolve(a.slice('--project='.length));
    else throw new Error(`未知参数: ${a}`);
  }
  return out;
}

function ensureDir(dir, dryRun) {
  if (!dryRun) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest, { dryRun, force }) {
  if (!force && fs.existsSync(dest)) {
    const same = Buffer.compare(fs.readFileSync(src), fs.readFileSync(dest)) === 0;
    if (same) return 'skip-same';
  }
  if (dryRun) return 'dry-run';
  ensureDir(path.dirname(dest), false);
  fs.copyFileSync(src, dest);
  return 'wrote';
}

function copyTree(srcDir, destDir, opts) {
  const out = [];
  ensureDir(destDir, opts.dryRun);
  for (const name of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, name);
    const dest = path.join(destDir, name);
    if (fs.statSync(src).isDirectory()) {
      out.push(...copyTree(src, dest, opts));
    } else {
      out.push({ path: dest, action: copyFile(src, dest, opts) });
    }
  }
  return out;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function agentsBlock() {
  const dir = path.join(ROOT, 'rules');
  const parts = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const body = fs.readFileSync(path.join(dir, f), 'utf8').trim();
      return `## ${f.replace(/\.md$/, '')}\n\n${body}\n`;
    });
  return `${MARKER_START}
# rubber-duck rules（安装器维护；请勿改动标记之间内容）

${parts.join('\n')}
${MARKER_END}
`;
}

function upsertAgentsMd(filePath, opts) {
  const block = agentsBlock().trim();
  let next;
  if (fs.existsSync(filePath)) {
    const cur = fs.readFileSync(filePath, 'utf8');
    if (cur.includes(MARKER_START) && cur.includes(MARKER_END)) {
      next = cur.replace(
        new RegExp(`${escapeRe(MARKER_START)}[\\s\\S]*?${escapeRe(MARKER_END)}`),
        block,
      );
    } else {
      next = `${cur.replace(/\s*$/, '')}\n\n${block}\n`;
    }
  } else {
    next = `# AGENTS.md\n\n${block}\n`;
  }

  if (!opts.force && fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === next) {
    return 'skip-same';
  }
  if (opts.dryRun) return 'dry-run';
  ensureDir(path.dirname(filePath), false);
  fs.writeFileSync(filePath, next, 'utf8');
  return 'wrote';
}

function installMdcRules(rulesDir, opts) {
  const srcDir = path.join(ROOT, 'install', 'cursor');
  ensureDir(rulesDir, opts.dryRun);
  return fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith('.mdc'))
    .map((f) => ({
      path: path.join(rulesDir, f),
      action: copyFile(path.join(srcDir, f), path.join(rulesDir, f), opts),
    }));
}

function installMdRules(rulesDir, opts) {
  const srcDir = path.join(ROOT, 'rules');
  ensureDir(rulesDir, opts.dryRun);
  return fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      path: path.join(rulesDir, f),
      action: copyFile(path.join(srcDir, f), path.join(rulesDir, f), opts),
    }));
}

function installSkills(skillsDir, opts) {
  const srcRoot = path.join(ROOT, 'skills');
  const out = [];
  // rubber-duck-install 只留在仓库里供首次安装阅读，不拷进用户 Agent
  const skip = new Set(['rubber-duck-install']);
  for (const name of fs.readdirSync(srcRoot).sort()) {
    if (skip.has(name)) continue;
    const src = path.join(srcRoot, name);
    if (!fs.statSync(src).isDirectory()) continue;
    const dest = path.join(skillsDir, name);
    out.push(...copyTree(src, dest, opts));
  }
  return out;
}

const OBSOLETE_CURSOR_RULES = [
  'core-decision-memory-comms.mdc',
  'troubleshoot-hard-gate.mdc',
  'converge-before-shipping.mdc',
];

const OBSOLETE_MD_RULES = [
  'core-decision-memory-comms.md',
  'troubleshoot-hard-gate.md',
  'converge-before-shipping.md',
];

const OBSOLETE_SKILL_DIRS = [
  'troubleshoot-hard-gate',
  'converge-before-shipping',
  'session-handoff',
  'install-rubber-duck',
  'rubber-duck-install', // 仓库内安装剧本，不应装进用户 Agent
];

function removeObsoleteMdRules(rulesDir, opts) {
  const out = [];
  for (const name of OBSOLETE_MD_RULES) {
    const dest = path.join(rulesDir, name);
    if (!fs.existsSync(dest)) continue;
    if (opts.dryRun) {
      out.push({ path: dest, action: 'dry-run-delete' });
    } else {
      fs.unlinkSync(dest);
      out.push({ path: dest, action: 'deleted' });
    }
  }
  return out;
}
function removeObsoleteCursorRules(rulesDir, opts) {
  const out = [];
  for (const name of OBSOLETE_CURSOR_RULES) {
    const dest = path.join(rulesDir, name);
    if (!fs.existsSync(dest)) continue;
    if (opts.dryRun) {
      out.push({ path: dest, action: 'dry-run-delete' });
    } else {
      fs.unlinkSync(dest);
      out.push({ path: dest, action: 'deleted' });
    }
  }
  return out;
}

function removeObsoleteSkills(skillsDir, opts) {
  const out = [];
  for (const name of OBSOLETE_SKILL_DIRS) {
    const dest = path.join(skillsDir, name);
    if (!fs.existsSync(dest)) continue;
    if (opts.dryRun) {
      out.push({ path: dest, action: 'dry-run-delete' });
    } else {
      fs.rmSync(dest, { recursive: true, force: true });
      out.push({ path: dest, action: 'deleted' });
    }
  }
  return out;
}

function isDetected(tool) {
  switch (tool) {
    case 'cursor':
      return fs.existsSync(path.join(HOME, '.cursor'));
    case 'codex':
      return (
        fs.existsSync(path.join(HOME, '.codex')) ||
        fs.existsSync(path.join(HOME, '.agents')) ||
        Boolean(process.env.CODEX_HOME)
      );
    case 'trae':
      return fs.existsSync(path.join(HOME, '.trae'));
    case 'codebuddy':
      return fs.existsSync(path.join(HOME, '.codebuddy'));
    case 'workbuddy':
      return fs.existsSync(path.join(HOME, '.workbuddy'));
    default:
      return false;
  }
}

function resolveTargets(tool, scope, projectRoot) {
  const codexHome = process.env.CODEX_HOME || path.join(HOME, '.codex');

  if (tool === 'cursor') {
    const base = scope === 'project' ? path.join(projectRoot, '.cursor') : path.join(HOME, '.cursor');
    return { kind: 'mdc+skill', rulesDir: path.join(base, 'rules'), skillsDir: path.join(base, 'skills') };
  }

  if (tool === 'codex') {
    if (scope === 'project') {
      return {
        kind: 'agents+skill',
        agentsFile: path.join(projectRoot, 'AGENTS.md'),
        skillsDir: path.join(projectRoot, '.agents', 'skills'),
      };
    }
    return {
      kind: 'agents+skill',
      agentsFile: path.join(codexHome, 'AGENTS.md'),
      skillsDir: path.join(HOME, '.agents', 'skills'),
      legacySkillsDir: path.join(codexHome, 'skills'),
    };
  }

  if (tool === 'trae') {
    if (scope === 'project') {
      return {
        kind: 'md+skill',
        rulesDir: path.join(projectRoot, '.trae', 'rules'),
        skillsDir: path.join(projectRoot, '.trae', 'skills'),
      };
    }
    return {
      kind: 'md+skill',
      rulesDir: path.join(HOME, '.trae', 'user_rules'),
      skillsDir: path.join(HOME, '.trae', 'skills'),
    };
  }

  if (tool === 'codebuddy') {
    const base =
      scope === 'project' ? path.join(projectRoot, '.codebuddy') : path.join(HOME, '.codebuddy');
    return {
      kind: 'md+skill',
      rulesDir: path.join(base, 'rules'),
      skillsDir: path.join(base, 'skills'),
    };
  }

  if (tool === 'workbuddy') {
    const base =
      scope === 'project' ? path.join(projectRoot, '.workbuddy') : path.join(HOME, '.workbuddy');
    return {
      kind: 'md+skill',
      rulesDir: path.join(base, 'rules'),
      skillsDir: path.join(base, 'skills'),
    };
  }

  throw new Error(`不支持的工具: ${tool}`);
}

function installOne(tool, scope, opts) {
  const targets = resolveTargets(tool, scope, opts.projectRoot);
  const ops = [];

  if (targets.kind === 'mdc+skill') {
    ops.push(...installMdcRules(targets.rulesDir, opts));
    ops.push(...removeObsoleteCursorRules(targets.rulesDir, opts));
    ops.push(...installSkills(targets.skillsDir, opts));
    ops.push(...removeObsoleteSkills(targets.skillsDir, opts));
  } else if (targets.kind === 'md+skill') {
    let rulesDir = targets.rulesDir;
    if (fs.existsSync(rulesDir) && fs.statSync(rulesDir).isFile()) {
      const fallback = path.join(HOME, '.trae', 'rules');
      ops.push({
        path: fallback,
        action: 'note',
        note: `${rulesDir} 已是文件，rules 改写入 ${fallback}`,
      });
      rulesDir = fallback;
    }
    ops.push(...installMdRules(rulesDir, opts));
    ops.push(...removeObsoleteMdRules(rulesDir, opts));
    ops.push(...installSkills(targets.skillsDir, opts));
    ops.push(...removeObsoleteSkills(targets.skillsDir, opts));
  } else if (targets.kind === 'agents+skill') {
    ops.push({ path: targets.agentsFile, action: upsertAgentsMd(targets.agentsFile, opts) });
    ops.push(...installSkills(targets.skillsDir, opts));
    ops.push(...removeObsoleteSkills(targets.skillsDir, opts));
    if (targets.legacySkillsDir) {
      ops.push(...installSkills(targets.legacySkillsDir, opts));
      ops.push(...removeObsoleteSkills(targets.legacySkillsDir, opts));
    }
  }

  return { tool, scope, ops };
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv);
  } catch (err) {
    console.error(err.message);
    printHelp();
    process.exit(2);
  }

  if (args.help || !args.tool) {
    printHelp();
    process.exit(args.help ? 0 : 2);
  }

  if (!['user', 'project'].includes(args.scope)) {
    console.error('--scope 只能是 user 或 project');
    process.exit(2);
  }

  const allowed = new Set(['cursor', 'codex', 'trae', 'codebuddy', 'workbuddy', 'all']);
  if (!allowed.has(args.tool)) {
    console.error(`未知工具: ${args.tool}`);
    process.exit(2);
  }

  const opts = {
    dryRun: args.dryRun,
    force: args.force,
    projectRoot: args.projectRoot,
  };

  let tools;
  if (args.tool === 'all') {
    tools = ['cursor', 'codex', 'trae', 'codebuddy', 'workbuddy'].filter(isDetected);
    if (tools.length === 0) {
      console.error(
        '未检测到 cursor/codex/trae/codebuddy/workbuddy 配置目录。请改用 --tool <name> 强制安装到约定路径。',
      );
      process.exit(1);
    }
  } else {
    tools = [args.tool];
  }

  console.log(`rubber-duck  scope=${args.scope}  dryRun=${opts.dryRun}  force=${opts.force}`);
  console.log(`root=${ROOT}`);
  console.log(`tools=${tools.join(', ')}`);
  console.log('');

  let wrote = 0;
  for (const tool of tools) {
    const result = installOne(tool, args.scope, opts);
    console.log(`## ${result.tool}`);
    for (const op of result.ops) {
      if (op.action === 'wrote' || op.action === 'dry-run') wrote++;
      console.log(`  [${op.action}] ${op.path}${op.note ? ` — ${op.note}` : ''}`);
    }
    console.log('');
  }

  console.log('完成。请新开 Agent 会话使 rules/skills 生效。');
  if (opts.dryRun) console.log('（dry-run：未写入磁盘）');
  if (wrote === 0) console.log('没有新写入（可能已是最新）。可用 --force 强制覆盖。');
}

main();
