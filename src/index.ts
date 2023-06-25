import express from 'express'
import ytdl from 'ytdl-core'
import fs from 'fs'
import { Request, Response } from "express";

const app = express()
const port = process.env.PORT || 3000
const tempDir = "tmp"

app.get('/download/:link', async (req: Request, res: Response) => {
  const linkParam = req.params.link
  const link = `https://www.youtube.com/watch?v=${linkParam}`

  const info = await ytdl.getInfo(link)
  const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
  const filename = `${info.videoDetails.title} - ${info.videoDetails.author}.mp3`

  ytdl(link, { format: audioFormat })
    .pipe(fs.createWriteStream(`${tempDir}/${filename}`))
    .on('finish', () => {
      res.download(`${tempDir}/${filename}`, () => {
        fs.unlinkSync(`${tempDir}/${filename}`)
      })
    })
})

app.get('/videoinfo/:link', async (req: Request, res: Response) => {
  const linkParam = req.params.link
  const link = `https://www.youtube.com/watch?v=${linkParam}`

  const info = await ytdl.getInfo(link)

  res.json({
    author: info.videoDetails.author,
    title: info.videoDetails.title,
    views: info.videoDetails.viewCount,
    thumbnail: info.videoDetails.thumbnails
  })
})

app.get('/', async (req: Request, res: Response) => {
  res.json({
    query: "None"
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
