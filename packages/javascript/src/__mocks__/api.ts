export const PushApi = jest.fn().mockImplementation(() => {
  return {
    push: jest.fn(span => Promise.resolve(span))
  }
})
