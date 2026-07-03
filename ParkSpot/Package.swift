// swift-tools-version:6.0
import PackageDescription

let package = Package(
    name: "ParkSpot",
    platforms: [.macOS(.v12)],
    targets: [
        .executableTarget(
            name: "ParkSpot",
            path: "Sources/ParkSpot",
            swiftSettings: [.swiftLanguageMode(.v5)]
        ),
        .executableTarget(
            name: "MoveMouse",
            path: "Sources/MoveMouse",
            swiftSettings: [.swiftLanguageMode(.v5)]
        )
    ]
)
