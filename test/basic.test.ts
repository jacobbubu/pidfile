import * as path from 'path'
import { promises as fs } from 'fs'
import pidlock from '../src'

describe('pidfile', () => {
  let checkPidFile = ''
  const filename = path.resolve(__dirname, '../output/lock.pid')
  afterEach(async () => {
    if (checkPidFile.length > 0) {
      try {
        const hasFile = await fs.readFile(checkPidFile, 'utf-8')
        expect(hasFile).toBeTruthy()
        await fs.unlink(checkPidFile)
      } catch (err) {
        checkPidFile = ''
        throw err
      }
    }
    checkPidFile = ''
  })

  it('create pidfile', async () => {
    const unlock = (await pidlock(filename)) as Function
    expect(unlock).toBeInstanceOf(Function)
    const pid = await fs.readFile(filename, 'utf8')
    expect(pid).toBe(process.pid.toString())
    await unlock()
    try {
      await fs.readFile(filename, 'utf8')
    } catch (err) {
      expect(err.code).toBe('ENOENT')
    }
  })

  it('lock again', async () => {
    const unlock = (await pidlock(filename)) as Function
    expect(unlock).toBeInstanceOf(Function)

    const lockError = (await pidlock(filename)) as Error
    expect(lockError).toBeInstanceOf(Error)
    expect(lockError.message).toBe('Lockfile already acquired')
  })

  it('leave pidfile alone', async () => {
    await pidlock(filename, { unlockOnExit: false })
    const pid = await fs.readFile(filename, 'utf8')
    expect(pid).toBe(process.pid.toString())
    checkPidFile = filename
  })
})
