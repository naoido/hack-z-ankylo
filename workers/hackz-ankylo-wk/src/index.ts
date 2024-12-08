import { Hono } from 'hono'

const app = new Hono()

app.get('/qrcode', (c) => {
  return c.text('Hello Hono!')
})

app.post('/qrcode', (c) => {
  return c.text('Hello Hono!')
})

app.get('/qrcodes', (c) => {
  return c.text('Hello Hono!')
})

export default app
