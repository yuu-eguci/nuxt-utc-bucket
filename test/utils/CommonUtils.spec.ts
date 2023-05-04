import { convertDatetime } from '@/utils/CommonUtils'

describe('CommonUtils', () => {
  describe('convertDatetime', () => {
    test.each([
      ['2023-04-29T00:00:00Z', 'UTC', 'Asia/Tokyo', '2023-04-29T09:00:00+09:00'],
      ['2023-04-29T09:00:00+09:00', 'Asia/Tokyo', 'UTC', '2023-04-29T00:00:00Z']
      // 他のテストケースを追加...
    ])(
      'converts %s from %s to %s timezone, expecting %s',
      (input, fromTz, toTz, expectedResult) => {
        const result = convertDatetime(input, fromTz, toTz)
        expect(result).toBe(expectedResult)
      }
    )
  })
})
