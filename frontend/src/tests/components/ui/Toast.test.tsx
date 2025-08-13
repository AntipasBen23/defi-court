import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ToastContainer } from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { renderHook, act } from '@testing-library/react'

describe('Toast Components', () => {
  describe('ToastContainer', () => {
    const mockOnClose = jest.fn()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('renders toast messages correctly', () => {
      const toasts = [
        {
          id: '1',
          title: 'Success',
          message: 'Operation completed',
          type: 'success' as const,
        },
        {
          id: '2',
          title: 'Error',
          type: 'error' as const,
        },
      ]

      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />)

      expect(screen.getByText('Success')).toBeInTheDocument()
      expect(screen.getByText('Operation completed')).toBeInTheDocument()
      expect(screen.getByText('Error')).toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', async () => {
      const toasts = [
        {
          id: '1',
          title: 'Test Toast',
          type: 'info' as const,
        },
      ]

      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />)

      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)

      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalledWith('1')
        },
        { timeout: 500 }
      )
    })

    it('renders different toast types with correct styling', () => {
      const toasts = [
        { id: '1', title: 'Success', type: 'success' as const },
        { id: '2', title: 'Error', type: 'error' as const },
        { id: '3', title: 'Warning', type: 'warning' as const },
        { id: '4', title: 'Info', type: 'info' as const },
      ]

      const { container } = render(
        <ToastContainer toasts={toasts} onClose={mockOnClose} />
      )

      expect(container.querySelector('.bg-green-600')).toBeInTheDocument()
      expect(container.querySelector('.bg-red-600')).toBeInTheDocument()
      expect(container.querySelector('.bg-yellow-600')).toBeInTheDocument()
      expect(container.querySelector('.bg-blue-600')).toBeInTheDocument()
    })

    it('auto-dismisses toast after duration', async () => {
      const toasts = [
        {
          id: '1',
          title: 'Auto dismiss',
          type: 'info' as const,
          duration: 100,
        },
      ]

      render(<ToastContainer toasts={toasts} onClose={mockOnClose} />)

      await waitFor(
        () => {
          expect(mockOnClose).toHaveBeenCalledWith('1')
        },
        { timeout: 500 }
      )
    })
  })

  describe('useToast hook', () => {
    it('adds and removes toasts correctly', () => {
      const { result } = renderHook(() => useToast())

      expect(result.current.toasts).toHaveLength(0)

      act(() => {
        result.current.addToast({
          title: 'Test Toast',
          type: 'success',
        })
      })

      expect(result.current.toasts).toHaveLength(1)
      expect(result.current.toasts[0].title).toBe('Test Toast')
      expect(result.current.toasts[0].type).toBe('success')

      const toastId = result.current.toasts[0].id

      act(() => {
        result.current.removeToast(toastId)
      })

      expect(result.current.toasts).toHaveLength(0)
    })

    it('provides helper methods for different toast types', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.success('Success message')
        result.current.error('Error message')
        result.current.warning('Warning message')
        result.current.info('Info message')
      })

      expect(result.current.toasts).toHaveLength(4)
      expect(result.current.toasts[0].type).toBe('success')
      expect(result.current.toasts[1].type).toBe('error')
      expect(result.current.toasts[2].type).toBe('warning')
      expect(result.current.toasts[3].type).toBe('info')
    })

    it('generates unique IDs for toasts', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.addToast({ title: 'Toast 1', type: 'info' })
        result.current.addToast({ title: 'Toast 2', type: 'info' })
      })

      const ids = result.current.toasts.map((toast) => toast.id)
      expect(ids[0]).not.toBe(ids[1])
      expect(ids.every((id) => typeof id === 'string')).toBe(true)
    })

    it('clears all toasts', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.addToast({ title: 'Toast 1', type: 'info' })
        result.current.addToast({ title: 'Toast 2', type: 'info' })
      })

      expect(result.current.toasts).toHaveLength(2)

      act(() => {
        result.current.clearAllToasts()
      })

      expect(result.current.toasts).toHaveLength(0)
    })

    it('provides predefined toast methods', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.disputeCreated()
        result.current.walletNotConnected()
        result.current.transactionFailed('Custom error')
      })

      expect(result.current.toasts).toHaveLength(3)
      expect(result.current.toasts[0].type).toBe('success')
      expect(result.current.toasts[1].type).toBe('error')
      expect(result.current.toasts[2].type).toBe('error')
      expect(result.current.toasts[2].message).toBe('Custom error')
    })

    it('uses custom duration when provided', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.success('Test', 'Message', 3000)
      })

      expect(result.current.toasts[0].duration).toBe(3000)
    })

    it('uses default duration for different toast types', () => {
      const { result } = renderHook(() => useToast())

      act(() => {
        result.current.success('Success')
        result.current.error('Error')
        result.current.warning('Warning')
        result.current.info('Info')
      })

      expect(result.current.toasts[0].duration).toBe(5000) // success
      expect(result.current.toasts[1].duration).toBe(7000) // error
      expect(result.current.toasts[2].duration).toBe(6000) // warning
      expect(result.current.toasts[3].duration).toBe(5000) // info
    })
  })
})
