export function navigateToContact(windowObject) {
  windowObject.history.scrollRestoration = "manual";
  windowObject.scrollTo({ top: 0, left: 0, behavior: "auto" });
  windowObject.location.assign("/#contact");
}
