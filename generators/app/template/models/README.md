## <%= projectName %> choo models.

Choo Models go here.

More information:  https://github.com/yoshuawuyts/choo-handbook/blob/master/guides/designing-for-reusability.md

### Generate

```bash
$ choo generate model my-model
```

### Anatomy of a model

```js
{
  state: {
    /* initial values of state inside the model */
    // counter: 1
  },
  reducers: {
    /* synchronous operations that modify state. Triggered by actions. Signature of (data, state). */
    /*
    add: (data, state) => ({ counter: state.counter + 1})
    */
  },
  effects: {
    // asynchronous operations that don't modify state directly.
    // Triggered by actions, can call actions. Signature of (data, state, send, done)
    /*
    myEffect: (data, state, send, done) => {
      // do stuff
    }
    */
  },
  subscriptions: [
    // asynchronous read-only operations that don't modify state directly.
    // Can call actions. Signature of (send, done).
    /*
    (send, done) => {
      // do stuff
    }
    */
  ]
}
```
