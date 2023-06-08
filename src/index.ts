import express from 'express'
import ytdl from 'ytdl-core'
import fs from 'fs'

const app = express()
const port = process.env.PORT || 3000

app.get('/:link', async (req, res) => {
  const link = `https://www.youtube.com/watch?v=${req.params.link}`

  const info = await ytdl.getInfo(link)
  const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'videoandaudio' })
  const filename = videoFormat.qualityLabel.replace(/\s/g, '_') + '.mp4'

  ytdl(link)
    .pipe(fs.createWriteStream(filename))
    .on('finish', () => {
      res.download(filename, () => {
        fs.unlinkSync(filename)
      })
    })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
