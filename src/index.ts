import express from 'express'
import ytdl from 'ytdl-core-discord'
import { Request, Response } from 'express'

const app = express()
const port = process.env.PORT || 3000

app.get('/download/:link', async (req: Request, res: Response) => {
  try {
    const linkParam = req.params.link
    const link = `https://www.youtube.com/watch?v=${linkParam}`

    const info = await ytdl.getInfo(link)
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
    const filename = `${info.videoDetails.title} - ${info.videoDetails.author}.mp3`

    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'audio/mpeg'
    });

    (await ytdl(link, { format: audioFormat })).pipe(res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to download the audio' })
  }
})

app.get('/videoinfo/:link', async (req: Request, res: Response) => {
  try {
    const linkParam = req.params.link
    const link = `https://www.youtube.com/watch?v=${linkParam}`

    const info = await ytdl.getInfo(link)

    res.json({
      author: info.videoDetails.author,
      title: info.videoDetails.title,
      views: info.videoDetails.viewCount,
      thumbnail: info.videoDetails.thumbnails
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch video information' })
  }
})

app.get('/', (req: Request, res: Response) => {
  res.json({
    query: 'None'
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
