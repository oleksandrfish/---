import SwiftUI

enum AppTheme {
    static let bgTop = Color(red: 0.10, green: 0.13, blue: 0.18)
    static let bgBottom = Color(red: 0.96, green: 0.93, blue: 0.88)
    static let bgGradient = LinearGradient(colors: [bgTop, bgBottom], startPoint: .topLeading, endPoint: .bottomTrailing)

    static let card = Color.white.opacity(0.92)
    static let ink = Color(red: 0.08, green: 0.10, blue: 0.12)
    static let inkSoft = Color(red: 0.32, green: 0.34, blue: 0.38)
    static let accent = Color(red: 0.92, green: 0.42, blue: 0.25)

    static let mint = Color(red: 0.20, green: 0.70, blue: 0.62)
    static let amber = Color(red: 0.92, green: 0.74, blue: 0.22)
    static let ocean = Color(red: 0.18, green: 0.45, blue: 0.76)
    static let slate = Color(red: 0.30, green: 0.37, blue: 0.46)
}

enum AppFont {
    static func title(_ size: CGFloat) -> Font { .custom("Avenir Next", size: size).weight(.semibold) }
    static func body(_ size: CGFloat) -> Font { .custom("Avenir Next", size: size) }
    static func caption(_ size: CGFloat) -> Font { .custom("Avenir Next", size: size).weight(.medium) }
}

