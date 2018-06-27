import store from '../app/app.store';

class Texts {
  'welcome.heading' = 'IFFR FilmMatcher';
  'welcome.text' = {
    en:
      'Welkome to our full-automatic FilmMatcher! We help you make a choice in the enormous filmprogramma of 2018.',
    nl:
      'Welkom bij onze volautomatische FilmMatcher! Wij helpen je een keuze te maken in het gigantische filmprogramma van 2018.',
  };
}

const texts = new Texts();

type TextID = keyof Texts;

export default function getText(textid: TextID) {
  const text = texts[textid];
  if (typeof text === 'string') return text;

  return text[store.language];
}
