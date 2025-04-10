import { createBrowserHistory } from 'history';
import { unstable_HistoryRouter as HistoryRouter, useRoutes } from 'react-router-dom';
import routes from './routes';

export const history = createBrowserHistory();

function RoutesWrapper() {
    return useRoutes(routes);
}

export default function RouterWrapper() {
    return (
        <HistoryRouter history={history}>
            <RoutesWrapper />
        </HistoryRouter>
    );
}
