import { createBrowserHistory } from 'history';
import { unstable_HistoryRouter as HistoryRouter, useRoutes } from 'react-router-dom';
import routes from './routes';
import { Suspense } from 'react';
import TokenGate from './utils/TokenGate';

export const history = createBrowserHistory();

function RoutesWrapper() {
    return useRoutes(routes);
}

export default function RouterWrapper() {
    return (
        <HistoryRouter history={history}>
            <TokenGate />
            <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                <RoutesWrapper />
            </Suspense>
        </HistoryRouter>
    );
}
