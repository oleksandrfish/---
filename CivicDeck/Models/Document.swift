import SwiftUI

struct Document: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let number: String
    let issued: String
    let expires: String
    let status: String
    let icon: String
    let tint: Color
}

