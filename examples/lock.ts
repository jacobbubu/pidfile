import * as path from 'path'
import { promises as fs } from 'fs'
import pidlock from '../src'

const main = async () => {
  const filename = path.join(__dirname, 'lock.pid')
  await pidlock(path.join(__dirname, 'lock.pid'), { unlockOnExit: false })
  const pid = await fs.readFile(filename, 'utf8')
  console.log({ pidInFile: pid, pid: process.pid })
}

// tslint:disable-next-line no-floating-promises
main()
