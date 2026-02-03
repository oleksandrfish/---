import SwiftUI

struct ActivityRow: View {
    let item: ActivityItem

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(item.tint.opacity(0.2))
                .frame(width: 42, height: 42)
                .overlay(
                    Image(systemName: item.icon)
                        .foregroundColor(item.tint)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(item.title)
                    .font(AppFont.body(15))
                    .foregroundColor(AppTheme.ink)
                Text(item.subtitle)
                    .font(AppFont.body(12))
                    .foregroundColor(AppTheme.inkSoft)
            }

            Spacer()
            Text(item.time)
                .font(AppFont.caption(12))
                .foregroundColor(AppTheme.inkSoft)
        }
        .padding(14)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(Color.white.opacity(0.92))
                .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
        )
    }
}

