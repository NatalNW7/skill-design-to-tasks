#!/usr/bin/env node

const { install } = require('../lib/installer');

function parseArgs(args) {
  const options = {
    isGlobal: false,
    dest: undefined,
    showHelp: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      options.showHelp = true;
    } else if (arg === '--global' || arg === '-g') {
      options.isGlobal = true;
    } else if (arg === '--dest' || arg === '-d') {
      const nextArg = args[i + 1];
      if (!nextArg || nextArg.startsWith('-')) {
        throw new Error('Option --dest requires a directory path argument.');
      }
      options.dest = nextArg;
      i++;
    }
  }

  return options;
}

function getHelpText() {
  return `skill-design-to-tasks - Installer for design-to-tasks agent skill

Usage:
  npx skills add NatalNW7/skill-design-to-tasks      (Recommended: Agent Skills standard)
  npx github:NatalNW7/skill-design-to-tasks [options] (Direct npx installer)

Options:
  -g, --global       Install globally into ~/.agents/skills/design-to-tasks
  -d, --dest <path>  Install into custom directory path
  -h, --help         Show this help message

Examples:
  # Install into current project (.agents/skills/design-to-tasks)
  npx skills add NatalNW7/skill-design-to-tasks

  # Direct installation with custom target
  npx github:NatalNW7/skill-design-to-tasks --dest ./my-skills/design-to-tasks`;
}

function run(argv = process.argv.slice(2), io = {}) {
  const log = io.log || console.log;
  const error = io.error || console.error;
  const exit = io.exit || process.exit;

  try {
    const options = parseArgs(argv);

    if (options.showHelp) {
      log(getHelpText());
      return 0;
    }

    log('Installing "design-to-tasks" skill...');
    const result = install(options);

    log(`✓ Skill successfully installed into: ${result.targetDir}`);
    log('You can now activate and use "design-to-tasks" in your agent workspace.');
    return 0;
  } catch (err) {
    error(`Error: ${err.message}`);
    exit(1);
    return 1;
  }
}

if (require.main === module) {
  run();
}

module.exports = { parseArgs, getHelpText, run };
