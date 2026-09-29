export function resetFullPageState(windowObject, documentObject) {
  documentObject.body.classList.remove("fullpage-active");
  documentObject.documentElement.classList.remove("fullpage-active");

  const scrollToTop = () => windowObject.scrollTo({ top: 0, left: 0, behavior: "auto" });
  scrollToTop();
  windowObject.requestAnimationFrame(scrollToTop);
}
