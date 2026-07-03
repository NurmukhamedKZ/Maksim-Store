// Test helper: warps the real cursor to given screen coordinates so ParkSpot
// can be exercised end-to-end without a human moving the mouse.
// Usage: MoveMouse <x> <y>   (coordinates are top-left-origin, like screencapture)
import CoreGraphics
import Foundation

let args = CommandLine.arguments
guard args.count >= 3, let x = Double(args[1]), let y = Double(args[2]) else {
    print("usage: MoveMouse <x> <y>")
    exit(1)
}

let point = CGPoint(x: x, y: y)
CGWarpMouseCursorPosition(point)
// Also post a move event so apps using event taps (not just polling) see motion.
if let event = CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: point, mouseButton: .left) {
    event.post(tap: .cghidEventTap)
}
print("moved cursor to \(point)")
