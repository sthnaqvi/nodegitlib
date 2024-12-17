const execa = require('execa');
const { platform } = require('os');
const path = require('path');
const pathIsAbsolute = require('path-is-absolute');

const cwd = process.cwd();

const isGit = (altPath = cwd) => {
  let thisPath = pathIsAbsolute(altPath) ? altPath : path.join(cwd, altPath);
  thisPath = thisPath.replace(/(\s)/g, '\\ ');

  try {
    if (platform() === 'win32') {
      execa.sync(`pushd ${thisPath} & git status`, { shell: true });
    } else {
      execa.sync(
        `(cd ${thisPath} ; ([ -d .git ] && echo .git) || git rev-parse --git-dir 2> /dev/null)`,
        { shell: true }
      );
    }

    return true;
  } catch (e) {
    return false;
  }
};

const currentBranch = (altPath = cwd) => {
  let stdout;
  const thisPath = altPath.replace(/(\s)/g, '\\ ');

  if (!isGit(thisPath)) {
    return false;
  }

  try {
    let cmd = '';

    if (platform() === 'win32') {
      cmd = `pushd ${thisPath} & git branch | findstr \\*`;
    } else {
      cmd = `(cd ${thisPath} ; git branch | grep \\*)`;
    }

    stdout = execa.sync(cmd, { shell: true }).stdout;
  } catch (e) {
    return false;
  }

  const branchName = stdout.slice(2, stdout.length);

  return branchName;
};

module.exports = {
  isGit,
  currentBranch,
};