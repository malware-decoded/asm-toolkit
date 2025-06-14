import { Fragment, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useStore, type Mode, type Architecture } from '../../store/useStore';

const getModeOptions = (architecture: Architecture): Mode[] => {
  switch (architecture) {
    case 'x86':
      return ['16-bit', '32-bit', '64-bit'];
    case 'MIPS':
      return ['MIPS32', 'MIPS64'];
    case 'PPC':
      return ['PPC32', 'PPC64'];
    case 'SPARC':
      return ['SPARC32', 'SPARC64'];
    case 'ARM':
      return ['ARM', 'THUMB'];
    default:
      return ['32-bit'];
  }
};

export function ModeSelector() {
  const { architecture, mode, setMode } = useStore();
  const modeOptions = getModeOptions(architecture);
  const isDisabled = architecture === 'ARM64';

  // Set default modes when architecture changes
  useEffect(() => {
    if (isDisabled) {
      setMode('32-bit');
    } else if (!modeOptions.includes(mode)) {
      setMode(modeOptions[0]);
    }
  }, [architecture]); // Only trigger when architecture changes

  return (
    <Listbox value={mode} onChange={setMode} disabled={isDisabled}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm text-gray-900 dark:text-white">
          <span className="block truncate">{mode}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400 dark:text-gray-300" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {modeOptions.map((modeOption) => (
              <Listbox.Option
                key={modeOption}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                  }`
                }
                value={modeOption}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {modeOption}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
} 