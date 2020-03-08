import execa from 'execa';
import { platform } from 'os';
import path from 'path';
import pathIsAbsolute from 'path-is-absolute';

const cwd = process.cwd();

const isGit = (altPath = cwd) => {
  let thisPath = pathIsAbsolute(altPath) ? altPath : path.join(cwd, altPath);
  thisPath = thisPath.replace(/(\s)/g, '\\ ');

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
