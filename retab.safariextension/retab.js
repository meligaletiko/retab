document.onkeydown = function (e) {
  if (e.metaKey && e.shiftKey && e.keyCode === 84) {
    e.preventDefault()
    safari.self.tab.dispatchMessage("retab")
  }
}
