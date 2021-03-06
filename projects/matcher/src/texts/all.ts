import store from '../app/app.store';

class Texts {
  'welcome.heading' = 'IFFR FilmMatcher';
  'welcome.text' = {
    en:
      'Welkome to our full-automatic FilmMatcher! We help you make a choice in the enormous filmprogramma of 2018.',
    nl:
      'Welkom bij onze volautomatische FilmMatcher! Wij helpen je een keuze te maken in het gigantische filmprogramma van 2018.',
  };
  'explanation1.heading' = 'Suggesties';
  'explanation1.text' =
    'Door films te beoordelen onthouden wij jouw voorkeuren, en kunnen wij persoonlijke filmsuggesties doen. Hoe meer films je beoordeelt, hoe beter de suggesties bij jou aansluiten!';
  'explanation2.heading' = 'Persoonlijk';
  'explanation2.text' =
    'Dit werkt het beste als je bent ingelogd. Je hoeft niet in te loggen, maar dan worden je suggesties niet opgeslagen.';
  'login.myiffr' = 'Login met MyIFFR-account';
  'login.facebook' = 'Login met Facebook';
  'login.anonymous' = 'Doorgaan zonder inloggen';
}

const texts = new Texts();

type TextID = keyof Texts;

export default function getText(textid: TextID) {
  const text = texts[textid];
  if (typeof text === 'string') return text;

  return text[store.language];
}
