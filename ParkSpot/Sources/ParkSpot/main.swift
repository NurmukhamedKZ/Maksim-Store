// ParkSpot — a parking lot for your mouse cursor.
// Menu bar utility that draws a "P" parking pad in the corner of the screen.
// Park your cursor in it, pay attention to the meter, or get fined.
import AppKit
import Foundation

// MARK: - Persisted stats

final class Stats {
    private let defaults = UserDefaults(suiteName: "com.parkspot.stats") ?? .standard

    var totalParks: Int {
        get { defaults.integer(forKey: "totalParks") }
        set { defaults.set(newValue, forKey: "totalParks") }
    }
    var totalFines: Double {
        get { defaults.double(forKey: "totalFines") }
        set { defaults.set(newValue, forKey: "totalFines") }
    }
    var currentStreak: Int {
        get { defaults.integer(forKey: "currentStreak") }
        set { defaults.set(newValue, forKey: "currentStreak") }
    }
    var longestStreak: Int {
        get { defaults.integer(forKey: "longestStreak") }
        set { defaults.set(newValue, forKey: "longestStreak") }
    }
    var ticketCounter: Int {
        get { defaults.integer(forKey: "ticketCounter") }
        set { defaults.set(newValue, forKey: "ticketCounter") }
    }

    func reset() {
        totalParks = 0
        totalFines = 0
        currentStreak = 0
        longestStreak = 0
        ticketCounter = 0
    }
}

// MARK: - Logging (so the app is testable end-to-end without a human watching the screen)

func logLine(_ s: String) {
    let ts = ISO8601DateFormatter().string(from: Date())
    let line = "[\(ts)] \(s)\n"
    FileHandle.standardOutput.write(line.data(using: .utf8)!)
    if let handle = FileHandle(forWritingAtPath: "/tmp/parkspot.log") {
        handle.seekToEndOfFile()
        handle.write(line.data(using: .utf8)!)
        handle.closeFile()
    } else {
        FileManager.default.createFile(atPath: "/tmp/parkspot.log", contents: line.data(using: .utf8))
    }
}

// MARK: - Parking session state machine

enum ParkState {
    case away
    case parked(ticketId: Int, startTime: Date, meterExpiry: Date, fined: Bool)
}

// MARK: - Parking pad view

final class ParkingPadView: NSView {
    var stateText: String = "SEARCHING FOR SPOT…"
    var subText: String = ""
    var isParked: Bool = false
    var meterFraction: Double = 0 // 0...1, how close to fine

    override func draw(_ dirtyRect: NSRect) {
        let bg = isParked ? NSColor.systemYellow.withAlphaComponent(0.92) : NSColor.black.withAlphaComponent(0.75)
        let path = NSBezierPath(roundedRect: bounds.insetBy(dx: 2, dy: 2), xRadius: 14, yRadius: 14)
        bg.setFill()
        path.fill()
        NSColor.white.withAlphaComponent(0.9).setStroke()
        path.lineWidth = 3
        path.stroke()

        // Big "P"
        let pAttrs: [NSAttributedString.Key: Any] = [
            .font: NSFont.systemFont(ofSize: 42, weight: .heavy),
            .foregroundColor: isParked ? NSColor.black : NSColor.white
        ]
        let pStr = NSAttributedString(string: "P", attributes: pAttrs)
        let pSize = pStr.size()
        pStr.draw(at: NSPoint(x: bounds.midX - pSize.width / 2, y: bounds.midY - pSize.height / 2 + 8))

        // Status text
        let statusAttrs: [NSAttributedString.Key: Any] = [
            .font: NSFont.systemFont(ofSize: 10, weight: .bold),
            .foregroundColor: isParked ? NSColor.black : NSColor.white
        ]
        let statusStr = NSAttributedString(string: stateText, attributes: statusAttrs)
        let statusSize = statusStr.size()
        statusStr.draw(at: NSPoint(x: bounds.midX - statusSize.width / 2, y: 14))

        // Sub text (ticket / fine info)
        if !subText.isEmpty {
            let subAttrs: [NSAttributedString.Key: Any] = [
                .font: NSFont.systemFont(ofSize: 9, weight: .medium),
                .foregroundColor: isParked ? NSColor.black.withAlphaComponent(0.7) : NSColor.white.withAlphaComponent(0.7)
            ]
            let subStr = NSAttributedString(string: subText, attributes: subAttrs)
            let subSize = subStr.size()
            subStr.draw(at: NSPoint(x: bounds.midX - subSize.width / 2, y: 3))
        }

        // Meter bar along the bottom edge
        if isParked {
            let barRect = NSRect(x: 8, y: bounds.height - 10, width: bounds.width - 16, height: 4)
            NSColor.black.withAlphaComponent(0.25).setFill()
            NSBezierPath(roundedRect: barRect, xRadius: 2, yRadius: 2).fill()
            let fillWidth = barRect.width * CGFloat(min(max(meterFraction, 0), 1))
            let fillRect = NSRect(x: barRect.minX, y: barRect.minY, width: fillWidth, height: barRect.height)
            (meterFraction > 0.8 ? NSColor.systemRed : NSColor.systemGreen).setFill()
            NSBezierPath(roundedRect: fillRect, xRadius: 2, yRadius: 2).fill()
        }
    }
}

// MARK: - App delegate

final class AppDelegate: NSObject, NSApplicationDelegate {
    var statusItem: NSStatusItem!
    var window: NSWindow!
    var padView: ParkingPadView!
    var timer: Timer!
    let stats = Stats()

