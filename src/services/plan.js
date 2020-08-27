import { filterAstralTexts } from './astral';
// const JupiterPlanTexts = { LOVE: 'LOVE', MARRIAGE: 'MARRIAGE', DATING: 'DATING', SEX: 'SEX' };

const MercurioPlanTexts = ['EMOTION', 'INSTINCT', 'INTELLECT', 'PERSONALITY'];

const getMainMercurioOtherTexts = ({ plan, profile }) => {
  switch (plan) {
    case 'MERCURIO':
      return filterAstralTexts({ texts: profile?.astral?.texts, filter: MercurioPlanTexts });

    case 'JUPITER':
      return filterAstralTexts({ texts: profile?.astral?.texts, filter: profile?.shownTexts });

    default:
      return filterAstralTexts({ texts: profile?.astral?.texts, filter: MercurioPlanTexts });
  }
};

const getMainJupiterOtherTexts = ({ plan, profile }) => {
  switch (plan) {
    case 'MERCURIO':
      return profile?.astral?.texts;

    case 'JUPITER':
      return filterAstralTexts({ texts: profile?.astral?.texts, filter: profile?.shownTexts });

    default:
      return profile?.astral?.texts;
  }
};

export const applyPlanMethods = ({ profiles, mainUser }) => {
  if (mainUser?.plan === 'MERCURIO') {
    const _profiles = profiles.map(profile => ({
      ...profile.toObject(),
      astral: {
        ...profile?.astral,
        texts: getMainMercurioOtherTexts({ plan: profile?.user?.plan, profile })
      }
    }));

    return _profiles;
  }

  if (mainUser?.plan === 'JUPITER') {
    const _profiles = profiles.map(profile => ({
      ...profile.toObject(),
      astral: {
        ...profile?.astral,
        texts: getMainJupiterOtherTexts({ plan: profile?.user?.plan, profile })
      }
    }));

    return _profiles;
  }

  return profiles;
};
