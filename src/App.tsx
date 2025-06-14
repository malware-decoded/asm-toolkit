import { Tab } from '@headlessui/react'
import { AssemblerView } from './components/AssemblerView'
import { EmulatorView } from './components/emulator-view/EmulatorView'
import './App.css'
import { useState, useEffect } from 'react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a saved preference
    const savedMode = localStorage.getItem('darkMode')
    // Check system preference if no saved preference
    if (savedMode === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return savedMode === 'true'
  })

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Assembly Toolkit
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 dark:bg-blue-900/40 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400'
                    : 'text-blue-900 dark:text-blue-300 hover:bg-white/[0.12] hover:text-blue-700 dark:hover:text-blue-400'
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
                    ? 'bg-white dark:bg-gray-800 shadow text-blue-700 dark:text-blue-400'
                    : 'text-blue-900 dark:text-blue-300 hover:bg-white/[0.12] hover:text-blue-700 dark:hover:text-blue-400'
                )
              }
            >
              Emulator
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4 h-[calc(100vh-12rem)]">
            <Tab.Panel className="h-full rounded-xl bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/5 transition-colors duration-200">
              <AssemblerView />
            </Tab.Panel>
            <Tab.Panel className="h-full rounded-xl bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/5 transition-colors duration-200">
              <EmulatorView />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  )
}
