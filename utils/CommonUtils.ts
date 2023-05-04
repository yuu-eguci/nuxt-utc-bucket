import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * 指定された日時を、元のタイムゾーンから目的のタイムゾーンに変換する関数。
 *
 * @param {string} value - 変換対象の日時文字列。 (例: '2023-04-29T00:00:00Z')
 * @param {string} fromTz - 元のタイムゾーン。IANAタイムゾーンデータベースの名前で指定する。 (例: 'UTC', 'Asia/Tokyo')
 * @param {string} toTz - 目的のタイムゾーン。IANAタイムゾーンデータベースの名前で指定する。 (例: 'UTC', 'Asia/Tokyo')
 *
 * @returns {string} - 目的のタイムゾーンに変換された日時文字列。 (例: '2023-04-29T09:00:00+09:00')
 * @throws {Error} - 変換が失敗した場合、エラーメッセージが返される。
 */
export function convertDatetime (value: string, fromTz: string, toTz: string): string {
  try {
    // value を UTC として解釈し、fromTz のタイムゾーンに変換
    const datetime = (dayjs as any).utc(value).tz(fromTz)
    // toTz への変換
    return datetime.tz(toTz).format()
  } catch (err: unknown) {
    return (err as any).message
  }
}
