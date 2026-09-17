/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#16181B',
    tint: '#E4542C',
    background: '#F6F7F8',
    foreground: '#16181B',
    card: '#FFFFFF',
    cardForeground: '#16181B',
    primary: '#E4542C',
    primaryForeground: '#FFFFFF',
    secondary: '#FFF0EB',
    secondaryForeground: '#B43A1E',
    muted: '#EEF0F2',
    mutedForeground: '#727980',
    accent: '#F5A04B',
    accentForeground: '#6B3715',
    destructive: '#C83B3B',
    destructiveForeground: '#FFFFFF',
    border: '#E6E8EA',
    input: '#D9DDE1',
    charcoal: '#17191C',
    charcoalSoft: '#24272B',
    success: '#2F8F62',
    successSoft: '#E7F5EE',
    warning: '#D58A25',
    warningSoft: '#FFF4DE',
    info: '#3B73A8',
    infoSoft: '#EAF3FB',
    white: '#FFFFFF',
  },
  radius: 18,
};

export default colors;
