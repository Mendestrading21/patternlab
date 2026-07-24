import { describe, expect, it } from '@jest/globals';
import { theme } from '@/design-system/theme';
import { TRADEMY_ICON_NAMES } from '@/design-system/icons/TrademyIcon';
import { STEP_META } from './lessonStepMeta';

describe('LessonStepView — métadonnées visuelles du parcours', () => {
  it('représente les étapes illustrées avec la famille Trademy, sans emoji', () => {
    const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️]/u;
    for (const meta of Object.values(STEP_META)) {
      expect(meta.label).not.toMatch(emoji);
      if (meta.icon) expect(TRADEMY_ICON_NAMES).toContain(meta.icon);
    }
  });

  it('un faux signal reste neutre et ne devient jamais une direction baissière', () => {
    expect(STEP_META.falseSignal.color).toBe(theme.colors.falseSignal);
    expect(STEP_META.falseSignal.accent).toBe(theme.colors.falseSignal);
    expect(STEP_META.falseSignal.icon).toBe('false-signal');
    expect(STEP_META.falseSignal.color).not.toBe(theme.colors.bearish);
    expect(STEP_META.falseSignal.color).not.toBe(theme.colors.bullish);
  });
});
