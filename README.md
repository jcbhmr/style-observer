# `StyleObserver`

## Installation

## Usage

```html
<div id="flasher"></div>
<script type="module">
  setInterval(() => {
    if (Math.random() < 0.5) {
      flasher.style = "color: red"
    } else {
        flasher.style = "color: green"
    }
  }, 1000)
</script>

<div id="flashercopy"></div>
<script type="module">
  import { StyleObserver } from "style-observer"
  const so = new StyleObserver(() => {
    flashercopy.style = flasher.style
  })
  so.observe(flasher, { attributes: true })
</script>
```

### `.observe()` options

Just like `MutationObserver`'s `.observe()` method has options to control how much to observe, so does the `StyleObserver` have options.

- **`attributes`:** Boolean. Defaults to `false`. Will observe changes in all own attributes including `style="..."`. The most basic technique.

- **`supertree`:** Boolean. Defaults to `false`. Whether or not to watch the element's entire `.ownerDocument` and `.getRootNode()` (if in shadow DOM) tree. Changes in the parent tree like `body.dark-theme` may affect styling of children.

- **`subtree`:** Boolean. Defaults to `false`. Whether or not to watch the element's subtree. Changes in the subtree may affect styling via `:has()` or `:empty`.

- **`styleSheetMutations`:** Boolean. Defaults to `false`. Whether to enable mutation detection of `CSSStyleSheet` instances. If there is more than one `StyleObserver` that has this option enabled then a monkeypatch will be applied to various parts of the CSSOM API to trigger style diff checking. Use with caution.

The `StyleObserver` makes heavy use of the `MutationObserver` for its implementation which is why many of its `.observe()` options are easily exposed here.
