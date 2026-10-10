const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const DEFAULT_SKILL_NAME = 'design-to-tasks';

/**
 * Validates that the skill source directory exists and contains SKILL.md.
 * @param {string} sourceDir
 */
function validateSkillSource(sourceDir) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Skill source directory does not exist: "${sourceDir}"`);
  }

  const skillFile = path.join(sourceDir, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    throw new Error(`SKILL.md not found in source directory: "${sourceDir}"`);
  }
}

/**
 * Resolves the target destination directory.
 * @param {{ isGlobal?: boolean, dest?: string }} options
 * @param {{ cwd?: string, homeDir?: string }} env
 * @returns {string}
 */
function resolveTargetPaths(options = {}, env = {}) {
  const cwd = env.cwd || process.cwd();
  const homeDir = env.homeDir || os.homedir();

  if (options.dest !== undefined) {
    if (typeof options.dest !== 'string' || options.dest.trim() === '') {
      throw new Error(`Destination path must be a non-empty string. Received: ${JSON.stringify(options.dest)}`);
    }
    return path.resolve(cwd, options.dest.trim());
  }

  if (options.isGlobal) {
    return path.join(homeDir, '.agents', 'skills', DEFAULT_SKILL_NAME);
  }

  return path.join(cwd, '.agents', 'skills', DEFAULT_SKILL_NAME);
}

/**
 * Installs the skill by copying files from source to destination.
 * @param {{ sourceDir?: string, dest?: string, isGlobal?: boolean }} options
 * @param {{ cwd?: string, homeDir?: string }} env
 * @returns {{ success: boolean, sourceDir: string, targetDir: string }}
 */
function install(options = {}, env = {}) {
  const defaultSource = path.resolve(__dirname, '..', DEFAULT_SKILL_NAME);
  const sourceDir = options.sourceDir || defaultSource;

  validateSkillSource(sourceDir);

  const targetDir = resolveTargetPaths(options, env);

  fs.mkdirSync(targetDir, { recursive: true });
  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });

  return {
    success: true,
    sourceDir,
    targetDir
  };
}

module.exports = {
  DEFAULT_SKILL_NAME,
  validateSkillSource,
  resolveTargetPaths,
  install
};
