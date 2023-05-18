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
    if (err instanceof Error) {
      return err.message
    } else {
      throw err
    }
  }
}

/**
 * 複数行のテキスト内の各日時を、元のタイムゾーンから目的のタイムゾーンに変換する関数。
 * 空欄の行はそのまま出力される。
 *
 * @param {string} value - 変換対象の複数行の日時テキスト。
 * @param {string} fromTz - 元のタイムゾーン。IANAタイムゾーンデータベースの名前で指定する。 (例: 'UTC', 'Asia/Tokyo')
 * @param {string} toTz - 目的のタイムゾーン。IANAタイムゾーンデータベースの名前で指定する。 (例: 'UTC', 'Asia/Tokyo')
 *
 * @returns {string} - 目的のタイムゾーンに変換された複数行の日時テキスト。空欄の行はそのまま出力される。
 */
export function convertDatetimeLines (value: string, fromTz: string, toTz: string): string {
  return value
    .split('\n')
    .map((line) => {
      if (line.trim() === '') {
        return line
      }
      return convertDatetime(line, fromTz, toTz)
    })
    .join('\n')
}
