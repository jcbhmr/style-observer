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
  so.observe(flasher)
</script>
```

- Attribute mutations
- Subtree mutations
- Supertree mutations
- CSS animations
- Media query changes
- Stylesheet additions & removals
- Adopted stylesheet additions & removals
- Stylesheet mutations
- Supertree resizings
