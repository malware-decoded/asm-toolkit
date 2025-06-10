import { Tab } from '@headlessui/react'
import { AssemblerView } from './components/AssemblerView'
import { EmulatorView } from './components/emulator-view/EmulatorView'
import './App.css'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Assembly Toolkit
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-700'
                )
              }
            >
              Assembler
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-900 hover:bg-white/[0.12] hover:text-blue-700'
                )
              }
            >
              Emulator
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4 h-[calc(100vh-12rem)]">
            <Tab.Panel className="h-full rounded-xl bg-white p-3 shadow-lg ring-1 ring-black/5">
              <AssemblerView />
            </Tab.Panel>
            <Tab.Panel className="h-full rounded-xl bg-white p-3 shadow-lg ring-1 ring-black/5">
              <EmulatorView />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  )
}
