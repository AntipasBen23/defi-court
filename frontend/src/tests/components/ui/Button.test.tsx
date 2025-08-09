import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

// Group related tests together
describe('Button Component', () => {
  // Test 1: Basic rendering
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    
    // Find the button and check if it's in the document
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  // Test 2: Click functionality
  it('calls onClick when clicked', () => {
    // Create a mock function to track if it's called
    const handleClick = jest.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Check if our mock function was called
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // Test 3: Different variants
  it('applies correct classes for different variants', () => {
    render(<Button variant="primary">Primary</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600') // Adjust based on your actual classes
  })

  // Test 4: Disabled state
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  // Test 5: Loading state
  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    
    // Look for loading indicator (adjust based on your implementation)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})