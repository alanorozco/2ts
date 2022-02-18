/**
 * @param {!Window} window
 * @return {!./service/ampdoc-impl.AmpDocService}
 */
const x = (window) => {
  return /** @type {!./service/ampdoc-impl.AmpDocService} */ (
    y(window, 'ampdoc')
  );
};
