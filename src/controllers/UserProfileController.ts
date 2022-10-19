import { User } from '../db'
import { Request, Response } from 'express'
import validateParams from '../validation/paramsId'
import CustomError from '../helpers/CustomError'
import EditProfileSchema from '../validation/EditProfileUpdate'

export default class UserProfileController {
  public static async index (req: Request, res:Response):Promise<void> {
    const { id } = req.params
    await validateParams({ id })

    const profile = await User.findOne({
      attributes: ['id', 'username', 'bio', 'location', 'profileImg',
        'headerImg', 'following', 'followers'],
      where: {
        id
      }
    })
    if (!profile) throw new CustomError('User not found', 404)
    res.json({ data: profile })
  }

  public static async update (req: Request, res:Response):Promise<void> {
    const { id } = req.params
    const { username, bio, location, profileImg, headerImg } = req.body

    await validateParams({ id })
    await EditProfileSchema.validateAsync({ username, bio, location, profileImg, headerImg })

    const update = await User.update({ username, bio, location, profileImg, headerImg }, {
      where: { id },
      returning: ['username', 'bio', 'location', 'profileImg', 'headerImg']
    })
    if (!update) throw new CustomError('Check your input', 400)
    res.json({ data: update })
  }
}
