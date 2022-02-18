/**
 * @param {!Window} window
 * @return {!./service/ampdoc-impl.AmpDocService}
 */
const x = (window: Window): AmpDocService => {
  return /** @type {!./service/ampdoc-impl.AmpDocService} */ y(
    window,
    "ampdoc"
  ) as AmpDocService;
};
