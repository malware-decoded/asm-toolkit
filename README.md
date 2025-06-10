# Assembly Toolkit

A modern web application for converting assembly code to machine code and emulating machine code execution. Built with React, TypeScript, and TailwindCSS.

## Features

- Assembly to Machine Code Converter
  - Support for x86, ARM64, ARM and other architectures
  - Configurable endianness and mode settings
  - Split-pane layout with real-time conversion
  - Copy-to-clipboard functionality

- Machine Code Emulator
  - Real-time emulation output
  - Configurable endianness and mode settings

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd asm-toolkit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Development

The project is structured as follows:

```
src/
  ├── components/         # React components
  │   ├── AssemblerView.tsx
  │   ├── EmulatorView.tsx
  │   ├── CodeEditor.tsx
  │   └── ...
  ├── store/             # Global state management
  │   └── useStore.ts
  ├── App.tsx           # Main application component
  └── index.tsx         # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
