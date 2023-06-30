import { convertDatetime } from '@/utils/CommonUtils'

describe('test/utils/CommonUtilsConvertDatetime.spec.ts', () => {
  test.each([
    // input, input を UTC とみなしたときの JST, input を JST とみなしたときの UTC
    ['2023-12-31 23:00:00', '2024-01-01T08:00:00+09:00', '2023-12-31T14:00:00Z'],
    ['2023-06-30 15:00:00', '2023-07-01T00:00:00+09:00', '2023-06-30T06:00:00Z'],
    ['2023-05-15 14:30:00', '2023-05-15T23:30:00+09:00', '2023-05-15T05:30:00Z'],
    ['2024-01-01 00:00:00', '2024-01-01T09:00:00+09:00', '2023-12-31T15:00:00Z'],
    ['2023-11-30 16:00:00', '2023-12-01T01:00:00+09:00', '2023-11-30T07:00:00Z'],
    ['2023-03-31 15:30:00', '2023-04-01T00:30:00+09:00', '2023-03-31T06:30:00Z'],
    ['2024-02-29 23:30:00', '2024-03-01T08:30:00+09:00', '2024-02-29T14:30:00Z'],
    ['2023-07-15 15:15:00', '2023-07-16T00:15:00+09:00', '2023-07-15T06:15:00Z'],
    ['2023-08-31 15:45:00', '2023-09-01T00:45:00+09:00', '2023-08-31T06:45:00Z'],
    ['2023-04-30 14:00:00', '2023-04-30T23:00:00+09:00', '2023-04-30T05:00:00Z'],
    // // 意地悪で、 input にタイムゾーン情報を含めてみる。
    ['2023-12-31 23:00:00+09:00', 'Input timezone does not match UTC', '2023-12-31T14:00:00Z'],
    ['2023-06-30 15:00:00Z', '2023-07-01T00:00:00+09:00', 'Input timezone does not match Asia/Tokyo'],
    // dayjs がサポートしていない文字列を入れてみる。
    ['2023-01-01A00:00:00Z', 'Invalid time value', 'Invalid time value']
  ])(
    // %#: test case number, %p: params の最初の値
    'Case %#: UTC to JST and JST to UTC conversion with param %p',
    (input, expectedJST, expectedUTC) => {
      const resultJST = convertDatetime(input, 'UTC', 'Asia/Tokyo')
      expect(resultJST).toBe(expectedJST)

      const resultUTC = convertDatetime(input, 'Asia/Tokyo', 'UTC')
      expect(resultUTC).toBe(expectedUTC)
    }
  )
})
