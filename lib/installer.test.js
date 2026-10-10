const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {
  validateSkillSource,
  resolveTargetPaths,
  install
} = require('./installer');

describe('installer', () => {
  let tempBaseDir;

  beforeEach(() => {
    tempBaseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-test-'));
  });

  afterEach(() => {
    if (tempBaseDir && fs.existsSync(tempBaseDir)) {
      fs.rmSync(tempBaseDir, { recursive: true, force: true });
    }
  });

  describe('validateSkillSource', () => {
    test('succeeds when directory exists and contains SKILL.md', () => {
      const validSource = path.join(tempBaseDir, 'valid-skill');
      fs.mkdirSync(validSource);
      fs.writeFileSync(path.join(validSource, 'SKILL.md'), '# Test Skill');

      assert.doesNotThrow(() => validateSkillSource(validSource));
    });

    test('throws actionable error when source directory does not exist', () => {
      const missingDir = path.join(tempBaseDir, 'non-existent');

      assert.throws(
        () => validateSkillSource(missingDir),
        (err) => {
          assert.match(err.message, /Skill source directory does not exist/);
          return true;
        }
      );
    });

    test('throws actionable error when source directory does not contain SKILL.md', () => {
      const emptyDir = path.join(tempBaseDir, 'empty-skill');
      fs.mkdirSync(emptyDir);

      assert.throws(
        () => validateSkillSource(emptyDir),
        (err) => {
          assert.match(err.message, /SKILL.md not found in source directory/);
          return true;
        }
      );
    });
  });

  describe('resolveTargetPaths', () => {
    test('resolves default local path to .agents/skills/design-to-tasks', () => {
      const cwd = path.join(tempBaseDir, 'project');
      const target = resolveTargetPaths({ isGlobal: false }, { cwd });

      assert.strictEqual(
        target,
        path.join(cwd, '.agents', 'skills', 'design-to-tasks')
      );
    });

    test('resolves global path to user home .agents/skills/design-to-tasks', () => {
      const fakeHome = path.join(tempBaseDir, 'home');
      const target = resolveTargetPaths({ isGlobal: true }, { homeDir: fakeHome });

      assert.strictEqual(
        target,
        path.join(fakeHome, '.agents', 'skills', 'design-to-tasks')
      );
    });

    test('resolves custom destination path when dest option is provided', () => {
      const cwd = path.join(tempBaseDir, 'project');
      const customRelative = './custom/target/skill';
      const target = resolveTargetPaths({ dest: customRelative }, { cwd });

      assert.strictEqual(
        target,
        path.resolve(cwd, customRelative)
      );
    });

    test('throws actionable error when dest option is not a valid non-empty string', () => {
      assert.throws(
        () => resolveTargetPaths({ dest: '   ' }),
        (err) => {
          assert.match(err.message, /Destination path must be a non-empty string/);
          return true;
        }
      );
    });
  });

  describe('install', () => {
    test('successfully copies skill files and templates to target directory', () => {
      const sourceDir = path.join(tempBaseDir, 'source-skill');
      const templatesDir = path.join(sourceDir, 'templates');
      fs.mkdirSync(templatesDir, { recursive: true });
      fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# Skill Docs');
      fs.writeFileSync(path.join(templatesDir, 'DESIGN.md'), '# Design Template');

      const targetDir = path.join(tempBaseDir, 'output-skill');

      const result = install({
        sourceDir,
        dest: targetDir
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.targetDir, targetDir);
      assert.strictEqual(fs.existsSync(path.join(targetDir, 'SKILL.md')), true);
      assert.strictEqual(fs.existsSync(path.join(targetDir, 'templates', 'DESIGN.md')), true);
    });

    test('successfully overwrites existing installation', () => {
      const sourceDir = path.join(tempBaseDir, 'source-skill');
      fs.mkdirSync(sourceDir, { recursive: true });
      fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# Updated Skill Docs');

      const targetDir = path.join(tempBaseDir, 'output-skill');
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'SKILL.md'), '# Old Skill Docs');

      const result = install({
        sourceDir,
        dest: targetDir
      });

      assert.strictEqual(result.success, true);
      const content = fs.readFileSync(path.join(targetDir, 'SKILL.md'), 'utf-8');
      assert.strictEqual(content, '# Updated Skill Docs');
    });

    test('throws actionable error when installing from an invalid source directory', () => {
      const nonExistentSource = path.join(tempBaseDir, 'does-not-exist');
      const targetDir = path.join(tempBaseDir, 'output-skill');

      assert.throws(
        () => install({ sourceDir: nonExistentSource, dest: targetDir }),
        (err) => {
          assert.match(err.message, /Skill source directory does not exist/);
          return true;
        }
      );
    });
  });
});
