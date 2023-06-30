import dayjs, { extend } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

extend(utc)
extend(timezone)

/**
 * 指定されたタイムゾーンから別のタイムゾーンに日時を変換します。
 *
 * @param {string} value - 変換する日時の文字列 (例: '2023-12-31 23:00:00')
 * @param {string} fromTz - 入力された日時の元のタイムゾーン (例: 'UTC', 'Asia/Tokyo')
 * @param {string} toTz - 出力される日時のタイムゾーン (例: 'UTC', 'Asia/Tokyo')
 * @returns {string} 変換された日時の文字列 (ISO 8601 形式)。
 *                   入力のタイムゾーンと異なるオフセットを持っている場合はエラーメッセージを返します。
 */
export function convertDatetime (value: string, fromTz: string, toTz: string): string {
  try {
    // fromTz のタイムゾーンで日時オブジェクトを作成
    let datetime = dayjs.tz(value, fromTz)

    // UTC offset (+xx:xx) or Z を持っているかチェック
    const hasTimezone = /[+-][0-9]{2}:[0-9]{2}$|Z$/i.test(value)

    if (hasTimezone) {
      // 入力からのUTCオフセットを取得
      const valueTzOffset = value.endsWith('Z') ? '+00:00' : value.slice(-6)

      // fromTzのUTCオフセットを取得
      const fromTzOffset = dayjs().tz(fromTz).format('Z')

      // 入力のタイムゾーンが指定されたものと一致しているか確認
      if (valueTzOffset !== fromTzOffset) {
        return `Input timezone does not match ${fromTz}`
      }

      // value がはじめから持つタイムゾーン付きで日時オブジェクトを作成
      datetime = dayjs(value).tz()
    }

    // toTzへの変換
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
