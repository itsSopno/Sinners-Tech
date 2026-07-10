import { Router } from 'express'
import { CreateUserDataModel, getAllUsersFullData, getUserFullData } from '../Controllers/totalUser.controller.js'

const router = Router()

router.post('/create', CreateUserDataModel)
router.get('/get/:email', getUserFullData)
router.get('/get', getAllUsersFullData)

export default router
