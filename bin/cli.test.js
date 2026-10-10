const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { parseArgs, getHelpText, run } = require('./cli');

describe('cli parseArgs', () => {
  test('returns default options when no arguments are provided', () => {
    const options = parseArgs([]);
    assert.deepStrictEqual(options, {
      isGlobal: false,
      dest: undefined,
      showHelp: false
    });
  });

  test('parses --help flag correctly', () => {
    const options = parseArgs(['--help']);
    assert.strictEqual(options.showHelp, true);

    const shortOptions = parseArgs(['-h']);
    assert.strictEqual(shortOptions.showHelp, true);
  });

  test('parses --global flag correctly', () => {
    const options = parseArgs(['--global']);
    assert.strictEqual(options.isGlobal, true);

    const shortOptions = parseArgs(['-g']);
    assert.strictEqual(shortOptions.isGlobal, true);
  });

  test('parses --dest flag correctly with target path', () => {
    const options = parseArgs(['--dest', './custom/path']);
    assert.strictEqual(options.dest, './custom/path');

    const shortOptions = parseArgs(['-d', '/opt/skills']);
    assert.strictEqual(shortOptions.dest, '/opt/skills');
  });

  test('throws error when --dest is missing argument', () => {
    assert.throws(
      () => parseArgs(['--dest']),
      (err) => {
        assert.match(err.message, /Option --dest requires a directory path argument/);
        return true;
      }
    );
  });

  test('throws error when --dest is followed by another flag', () => {
    assert.throws(
      () => parseArgs(['-d', '--global']),
      (err) => {
        assert.match(err.message, /Option --dest requires a directory path argument/);
        return true;
      }
    );
  });
});

describe('cli getHelpText', () => {
  test('returns informative help text', () => {
    const helpText = getHelpText();
    assert.match(helpText, /Usage:/);
    assert.match(helpText, /npx skills add/);
  });
});

describe('cli run', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-run-test-'));
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('prints help when --help flag is passed', () => {
    const logs = [];
    const exitCode = run(['--help'], {
      log: (msg) => logs.push(msg)
    });

    assert.strictEqual(exitCode, 0);
    assert.ok(logs.some((msg) => msg.includes('Usage:')));
  });

  test('executes installation successfully with custom --dest', () => {
    const targetDir = path.join(tempDir, 'installed-skill');
    const logs = [];

    const exitCode = run(['--dest', targetDir], {
      log: (msg) => logs.push(msg)
    });

    assert.strictEqual(exitCode, 0);
    assert.ok(logs.some((msg) => msg.includes('Skill successfully installed into:')));
    assert.strictEqual(fs.existsSync(path.join(targetDir, 'SKILL.md')), true);
  });

  test('handles execution errors and calls exit with 1', () => {
    const errors = [];
    let exitCalledWith = null;

    const exitCode = run(['--dest'], {
      error: (msg) => errors.push(msg),
      exit: (code) => {
        exitCalledWith = code;
      }
    });

    assert.strictEqual(exitCode, 1);
    assert.strictEqual(exitCalledWith, 1);
    assert.ok(errors.some((msg) => msg.includes('Option --dest requires a directory path argument')));
  });
});
