import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { Secret } from '@adonisjs/core/helpers'

export default class AuthController {
  public async register({ request }: HttpContext) {
    const { firstName, lastName, nickname, profileColor, email, password } = request.only([
      'firstName',
      'lastName',
      'nickname',
      'profileColor',
      'email',
      'password',
    ])

    try {
      const user = await User.create({
        firstName,
        lastName,
        nickname,
        profileColor,
        email,
        password,
      })

      // Create token using access_tokens provider
      const token = await DbAccessTokensProvider.forModel(User).create(user, {
        name: 'authToken',
      } as any)

      return { user, token }
    } catch (error) {
      // UNIQUE constraint handling
      const uniqueViolation = error.code === '23505' // Postgres

      if (uniqueViolation) {
        const field = error.constraint

        return {
          status: 400,
          message:
            field === 'users_nickname_unique'
              ? 'Nickname already exists'
              : field === 'users_email_unique'
                ? 'Email already exists'
                : 'Unique field already exists',
        }
      }

      return { status: 500, message: 'Something went wrong' }
    }
  }

  public async login({ request }: HttpContext) {
    const { nickname, password } = request.only(['nickname', 'password'])

    const user = await User.query().where('nickname', nickname).firstOrFail()

    if (!(await user.verifyPassword(password))) {
      return { error: 'Invalid credentials' }
    }

    const token = await DbAccessTokensProvider.forModel(User).create(user, {
      name: 'authToken',
    } as any)

    return { user, token }
  }

  public async logout({ request }: HttpContext) {
    const authHeader = request.header('Authorization')
    const tokenValue = authHeader?.replace('Bearer ', '')
    if (!tokenValue) return { error: 'No token provided' }

    const tokenSecret = new Secret(tokenValue)
    await DbAccessTokensProvider.forModel(User).invalidate(tokenSecret)

    return { message: 'Logged out successfully' }
  }
}