    var state: ParkState = .away
    var zone: NSRect = .zero

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory) // menu-bar only, no Dock icon

        setupWindow()
        setupStatusItem()
        logLine("ParkSpot launched. zone=\(zone) totalParks=\(stats.totalParks) totalFines=\(stats.totalFines)")

        timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { [weak self] _ in
            self?.tick()
        }
        RunLoop.main.add(timer, forMode: .common)
    }

    func setupWindow() {
        guard let screen = NSScreen.main else { fatalError("no screen") }
        let screenFrame = screen.frame
        let size = CGSize(width: 120, height: 120)
        let origin = CGPoint(x: screenFrame.maxX - size.width - 24, y: screenFrame.minY + 24)
        zone = NSRect(origin: origin, size: size)

        window = NSWindow(contentRect: zone, styleMask: [.borderless], backing: .buffered, defer: false)
        window.isOpaque = false
        window.backgroundColor = .clear
        window.hasShadow = true
        window.level = .floating
        window.ignoresMouseEvents = true // decorative: never blocks clicks to apps beneath
        window.collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle]

        padView = ParkingPadView(frame: NSRect(origin: .zero, size: size))
        window.contentView = padView
        window.orderFrontRegardless()
    }

    func setupStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        statusItem.button?.title = "🅿️"
        rebuildMenu()
    }

    func rebuildMenu() {
        let menu = NSMenu()
        menu.addItem(withTitle: "ParkSpot — cursor parking", action: nil, keyEquivalent: "")
        menu.addItem(.separator())
        menu.addItem(withTitle: "Total successful parks: \(stats.totalParks)", action: nil, keyEquivalent: "")
        menu.addItem(withTitle: "Current streak: \(stats.currentStreak)", action: nil, keyEquivalent: "")
        menu.addItem(withTitle: "Longest streak: \(stats.longestStreak)", action: nil, keyEquivalent: "")
        let fineItem = menu.addItem(
            withTitle: String(format: "Outstanding fines: $%.2f", stats.totalFines),
            action: stats.totalFines > 0 ? #selector(payFines) : nil,
            keyEquivalent: ""
        )
        fineItem.target = self
        menu.addItem(.separator())
        let resetItem = menu.addItem(withTitle: "Reset stats", action: #selector(resetStats), keyEquivalent: "")
        resetItem.target = self
        menu.addItem(.separator())
        menu.addItem(withTitle: "Quit ParkSpot", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        statusItem.menu = menu
    }

    @objc func payFines() {
        logLine("PAY fines=\(stats.totalFines)")
        stats.totalFines = 0
        rebuildMenu()
    }

    @objc func resetStats() {
        stats.reset()
        logLine("RESET stats")
        rebuildMenu()
    }

    func tick() {
        let point = NSEvent.mouseLocation
        let inside = zone.contains(point)
        let now = Date()

        switch (state, inside) {
        case (.away, true):
            // entering the spot
            stats.ticketCounter += 1
            let ticketId = stats.ticketCounter
            let meterSeconds = Double.random(in: 4...8)
            state = .parked(ticketId: ticketId, startTime: now, meterExpiry: now.addingTimeInterval(meterSeconds), fined: false)
            NSSound(named: "Tink")?.play()
            logLine("PARK ticket=\(ticketId) x=\(Int(point.x)) y=\(Int(point.y)) meterSeconds=\(String(format: "%.1f", meterSeconds))")

        case (.parked(let ticketId, let startTime, let meterExpiry, let fined), false):
            // leaving the spot
            let duration = now.timeIntervalSince(startTime)
            if fined {
                stats.currentStreak = 0
            } else {
                stats.totalParks += 1
                stats.currentStreak += 1
                stats.longestStreak = max(stats.longestStreak, stats.currentStreak)
            }
            logLine("LEAVE ticket=\(ticketId) duration=\(String(format: "%.1f", duration))s fined=\(fined) streak=\(stats.currentStreak)")
            state = .away
            _ = meterExpiry // silence unused warning path
            rebuildMenu()

        case (.parked(let ticketId, let startTime, let meterExpiry, let fined), true):
            if !fined && now >= meterExpiry {
                let fine = Double(Int.random(in: 15...75))
                stats.totalFines += fine
                state = .parked(ticketId: ticketId, startTime: startTime, meterExpiry: meterExpiry, fined: true)
                NSSound(named: "Basso")?.play()
                logLine("FINE ticket=\(ticketId) amount=\(fine) totalFines=\(stats.totalFines)")
                rebuildMenu()
            }

        case (.away, false):
            break
        }

        render(point: point)
    }

    func render(point: NSPoint) {
        switch state {
        case .away:
            padView.isParked = false
            padView.stateText = "SEARCHING FOR SPOT…"
            padView.subText = "streak \(stats.currentStreak)"
            padView.meterFraction = 0
        case .parked(let ticketId, let startTime, let meterExpiry, let fined):
            padView.isParked = true
            let elapsed = Date().timeIntervalSince(startTime)
            let total = meterExpiry.timeIntervalSince(startTime)
            padView.meterFraction = total > 0 ? elapsed / total : 1
            if fined {
                padView.stateText = "OVERSTAY VIOLATION"
                padView.subText = "ticket #\(ticketId) — pay in menu"
            } else {
                padView.stateText = "PARKED ✅"
                padView.subText = "ticket #\(ticketId) — \(String(format: "%.1f", elapsed))s"
            }
        }
        padView.needsDisplay = true
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.run()
