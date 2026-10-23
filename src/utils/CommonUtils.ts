import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// UTC offset (+xx:xx) or Z/z at the end of the input.
const OFFSET_SUFFIX = /([+-][0-9]{2}:[0-9]{2}|Z)$/i
const INVALID_TIME_VALUE = 'Invalid time value'

/**
 * timeZone の、ある瞬間における UTC オフセット (分) を返します。
 * Intl だけで計算するので、実行しているマシンのタイムゾーンに影響されません。
 */
function offsetMinutesAt (timestamp: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).formatToParts(timestamp)
  const part = (type: Intl.DateTimeFormatPartTypes): number => Number(parts.find(p => p.type === type)?.value)
  const wallClockAsUtc = Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'), part('second'))
  return Math.round((wallClockAsUtc - Math.floor(timestamp / 1000) * 1000) / 60000)
}

function formatOffset (minutes: number): string {
  const sign = minutes < 0 ? '-' : '+'
  const abs = Math.abs(minutes)
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`
}

/**
 * timeZone での壁時計の時刻 (UTC として表した値) を、実際の瞬間に変換します。
 * DST の切り替わりは Day.js の timezone plugin と同じ考え方で補正します。
 */
function wallClockToTimestamp (wallClockAsUtc: number, timeZone: string): number {
  const o0 = offsetMinutesAt(wallClockAsUtc, timeZone)
  const guess = wallClockAsUtc - o0 * 60000
  const o2 = offsetMinutesAt(guess, timeZone)
  if (o0 === o2) {
    return guess
  }
  const o3 = offsetMinutesAt(guess - (o2 - o0) * 60000, timeZone)
  return o2 === o3 ? guess - (o2 - o0) * 60000 : wallClockAsUtc - Math.min(o2, o3) * 60000
}

function formatInTimeZone (timestamp: number, timeZone: string): string {
  const offset = offsetMinutesAt(timestamp, timeZone)
  const wallClock = dayjs.utc(timestamp + offset * 60000).format('YYYY-MM-DDTHH:mm:ss')
  return `${wallClock}${offset === 0 ? 'Z' : formatOffset(offset)}`
}

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
    // 小文字の z も UTC として扱います。
    const normalized = value.replace(/z$/, 'Z')
    const wallClock = dayjs.utc(normalized)
    if (!wallClock.isValid()) {
      return INVALID_TIME_VALUE
    }

    const suffix = OFFSET_SUFFIX.exec(normalized)
    if (suffix === null) {
      // オフセットがない場合は fromTz の現地時刻として扱います。
      return formatInTimeZone(wallClockToTimestamp(wallClock.valueOf(), fromTz), toTz)
    }

    // オフセットがある場合は、その瞬間の fromTz のオフセットと一致するか確認します。
    const timestamp = dayjs(normalized).valueOf()
    const valueTzOffset = suffix[1] === 'Z' ? '+00:00' : suffix[1]
    if (valueTzOffset !== formatOffset(offsetMinutesAt(timestamp, fromTz))) {
      return `Input timezone does not match ${fromTz}`
    }
    return formatInTimeZone(timestamp, toTz)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return err.message
    } else {
      throw err
    }
  }
}

/**
 * 複数行のテキスト内の各日時を、元のタイムゾーンから目的のタイムゾーンに変換します。
 * 空欄の行はそのまま出力します。
 * 改行コードは LF と CRLF のどちらも受け付け、入力のまま残します。
 *
 * @param {string} value - 変換対象の複数行の日時テキスト。
 * @param {string} fromTz - 元のタイムゾーン。IANA タイムゾーンデータベースの名前で指定します。 (例: 'UTC', 'Asia/Tokyo')
 * @param {string} toTz - 目的のタイムゾーン。IANA タイムゾーンデータベースの名前で指定します。 (例: 'UTC', 'Asia/Tokyo')
 *
 * @returns {string} - 目的のタイムゾーンに変換された複数行の日時テキスト。空欄の行はそのまま出力します。
 */
export function convertDatetimeLines (value: string, fromTz: string, toTz: string): string {
  return value
    // 区切り (\n または \r\n) も残すため、キャプチャ付きで split します。
    .split(/(\r?\n)/)
    .map((line, index) => {
      if (index % 2 === 1 || line.trim() === '') {
        return line
      }
      return convertDatetime(line, fromTz, toTz)
    })
    .join('')
}
