import SwiftUI

struct QuickActionButton: View {
    let title: String
    let icon: String
    let tint: Color

    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(tint)

            Text(title)
                .font(AppFont.caption(12))
                .foregroundColor(AppTheme.ink)
        }
        .frame(width: 96, height: 92)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.white.opacity(0.92))
                .shadow(color: Color.black.opacity(0.08), radius: 10, x: 0, y: 6)
        )
    }
}


