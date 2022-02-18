/**
 * @param {!Window} bar
 * @return {!./service/ampdoc-impl.AmpDocService}
 */
function x(bar: Window): AmpDocService {
  return /** @type {!./service/ampdoc-impl.AmpDocService} */ y(
    bar,
    "foo"
  ) as AmpDocService;
}
