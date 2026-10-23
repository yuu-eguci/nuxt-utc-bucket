import { afterEach, describe, expect, test, vi } from 'vitest'
import { convertDatetime, convertDatetimeLines } from '../../src/utils/CommonUtils'

describe('convertDatetime: offset suffix', () => {
  test.each([
    ['2023-06-30 15:00:00Z'],
    ['2023-06-30 15:00:00z'],
    ['2023-06-30T15:00:00z']
  ])('%s is accepted as UTC regardless of the case of Z', (input) => {
    expect(convertDatetime(input, 'UTC', 'Asia/Tokyo')).toBe('2023-07-01T00:00:00+09:00')
  })

  test('lowercase z is still rejected when the field is not UTC', () => {
    expect(convertDatetime('2023-06-30 15:00:00z', 'Asia/Tokyo', 'UTC'))
      .toBe('Input timezone does not match Asia/Tokyo')
  })
})

describe('convertDatetime: offset is checked at the input instant, not at "now"', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test('a winter New York offset is accepted while the clock is in summer', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-01T00:00:00Z'))
    expect(convertDatetime('2026-01-15 10:00:00-05:00', 'America/New_York', 'UTC'))
      .toBe('2026-01-15T15:00:00Z')
  })
})

describe('convertDatetimeLines: Windows line endings', () => {
  test('CRLF input converts every line and keeps CRLF and blank lines', () => {
    const input = '2023-04-29T00:00:00Z\r\n\r\n2023-04-30 00:00:00\r\n'
    expect(convertDatetimeLines(input, 'UTC', 'Asia/Tokyo'))
      .toBe('2023-04-29T09:00:00+09:00\r\n\r\n2023-04-30T09:00:00+09:00\r\n')
  })
})

// The host timezone is not switched inside the process: Node.js would update Date but
// not the cached Intl timezone. scripts/test-host-timezones.mjs runs the whole suite in
// separate processes started with different TZ values instead.
describe('host timezone independence', () => {
  test('conversions around DST transitions of common host timezones', () => {
    // 2024-03-10 02:30 does not exist in America/Los_Angeles; 2024-11-03 01:30 happens twice there.
    expect(convertDatetime('2024-03-10 02:30:00', 'UTC', 'Asia/Tokyo')).toBe('2024-03-10T11:30:00+09:00')
    expect(convertDatetime('2024-11-03 01:30:00', 'UTC', 'Asia/Tokyo')).toBe('2024-11-03T10:30:00+09:00')
    // 2024-03-31 01:30 does not exist in Europe/London.
    expect(convertDatetime('2024-03-31 01:30:00', 'Asia/Tokyo', 'UTC')).toBe('2024-03-30T16:30:00Z')
    expect(convertDatetime('2023-12-31 23:00:00+09:00', 'Asia/Tokyo', 'UTC')).toBe('2023-12-31T14:00:00Z')
    expect(convertDatetime('2023-06-30 15:00:00Z', 'UTC', 'Asia/Tokyo')).toBe('2023-07-01T00:00:00+09:00')
  })
})
