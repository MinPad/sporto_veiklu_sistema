import { useBlocker } from './useBlocker';

export function useUnsavedChangesPrompt(shouldBlock, onNavigate) {
    useBlocker(shouldBlock, onNavigate);
}
