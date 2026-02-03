import SwiftUI

struct DocumentDetailView: View {
    let document: Document

    var body: some View {
        ZStack {
            AppTheme.bgGradient.ignoresSafeArea()

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    DocumentCard(document: document)
                        .frame(maxWidth: .infinity, alignment: .center)

                    VStack(spacing: 12) {
                        infoRow(label: "Номер", value: document.number)
                        infoRow(label: "Видано", value: document.issued)
                        infoRow(label: "Діє до", value: document.expires)
                        infoRow(label: "Статус", value: document.status)
                    }

                    HStack(spacing: 12) {
                        actionButton(title: "Показати QR", icon: "qrcode", tint: AppTheme.accent)
                        actionButton(title: "Поділитись", icon: "square.and.arrow.up", tint: AppTheme.ocean)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
                .padding(.bottom, 40)
            }
        }
        .navigationTitle(document.title)
        .navigationBarTitleDisplayMode(.inline)
    }

    private func infoRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(AppFont.body(14))
                .foregroundColor(AppTheme.inkSoft)
            Spacer()
            Text(value)
                .font(AppFont.body(15))
                .foregroundColor(AppTheme.ink)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.9))
        )
    }

    private func actionButton(title: String, icon: String, tint: Color) -> some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
            Text(title)
        }
        .font(AppFont.body(14))
        .foregroundColor(.white)
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(tint)
        )
    }
}

