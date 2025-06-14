import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useStore, type Architecture, type Endianness } from '../../store/useStore';


const getEndianOptions = (architecture: Architecture): Endianness[] => {
  switch (architecture) {
    case 'MIPS':
    case 'PPC':
    case 'SPARC':
      return ['big', 'little'];
    case 'HEXAGON':
    case 'SYSTEMZ':
      return ['big'];
    default:
      return ['little'];
  }
};

export function EndianSelector() {
  const { architecture, mode, endianness, setEndianness } = useStore();
  const [endianOptions, setEndianOptions] = useState<Endianness[]>(getEndianOptions(architecture));
 
  useEffect(() => {
    if (architecture === 'PPC' && mode === 'PPC32') {
      setEndianOptions(['big']);
      setEndianness('big');
    } else {
      setEndianOptions(getEndianOptions(architecture));
      setEndianness(endianOptions[0]);
    }


  }, [architecture, mode, setEndianness]);

  return (
    <Listbox value={endianness} onChange={setEndianness}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm text-gray-900 dark:text-white">
          <span className="block truncate">{endianness}</span>
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
            {endianOptions.map((endian) => (
              <Listbox.Option
                key={endian}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
                  }`
                }
                value={endian}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {endian}
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