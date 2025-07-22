# Coffee Roaster Game - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a professional web-based coffee roasting simulation game built with:
- **Phaser 3** - Game engine for 2D web games
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Modern Web Standards** - Progressive Web App capabilities

## Code Style & Architecture

### TypeScript Standards
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use enums for constants and game states
- Implement proper error handling with custom error types
- Use generics where appropriate for reusability

### Game Architecture Patterns
- **Scene Management**: Each game screen is a separate Phaser scene
- **Component System**: Reusable game objects and UI components
- **Data Management**: Centralized game state with TypeScript interfaces
- **Event System**: Use Phaser's event emitter for decoupled communication

### Coffee Industry Accuracy
- All coffee-related data should be scientifically accurate
- Bean varieties, roasting temperatures, and flavor profiles must be realistic
- Use actual coffee industry terminology and processes
- Quality calculations should reflect real-world cupping standards

### Performance Considerations
- Target 60fps on mid-range devices
- Optimize sprite sheets and asset loading
- Use object pools for frequently created/destroyed objects
- Implement efficient collision detection and physics

### Code Organization
```
src/
├── scenes/          # Phaser scenes (game screens)
├── components/      # Reusable game objects
├── data/           # Game data and configurations
├── managers/       # System managers (audio, save, etc.)
├── utils/          # Helper functions and utilities
└── types/          # TypeScript type definitions
```

### Naming Conventions
- Use PascalCase for classes and interfaces
- Use camelCase for variables and functions
- Use UPPER_SNAKE_CASE for constants
- Prefix interfaces with 'I' when needed for clarity
- Use descriptive names that reflect coffee industry terms

### Game-Specific Guidelines
- Roasting simulation should use realistic physics principles
- Customer AI should have believable personality and preferences
- Quality calculations must be transparent and educational
- UI should be intuitive for both coffee novices and experts
- All educational content should be factually accurate

### Error Handling
- Implement graceful degradation for missing assets
- Handle save/load operations with proper error recovery
- Provide meaningful error messages for development
- Use try-catch blocks for async operations

### Testing Approach
- Write unit tests for game logic and calculations
- Test cross-browser compatibility
- Validate mobile responsiveness
- Ensure accessibility compliance

When generating code, prioritize:
1. Type safety and proper TypeScript usage
2. Coffee industry authenticity and accuracy
3. Performance optimization for web deployment
4. Clean, maintainable, and well-documented code
5. User experience and accessibility considerations
