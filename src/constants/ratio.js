export const ASPECT_RATIO_CONFIG = {
  '3/4': {
    value: 3 / 4,
    camera: {
      className: 'aspect-[3/4]',
      position: 'bottom-54',
    },
    tournament: {
      className: 'aspect-[3/4]',
    },
    next: '9/16',
  },

  '9/16': {
    value: 9 / 16,
    camera: {
      className: 'aspect-[9/16]',
      position: 'bottom-24',
    },
    tournament: {
      className: 'aspect-[3/4]',
    },
    next: '1/1',
  },

  '1/1': {
    value: 1,
    camera: {
      className: 'aspect-square',
      position: 'bottom-74',
    },
    tournament: {
      className: 'aspect-square',
    },
    next: '3/4',
  },
};