const request = require('supertest')
const app = require('../src/index')

describe('Sanity', ()=>{
  test('GET / should return ok', async ()=>{
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBeTruthy()
  })
})
