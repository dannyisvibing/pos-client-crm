/**
 * Utility for adding the correct base class for either a FontAwesome (fa) or Vend (vd-i) icon, if not already present.
 *
 * @function ensureIconBaseClass
 *
 * @param {String} icon
 *        The requested icon.
 *
 * @return {String} The requested icon with the correct base icon class, either vd-i or fa
 */
export function ensureIconBaseClass(icon) {
  if (!icon) {
    return;
  }

  if (icon.match(/fa-/g) && !icon.match(/\bfa(?!-)\b/g)) {
    // FontAwesome icon without the required 'fa' base class
    icon = `fa ${icon}`;
  } else if (icon.match(/vd-i-/g) && !icon.match(/\bvd-i(?!-)\b/g)) {
    // Vend icon without the required 'vd-i' base class
    icon = `vd-i ${icon}`;
  }

  return icon;
}
