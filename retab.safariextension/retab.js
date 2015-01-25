document.onkeydown = function (e) {
  safari.self.tab.dispatchMessage("onkeydown", {
      meta:  e.metaKey,
      shift: e.shiftKey,
      code:  e.keyCode
    }
  );
};
