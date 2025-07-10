import { cn, formatAddress, formatNumber } from '@/lib/utils'

describe('Utils Functions', () => {
  describe('cn function', () => {
    it('merges classes correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('active-class')
    })
  })

  describe('formatAddress function', () => {
    it('shortens long addresses', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const result = formatAddress(address)
      expect(result).toBe('0x1234...7890')
    })

    it('returns short addresses unchanged', () => {
      const address = '0x1234'
      const result = formatAddress(address)
      expect(result).toBe('0x1234')
    })
  })

  describe('formatNumber function', () => {
    it('formats large numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })

    it('handles decimal places', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56')
    })
  })
})