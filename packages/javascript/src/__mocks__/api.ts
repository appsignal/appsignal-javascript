let mock: jest.Mock

beforeEach(() => {
  mock = jest.fn(span => Promise.resolve(span))
})

export const pushMock = () => mock

export const PushApi = jest.fn().mockImplementation(() => {
  return {
    push: mock
  }
})
