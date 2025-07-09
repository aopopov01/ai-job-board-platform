import { render, screen } from '@testing-library/react'
import { LazyImage } from '../LazyImage'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

describe('LazyImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 300,
    height: 200,
  }

  beforeEach(() => {
    mockIntersectionObserver.mockClear()
  })

  it('renders with placeholder initially', () => {
    render(<LazyImage {...defaultProps} />)
    
    // Should show placeholder/loading state (div with SVG icon)
    const placeholder = document.querySelector('.bg-gray-200.animate-pulse')
    expect(placeholder).toBeInTheDocument()
  })

  it('loads image immediately when priority is true', () => {
    render(<LazyImage {...defaultProps} priority={true} />)
    
    // Should not use IntersectionObserver when priority is true
    expect(mockIntersectionObserver).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <LazyImage {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('uses IntersectionObserver for lazy loading', () => {
    render(<LazyImage {...defaultProps} />)
    
    // Should use IntersectionObserver for lazy loading
    expect(mockIntersectionObserver).toHaveBeenCalled()
  })

  it('has correct alt text', () => {
    render(<LazyImage {...defaultProps} priority={true} />)
    
    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
  })
})