// jsdom does not implement ResizeObserver, which Vuetify layout components use.
class ResizeObserverStub {
  observe (): void {}
  unobserve (): void {}
  disconnect (): void {}
}
globalThis.ResizeObserver ??= ResizeObserverStub
