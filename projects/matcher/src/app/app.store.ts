import { observable, configure, action, autorun, decorate } from 'mobx';

configure({
  enforceActions: true,
  computedRequiresReaction: true,
});

export enum Screen {
  Guide1,
  Guide2,
  Login,
  Matching,
  Planning,
}

export enum Language {
  NL = 'nl',
  EN = 'en',
}

class AppStore {
  @observable screen: Screen = Screen.Guide1;

  @action.bound
  setScreen(screen: Screen) {
    this.screen = screen;
  }

  @observable language: Language = Language.NL;
}
const store = new AppStore();

export default store;
