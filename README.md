# collabdocs
This is an app for demonstrating how to use the mset package to implement a collaborative editor.
The goal of the project is to build an editor that supports thousands of simultaneous editors without
any noticeable lag. The user's own edits appear in real-time on their screen and remote edit operations
are handled "between keystrokes".

The system has three main components:
* CanvasEditor - a javascript object which handles all user input including key presses and mouse clicks
   and which translates these operations into edit operations on the underlying string.
* TextEditor - javascript object which maintains a list of the strings that are visible in the textwindow and which processes 
