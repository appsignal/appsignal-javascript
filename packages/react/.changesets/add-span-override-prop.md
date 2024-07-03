---
bump: patch
type: add
---

Add a span override prop to the `ErrorBoundary` and `LegacyBoundary` components.

Pass an override function to the error boundary component in order to set properties, such as tags, params or breadcrumbs, in the error span that will be sent to AppSignal.

The override function is only called when an error is about to be sent. This allows you to only perform expensive computation to add information to the error when an error will actually be reported.

When defined within a component, the function should be memoized with `useCallback` to prevent unnecessary re-renders:

```jsx
  export default const SomeComponent = ({ someProp }) => {
    const override = useCallback((span) => {
      span.setTags({ someProp })
    }, [someProp]);

    return (
      <ErrorBoundary override={override}>
        { /* Your component here */ }
      </ErrorBoundary>
    )
  }
```
