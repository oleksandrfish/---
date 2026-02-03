import SwiftUI

struct ServiceCard: View {
    let service: Service

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ZStack {
                Circle()
                    .fill(service.tint.opacity(0.18))
                    .frame(width: 44, height: 44)

                Image(systemName: service.icon)
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(service.tint)
            }

            Text(service.title)
                .font(AppFont.title(16))
                .foregroundColor(AppTheme.ink)

            Text(service.subtitle)
                .font(AppFont.body(12))
                .foregroundColor(AppTheme.inkSoft)
        }
        .padding(16)
        .frame(maxWidth: .infinity, minHeight: 150, alignment: .topLeading)
        .background(
            RoundedRectangle(cornerRadius: 22)
                .fill(Color.white.opacity(0.92))
                .shadow(color: Color.black.opacity(0.08), radius: 10, x: 0, y: 6)
        )
    }
}

