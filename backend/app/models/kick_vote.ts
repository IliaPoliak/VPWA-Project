import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class KickVote extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public channelId!: number

  @column()
  public targetUserId!: number

  @column()
  public voterUserId!: number
}
