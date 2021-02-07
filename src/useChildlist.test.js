import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { ApiProvider } from './provider'
import { useChildList } from './hooks'
import store from './store'
import init from './__mocks__/@skolplattformen/embedded-api'
import createStorage from './__mocks__/AsyncStorage'

const pause = (ms = 0) => new Promise((r) => setTimeout(r, ms))

describe('useChildList()', () => {
  let api
  let storage
  let response
  const wrapper = ({ children }) => (
    <ApiProvider api={api} storage={storage}>{children}</ApiProvider>
  )
  beforeEach(() => {
    response = [{ id: 1 }]
    api = init()
    api.getChildren.mockImplementation(() => (
      new Promise((res) => {
        setTimeout(() => res(response), 50)
      })
    ))
    storage = createStorage({
      children: [{ id: 2 }],
    }, 2)
  })
  afterEach(async () => {
    await act(async () => {
      await pause(70)
      store.dispatch({ entity: 'ALL', type: 'CLEAR' })
    })
  })
  it('returns correct initial value', () => {
    const { result } = renderHook(() => useChildList(), { wrapper })

    expect(result.current.status).toEqual('pending')
  })
  it('calls api', async () => {
    await act(async () => {
      api.isLoggedIn = true
      const { waitForNextUpdate } = renderHook(() => useChildList(), { wrapper })

      await waitForNextUpdate()
      await waitForNextUpdate()

      expect(api.getChildren).toHaveBeenCalled()
    })
  })
  it('only calls api once', async () => {
    await act(async () => {
      api.isLoggedIn = true
      renderHook(() => useChildList(), { wrapper })
      const { waitForNextUpdate } = renderHook(() => useChildList(), { wrapper })

      await waitForNextUpdate()
      renderHook(() => useChildList(), { wrapper })
      await waitForNextUpdate()
      renderHook(() => useChildList(), { wrapper })
      await waitForNextUpdate()

      const { result } = renderHook(() => useChildList(), { wrapper })

      expect(api.getChildren).toHaveBeenCalledTimes(1)
      expect(result.current.status).toEqual('loaded')
    })
  })
  it('calls cache', async () => {
    await act(async () => {
      api.isLoggedIn = true
      const { result, waitForNextUpdate } = renderHook(() => useChildList(), { wrapper })

      await waitForNextUpdate()
      await waitForNextUpdate()

      expect(result.current.data).toEqual([{ id: 2 }])
    })
  })
  it('updates status to loading', async () => {
    await act(async () => {
      api.isLoggedIn = true
      const { result, waitForNextUpdate } = renderHook(() => useChildList(), { wrapper })

      await waitForNextUpdate()
      await waitForNextUpdate()

      expect(result.current.status).toEqual('loading')
    })
  })
  it('updates status to loaded', async () => {
    await act(async () => {
      api.isLoggedIn = true
      const { result, waitForNextUpdate } = renderHook(() => useChildList(), { wrapper })

      await waitForNextUpdate()
      await waitForNextUpdate()
      await waitForNextUpdate()

      expect(result.current.status).toEqual('loaded')
    })
  })
  it('stores in cache if not fake', async () => {
    await act(async () => {
      api.isLoggedIn = true
      api.isFake = false

      const { waitForNextUpdate } = renderHook(() => useChildList(), { wrapper })

      await waitForNextUpdate()
      await waitForNextUpdate()
      await waitForNextUpdate()
      await pause(20)

      expect(storage.cache.children).toEqual('[{"id":1}]')
    })
  })
  it('does not store in cache if fake', async () => {
    await act(async () => {
      api.isLoggedIn = true
      api.isFake = true

      const { waitForNextUpdate } = renderHook(() => useChildList(), { wrapper })

      await waitForNextUpdate()
      await waitForNextUpdate()
      await pause(20)

      expect(storage.cache.children).toEqual('[{"id":2}]')
    })
  })
})
