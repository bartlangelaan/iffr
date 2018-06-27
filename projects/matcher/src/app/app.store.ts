import { observable, configure } from 'mobx';

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

class AppStore {
  @observable screen: Screen = Screen.Guide1;

  setScreen(screen: Screen) {
    this.screen = screen;
  }
}

export default new AppStore();