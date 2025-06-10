import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useStore, type Architecture } from '../../store/useStore';

const ASSEMBLER_ARCHITECTURES: Architecture[] = [
  'x86',
  'ARM64',
  'ARM',
  'HEXAGON',
  'MIPS',
  'PPC',
  'SPARC',
  'SYSTEMZ'
];

const EMULATOR_ARCHITECTURES: Architecture[] = [
  'ARM64',
  'ARM',
  'MIPS',
  'SPARC',
  'x86'
];


interface Props {
  mode: 'emulator' | 'assembler';
}

export function ArchitectureSelector({ mode }: Props) {
  const { architecture, setArchitecture } = useStore();
  const architectures = mode === 'emulator' ? EMULATOR_ARCHITECTURES : ASSEMBLER_ARCHITECTURES;

  return (
    <Listbox value={architecture} onChange={setArchitecture}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{architecture}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
            {architectures.map((arch) => (
              <Listbox.Option
                key={arch}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
                value={arch}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {arch}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
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