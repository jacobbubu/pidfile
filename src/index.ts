import { promises as fs } from 'fs'

const currentPid = process.pid.toString()

async function check(filename: string) {
  let pid: number
  try {
    pid = parseInt(await fs.readFile(filename, 'utf-8'), 10)
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    } else {
      throw err
    }
  }

  try {
    // a signal of 0 can be used to test for the existence of a process.
    process.kill(pid, 0)
    return true
  } catch (err) {
    return false
  }
}

export interface LockOption {
  unlockOnExit: boolean
}

export default async function lock(filename: string, opts: Partial<LockOption> = {}) {
  const unlockOnExit = opts.unlockOnExit ?? true

  async function unlock() {
    try {
      await fs.unlink(filename)
    } catch (err) {
      /* noop */
    }
  }
  const locked = await check(filename)
  if (locked) {
    return new Error('Lockfile already acquired')
  }
  await unlock()

  if (unlockOnExit) {
    process.once('exit', () => unlock())
  }

  await fs.writeFile(filename, currentPid, { flag: 'wx' })
  return unlock
}
