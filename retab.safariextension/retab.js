document.onkeydown = function (e) {
  var T = 84, Z = 90
  if (e.metaKey && e.shiftKey && e.keyCode === T) {
    safari.self.tab.dispatchMessage("retab", { chrome: true } )
  } else if (e.metaKey && e.codeKey === Z) {
    safari.self.tab.dispatchMessage("retab", { chrome: false } )
  }
}
