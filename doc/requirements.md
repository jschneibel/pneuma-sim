# Requirements

This is a brainstorminge list of requirements, some of which have been implemented.

## General

- Start page to pre-load editor (as SPA)
- Login system
- Guest mode (when not logged in; doesn't include saving/loading files online)
- Dark/light mode
- Multiple languages
- File sharing by
  - sending file via email
  - sending link with all data in url via email
  - sending link with online circuit identifier to create personal copy of circuit
- Display message if browser does not support JavaScript
- Download/Install as desktop application (e.g. using Electron)

## Editor

- Zoom view using
  - \+ and - on num pad
  - mouse wheel
- Pan view using
  - hold alt + left mouse button and drag
  - hold right mouse button and drag
  - hold middle mouse button and drag
- Save/open circuit
  - as file
  - in online profile
  - from preset/library
- Import Festo FluidSIM file
- Export Festo FluidSIM file
- Editor tabs for multiple circuits (does this even make sense - could just use browser tabs instead?)
- Editor tools shown as
  - fixed sidebars
  - movable, minimizable/collapsible (and resizable?) windows
- Print (e.g. as PDF)
- Help as
  - button (leading to pop-up, dedicated help page, ...)
  - minimalist, unobtrusive text overlay
- Tooltips
- Undo/redo function using
  - buttons (shown in editor - where?)
  - browser back/forward button
  - ctrl + Z/Y
- "Text field" tool (to place custom text like a circuit element)

## Circuit elements

- Element types:
  - voltage source (phys. properties: voltage)
  - wire (phys. properties: )
  - switch (phys. properties: )
  - relay (phys. properties: )
  - cylinder (phys. properties: )
  - ...
- Place new elements using drag and drop from toolbox
- Select one element using left click on element
- Select/deselect multiple elements using
  - shift click on individual elements
  - ctrl click on individual elements
  - hold click on empty area and drag to open selection window (only for selecting, not deselecting)
- Deselect all elements using left click in empty area
- Move elements using
  - drag and drop on selected element(s) or one unselected element
  - arrow keys
    - shift + arrow keys for smaller/larger distance
  - pixel number (in properties window?)
- Move elements horizontally/vertically using
  - shift + drag and drop on selected element(s) or one unselected element
- Snap elements when moving or placing them
- On mouse hover, colorize the element that would be selected on mouse down
- Delete elements using
  - delete key
  - delete button (shown in editor - where?)
- Element properties of selected element shown as
  - fixed sidebars
  - movable, minimizable/collapsible windows
- Element properties of a single selected element include
  - element type
  - element name (editable?)
  - position x/y (editable within limits)
  - rotation (editable in 90 degree steps)
  - scale/size (editable within limits)
  - connected elements
  - warning messages (e.g. 'not runnable', 'not connected')
  - physical properties (e.g. resistance, voltage)
- Element properties of multiple selected elements include
  - element types
  - element names
  - warning messages (e.g. 'not runnable', 'not connected')
- Settings dropdown when right clicking on element
  - copy
  - delete
  - paste
  - rotate 90 degrees (counter-)clockwise
  - flip vertically
  - flip horizontally

## Simulation

- Run simulation using
  - space bar
  - run button (shown in editor - where?)
- Pause running simulation using
  - space bar
  - pause button (shown in editor - where? Should it replace play button?)
- Stop/cancel running simulation using
  - escape key
  - stop button (shown in editor - where?)
- Animate graphs of physical variables while animation is running
  - Open points: Which graphs are shown? Where? How?
- Animate circuit elements while animation is running
- Control animation speed using
  - dropdown
  - input field
  - faster/slower buttons
- Save animation as video
- Save output as log file/results file
