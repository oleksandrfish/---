import SwiftUI

struct SettingsRow: View {
    let title: String
    let subtitle: String
    let icon: String
    let tint: Color

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(tint.opacity(0.2))
                .frame(width: 44, height: 44)
                .overlay(
                    Image(systemName: icon)
                        .foregroundColor(tint)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(AppFont.body(15))
                    .foregroundColor(AppTheme.ink)
                Text(subtitle)
                    .font(AppFont.body(12))
                    .foregroundColor(AppTheme.inkSoft)
            }

            Spacer()
            Image(systemName: "chevron.right")
                .foregroundColor(AppTheme.inkSoft)
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.white.opacity(0.92))
        )
    }
}

