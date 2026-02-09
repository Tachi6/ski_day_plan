export interface ViewBoxesState {
  settingsBox: boolean;
  selectResortBox: boolean;
  infoBox: boolean;
  tutorialBox: boolean;
}

export interface ViewBoxesPayload {
  isPortrait: boolean;
  hideTutorialForever?: boolean;
  hasSelectedResort?: boolean;
}

export type ViewBoxesAction =
  | { type: 'SETTINGS_BOX'; payload: ViewBoxesPayload }
  | { type: 'SELECT_RESORT_BOX'; payload: ViewBoxesPayload }
  | { type: 'INFO_BOX'; payload: ViewBoxesPayload }
  | { type: 'TUTORIAL_BOX'; payload: ViewBoxesPayload };

export const viewBoxesReducer = (state: ViewBoxesState, action: ViewBoxesAction) => {
  switch (action.type) {
    case 'INFO_BOX': {
      if (state.tutorialBox) return state;

      if (action.payload.isPortrait && !state.infoBox) {
        return {
          settingsBox: false,
          selectResortBox: false,
          infoBox: true,
          tutorialBox: false,
        };
      }
      return {
        ...state,
        infoBox: !state.infoBox,
      };
    }
    case 'SELECT_RESORT_BOX': {
      if (state.tutorialBox) return state;

      if (action.payload.isPortrait && !state.selectResortBox) {
        return {
          settingsBox: false,
          selectResortBox: true,
          infoBox: false,
          tutorialBox: false,
        };
      }
      return {
        ...state,
        selectResortBox: !state.selectResortBox,
      };
    }
    case 'SETTINGS_BOX': {
      if (state.tutorialBox) return state;

      if (action.payload.isPortrait && !state.settingsBox) {
        return {
          settingsBox: true,
          selectResortBox: false,
          infoBox: false,
          tutorialBox: false,
        };
      }
      return {
        ...state,
        settingsBox: !state.settingsBox,
      };
    }
    case 'TUTORIAL_BOX': {
      localStorage.setItem('showTutorial', JSON.stringify(action.payload.hideTutorialForever));

      return {
        ...state,
        tutorialBox: !state.tutorialBox,
        selectResortBox: true,
      };
    }

    default:
      return state;
  }
};
