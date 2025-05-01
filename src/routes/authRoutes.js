import express from 'express'
import { login } from '../controllers/authController.js'

export default function(db) {
  const router = express.Router()
  // POST /api/auth/login
  router.post('/login', express.json(), (req, res) => {
    return login(db, req, res)
  })
  return router
}
