import { useEffect } from 'react';
import { history } from '../router';

export function useBlocker(shouldBlock, onNavigate) {
    useEffect(() => {
        if (!shouldBlock || typeof onNavigate !== 'function') return;

        const unblock = history.block((tx) => {
            onNavigate({
                retry: () => {
                    unblock();
                    history.push(tx.pathname);
                },
            });
        });

        return () => unblock();
    }, [shouldBlock, onNavigate]);
}
