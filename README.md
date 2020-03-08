# nodegitlib

A tool to play with git within node project

## Installation

```sh
$ npm i nodegitlib --save
```
or
```sh
$ yarn add nodegitlib
```

## Usage

Returns:
- Boolean `false`: It is not a git repository
- String: The branch name

```js
const git = require('nodegitlib');

git.isGit(); // true or false of current working directory
git.isGit('any/git/repo'); // true or false

git.currentBranch(); // false or branch name of current working directory
git.currentBranch('any/git/repo'); // false or branch name
```

## LICENSE

MIT © [Sayed Tauseef Naqvi](https://github.com/sthnaqvi)