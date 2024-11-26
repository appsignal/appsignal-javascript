export const pushMock = jest.fn(span => Promise.resolve(span))

export const PushApi = jest.fn().mockImplementation(() => {
  return {
    push: pushMock
  }
})
