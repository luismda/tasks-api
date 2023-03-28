import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('./tasks.csv', import.meta.url)

const parser = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2,
})

const stream = fs.createReadStream(csvPath).pipe(parser)

async function importCsvFile() {
  for await (const task of stream) {
    const [title, description] = task

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}

importCsvFile()
