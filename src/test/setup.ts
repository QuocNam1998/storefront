import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

// Every test starts with nothing saved in the browser and nothing on screen from the test before it.
beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})
