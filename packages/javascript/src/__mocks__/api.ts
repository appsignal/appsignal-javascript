export const PushApi = jest.fn().mockImplementation(() => {
  return {
    push: jest.fn(() => Promise.resolve())
  }
})
