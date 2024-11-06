import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import PageComponent from "./components/PageComponent.jsx";
import { useStateContext } from './contexts/ContexProvider.jsx';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  const { currentUser } = useStateContext();

  return (
    <PageComponent title="Dashboard">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Your content here */}
      </div>
    </PageComponent>
  );
}
