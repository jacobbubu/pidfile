# @jacobbubu/pidfile

[![Build Status](https://github.com/jacobbubu/pidfile/workflows/Build%20and%20Release/badge.svg)](https://github.com/jacobbubu/pidfile/actions?query=workflow%3A%22Build+and+Release%22)
[![Coverage Status](https://coveralls.io/repos/github/jacobbubu/pidfile/badge.svg)](https://coveralls.io/github/jacobbubu/pidfile)
[![npm](https://img.shields.io/npm/v/@jacobbubu/pidfile.svg)](https://www.npmjs.com/package/@jacobbubu/pidfile/)

> A simple pidfile generate module (ref. https://github.com/kesla/pidlockfile)

## Usage

``` ts
import * as path from 'path'
import { promises as fs } from 'fs'
import pidlock from '@jacobbubu/pidfile'

const main = async () => {
  const filename = path.join(__dirname, 'lock.pid')
  const unlock = await pidlock(path.join(__dirname, 'lock.pid'), { unlockOnExit: false })
  if (unlock instanceof Error) {
    // unlock is an Error object withe message 'Lockfile already acquired'
  } else {
    const pid = await fs.readFile(filename, 'utf8')
    console.log({ pidInFile: pid, pid: process.pid })
    unlock()
  }
}

main()
```

## Before push

Before pushing the code to GitHub, please make sure that `NPM_TOKEN` is configured in `https://github.com/__your_repo__/settings/secrets`, or you can do this through [`semantic-release-cli`](https://github.com/semantic-release/cli).
