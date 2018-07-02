import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../app/app.store';
import Button from '@material-ui/core/Button';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { Grid, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

@observer
export default class MatchScreen extends React.Component {
  render() {
    const s = store.suggestion ? store.suggestion.suggestion : null;
    const title = s ? s.title : null;
    const description = s
      ? typeof s.description['a-tot-z'] === 'object'
        ? s.description['a-tot-z']!.dutch
        : null
      : null;

    const actionsDisabled = !s || store.changingFavorite.indexOf(s.id) !== -1;

    const director =
      (s && s.credits.find(c => c.role.key === 'director')) || null;
    return (
      <Grid
        item
        container
        style={{
          maxWidth: 800,
          width: '90%',
          margin: '0 auto',
        }}
        justify={'space-between'}
        direction="column"
        spacing={40}
        wrap="nowrap"
      >
        <Grid
          item
          style={{ flexGrow: 1, width: '100%', overflow: 'scroll', height: 0 }}
        >
          <SuggestionVideo s={s} />
          <h1>{s ? s.title : 'Laden...'}</h1>
          <p>{description}</p>
          {s !== null && (
            <table
              style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                textAlign: 'left',
              }}
            >
              <tbody>
                <tr>
                  <th style={{ width: '50%' }}>Genre</th>
                  <td style={{ width: '50%' }}>
                    {s.genre.charAt(0).toUpperCase() + s.genre.slice(1)}
                  </td>
                </tr>
                <tr>
                  <th style={{ width: '50%' }}>Lengte</th>
                  <td style={{ width: '50%' }}>{s.lengthInMinutes} minuten</td>
                </tr>
                {director && (
                  <tr>
                    <th style={{ width: '50%' }}>Regisseur</th>
                    <td style={{ width: '50%' }}>{director.name}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </Grid>
        <Grid item container direction="row" justify="space-around">
          <FavoriteButton action="dislike" disabled={actionsDisabled} s={s!} />
          <FavoriteButton action="like" disabled={actionsDisabled} s={s!} />
        </Grid>
      </Grid>
    );
  }
}

const ytRegex = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/;

// tslint:disable-next-line:function-name
function SuggestionVideo({ s }: { s: null | { media: { value: string }[] } }) {
  if (s === null) return null;

  const ytLink = s.media.find(m => ytRegex.test(m.value));
  if (!ytLink) return null;

  const tested = ytRegex.exec(ytLink.value);
  if (tested === null || !tested[1]) return null;
  const ytId = tested[1];

  // tslint:disable-next-line:variable-name
  const Iframe: any = 'iframe';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: '56.25%',
      }}
    >
      <Iframe
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
        }}
        src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&amp;showinfo=0&amp;autoplay=1`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
}

// tslint:disable-next-line:function-name
function FavoriteButton({ action, disabled, s }: FavoriteButtonProps) {
  return (
    <Grid item style={{ width: '33%', minWidth: 100 }}>
      <MuiThemeProvider theme={action === 'like' ? greenTheme : redTheme}>
        <Button
          onClick={() => store[action](s.id)}
          disabled={disabled}
          variant="raised"
          color="primary"
          style={{ width: '100%' }}
        >
          <Grid container direction="column">
            <Grid item>
              {action === 'like' ? <ThumbUpIcon /> : <ThumbDownIcon />}
            </Grid>
            <Grid>{action === 'like' ? 'Leuk' : 'Niet leuk'}</Grid>
          </Grid>
        </Button>
      </MuiThemeProvider>
    </Grid>
  );
}
interface FavoriteButtonProps {
  action: 'like' | 'dislike';
  disabled: boolean;
  s: { id: string };
}
const redTheme = createMuiTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

const greenTheme = createMuiTheme({
  palette: {
    primary: {
      main: green[600],
    },
  },
});
