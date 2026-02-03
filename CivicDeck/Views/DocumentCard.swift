import SwiftUI

struct DocumentCard: View {
    let document: Document

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: document.icon)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundColor(document.tint)

                Spacer()

                Text(document.status)
                    .font(AppFont.caption(12))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(
                        Capsule().fill(document.tint.opacity(0.15))
                    )
                    .foregroundColor(document.tint)
            }

            Text(document.title)
                .font(AppFont.title(20))
                .foregroundColor(AppTheme.ink)

            Text(document.subtitle)
                .font(AppFont.body(13))
                .foregroundColor(AppTheme.inkSoft)

            Text(document.number)
                .font(AppFont.caption(12))
                .foregroundColor(AppTheme.inkSoft)
        }
        .padding(16)
        .frame(width: 250, height: 170)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(LinearGradient(colors: [document.tint.opacity(0.18), Color.white], startPoint: .topLeading, endPoint: .bottomTrailing))
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .stroke(Color.white.opacity(0.7), lineWidth: 1)
                )
                .overlay(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(document.tint)
                        .frame(width: 6)
                        .padding(.vertical, 14)
                        .padding(.leading, 10)
                }
        )
        .shadow(color: Color.black.opacity(0.08), radius: 14, x: 0, y: 8)
    }
}

