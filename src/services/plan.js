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
    const _profiles = profiles.map(profile => {
      const _profile = { ...profile?.toObject() };

      return {
        ..._profile,
        astral: {
          ..._profile?.astral,
          texts: getMainMercurioOtherTexts({
            plan: _profile?.user?.plan,
            profile: _profile
          })
        }
      };
    });

    return _profiles;
  }

  if (mainUser?.plan === 'JUPITER') {
    const _profiles = profiles.map(profile => {
      const _profile = { ...profile?.toObject() };

      return {
        ..._profile,
        astral: {
          ..._profile?.astral,
          texts: getMainJupiterOtherTexts({
            plan: _profile?.user?.plan,
            profile: _profile
          })
        }
      };
    });

    return _profiles;
  }

  return profiles;
};
