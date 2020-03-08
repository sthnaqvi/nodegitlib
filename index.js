import execa from 'execa';
import { platform } from 'os';
import path from 'path';
import pathIsAbsolute from 'path-is-absolute';

const cwd = process.cwd();

const isGit = (altPath = cwd) => {
  const thisPath = pathIsAbsolute(altPath) ? altPath : path.join(cwd, altPath);

  try {
    if (platform() === 'win32') {
      execa.shellSync(`pushd ${thisPath} & git status`);
    } else {
      execa.shellSync(`(cd ${thisPath} ; ([ -d .git ] && echo .git) || git rev-parse --git-dir 2> /dev/null)`);
    }

    return true;
  } catch (e) {
    return false;
  }
};

const currentBranch = (altPath = cwd) => {
  let stdout;

  if (!isGit(altPath)) {
    return false;
  }

  try {
    let cmd = '';

    if (platform() === 'win32') {
      cmd = `pushd ${altPath || cwd} & git branch | findstr \\*`;
    } else {
      cmd = `(cd ${altPath || cwd} ; git branch | grep \\*)`;
    }

    stdout = execa.shellSync(cmd).stdout;
  } catch (e) {
    return false;
  }

  const branchName = stdout.slice(2, stdout.length);

  return branchName;
};

const git = {
  isGit,
  currentBranch,
};

export default git;
