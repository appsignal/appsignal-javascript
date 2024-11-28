let mock: jest.Mock

beforeEach(() => {
  mock = jest.fn(span => Promise.resolve(span))
})

export const pushMockCall = (index: number = 0) => {
  expect(mock).toHaveBeenCalledTimes(index + 1)
  return mock.mock.calls[index][0].serialize()
}

export const PushApi = jest.fn().mockImplementation(() => {
  return {
    push: mock
  }
})
